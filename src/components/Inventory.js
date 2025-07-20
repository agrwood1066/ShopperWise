import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  X,
  Save,
  Calendar,
  MapPin,
  TrendingDown,
  ChefHat,
  ShoppingCart
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { categorizeIngredient } from '../utils/ingredientHelpers';
import './Inventory.css';

const Inventory = ({ userProfile }) => {
  const [inventory, setInventory] = useState([]);
  const [possibleRecipes, setPossibleRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExpiry, setFilterExpiry] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState('');

  // Form state for adding/editing inventory items
  const [formData, setFormData] = useState({
    ingredient_name: '',
    category: '',
    quantity: '',
    unit: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    location_detail: '',
    storage_location: 'fridge',
    cost: '',
    store_purchased_from: ''
  });

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchInventory(),
        fetchPossibleRecipes()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading inventory data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory_with_expiry_status')
      .select('*')
      .eq('family_id', userProfile.family_id)
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    setInventory(data || []);
  };



  const fetchPossibleRecipes = async () => {
    // Get current inventory ingredient names
    const { data: inventoryData, error: invError } = await supabase
      .from('inventory_with_expiry_status')
      .select('ingredient_name')
      .eq('family_id', userProfile.family_id)
      .gt('quantity', 0);

    if (invError) throw invError;

    const availableIngredients = inventoryData.map(item => 
      item.ingredient_name.toLowerCase()
    );

    // Get recipes and check which ones can be made
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select('id, name, ingredients, difficulty, prep_time, cook_time')
      .eq('family_id', userProfile.family_id);

    if (recipeError) throw recipeError;

    const possibleRecipes = recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients || [];
      const requiredIngredients = recipeIngredients.map(ing => 
        ing.item.toLowerCase()
      );
      
      // Check if at least 70% of ingredients are available
      const availableCount = requiredIngredients.filter(ingredient =>
        availableIngredients.some(available => 
          available.includes(ingredient) || ingredient.includes(available)
        )
      ).length;
      
      return availableCount >= Math.ceil(requiredIngredients.length * 0.7);
    });

    setPossibleRecipes(possibleRecipes);
  };

  const resetForm = () => {
    setFormData({
      ingredient_name: '',
      category: '',
      quantity: '',
      unit: '',
      purchase_date: new Date().toISOString().split('T')[0],
      expiry_date: '',
      location_detail: '',
      storage_location: 'fridge',
      cost: '',
      store_purchased_from: ''
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-categorize when ingredient name changes
    if (name === 'ingredient_name' && value.trim()) {
      setFormData(prev => ({
        ...prev,
        category: categorizeIngredient(value)
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate required fields
      if (!formData.ingredient_name.trim()) {
        throw new Error('Ingredient name is required');
      }
      if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
        throw new Error('Valid quantity is required');
      }
      if (!formData.unit) {
        throw new Error('Unit is required');
      }

      const inventoryData = {
        family_id: userProfile.family_id,
        ingredient_name: formData.ingredient_name.trim(),
        category: formData.category || categorizeIngredient(formData.ingredient_name),
        storage_location: formData.storage_location,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        purchase_date: formData.purchase_date || null,
        expiry_date: formData.expiry_date || null, // Convert empty string to null
        location_detail: formData.location_detail.trim() || null, // Convert empty string to null
        cost: formData.cost ? parseFloat(formData.cost) : null,
        store_purchased_from: formData.store_purchased_from.trim() || null, // Convert empty string to null
        added_by: userProfile.id
      };

      console.log('Submitting inventory data:', inventoryData); // Debug log

      let result;
      if (editingItem) {
        result = await supabase
          .from('current_inventory')
          .update(inventoryData)
          .eq('id', editingItem.id)
          .select();
      } else {
        result = await supabase
          .from('current_inventory')
          .insert([inventoryData])
          .select();
      }

      if (result.error) {
        console.error('Database error:', result.error); // Better error logging
        throw result.error;
      }

      setMessage(`Item ${editingItem ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      setMessage(`Error saving item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ingredient_name: item.ingredient_name,
      category: item.category,
      storage_location: item.storage_location,
      quantity: item.quantity.toString(),
      unit: item.unit,
      purchase_date: item.purchase_date,
      expiry_date: item.expiry_date,
      location_detail: item.location_detail || '',
      cost: item.cost ? item.cost.toString() : '',
      store_purchased_from: item.store_purchased_from || ''
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('current_inventory')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setMessage('Item deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      setMessage('Error deleting item. Please try again.');
    }
  };

  const getExpiryStatusColor = (status) => {
    switch (status) {
      case 'expired': return '#ef4444'; // red
      case 'expiring': return '#f97316'; // orange  
      case 'soon': return '#eab308'; // yellow
      case 'fresh': return '#22c55e'; // green
      default: return '#6b7280'; // gray
    }
  };

  const getExpiryStatusText = (status, daysUntilExpiry) => {
    switch (status) {
      case 'expired': return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
      case 'expiring': return `Expires in ${daysUntilExpiry} days`;
      case 'soon': return `Expires in ${daysUntilExpiry} days`;
      case 'fresh': return `${daysUntilExpiry} days remaining`;
      default: return 'Unknown';
    }
  };

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location_detail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || item.storage_location === filterLocation;
    const matchesExpiry = !filterExpiry || item.expiry_status === filterExpiry;
    
    return matchesSearch && matchesLocation && matchesExpiry;
  });

  // Get summary statistics
  const expiringSoon = inventory.filter(item => 
    ['expired', 'expiring', 'soon'].includes(item.expiry_status)
  );
  const totalValue = inventory.reduce((sum, item) => sum + (item.cost || 0), 0);

  if (loading && inventory.length === 0) {
    return (
      <div className="inventory">
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading your inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory">
      <div className="page-header">
        <h1>Smart Inventory</h1>
        <p>Track your ingredients with intelligent expiry monitoring</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
          <button onClick={() => setMessage('')} className="alert-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="inventory-stats">
        <div className="stat-card">
          <Package size={24} />
          <div className="stat-content">
            <span className="stat-number">{inventory.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
        </div>
        <div className="stat-card urgent">
          <AlertTriangle size={24} />
          <div className="stat-content">
            <span className="stat-number">{expiringSoon.length}</span>
            <span className="stat-label">Need Attention</span>
          </div>
        </div>
        <div className="stat-card">
          <ChefHat size={24} />
          <div className="stat-content">
            <span className="stat-number">{possibleRecipes.length}</span>
            <span className="stat-label">Possible Recipes</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingDown size={24} />
          <div className="stat-content">
            <span className="stat-number">£{totalValue.toFixed(2)}</span>
            <span className="stat-label">Total Value</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="inventory-actions">
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Search and Filters */}
      <div className="inventory-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ingredients or locations..."
            className="input"
          />
        </div>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="input filter-select"
        >
          <option value="">All Locations</option>
          <option value="fridge">Fridge</option>
          <option value="freezer">Freezer</option>
          <option value="pantry">Pantry</option>
        </select>

        <select
          value={filterExpiry}
          onChange={(e) => setFilterExpiry(e.target.value)}
          className="input filter-select"
        >
          <option value="">All Items</option>
          <option value="expired">Expired</option>
          <option value="expiring">Expiring (2 days)</option>
          <option value="soon">Soon (7 days)</option>
          <option value="fresh">Fresh</option>
        </select>
      </div>

      {/* Possible Recipes Section */}
      {possibleRecipes.length > 0 && (
        <div className="possible-recipes">
          <h3>🍳 Recipes You Can Make</h3>
          <div className="recipe-suggestions">
            {possibleRecipes.slice(0, 3).map(recipe => (
              <div key={recipe.id} className="recipe-suggestion">
                <h4>{recipe.name}</h4>
                <div className="recipe-meta">
                  <span className="difficulty">{recipe.difficulty}</span>
                  <span className="time">{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      {filteredInventory.length > 0 ? (
        <div className="inventory-grid">
          {filteredInventory.map(item => (
            <div key={item.id} className="inventory-card">
              <div className="inventory-header">
                <h3>{item.ingredient_name}</h3>
                <div className="inventory-actions-menu">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn-icon"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-icon delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="inventory-details">
                <div className="quantity-info">
                  <span className="quantity">{item.quantity} {item.unit}</span>
                  <span className="category">{item.category}</span>
                </div>

                <div className="location-info">
                  <MapPin size={14} />
                  <span>{item.storage_location}</span>
                  {item.location_detail && (
                    <span className="location-detail"> - {item.location_detail}</span>
                  )}
                </div>

                <div 
                  className="expiry-status"
                  style={{ color: getExpiryStatusColor(item.expiry_status) }}
                >
                  <Clock size={14} />
                  <span>{getExpiryStatusText(item.expiry_status, item.days_until_expiry)}</span>
                </div>

                {item.cost && (
                  <div className="cost-info">
                    <span>£{item.cost.toFixed(2)}</span>
                    {item.store_purchased_from && (
                      <span className="store"> from {item.store_purchased_from}</span>
                    )}
                  </div>
                )}
              </div>

              <div 
                className="expiry-indicator"
                style={{ backgroundColor: getExpiryStatusColor(item.expiry_status) }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Package size={48} />
          <h3>No Items Found</h3>
          <p>
            {searchTerm || filterLocation || filterExpiry
              ? 'Try adjusting your search filters'
              : 'Start tracking your ingredients!'
            }
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Add Your First Item
          </button>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={resetForm} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="inventory-form">
              <div className="form-group">
                <label htmlFor="ingredient_name">Ingredient Name *</label>
                <input
                  id="ingredient_name"
                  name="ingredient_name"
                  type="text"
                  value={formData.ingredient_name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Chicken breast, Milk, Onions..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Auto-detect</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="meat">Meat</option>
                    <option value="fish">Fish</option>
                    <option value="dairy">Dairy</option>
                    <option value="grains">Grains</option>
                    <option value="herbs_spices">Herbs & Spices</option>
                    <option value="oils_condiments">Oils & Condiments</option>
                    <option value="pantry">Pantry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="storage_location">Storage Location</label>
                  <select
                    id="storage_location"
                    name="storage_location"
                    value={formData.storage_location}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="fridge">Fridge</option>
                    <option value="freezer">Freezer</option>
                    <option value="pantry">Pantry</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unit">Unit *</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select unit...</option>
                    <option value="pieces">pieces</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="litres">litres</option>
                    <option value="ml">ml</option>
                    <option value="dozen">dozen</option>
                    <option value="pack">pack</option>
                    <option value="tin">tin</option>
                    <option value="jar">jar</option>
                    <option value="bottle">bottle</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="purchase_date">Purchase Date</label>
                  <input
                    id="purchase_date"
                    name="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expiry_date">Expiry Date</label>
                  <input
                    id="expiry_date"
                    name="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                    className="input"
                  />
                  <small>Optional - set your own expiry date</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cost">Cost (£)</label>
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="store_purchased_from">Store</label>
                  <input
                    id="store_purchased_from"
                    name="store_purchased_from"
                    type="text"
                    value={formData.store_purchased_from}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Tesco, ASDA..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? (
                    <div className="loading small"></div>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;