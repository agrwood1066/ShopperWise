import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  ChefHat, 
  ShoppingCart, 
  AlertTriangle,
  Plus,
  TrendingUp,
  Star,
  Clock
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const Dashboard = ({ userProfile }) => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    favouriteRecipes: 0,
    inventoryItems: 0,
    expiringItems: 0,
    activeLists: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topRecipes, setTopRecipes] = useState([]);

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchDashboardData();
    }
  }, [userProfile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recipes count and data
      const { data: recipes, count: recipesCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact' })
        .eq('family_id', userProfile.family_id);

      // Count favourite recipes
      const favouriteCount = recipes?.filter(r => r.is_favourite).length || 0;

      // Fetch inventory count (placeholder for now)
      const { count: inventoryCount } = await supabase
        .from('current_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id);

      // Fetch expiring items (within 7 days) - placeholder for now
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      const { count: expiringCount } = await supabase
        .from('current_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id)
        .lte('expiry_date', sevenDaysFromNow.toISOString().split('T')[0]);

      // Fetch active shopping lists (placeholder for now)
      const { count: activeListsCount } = await supabase
        .from('shopping_lists')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', userProfile.family_id)
        .in('status', ['planning', 'active']);

      // Get recent recipes for activity
      const recentRecipes = recipes
        ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5) || [];

      // Get top-rated recipes
      const topRatedRecipes = recipes
        ?.filter(r => r.healthy_rating >= 4)
        .sort((a, b) => b.healthy_rating - a.healthy_rating)
        .slice(0, 3) || [];

      setStats({
        totalRecipes: recipesCount || 0,
        favouriteRecipes: favouriteCount,
        inventoryItems: inventoryCount || 0,
        expiringItems: expiringCount || 0,
        activeLists: activeListsCount || 0
      });

      setRecentActivity(recentRecipes);
      setTopRecipes(topRatedRecipes);
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

  const getTotalTime = (recipe) => {
    return (recipe.prep_time || 0) + (recipe.cook_time || 0);
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
            {stats.favouriteRecipes > 0 && (
              <small>{stats.favouriteRecipes} favourites</small>
            )}
          </div>
          <Link to="/recipes" className="stat-link">
            {stats.totalRecipes > 0 ? 'View All' : 'Add First Recipe'}
          </Link>
        </div>

        <div className="stat-card inventory-placeholder">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Coming Soon</h3>
            <p>Inventory Tracking</p>
          </div>
          <Link to="/inventory" className="stat-link">
            Phase 3
          </Link>
        </div>

        <div className="stat-card expiry-placeholder">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>Coming Soon</h3>
            <p>Expiry Alerts</p>
          </div>
          <Link to="/inventory" className="stat-link">
            Phase 3
          </Link>
        </div>

        <div className="stat-card shopping-placeholder">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>Coming Soon</h3>
            <p>Shopping Lists</p>
          </div>
          <Link to="/shopping" className="stat-link">
            Phase 4
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
          <Link to="/inventory" className="action-card disabled">
            <Package size={20} />
            <span>Update Inventory</span>
            <small>Phase 3</small>
          </Link>
          <Link to="/meal-planner" className="action-card disabled">
            <Calendar size={20} />
            <span>Plan This Week</span>
            <small>Phase 3</small>
          </Link>
          <Link to="/shopping" className="action-card disabled">
            <ShoppingCart size={20} />
            <span>Create Shopping List</span>
            <small>Phase 4</small>
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>Recent Recipes</h2>
          <div className="card">
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map((recipe, index) => (
                  <div key={recipe.id} className="activity-item">
                    <div className="activity-icon">
                      <ChefHat size={16} />
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{recipe.name}</strong> 
                        {recipe.is_favourite && <Star size={14} className="inline-star" />}
                      </p>
                      <div className="activity-meta">
                        <span className="activity-date">{formatDate(recipe.created_at)}</span>
                        {getTotalTime(recipe) > 0 && (
                          <span className="activity-time">
                            <Clock size={12} />
                            {getTotalTime(recipe)} min
                          </span>
                        )}
                        <span className="cuisine-badge">{recipe.cuisine_type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <ChefHat size={48} />
                <h3>No Recipes Yet</h3>
                <p>Start building your recipe collection!</p>
                <Link to="/recipes" className="btn">
                  Add Your First Recipe
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Rated Recipes */}
        {topRecipes.length > 0 && (
          <div className="dashboard-section">
            <h2>Top Rated Recipes</h2>
            <div className="card">
              <div className="top-recipes-list">
                {topRecipes.map((recipe) => (
                  <div key={recipe.id} className="top-recipe-item">
                    <div className="recipe-info">
                      <h4>{recipe.name}</h4>
                      <div className="recipe-meta">
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < recipe.healthy_rating ? 'filled' : ''}
                            />
                          ))}
                        </div>
                        <span className="cuisine">{recipe.cuisine_type}</span>
                      </div>
                    </div>
                    {recipe.is_favourite && (
                      <Star size={16} className="favourite-indicator" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase Progress */}
      <div className="dashboard-section">
        <h2>Development Progress</h2>
        <div className="card">
          <div className="phase-progress">
            <div className="phase-item completed">
              <div className="phase-icon">✅</div>
              <div className="phase-content">
                <h4>Phase 1: Core & Auth</h4>
                <p>Authentication, profiles, and navigation</p>
              </div>
            </div>
            <div className="phase-item completed">
              <div className="phase-icon">✅</div>
              <div className="phase-content">
                <h4>Phase 2: Recipe Management</h4>
                <p>Add, edit, search, and organise recipes</p>
              </div>
            </div>
            <div className="phase-item pending">
              <div className="phase-icon">🔄</div>
              <div className="phase-content">
                <h4>Phase 3: Inventory & AI Planning</h4>
                <p>Smart inventory tracking and meal suggestions</p>
              </div>
            </div>
            <div className="phase-item pending">
              <div className="phase-icon">⏳</div>
              <div className="phase-content">
                <h4>Phase 4: Shopping Lists</h4>
                <p>Automated shopping lists and budget tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;