import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter,
  Edit3,
  Trash2,
  Check,
  X,
  Save,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Download,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Package,
  Tag,
  Users
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './ShoppingList.css';

const ShoppingList = ({ userProfile }) => {
  // State management
  const [shoppingLists, setShoppingLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('overview'); // overview, create, edit, shopping
  const [mealPlans, setMealPlans] = useState([]);
  
  // Form states
  const [newListForm, setNewListForm] = useState({
    list_name: '',
    target_store: '',
    meal_plan_id: null,
    items: []
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'other',
    estimated_price: ''
  });

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, planning, active, completed
  const [shoppingMode, setShoppingMode] = useState(false);

  // Categories for better organisation
  const categories = [
    { key: 'meat', label: 'Meat & Fish', color: '#ef4444' },
    { key: 'dairy', label: 'Dairy & Eggs', color: '#f59e0b' },
    { key: 'vegetables', label: 'Vegetables', color: '#10b981' },
    { key: 'fruits', label: 'Fruits', color: '#f97316' },
    { key: 'grains', label: 'Grains & Pasta', color: '#8b5cf6' },
    { key: 'herbs_spices', label: 'Herbs & Spices', color: '#06b6d4' },
    { key: 'oils_condiments', label: 'Oils & Condiments', color: '#84cc16' },
    { key: 'beverages', label: 'Beverages', color: '#3b82f6' },
    { key: 'snacks', label: 'Snacks', color: '#ec4899' },
    { key: 'frozen', label: 'Frozen', color: '#6366f1' },
    { key: 'bakery', label: 'Bakery', color: '#f59e0b' },
    { key: 'household', label: 'Household', color: '#6b7280' },
    { key: 'other', label: 'Other', color: '#9ca3af' }
  ];

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchShoppingLists();
      fetchMealPlans();
    }
  }, [userProfile]);

  // Fetch all shopping lists for the family
  const fetchShoppingLists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shopping_lists')
        .select(`
          *,
          weekly_meal_plans(
            week_starting,
            preferences
          )
        `)
        .eq('family_id', userProfile.family_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShoppingLists(data || []);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      setMessage('Error loading shopping lists');
    } finally {
      setLoading(false);
    }
  };

  // Fetch meal plans for auto-generation
  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select(`
          *,
          monday_breakfast:recipes!weekly_meal_plans_monday_breakfast_fkey(id, name, ingredients),
          monday_lunch:recipes!weekly_meal_plans_monday_lunch_fkey(id, name, ingredients),
          monday_dinner:recipes!weekly_meal_plans_monday_dinner_fkey(id, name, ingredients),
          tuesday_breakfast:recipes!weekly_meal_plans_tuesday_breakfast_fkey(id, name, ingredients),
          tuesday_lunch:recipes!weekly_meal_plans_tuesday_lunch_fkey(id, name, ingredients),
          tuesday_dinner:recipes!weekly_meal_plans_tuesday_dinner_fkey(id, name, ingredients),
          wednesday_breakfast:recipes!weekly_meal_plans_wednesday_breakfast_fkey(id, name, ingredients),
          wednesday_lunch:recipes!weekly_meal_plans_wednesday_lunch_fkey(id, name, ingredients),
          wednesday_dinner:recipes!weekly_meal_plans_wednesday_dinner_fkey(id, name, ingredients),
          thursday_breakfast:recipes!weekly_meal_plans_thursday_breakfast_fkey(id, name, ingredients),
          thursday_lunch:recipes!weekly_meal_plans_thursday_lunch_fkey(id, name, ingredients),
          thursday_dinner:recipes!weekly_meal_plans_thursday_dinner_fkey(id, name, ingredients),
          friday_breakfast:recipes!weekly_meal_plans_friday_breakfast_fkey(id, name, ingredients),
          friday_lunch:recipes!weekly_meal_plans_friday_lunch_fkey(id, name, ingredients),
          friday_dinner:recipes!weekly_meal_plans_friday_dinner_fkey(id, name, ingredients),
          saturday_breakfast:recipes!weekly_meal_plans_saturday_breakfast_fkey(id, name, ingredients),
          saturday_lunch:recipes!weekly_meal_plans_saturday_lunch_fkey(id, name, ingredients),
          saturday_dinner:recipes!weekly_meal_plans_saturday_dinner_fkey(id, name, ingredients),
          sunday_breakfast:recipes!weekly_meal_plans_sunday_breakfast_fkey(id, name, ingredients),
          sunday_lunch:recipes!weekly_meal_plans_sunday_lunch_fkey(id, name, ingredients),
          sunday_dinner:recipes!weekly_meal_plans_sunday_dinner_fkey(id, name, ingredients)
        `)
        .eq('family_id', userProfile.family_id)
        .gte('week_starting', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('week_starting', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  // Auto-generate shopping list from meal plan
  const generateFromMealPlan = async (mealPlanId) => {
    try {
      const mealPlan = mealPlans.find(mp => mp.id === mealPlanId);
      if (!mealPlan) return;

      const ingredientMap = new Map();
      
      // Collect all ingredients from all meals in the week
      const meals = [
        'monday_breakfast', 'monday_lunch', 'monday_dinner',
        'tuesday_breakfast', 'tuesday_lunch', 'tuesday_dinner',
        'wednesday_breakfast', 'wednesday_lunch', 'wednesday_dinner',
        'thursday_breakfast', 'thursday_lunch', 'thursday_dinner',
        'friday_breakfast', 'friday_lunch', 'friday_dinner',
        'saturday_breakfast', 'saturday_lunch', 'saturday_dinner',
        'sunday_breakfast', 'sunday_lunch', 'sunday_dinner'
      ];

      meals.forEach(mealKey => {
        const recipe = mealPlan[mealKey];
        if (recipe && recipe.ingredients) {
          recipe.ingredients.forEach(ingredient => {
            const key = ingredient.item.toLowerCase();
            if (ingredientMap.has(key)) {
              // Combine quantities if same ingredient
              const existing = ingredientMap.get(key);
              existing.notes = existing.notes ? 
                `${existing.notes}, ${ingredient.notes || ''}` : 
                ingredient.notes || '';
            } else {
              ingredientMap.set(key, {
                name: ingredient.item,
                quantity: ingredient.quantity || '1',
                unit: ingredient.unit || '',
                category: ingredient.category || 'other',
                notes: ingredient.notes || '',
                purchased: false,
                estimated_price: 0
              });
            }
          });
        }
      });

      const items = Array.from(ingredientMap.values());
      
      setNewListForm({
        list_name: `Week of ${new Date(mealPlan.week_starting).toLocaleDateString('en-GB')} Shopping`,
        target_store: '',
        meal_plan_id: mealPlanId,
        items: items
      });

      setView('create');
      setMessage('Shopping list generated from meal plan!');
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setMessage('Error generating shopping list');
    }
  };

  // Create new shopping list
  const createShoppingList = async () => {
    try {
      if (!newListForm.list_name.trim()) {
        setMessage('Please enter a list name');
        return;
      }

      const totalEstimated = newListForm.items.reduce((sum, item) => 
        sum + (parseFloat(item.estimated_price) || 0), 0
      );

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([{
          family_id: userProfile.family_id,
          created_by: userProfile.id,
          list_name: newListForm.list_name,
          target_store: newListForm.target_store,
          meal_plan_id: newListForm.meal_plan_id,
          items: newListForm.items,
          total_estimated_cost: totalEstimated,
          status: 'planning'
        }])
        .select()
        .single();

      if (error) throw error;

      setMessage('Shopping list created successfully!');
      setView('overview');
      setNewListForm({ list_name: '', target_store: '', meal_plan_id: null, items: [] });
      fetchShoppingLists();
    } catch (error) {
      console.error('Error creating shopping list:', error);
      setMessage('Error creating shopping list');
    }
  };

  // Add item to current list
  const addItemToList = () => {
    if (!newItem.name.trim()) return;

    const item = {
      ...newItem,
      id: Date.now().toString(),
      purchased: false,
      estimated_price: parseFloat(newItem.estimated_price) || 0
    };

    setNewListForm(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    setNewItem({
      name: '',
      quantity: '',
      unit: '',
      category: 'other',
      estimated_price: ''
    });
  };

  // Remove item from list
  const removeItemFromList = (itemId) => {
    setNewListForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Toggle item purchased status
  const toggleItemPurchased = async (listId, itemIndex) => {
    try {
      const list = shoppingLists.find(l => l.id === listId);
      const updatedItems = [...list.items];
      updatedItems[itemIndex].purchased = !updatedItems[itemIndex].purchased;

      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          items: updatedItems,
          actual_cost: updatedItems
            .filter(item => item.purchased)
            .reduce((sum, item) => sum + (parseFloat(item.estimated_price) || 0), 0)
        })
        .eq('id', listId);

      if (error) throw error;

      fetchShoppingLists();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Update list status
  const updateListStatus = async (listId, status) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          status,
          shopping_date: status === 'completed' ? new Date().toISOString().split('T')[0] : null
        })
        .eq('id', listId);

      if (error) throw error;
      fetchShoppingLists();
      setMessage(`List marked as ${status}!`);
    } catch (error) {
      console.error('Error updating list status:', error);
    }
  };

  // Delete shopping list
  const deleteShoppingList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this shopping list?')) return;

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;
      fetchShoppingLists();
      setMessage('Shopping list deleted');
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  // Export list to text
  const exportList = (list) => {
    const text = `${list.list_name}\n${list.target_store ? `Store: ${list.target_store}\n` : ''}\n` +
      list.items.map(item => 
        `${item.purchased ? '✓' : '○'} ${item.name} ${item.quantity} ${item.unit}${item.notes ? ` (${item.notes})` : ''}`
      ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.list_name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter lists
  const filteredLists = shoppingLists.filter(list => {
    const matchesSearch = list.list_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.target_store?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || list.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get category info
  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || categories.find(cat => cat.key === 'other');
  };

  if (loading) {
    return (
      <div className="shopping-list">
        <div className="loading">Loading shopping lists...</div>
      </div>
    );
  }

  // Overview View
  if (view === 'overview') {
    return (
      <div className="shopping-list">
        <div className="page-header">
          <h1>Shopping Lists</h1>
          <p>Manage your shopping with smart categorisation and meal plan integration</p>
        </div>

        {message && (
          <div className="message success">
            <CheckCircle2 size={20} />
            {message}
            <button onClick={() => setMessage('')} className="close-message">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="action-button primary"
            onClick={() => setView('create')}
          >
            <Plus size={20} />
            Create New List
          </button>
          
          {mealPlans.length > 0 && (
            <div className="meal-plan-generator">
              <span>Generate from meal plan:</span>
              <select 
                onChange={(e) => e.target.value && generateFromMealPlan(e.target.value)}
                value=""
              >
                <option value="">Select meal plan...</option>
                {mealPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    Week of {new Date(plan.week_starting).toLocaleDateString('en-GB')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Lists</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Shopping Lists Grid */}
        <div className="shopping-lists-grid">
          {filteredLists.length === 0 ? (
            <div className="empty-state">
              <ShoppingCart size={64} />
              <h3>No shopping lists yet</h3>
              <p>Create your first shopping list or generate one from a meal plan</p>
              <button 
                className="action-button primary"
                onClick={() => setView('create')}
              >
                Create Your First List
              </button>
            </div>
          ) : (
            filteredLists.map(list => (
              <div key={list.id} className={`shopping-list-card ${list.status}`}>
                <div className="card-header">
                  <h3>{list.list_name}</h3>
                  <div className="card-actions">
                    <button
                      onClick={() => {
                        setCurrentList(list);
                        setView('shopping');
                      }}
                      className="action-button small"
                      title="Shopping Mode"
                    >
                      <Smartphone size={16} />
                    </button>
                    <button
                      onClick={() => exportList(list)}
                      className="action-button small"
                      title="Export List"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => deleteShoppingList(list.id)}
                      className="action-button small danger"
                      title="Delete List"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  {list.target_store && (
                    <div className="list-info">
                      <MapPin size={16} />
                      <span>{list.target_store}</span>
                    </div>
                  )}
                  
                  <div className="list-stats">
                    <div className="stat">
                      <Package size={16} />
                      <span>{list.items?.length || 0} items</span>
                    </div>
                    <div className="stat">
                      <CheckCircle2 size={16} />
                      <span>{list.items?.filter(item => item.purchased).length || 0} purchased</span>
                    </div>
                    {list.total_estimated_cost > 0 && (
                      <div className="stat">
                        <DollarSign size={16} />
                        <span>£{list.total_estimated_cost.toFixed(2)} estimated</span>
                      </div>
                    )}
                  </div>

                  <div className="list-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${list.items?.length > 0 ? 
                            (list.items.filter(item => item.purchased).length / list.items.length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {list.items?.length > 0 ? 
                        Math.round((list.items.filter(item => item.purchased).length / list.items.length) * 100) : 0}% complete
                    </span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="status-badges">
                    <span className={`status-badge ${list.status}`}>
                      {list.status.charAt(0).toUpperCase() + list.status.slice(1)}
                    </span>
                    {list.weekly_meal_plans && (
                      <span className="meal-plan-badge">
                        <Calendar size={14} />
                        Meal Plan
                      </span>
                    )}
                  </div>
                  
                  <div className="card-actions-footer">
                    {list.status === 'planning' && (
                      <button
                        onClick={() => updateListStatus(list.id, 'active')}
                        className="action-button small primary"
                      >
                        Start Shopping
                      </button>
                    )}
                    {list.status === 'active' && (
                      <button
                        onClick={() => updateListStatus(list.id, 'completed')}
                        className="action-button small success"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Create/Edit View
  if (view === 'create') {
    return (
      <div className="shopping-list">
        <div className="page-header">
          <h1>Create Shopping List</h1>
          <p>Add items manually or generate from meal plans</p>
        </div>

        {message && (
          <div className="message success">
            <CheckCircle2 size={20} />
            {message}
            <button onClick={() => setMessage('')} className="close-message">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="create-list-form">
          {/* List Details */}
          <div className="form-section">
            <h3>List Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>List Name *</label>
                <input
                  type="text"
                  value={newListForm.list_name}
                  onChange={(e) => setNewListForm(prev => ({
                    ...prev,
                    list_name: e.target.value
                  }))}
                  placeholder="e.g., Weekly Shop, Tesco Run"
                />
              </div>
              <div className="form-group">
                <label>Target Store</label>
                <input
                  type="text"
                  value={newListForm.target_store}
                  onChange={(e) => setNewListForm(prev => ({
                    ...prev,
                    target_store: e.target.value
                  }))}
                  placeholder="e.g., Tesco Extra, Sainsbury's"
                />
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div className="form-section">
            <h3>Add Items</h3>
            <div className="add-item-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Item name"
                  />
                </div>
                <div className="form-group small">
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      quantity: e.target.value
                    }))}
                    placeholder="Qty"
                  />
                </div>
                <div className="form-group small">
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      unit: e.target.value
                    }))}
                    placeholder="Unit"
                  />
                </div>
                <div className="form-group">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                  >
                    {categories.map(cat => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group small">
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.estimated_price}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      estimated_price: e.target.value
                    }))}
                    placeholder="£"
                  />
                </div>
                <button
                  type="button"
                  onClick={addItemToList}
                  className="action-button primary"
                  disabled={!newItem.name.trim()}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          {newListForm.items.length > 0 && (
            <div className="form-section">
              <h3>Items ({newListForm.items.length})</h3>
              <div className="items-list">
                {Object.entries(
                  newListForm.items.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {})
                ).map(([category, items]) => {
                  const categoryInfo = getCategoryInfo(category);
                  return (
                    <div key={category} className="category-group">
                      <h4 className="category-header" style={{ color: categoryInfo.color }}>
                        <Tag size={16} />
                        {categoryInfo.label} ({items.length})
                      </h4>
                      <div className="category-items">
                        {items.map((item, index) => (
                          <div key={item.id || index} className="item-row">
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-details">
                                {item.quantity} {item.unit}
                                {item.estimated_price > 0 && ` - £${item.estimated_price}`}
                              </span>
                            </div>
                            <button
                              onClick={() => removeItemFromList(item.id)}
                              className="action-button small danger"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="list-summary">
                <div className="summary-stat">
                  <strong>Total Items: {newListForm.items.length}</strong>
                </div>
                <div className="summary-stat">
                  <strong>
                    Estimated Total: £{newListForm.items.reduce((sum, item) => 
                      sum + (parseFloat(item.estimated_price) || 0), 0
                    ).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              onClick={() => setView('overview')}
              className="action-button secondary"
            >
              Cancel
            </button>
            <button
              onClick={createShoppingList}
              className="action-button primary"
              disabled={!newListForm.list_name.trim() || newListForm.items.length === 0}
            >
              <Save size={16} />
              Create Shopping List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Shopping Mode View
  if (view === 'shopping' && currentList) {
    const groupedItems = currentList.items.reduce((acc, item, index) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({...item, originalIndex: index});
      return acc;
    }, {});

    return (
      <div className="shopping-list shopping-mode">
        <div className="shopping-header">
          <div className="header-info">
            <h1>{currentList.list_name}</h1>
            {currentList.target_store && (
              <p className="store-info">
                <MapPin size={16} />
                {currentList.target_store}
              </p>
            )}
          </div>
          <button
            onClick={() => setView('overview')}
            className="action-button secondary"
          >
            Exit Shopping
          </button>
        </div>

        <div className="shopping-progress">
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-value">
                {currentList.items.filter(item => item.purchased).length}
              </span>
              <span className="stat-label">Purchased</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {currentList.items.filter(item => !item.purchased).length}
              </span>
              <span className="stat-label">Remaining</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                £{currentList.items
                  .filter(item => item.purchased)
                  .reduce((sum, item) => sum + (parseFloat(item.estimated_price) || 0), 0)
                  .toFixed(2)}
              </span>
              <span className="stat-label">Spent</span>
            </div>
          </div>
          <div className="progress-bar large">
            <div 
              className="progress-fill"
              style={{ 
                width: `${currentList.items.length > 0 ? 
                  (currentList.items.filter(item => item.purchased).length / currentList.items.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        <div className="shopping-categories">
          {Object.entries(groupedItems).map(([category, items]) => {
            const categoryInfo = getCategoryInfo(category);
            const purchasedCount = items.filter(item => item.purchased).length;
            
            return (
              <div key={category} className="shopping-category">
                <div className="category-header">
                  <h3 style={{ color: categoryInfo.color }}>
                    <Tag size={18} />
                    {categoryInfo.label}
                  </h3>
                  <span className="category-progress">
                    {purchasedCount}/{items.length}
                  </span>
                </div>
                
                <div className="category-items">
                  {items.map((item) => (
                    <div 
                      key={item.originalIndex}
                      className={`shopping-item ${item.purchased ? 'purchased' : ''}`}
                      onClick={() => toggleItemPurchased(currentList.id, item.originalIndex)}
                    >
                      <div className="item-checkbox">
                        {item.purchased ? (
                          <CheckCircle2 size={24} className="checked" />
                        ) : (
                          <div className="unchecked" />
                        )}
                      </div>
                      <div className="item-content">
                        <div className="item-name">{item.name}</div>
                        <div className="item-details">
                          {item.quantity} {item.unit}
                          {item.estimated_price > 0 && (
                            <span className="item-price">£{item.estimated_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {currentList.items.every(item => item.purchased) && (
          <div className="shopping-complete">
            <CheckCircle2 size={48} />
            <h3>Shopping Complete!</h3>
            <p>All items have been purchased</p>
            <button
              onClick={() => updateListStatus(currentList.id, 'completed')}
              className="action-button primary large"
            >
              Mark List as Complete
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ShoppingList;