import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import RecipeManager from './components/RecipeManager';
import Inventory from './components/Inventory';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading ShopperWise...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app">
        <Navigation userProfile={userProfile} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard userProfile={userProfile} />} />
            <Route path="/profile" element={<Profile userProfile={userProfile} setUserProfile={setUserProfile} />} />
            <Route path="/recipes" element={<RecipeManager userProfile={userProfile} />} />
            <Route path="/inventory" element={<Inventory userProfile={userProfile} />} />
            <Route path="/meal-planner" element={<MealPlanner userProfile={userProfile} />} />
            <Route path="/shopping" element={<ShoppingList userProfile={userProfile} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;