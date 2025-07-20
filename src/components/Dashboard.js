import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  ChefHat, 
  ShoppingCart, 
  AlertTriangle,
  Plus,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const Dashboard = ({ userProfile }) => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    inventoryItems: 0,
    expiringItems: 0,
    activeLists: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchDashboardData();
    }
  }, [userProfile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recipes count
      const { count: recipesCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id);

      // Fetch inventory count
      const { count: inventoryCount } = await supabase
        .from('current_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id);

      // Fetch expiring items (within 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      const { count: expiringCount } = await supabase
        .from('current_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id)
        .lte('expiry_date', sevenDaysFromNow.toISOString().split('T')[0]);

      // Fetch active shopping lists
      const { count: activeListsCount } = await supabase
        .from('shopping_lists')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id)
        .in('status', ['planning', 'active']);

      // Fetch recent recipes
      const { data: recentRecipes } = await supabase
        .from('recipes')
        .select('name, created_at')
        .eq('family_id', userProfile.family_id)
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        totalRecipes: recipesCount || 0,
        inventoryItems: inventoryCount || 0,
        expiringItems: expiringCount || 0,
        activeLists: activeListsCount || 0
      });

      setRecentActivity(recentRecipes || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to ShopperWise! Here's your meal planning overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ChefHat size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalRecipes}</h3>
            <p>Recipes</p>
          </div>
          <Link to="/recipes" className="stat-link">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.inventoryItems}</h3>
            <p>Inventory Items</p>
          </div>
          <Link to="/inventory" className="stat-link">
            Manage
          </Link>
        </div>

        <div className={`stat-card ${stats.expiringItems > 0 ? 'warning' : ''}`}>
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.expiringItems}</h3>
            <p>Expiring Soon</p>
          </div>
          <Link to="/inventory" className="stat-link">
            Check Items
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeLists}</h3>
            <p>Active Lists</p>
          </div>
          <Link to="/shopping" className="stat-link">
            View Lists
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/recipes" className="action-card">
            <Plus size={20} />
            <span>Add Recipe</span>
          </Link>
          <Link to="/inventory" className="action-card">
            <Package size={20} />
            <span>Update Inventory</span>
          </Link>
          <Link to="/meal-planner" className="action-card">
            <Calendar size={20} />
            <span>Plan This Week</span>
          </Link>
          <Link to="/shopping" className="action-card">
            <ShoppingCart size={20} />
            <span>Create Shopping List</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="card">
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((recipe, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <ChefHat size={16} />
                  </div>
                  <div className="activity-content">
                    <p><strong>{recipe.name}</strong> was added</p>
                    <span className="activity-date">{formatDate(recipe.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <TrendingUp size={48} />
              <h3>No Recent Activity</h3>
              <p>Start by adding your first recipe or updating your inventory!</p>
              <Link to="/recipes" className="btn">
                Add Your First Recipe
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;