import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ChefHat, 
  Package, 
  Calendar, 
  ShoppingCart, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Navigation.css';

const Navigation = ({ userProfile }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/recipes', icon: ChefHat, label: 'Recipes' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/meal-planner', icon: Calendar, label: 'Meal Planner' },
    { path: '/shopping', icon: ShoppingCart, label: 'Shopping Lists' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Sidebar */}
      <nav className={`navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-header">
          <h2>🛒 ShopperWise</h2>
          {userProfile && (
            <p className="welcome-text">
              Welcome, {userProfile.full_name || userProfile.email}
            </p>
          )}
        </div>

        <ul className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-footer">
          <Link
            to="/profile"
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          
          <button onClick={handleSignOut} className="nav-link sign-out">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;