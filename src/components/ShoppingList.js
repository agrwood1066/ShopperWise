import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Edit3,
  Trash2,
  X,
  Save,
  Calendar,
  MapPin,
  Download,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  Package,
  Tag,
  ArrowLeft,
  MoreHorizontal,
  Star,
  Circle
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { categorizeIngredient } from '../utils/ingredientHelpers';
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
    notes: ''
  });

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, planning, active, completed
  
  // AnyList-inspired states
  const [showCompleted, setShowCompleted] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  
  // Edit mode states
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'other',
    notes: ''
  });

  // Categories with AnyList-style organization
  const [categories, setCategories] = useState([
    { key: 'beverages', label: 'Beverages', emoji: '🥤', color: '#007AFF' },
    { key: 'meat', label: 'Meat', emoji: '🍗', color: '#FF3B30' },
    { key: 'fish', label: 'Fish', emoji: '🐟', color: '#00C7BE' },
    { key: 'produce', label: 'Produce', emoji: '🍎', color: '#34C759' },
    { key: 'dairy', label: 'Dairy', emoji: '🥛', color: '#007AFF' },
    { key: 'bakery', label: 'Bakery', emoji: '🍞', color: '#FF9500' },
    { key: 'frozen', label: 'Frozen', emoji: '🧊', color: '#5AC8FA' },
    { key: 'pantry', label: 'Pantry', emoji: '🍿', color: '#AF52DE' },
    { key: 'snacks', label: 'Snacks', emoji: '🍫', color: '#FFCC00' },
    { key: 'household', label: 'Household', emoji: '🧽', color: '#8E8E93' },
    { key: 'other', label: 'Other', emoji: '📦', color: '#8E8E93' }
  ]);
  
  // Custom category management
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    emoji: '📦'
  });

  // Common UK grocery items for autocomplete
  const commonItems = [
    'Milk', 'Bread', 'Eggs', 'Butter', 'Cheese', 'Chicken breast', 'Mince beef',
    'Bananas', 'Apples', 'Oranges', 'Potatoes', 'Onions', 'Carrots', 'Tomatoes',
    'Rice', 'Pasta', 'Olive oil', 'Salt', 'Black pepper', 'Garlic', 'Yogurt',
    'Bacon', 'Ham', 'Salmon', 'Broccoli', 'Spinach', 'Lettuce', 'Cucumber',
    'Lemon', 'Lime', 'Ginger', 'Mushrooms', 'Peppers', 'Courgette', 'Avocado',
    'Flour', 'Sugar', 'Honey', 'Coconut milk', 'Tinned tomatoes', 'Stock cubes'
  ];

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchShoppingLists();
      fetchMealPlans();
      loadFavorites();
      loadRecentItems();
      loadCustomCategories();
    }
  }, [userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load custom categories from localStorage
  const loadCustomCategories = () => {
    try {
      const saved = localStorage.getItem(`custom_categories_${userProfile.family_id}`);
      if (saved) {
        const customCategories = JSON.parse(saved);
        setCategories(prev => {
          // Merge default categories with custom ones, avoiding duplicates
          const defaultKeys = prev.map(cat => cat.key);
          const newCustomCategories = customCategories.filter(cat => !defaultKeys.includes(cat.key));
          return [...prev, ...newCustomCategories];
        });
      }
    } catch (error) {
      console.error('Error loading custom categories:', error);
    }
  };

  // Save custom categories to localStorage
  const saveCustomCategories = (newCategories) => {
    try {
      // Only save custom categories (those not in the default list)
      const defaultKeys = [
        'beverages', 'meat', 'fish', 'produce', 'dairy', 'bakery', 
        'frozen', 'pantry', 'snacks', 'household', 'other'
      ];
      const customCategories = newCategories.filter(cat => !defaultKeys.includes(cat.key));
      localStorage.setItem(`custom_categories_${userProfile.family_id}`, JSON.stringify(customCategories));
    } catch (error) {
      console.error('Error saving custom categories:', error);
    }
  };

  // Add new custom category
  const addCustomCategory = () => {
    if (!newCategoryForm.name.trim()) {
      setMessage('Please enter a category name');
      return;
    }

    const categoryKey = newCategoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Check if category already exists
    if (categories.find(cat => cat.key === categoryKey || cat.label.toLowerCase() === newCategoryForm.name.toLowerCase())) {
      setMessage('This category already exists');
      return;
    }

    const newCategory = {
      key: categoryKey,
      label: newCategoryForm.name.trim(),
      emoji: newCategoryForm.emoji,
      color: '#007AFF',
      custom: true
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCustomCategories(updatedCategories);
    
    setNewCategoryForm({ name: '', emoji: '📦' });
    setShowAddCategory(false);
    setMessage(`Category "${newCategory.label}" added successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

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
      
      // Ensure items is always an array
      const listsWithItems = (data || []).map(list => ({
        ...list,
        items: Array.isArray(list.items) ? list.items : []
      }));
      
      console.log('Fetched shopping lists:', listsWithItems);
      setShoppingLists(listsWithItems);
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



  // Load favorites from localStorage
  const loadFavorites = () => {
    const saved = localStorage.getItem(`favorites_${userProfile.id}`);
    setFavorites(saved ? JSON.parse(saved) : []);
  };

  // Load recent items from localStorage
  const loadRecentItems = () => {
    const saved = localStorage.getItem(`recent_${userProfile.id}`);
    setRecentItems(saved ? JSON.parse(saved) : []);
  };

  // Helper Functions
  const handleAutocomplete = (input) => {
    if (input.length > 0) {
      const filtered = commonItems
        .filter(item => item.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 5);
      setAutocompleteItems(filtered);
    } else {
      setAutocompleteItems([]);
    }
  };

  const addToFavorites = (itemName) => {
    const updatedFavorites = [itemName, ...favorites.filter(item => item !== itemName)].slice(0, 15);
    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${userProfile.id}`, JSON.stringify(updatedFavorites));
    setMessage('Added to favourites!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getProgress = () => {
    if (!currentList?.items) return { remaining: 0, total: 0, completed: 0 };
    
    const total = currentList.items.length;
    const completed = currentList.items.filter(item => item.purchased).length;
    const remaining = total - completed;
    
    return { remaining, total, completed };
  };



  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || categories.find(cat => cat.key === 'other');
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
                quantity: ingredient.quantity || '',
                unit: ingredient.unit || '',
                category: ingredient.category || 'other',
                notes: ingredient.notes || '',
                purchased: false
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

      // Ensure all items have required fields
      const itemsWithDefaults = newListForm.items.map(item => ({
        id: item.id || Date.now().toString(),
        name: item.name || '',
        quantity: item.quantity || '',
        unit: item.unit || '',
        category: item.category || 'other',
        notes: item.notes || '',
        purchased: false
      }));

      console.log('Creating shopping list with items:', itemsWithDefaults);

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([{
          family_id: userProfile.family_id,
          created_by: userProfile.id,
          list_name: newListForm.list_name,
          target_store: newListForm.target_store,
          meal_plan_id: newListForm.meal_plan_id,
          items: itemsWithDefaults,
          status: 'planning'
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('Created shopping list:', data);
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
      id: Date.now().toString(),
      name: newItem.name.trim(),
      quantity: '',
      unit: '',
      category: categorizeIngredient(newItem.name.trim()),
      notes: '',
      purchased: false
    };

    setNewListForm(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    // Clear the form and refocus for quick adding
    setNewItem({
      name: '',
      quantity: '',
      unit: '',
      category: 'other',
      notes: ''
    });
    
    // Refocus the input field
    setTimeout(() => {
      const input = document.querySelector('.add-item-form input[type="text"]');
      if (input) input.focus();
    }, 100);
  };

  // Remove item from list
  const removeItemFromList = (itemId) => {
    setNewListForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Add quick item to current list
  const addQuickItem = async (itemName, categoryOverride = null) => {
    if (!itemName.trim() || !currentList) return;

    try {
      const newItem = {
        id: Date.now().toString(),
        name: itemName.trim(),
        category: categoryOverride || categorizeIngredient(itemName.trim()),
        purchased: false,
        notes: '',
        quantity: '',
        unit: ''
      };

      const updatedItems = [...currentList.items, newItem];
      
      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          items: updatedItems
        })
        .eq('id', currentList.id);

      if (error) throw error;

      setCurrentList(prev => ({...prev, items: updatedItems}));
      
      // Update recent items
      const updatedRecent = [itemName, ...recentItems.filter(item => item !== itemName)].slice(0, 20);
      setRecentItems(updatedRecent);
      localStorage.setItem(`recent_${userProfile.id}`, JSON.stringify(updatedRecent));

      setNewItemName('');
      setShowAddItem(false);
      setAutocompleteItems([]);
      
      fetchShoppingLists();
    } catch (error) {
      console.error('Error adding item:', error);
    }
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
          items: updatedItems
        })
        .eq('id', listId);

      if (error) throw error;

      // Update both currentList and shoppingLists state
      if (currentList && currentList.id === listId) {
        setCurrentList(prev => ({...prev, items: updatedItems}));
      }
      
      // Update the shoppingLists array
      setShoppingLists(prev => 
        prev.map(l => l.id === listId ? {...l, items: updatedItems} : l)
      );
      
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

  // Edit Mode Functions
  const startEditItem = (item, itemIndex) => {
    setEditForm({
      name: item.name || '',
      quantity: item.quantity || '',
      unit: item.unit || '',
      category: item.category || 'other',
      notes: item.notes || ''
    });
    setEditingItem({ ...item, index: itemIndex });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({
      name: '',
      quantity: '',
      unit: '',
      category: 'other',
      notes: ''
    });
  };

  const saveEditItem = async () => {
    if (!editForm.name.trim() || !editingItem) return;

    try {
      // Handle editing items during list creation
      if (editingItem.isCreating) {
        const updatedItems = [...newListForm.items];
        updatedItems[editingItem.index] = {
          ...updatedItems[editingItem.index],
          name: editForm.name.trim(),
          quantity: editForm.quantity,
          unit: editForm.unit,
          category: editForm.category,
          notes: editForm.notes
        };
        
        setNewListForm(prev => ({ ...prev, items: updatedItems }));
        cancelEdit();
        setMessage('Item updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      // Handle editing items in existing lists
      const updatedItems = [...currentList.items];
      updatedItems[editingItem.index] = {
        ...updatedItems[editingItem.index],
        name: editForm.name.trim(),
        quantity: editForm.quantity,
        unit: editForm.unit,
        category: editForm.category,
        notes: editForm.notes
      };

      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          items: updatedItems
        })
        .eq('id', currentList.id);

      if (error) throw error;

      setCurrentList(prev => ({...prev, items: updatedItems}));
      fetchShoppingLists();
      cancelEdit();
      setMessage('Item updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating item:', error);
      setMessage('Error updating item');
    }
  };

  const deleteItem = async (itemIndex) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const updatedItems = currentList.items.filter((_, index) => index !== itemIndex);
      
      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          items: updatedItems
        })
        .eq('id', currentList.id);

      if (error) throw error;

      setCurrentList(prev => ({...prev, items: updatedItems}));
      fetchShoppingLists();
      setMessage('Item deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
      setMessage('Error deleting item');
    }
  };

  // Filter lists
  const filteredLists = shoppingLists.filter(list => {
    const matchesSearch = list.list_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.target_store?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || list.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
                        console.log('Setting current list:', list);
                        setCurrentList({...list, items: list.items || []});
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
                    <div className="stat">
                      <Tag size={16} />
                      <span>{list.items?.filter(item => item.quantity && item.quantity.trim()).length || 0} with quantities</span>
                    </div>
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
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addItemToList();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={addItemToList}
                  className="action-button primary"
                  disabled={!newItem.name.trim()}
                >
                  <Plus size={16} />
                  Add
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
                                {item.quantity && item.unit ? `${item.quantity} ${item.unit}` : 
                                 item.quantity ? item.quantity : 
                                 item.unit ? item.unit : 
                                 'No quantity set'}
                                {item.notes && ` (${item.notes})`}
                              </span>
                            </div>
                            <div className="item-actions">
                              <button
                                onClick={() => {
                                  // Create a temporary edit state for items in the create form
                                  const itemIndex = newListForm.items.findIndex(i => i.id === item.id);
                                  setEditForm({
                                    name: item.name || '',
                                    quantity: item.quantity || '',
                                    unit: item.unit || '',
                                    category: item.category || 'other',
                                    notes: item.notes || ''
                                  });
                                  setEditingItem({ ...item, index: itemIndex, isCreating: true });
                                }}
                                className="action-button small secondary"
                                title="Edit item"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => removeItemFromList(item.id)}
                                className="action-button small danger"
                                title="Remove item"
                              >
                                <X size={14} />
                              </button>
                            </div>
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
                    Items with quantities: {newListForm.items.filter(item => item.quantity && item.quantity.trim()).length}
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

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="edit-mode-overlay" onClick={cancelEdit}>
            <div className="edit-item-modal" onClick={(e) => e.stopPropagation()}>
              <div className="edit-modal-header">
                <h3>Edit Item</h3>
                <button onClick={cancelEdit} className="close-modal">
                  <X size={20} />
                </button>
              </div>
              
              <div className="edit-form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Item name"
                  autoFocus
                />
              </div>
              
              <div className="edit-form-group">
                <label>Quantity</label>
                <input
                  type="text"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g., 2, 500g"
                />
              </div>
              
              <div className="edit-form-group">
                <label>Unit</label>
                <input
                  type="text"
                  value={editForm.unit}
                  onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., kg, litres, pack"
                />
              </div>
              
              <div className="edit-form-group">
                <label>Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="edit-form-group">
                <label>Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
              
              <div className="edit-modal-actions">
                <button
                  onClick={() => deleteItem(editingItem.index)}
                  className="action-button danger"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={cancelEdit}
                  className="action-button secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditItem}
                  className="action-button primary"
                  disabled={!editForm.name.trim()}
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Delete all completed items
  const deleteAllCompleted = async () => {
    if (!window.confirm('Are you sure you want to delete all completed items?')) return;

    try {
      const updatedItems = currentList.items.filter(item => !item.purchased);
      
      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          items: updatedItems
        })
        .eq('id', currentList.id);

      if (error) throw error;

      setCurrentList(prev => ({...prev, items: updatedItems}));
      fetchShoppingLists();
      setMessage('All completed items deleted!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting completed items:', error);
      setMessage('Error deleting completed items');
    }
  };

  // Shopping Mode
  if (view === 'shopping') {
    console.log('Shopping mode triggered with currentList:', currentList);
    
    // Safety check - ensure currentList exists and has items array
    if (!currentList || !currentList.items) {
      console.log('CurrentList missing or no items, showing loading...');
      return (
        <div className="shopping-mode">
          <div className="shopping-header">
            <button
              onClick={() => setView('overview')}
              className="back-button"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="shopping-title">
              <h1>Loading...</h1>
              <p>Please wait</p>
            </div>
          </div>
          <div className="empty-shopping-list">
            <ShoppingCart size={48} />
            <h3>Loading shopping list...</h3>
            <p>Please wait while we load your items</p>
          </div>
        </div>
      );
    }

    const { remaining, total, completed } = getProgress();
    const activeItems = currentList.items.filter(item => !item.purchased);
    const displayItems = showCompleted ? currentList.items : activeItems;

    // Group items by category
    const groupedItems = displayItems.reduce((acc, item, index) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ ...item, originalIndex: currentList.items.indexOf(item) });
      return acc;
    }, {});

    return (
      <div className="shopping-mode">
        {/* Header */}
        <div className="shopping-header">
          <button
            onClick={() => setView('overview')}
            className="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="shopping-title">
            <h1>{currentList.list_name}</h1>
            <p>{remaining} of {total} items remaining</p>
          </div>
          <button className="more-options">
            <MoreHorizontal size={20} />
          </button>
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

        {/* Controls */}
        <div className="shopping-controls">
          <button
            className="add-item-button"
            onClick={() => setShowAddItem(true)}
          >
            <Plus size={18} />
            Add Item
          </button>
          
          <div className="shopping-toggles">
            <button
              className={`toggle-button ${showCompleted ? 'active' : ''}`}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? <EyeOff size={16} /> : <Eye size={16} />}
              {showCompleted ? 'Hide Completed' : `Show Completed (${completed})`}
            </button>
            
            {completed > 0 && (
              <button
                className="delete-completed-button"
                onClick={deleteAllCompleted}
              >
                <Trash2 size={16} />
                Delete All Completed
              </button>
            )}
          </div>
        </div>

        {/* Add Item Form */}
        {showAddItem && (
          <div className="add-item-form-shopping">
            <div className="add-item-input">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => {
                  setNewItemName(e.target.value);
                  handleAutocomplete(e.target.value);
                }}
                placeholder="Add item..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newItemName.trim()) {
                    addQuickItem(newItemName);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newItemName.trim()) {
                    addQuickItem(newItemName);
                  }
                }}
                className="add-button"
                disabled={!newItemName.trim()}
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setNewItemName('');
                  setAutocompleteItems([]);
                }}
                className="cancel-button"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Autocomplete */}
            {autocompleteItems.length > 0 && (
              <div className="autocomplete-list">
                {autocompleteItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => addQuickItem(item)}
                    className="autocomplete-item"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shopping List */}
        <div className="shopping-list-content">
          {Object.entries(groupedItems).map(([category, items]) => {
            const categoryInfo = getCategoryInfo(category);
            return (
              <div key={category} className="shopping-category">
                <div 
                  className="category-header-shopping"
                  style={{ backgroundColor: categoryInfo.color }}
                >
                  <span className="category-emoji">{categoryInfo.emoji}</span>
                  <span className="category-name">{categoryInfo.label}</span>
                </div>
                
                <div className="category-items-shopping">
                  {items.map((item) => (
                    <div 
                      key={item.originalIndex} 
                      className={`shopping-item ${item.purchased ? 'completed' : ''}`}
                      onClick={() => toggleItemPurchased(currentList.id, item.originalIndex)}
                    >
                      <div className="item-content">
                        <div className="item-details">
                          <span className={`item-name ${item.purchased ? 'crossed-out' : ''}`}>
                            {item.name}
                            {(item.quantity || item.unit) && (
                              <span className="item-quantity">
                                {' '}
                                {item.quantity && item.unit ? `(${item.quantity} ${item.unit})` : 
                                 item.quantity ? `(${item.quantity})` : 
                                 item.unit ? `(${item.unit})` : ''}
                              </span>
                            )}
                          </span>
                          {item.notes && (
                            <span className="item-notes">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditItem(item, item.originalIndex);
                          }}
                          className="edit-button"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.originalIndex);
                          }}
                          className="delete-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {displayItems.length === 0 && (
            <div className="empty-shopping-list">
              {showCompleted ? (
                <>
                  <CheckCircle2 size={48} />
                  <h3>All done!</h3>
                  <p>You've completed your shopping list</p>
                </>
              ) : (
                <>
                  <ShoppingCart size={48} />
                  <h3>All items completed!</h3>
                  <p>Tap "Show Completed" to see what you've bought</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="edit-mode-overlay" onClick={cancelEdit}>
            <div className="edit-item-modal shopping-edit" onClick={(e) => e.stopPropagation()}>
              <div className="edit-modal-header">
                <h3>Item Details</h3>
                <button onClick={cancelEdit} className="done-button">
                  Done
                </button>
              </div>
              
              <div className="edit-item-content">
                <div className="item-name-section">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="item-name-input"
                    placeholder="Item name"
                  />
                  <button 
                    className="favorite-button"
                    onClick={() => addToFavorites(editForm.name)}
                  >
                    <Star size={20} />
                  </button>
                </div>
                
                <div className="edit-sections">
                  <div className="edit-section">
                    <h4>INFO</h4>
                    
                    <div className="edit-row">
                      <div className="edit-row-icon">
                        <Package size={20} />
                      </div>
                      <div className="edit-row-content">
                        <span className="edit-row-label">Category</span>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="edit-select"
                        >
                          {categories.map(cat => (
                            <option key={cat.key} value={cat.key}>
                              {cat.emoji} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Add Custom Category Option */}
                    {!showAddCategory ? (
                      <div className="edit-row" onClick={() => setShowAddCategory(true)}>
                        <div className="edit-row-icon">
                          <Plus size={20} />
                        </div>
                        <div className="edit-row-content">
                          <span className="edit-row-label">Add New Category</span>
                          <span className="edit-row-hint">Create custom category</span>
                        </div>
                      </div>
                    ) : (
                      <div className="add-category-form">
                        <div className="edit-row">
                          <div className="edit-row-icon">
                            <input
                              type="text"
                              value={newCategoryForm.emoji}
                              onChange={(e) => setNewCategoryForm(prev => ({ ...prev, emoji: e.target.value }))}
                              className="emoji-input"
                              placeholder="📦"
                              maxLength={2}
                            />
                          </div>
                          <div className="edit-row-content">
                            <input
                              type="text"
                              value={newCategoryForm.name}
                              onChange={(e) => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Category name (e.g., Pet Supplies)"
                              className="category-name-input"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="add-category-actions">
                          <button
                            onClick={() => {
                              setShowAddCategory(false);
                              setNewCategoryForm({ name: '', emoji: '📦' });
                            }}
                            className="cancel-category-button"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addCustomCategory}
                            className="save-category-button"
                            disabled={!newCategoryForm.name.trim()}
                          >
                            Add Category
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="edit-row">
                      <div className="edit-row-icon">
                        <Circle size={20} />
                      </div>
                      <div className="edit-row-content">
                        <span className="edit-row-label">Quantity</span>
                        <input
                          type="text"
                          value={editForm.quantity}
                          onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                          placeholder="Not set"
                          className="edit-input"
                        />
                      </div>
                    </div>
                    
                    <div className="edit-row">
                      <div className="edit-row-icon">
                        <Package size={20} />
                      </div>
                      <div className="edit-row-content">
                        <span className="edit-row-label">Unit</span>
                        <input
                          type="text"
                          value={editForm.unit}
                          onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                          placeholder="Not set"
                          className="edit-input"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="edit-section">
                    <h4>NOTES</h4>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add note..."
                      className="notes-textarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="edit-modal-actions">
                <button
                  onClick={saveEditItem}
                  className="save-item-button"
                  disabled={!editForm.name.trim()}
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="shopping-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            />
          </div>
          <span className="progress-text">
            {completed} of {total} items completed
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default ShoppingList;