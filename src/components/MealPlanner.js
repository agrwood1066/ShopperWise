import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  ChefHat,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  RotateCcw,
  Star,
  Utensils
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './MealPlanner.css';

const MealPlanner = ({ userProfile }) => {
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState({});
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [possibleRecipes, setPossibleRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  // Get start of week (Monday)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff));
  }

  // Format week display
  const formatWeekDisplay = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const options = { day: 'numeric', month: 'short' };
    return `${startDate.toLocaleDateString('en-GB', options)} - ${endDate.toLocaleDateString('en-GB', options)}`;
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(getStartOfWeek(newWeek));
  };

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchData();
    }
  }, [userProfile, currentWeek]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchRecipes(),
        fetchMealPlan(),
        fetchPossibleRecipes()
      ]);
    } catch (error) {
      console.error('Error fetching meal planner data:', error);
      setMessage('Error loading meal planner. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('family_id', userProfile.family_id)
      .order('name');

    if (error) throw error;
    setAvailableRecipes(data || []);
  };

  const fetchMealPlan = async () => {
    const weekStart = currentWeek.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('weekly_meal_plans')
      .select(`
        *,
        monday_dinner:recipes!weekly_meal_plans_monday_dinner_fkey(*),
        tuesday_dinner:recipes!weekly_meal_plans_tuesday_dinner_fkey(*),
        wednesday_dinner:recipes!weekly_meal_plans_wednesday_dinner_fkey(*),
        thursday_dinner:recipes!weekly_meal_plans_thursday_dinner_fkey(*),
        friday_dinner:recipes!weekly_meal_plans_friday_dinner_fkey(*),
        saturday_dinner:recipes!weekly_meal_plans_saturday_dinner_fkey(*),
        sunday_dinner:recipes!weekly_meal_plans_sunday_dinner_fkey(*)
      `)
      .eq('family_id', userProfile.family_id)
      .eq('week_starting', weekStart)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
    
    if (data) {
      setMealPlan({
        id: data.id,
        monday: data.monday_dinner,
        tuesday: data.tuesday_dinner,
        wednesday: data.wednesday_dinner,
        thursday: data.thursday_dinner,
        friday: data.friday_dinner,
        saturday: data.saturday_dinner,
        sunday: data.sunday_dinner
      });
    } else {
      setMealPlan({});
    }
  };

  const fetchPossibleRecipes = async () => {
    try {
      // Get current inventory
      const { data: inventoryData, error: invError } = await supabase
        .from('inventory_with_expiry_status')
        .select('ingredient_name, quantity, expiry_status')
        .eq('family_id', userProfile.family_id)
        .gt('quantity', 0);

      if (invError) throw invError;

      const availableIngredients = inventoryData.map(item => 
        item.ingredient_name.toLowerCase()
      );

      // Get recipes and check which ones can be made
      const { data: recipes, error: recipeError } = await supabase
        .from('recipes')
        .select('id, name, ingredients, difficulty, prep_time, cook_time, is_favourite')
        .eq('family_id', userProfile.family_id);

      if (recipeError) throw recipeError;

      const recipesWithAvailability = recipes.map(recipe => {
        const recipeIngredients = recipe.ingredients || [];
        const requiredIngredients = recipeIngredients.map(ing => {
          // Handle different ingredient JSON structures
          const ingredientName = ing.name || ing.item || ing.ingredient || '';
          return ingredientName.toLowerCase();
        });
        
        // Check ingredient availability
        const availableCount = requiredIngredients.filter(ingredient =>
          availableIngredients.some(available => 
            available.includes(ingredient) || ingredient.includes(available)
          )
        ).length;
        
        const availabilityPercent = requiredIngredients.length > 0 
          ? Math.round((availableCount / requiredIngredients.length) * 100)
          : 0;

        return {
          ...recipe,
          availabilityPercent,
          canMake: availabilityPercent >= 70
        };
      });

      // Sort by availability percentage and favourites
      const sortedRecipes = recipesWithAvailability
        .sort((a, b) => {
          if (a.is_favourite && !b.is_favourite) return -1;
          if (!a.is_favourite && b.is_favourite) return 1;
          return b.availabilityPercent - a.availabilityPercent;
        });

      setPossibleRecipes(sortedRecipes);
    } catch (error) {
      console.error('Error fetching possible recipes:', error);
    }
  };

  const assignRecipe = async (day, recipe) => {
    try {
      setIsSaving(true);
      const weekStart = currentWeek.toISOString().split('T')[0];
      
      const mealPlanData = {
        family_id: userProfile.family_id,
        week_starting: weekStart,
        created_by: userProfile.id,
        [`${day}_dinner`]: recipe?.id || null
      };

      let result;
      if (mealPlan.id) {
        // Update existing meal plan
        result = await supabase
          .from('weekly_meal_plans')
          .update(mealPlanData)
          .eq('id', mealPlan.id)
          .select();
      } else {
        // Create new meal plan
        result = await supabase
          .from('weekly_meal_plans')
          .upsert(mealPlanData, { 
            onConflict: 'family_id,week_starting',
            ignoreDuplicates: false 
          })
          .select();
      }

      if (result.error) throw result.error;

      // Update local state
      setMealPlan(prev => ({
        ...prev,
        id: result.data[0]?.id || prev.id,
        [day]: recipe
      }));

      setMessage(`${recipe ? 'Recipe assigned' : 'Recipe removed'} successfully!`);
      setShowRecipeSelector(false);
    } catch (error) {
      console.error('Error assigning recipe:', error);
      setMessage('Error saving meal plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const openRecipeSelector = (day) => {
    setSelectedDay(day);
    setShowRecipeSelector(true);
    setSearchTerm('');
    setFilterDifficulty('');
    setFilterCuisine('');
  };

  // Filter recipes for selector
  const filteredRecipes = availableRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || recipe.difficulty === filterDifficulty;
    const matchesCuisine = !filterCuisine || recipe.cuisine_type === filterCuisine;
    
    return matchesSearch && matchesDifficulty && matchesCuisine;
  });

  // Get unique cuisines for filter
  const cuisines = [...new Set(availableRecipes.map(r => r.cuisine_type).filter(Boolean))];

  if (loading && Object.keys(mealPlan).length === 0) {
    return (
      <div className="meal-planner">
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-planner">
      <div className="page-header">
        <h1>Weekly Meal Planner</h1>
        <p>Plan your meals intelligently with smart recipe suggestions</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
          <button onClick={() => setMessage('')} className="alert-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Week Navigation */}
      <div className="week-navigation">
        <button onClick={() => navigateWeek(-1)} className="btn btn-secondary">
          ← Previous Week
        </button>
        <div className="week-display">
          <h2>{formatWeekDisplay(currentWeek)}</h2>
        </div>
        <button onClick={() => navigateWeek(1)} className="btn btn-secondary">
          Next Week →
        </button>
      </div>

      {/* Weekly Calendar */}
      <div className="weekly-calendar">
        {daysOfWeek.map((day, index) => {
          const recipe = mealPlan[day.key];
          const dayDate = new Date(currentWeek);
          dayDate.setDate(currentWeek.getDate() + index);
          
          return (
            <div key={day.key} className="day-card">
              <div className="day-header">
                <h3>{day.short}</h3>
                <span className="day-date">
                  {dayDate.getDate()}
                </span>
              </div>
              
              <div className="meal-slot">
                {recipe ? (
                  <div className="assigned-recipe">
                    <div className="recipe-info">
                      <h4>{recipe.name}</h4>
                      <div className="recipe-meta">
                        <span className="difficulty">{recipe.difficulty}</span>
                        <span className="time">
                          <Clock size={12} />
                          {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                        </span>
                        <span className="servings">
                          <Users size={12} />
                          {recipe.servings}
                        </span>
                      </div>
                    </div>
                    <div className="recipe-actions">
                      <button
                        onClick={() => openRecipeSelector(day.key)}
                        className="btn-icon"
                        title="Change recipe"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => assignRecipe(day.key, null)}
                        className="btn-icon delete"
                        title="Remove recipe"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openRecipeSelector(day.key)}
                    className="add-recipe-btn"
                  >
                    <Plus size={20} />
                    <span>Add Recipe</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Suggestions */}
      <div className="smart-suggestions">
        <h3>🧠 Smart Suggestions</h3>
        
        <div className="suggestion-sections">
          {/* Recipes You Can Make */}
          <div className="suggestion-section">
            <h4>
              <CheckCircle size={18} className="icon-success" />
              Recipes You Can Make ({possibleRecipes.filter(r => r.canMake).length})
            </h4>
            <div className="recipe-suggestions">
              {possibleRecipes.filter(r => r.canMake).slice(0, 4).map(recipe => (
                <div key={recipe.id} className="recipe-suggestion can-make">
                  <div className="recipe-header">
                    <h5>{recipe.name}</h5>
                    {recipe.is_favourite && <Star size={14} className="favourite" />}
                  </div>
                  <div className="recipe-meta">
                    <span className="availability">✅ {recipe.availabilityPercent}% available</span>
                    <span className="difficulty">{recipe.difficulty}</span>
                    <span className="time">{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipes Needing Some Ingredients */}
          <div className="suggestion-section">
            <h4>
              <AlertTriangle size={18} className="icon-warning" />
              Almost Possible (50-70% ingredients)
            </h4>
            <div className="recipe-suggestions">
              {possibleRecipes
                .filter(r => r.availabilityPercent >= 50 && r.availabilityPercent < 70)
                .slice(0, 3)
                .map(recipe => (
                  <div key={recipe.id} className="recipe-suggestion partial">
                    <div className="recipe-header">
                      <h5>{recipe.name}</h5>
                      {recipe.is_favourite && <Star size={14} className="favourite" />}
                    </div>
                    <div className="recipe-meta">
                      <span className="availability">🛒 {recipe.availabilityPercent}% available</span>
                      <span className="difficulty">{recipe.difficulty}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Choose Recipe for {daysOfWeek.find(d => d.key === selectedDay)?.label}</h2>
              <button onClick={() => setShowRecipeSelector(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="recipe-filters">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recipes..."
                  className="input"
                />
              </div>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="input filter-select"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={filterCuisine}
                onChange={(e) => setFilterCuisine(e.target.value)}
                className="input filter-select"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipe Grid */}
            <div className="recipe-grid">
              {filteredRecipes.map(recipe => {
                const possibleRecipe = possibleRecipes.find(p => p.id === recipe.id);
                const canMake = possibleRecipe?.canMake || false;
                
                return (
                  <div 
                    key={recipe.id} 
                    className={`recipe-card ${canMake ? 'can-make' : ''}`}
                    onClick={() => assignRecipe(selectedDay, recipe)}
                  >
                    <div className="recipe-header">
                      <h4>{recipe.name}</h4>
                      {recipe.is_favourite && <Star size={16} className="favourite" />}
                    </div>
                    
                    <div className="recipe-details">
                      <p className="description">{recipe.description}</p>
                      
                      <div className="recipe-meta">
                        <span className="cuisine">{recipe.cuisine_type}</span>
                        <span className="difficulty">{recipe.difficulty}</span>
                        <span className="time">
                          <Clock size={14} />
                          {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                        </span>
                        <span className="servings">
                          <Users size={14} />
                          {recipe.servings}
                        </span>
                      </div>
                      
                      {possibleRecipe && (
                        <div className="availability-indicator">
                          {canMake ? (
                            <span className="can-make-badge">✅ Can make now!</span>
                          ) : (
                            <span className="partial-badge">
                              🛒 {possibleRecipe.availabilityPercent}% available
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="empty-state">
                <ChefHat size={48} />
                <h3>No Recipes Found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;