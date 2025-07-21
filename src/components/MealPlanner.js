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
  Utensils,
  Coffee,
  ShoppingBag,
  Check
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './MealPlanner.css';

const MealPlanner = ({ userProfile }) => {
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
  const [mealPlans, setMealPlans] = useState({});
  const [shoppingStatus, setShoppingStatus] = useState({});
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [possibleRecipes, setPossibleRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterMealType, setFilterMealType] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#f59e0b' },
    { key: 'lunch', label: 'Lunch', icon: Utensils, color: '#10b981' },
    { key: 'dinner', label: 'Dinner', icon: ChefHat, color: '#3b82f6' }
  ];

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
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Format week display for two weeks
  const formatTwoWeekDisplay = (startDate) => {
    const week2Start = new Date(startDate);
    week2Start.setDate(startDate.getDate() + 7);
    const week2End = new Date(week2Start);
    week2End.setDate(week2Start.getDate() + 6);
    
    const options = { day: 'numeric', month: 'short' };
    return {
      week1: `${startDate.toLocaleDateString('en-GB', options)} - ${new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', options)}`,
      week2: `${week2Start.toLocaleDateString('en-GB', options)} - ${week2End.toLocaleDateString('en-GB', options)}`
    };
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
        fetchMealPlans(),
        fetchPossibleRecipes(),
        fetchShoppingStatus()
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

  const fetchMealPlans = async () => {
    const weekStart = currentWeek.toISOString().split('T')[0];
    const week2Start = new Date(currentWeek);
    week2Start.setDate(currentWeek.getDate() + 7);
    const week2StartStr = week2Start.toISOString().split('T')[0];
    
    // Fetch both weeks
    const { data, error } = await supabase
      .from('weekly_meal_plans')
      .select(`
        *,
        monday_breakfast:recipes!weekly_meal_plans_monday_breakfast_fkey(*),
        monday_lunch:recipes!weekly_meal_plans_monday_lunch_fkey(*),
        monday_dinner:recipes!weekly_meal_plans_monday_dinner_fkey(*),
        tuesday_breakfast:recipes!weekly_meal_plans_tuesday_breakfast_fkey(*),
        tuesday_lunch:recipes!weekly_meal_plans_tuesday_lunch_fkey(*),
        tuesday_dinner:recipes!weekly_meal_plans_tuesday_dinner_fkey(*),
        wednesday_breakfast:recipes!weekly_meal_plans_wednesday_breakfast_fkey(*),
        wednesday_lunch:recipes!weekly_meal_plans_wednesday_lunch_fkey(*),
        wednesday_dinner:recipes!weekly_meal_plans_wednesday_dinner_fkey(*),
        thursday_breakfast:recipes!weekly_meal_plans_thursday_breakfast_fkey(*),
        thursday_lunch:recipes!weekly_meal_plans_thursday_lunch_fkey(*),
        thursday_dinner:recipes!weekly_meal_plans_thursday_dinner_fkey(*),
        friday_breakfast:recipes!weekly_meal_plans_friday_breakfast_fkey(*),
        friday_lunch:recipes!weekly_meal_plans_friday_lunch_fkey(*),
        friday_dinner:recipes!weekly_meal_plans_friday_dinner_fkey(*),
        saturday_breakfast:recipes!weekly_meal_plans_saturday_breakfast_fkey(*),
        saturday_lunch:recipes!weekly_meal_plans_saturday_lunch_fkey(*),
        saturday_dinner:recipes!weekly_meal_plans_saturday_dinner_fkey(*),
        sunday_breakfast:recipes!weekly_meal_plans_sunday_breakfast_fkey(*),
        sunday_lunch:recipes!weekly_meal_plans_sunday_lunch_fkey(*),
        sunday_dinner:recipes!weekly_meal_plans_sunday_dinner_fkey(*)
      `)
      .eq('family_id', userProfile.family_id)
      .in('week_starting', [weekStart, week2StartStr]);

    if (error) throw error;
    
    // Process meal plans for both weeks
    const processedMealPlans = {};
    
    (data || []).forEach(planData => {
      const isWeek2 = planData.week_starting === week2StartStr;
      const weekKey = isWeek2 ? 'week2' : 'week1';
      
      processedMealPlans[weekKey] = {
        id: planData.id,
        week_starting: planData.week_starting
      };
      
      // Process each day and meal type
      daysOfWeek.forEach(day => {
        mealTypes.forEach(meal => {
          const key = `${day.key}_${meal.key}`;
          processedMealPlans[weekKey][key] = planData[key];
        });
      });
    });
    
    setMealPlans(processedMealPlans);
  };

  const fetchShoppingStatus = async () => {
    // For now, set empty shopping status - will be populated when shopping lists are integrated
    setShoppingStatus({});
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
        .select('id, name, ingredients, difficulty, prep_time, cook_time, is_favourite, cuisine_type')
        .eq('family_id', userProfile.family_id);

      if (recipeError) throw recipeError;

      const recipesWithAvailability = recipes.map(recipe => {
        const recipeIngredients = recipe.ingredients || [];
        const requiredIngredients = recipeIngredients.map(ing => {
          const ingredientName = ing.name || ing.item || ing.ingredient || '';
          return ingredientName.toLowerCase();
        });
        
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

  const assignRecipe = async (week, day, mealType, recipe) => {
    try {
      setIsSaving(true);
      const weekStartDate = week === 'week2' 
        ? new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        : currentWeek;
      const weekStart = weekStartDate.toISOString().split('T')[0];
      
      const columnName = `${day}_${mealType}`;
      const mealPlanData = {
        family_id: userProfile.family_id,
        week_starting: weekStart,
        created_by: userProfile.id,
        [columnName]: recipe?.id || null
      };

      const existingPlan = mealPlans[week];
      let result;
      
      if (existingPlan?.id) {
        result = await supabase
          .from('weekly_meal_plans')
          .update(mealPlanData)
          .eq('id', existingPlan.id)
          .select();
      } else {
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
      setMealPlans(prev => ({
        ...prev,
        [week]: {
          ...prev[week],
          id: result.data[0]?.id || prev[week]?.id,
          [columnName]: recipe
        }
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

  const toggleShoppingStatus = async (week, day, mealType, recipe) => {
    const key = `${week}-${day}-${mealType}-${recipe.id}`;
    const currentStatus = shoppingStatus[key] || false;
    
    setShoppingStatus(prev => ({
      ...prev,
      [key]: !currentStatus
    }));
    
    setMessage(`Ingredients marked as ${!currentStatus ? 'purchased' : 'not purchased'}`);
  };

  const openRecipeSelector = (week, day, mealType) => {
    setSelectedWeek(week);
    setSelectedDay(day);
    setSelectedMeal(mealType);
    setShowRecipeSelector(true);
    setSearchTerm('');
    setFilterDifficulty('');
    setFilterCuisine('');
    setFilterMealType('');
  };

  // Filter recipes for selector
  const filteredRecipes = availableRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || recipe.difficulty === filterDifficulty;
    const matchesCuisine = !filterCuisine || recipe.cuisine_type === filterCuisine;
    
    // Filter by meal type preferences (rough categorization)
    if (filterMealType) {
      const recipeName = recipe.name.toLowerCase();
      const isBreakfast = recipeName.includes('breakfast') || recipeName.includes('egg') || 
                         recipeName.includes('toast') || recipeName.includes('cereal') ||
                         recipeName.includes('yogurt') || recipeName.includes('porridge');
      const isLunch = recipeName.includes('lunch') || recipeName.includes('sandwich') || 
                     recipeName.includes('salad') || recipeName.includes('soup');
      
      if (filterMealType === 'breakfast' && !isBreakfast) return false;
      if (filterMealType === 'lunch' && !isLunch && !isBreakfast) return false;
    }
    
    return matchesSearch && matchesDifficulty && matchesCuisine;
  });

  const cuisines = [...new Set(availableRecipes.map(r => r.cuisine_type).filter(Boolean))];

  // Generate 14 days starting from current week
  const generateTwoWeeks = () => {
    const weeks = [];
    
    for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
      const weekStart = new Date(currentWeek);
      weekStart.setDate(currentWeek.getDate() + (weekOffset * 7));
      
      const weekKey = weekOffset === 0 ? 'week1' : 'week2';
      const weekLabel = weekOffset === 0 ? 'This Week' : 'Next Week';
      
      const days = daysOfWeek.map((day, dayIndex) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + dayIndex);
        
        return {
          ...day,
          date: dayDate,
          weekKey
        };
      });
      
      weeks.push({
        key: weekKey,
        label: weekLabel,
        days
      });
    }
    
    return weeks;
  };

  if (loading && Object.keys(mealPlans).length === 0) {
    return (
      <div className="meal-planner">
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  const twoWeeks = generateTwoWeeks();
  const weekDisplay = formatTwoWeekDisplay(currentWeek);

  return (
    <div className="meal-planner">
      <div className="page-header">
        <h1>Two-Week Meal Planner</h1>
        <p>Plan your meals with breakfast, lunch, and dinner - perfect for shopping coordination</p>
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
          ← Previous Weeks
        </button>
        <div className="week-display">
          <div className="week-labels">
            <h3>Week 1: {weekDisplay.week1}</h3>
            <h3>Week 2: {weekDisplay.week2}</h3>
          </div>
        </div>
        <button onClick={() => navigateWeek(1)} className="btn btn-secondary">
          Next Weeks →
        </button>
      </div>

      {/* Two Week Calendar */}
      <div className="two-week-calendar">
        {twoWeeks.map(week => (
          <div key={week.key} className="week-section">
            <h3 className="week-title">{week.label}</h3>
            
            <div className="weekly-calendar">
              {week.days.map(day => {
                return (
                  <div key={`${week.key}-${day.key}`} className="day-card enhanced">
                    <div className="day-header">
                      <h4>{day.short}</h4>
                      <span className="day-date">
                        {day.date.getDate()}
                      </span>
                    </div>
                    
                    <div className="meal-slots">
                      {mealTypes.map(meal => {
                        const recipe = mealPlans[week.key]?.[`${day.key}_${meal.key}`];
                        const shoppingKey = `${week.key}-${day.key}-${meal.key}-${recipe?.id}`;
                        const isPurchased = shoppingStatus[shoppingKey] || false;
                        const MealIcon = meal.icon;
                        
                        return (
                          <div key={meal.key} className="meal-slot">
                            <div className="meal-header" style={{ color: meal.color }}>
                              <MealIcon size={14} />
                              <span className="meal-type">{meal.label}</span>
                            </div>
                            
                            {recipe ? (
                              <div className={`assigned-recipe ${isPurchased ? 'purchased' : ''}`}>
                                <div className="recipe-info">
                                  <h5>{recipe.name}</h5>
                                  <div className="recipe-meta">
                                    <span className="time">
                                      <Clock size={10} />
                                      {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="recipe-actions">
                                  <button
                                    onClick={() => toggleShoppingStatus(week.key, day.key, meal.key, recipe)}
                                    className={`btn-icon shopping ${isPurchased ? 'purchased' : ''}`}
                                    title={isPurchased ? 'Mark as not purchased' : 'Mark ingredients as purchased'}
                                  >
                                    {isPurchased ? <Check size={12} /> : <ShoppingBag size={12} />}
                                  </button>
                                  
                                  <button
                                    onClick={() => openRecipeSelector(week.key, day.key, meal.key)}
                                    className="btn-icon"
                                    title="Change recipe"
                                  >
                                    <RotateCcw size={12} />
                                  </button>
                                  
                                  <button
                                    onClick={() => assignRecipe(week.key, day.key, meal.key, null)}
                                    className="btn-icon delete"
                                    title="Remove recipe"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => openRecipeSelector(week.key, day.key, meal.key)}
                                className="add-recipe-btn small"
                              >
                                <Plus size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Smart Suggestions */}
      <div className="smart-suggestions">
        <h3>🧠 Smart Suggestions</h3>
        
        <div className="suggestion-sections">
          <div className="suggestion-section">
            <h4>
              <CheckCircle size={18} className="icon-success" />
              Recipes You Can Make ({possibleRecipes.filter(r => r.canMake).length})
            </h4>
            <div className="recipe-suggestions">
              {possibleRecipes.filter(r => r.canMake).slice(0, 6).map(recipe => (
                <div key={recipe.id} className="recipe-suggestion can-make">
                  <div className="recipe-header">
                    <h5>{recipe.name}</h5>
                    {recipe.is_favourite && <Star size={14} className="favourite" />}
                  </div>
                  <div className="recipe-meta">
                    <span className="availability">✅ {recipe.availabilityPercent}% available</span>
                    <span className="difficulty">{recipe.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>
                Choose {mealTypes.find(m => m.key === selectedMeal)?.label} for{' '}
                {daysOfWeek.find(d => d.key === selectedDay)?.label}
              </h2>
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
                value={filterMealType}
                onChange={(e) => setFilterMealType(e.target.value)}
                className="input filter-select"
              >
                <option value="">All Meal Types</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>

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
                    onClick={() => assignRecipe(selectedWeek, selectedDay, selectedMeal, recipe)}
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