import React, { useState, useEffect } from 'react';
import { User, Users, Settings, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Profile.css';

const Profile = ({ userProfile, setUserProfile }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    dietary_preferences: [],
    cooking_skill: 'intermediate',
    weekly_meal_goal: 7
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        dietary_preferences: userProfile.dietary_preferences || [],
        cooking_skill: userProfile.cooking_skill || 'intermediate',
        weekly_meal_goal: userProfile.weekly_meal_goal || 7
      });
      fetchFamilyMembers();
    }
  }, [userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFamilyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('family_id', userProfile.family_id);

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryPreferenceChange = (preference) => {
    setFormData(prev => ({
      ...prev,
      dietary_preferences: prev.dietary_preferences.includes(preference)
        ? prev.dietary_preferences.filter(p => p !== preference)
        : [...prev.dietary_preferences, preference]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          dietary_preferences: formData.dietary_preferences,
          cooking_skill: formData.cooking_skill,
          weekly_meal_goal: parseInt(formData.weekly_meal_goal)
        })
        .eq('id', userProfile.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Low-Carb',
    'Keto',
    'Paleo'
  ];

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account and meal planning preferences</p>
      </div>

      <div className="profile-content">
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <User size={20} />
            <h2>Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="input disabled"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cooking_skill">Cooking Skill Level</label>
              <select
                id="cooking_skill"
                name="cooking_skill"
                value={formData.cooking_skill}
                onChange={handleInputChange}
                className="input"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weekly_meal_goal">Weekly Meal Goal</label>
              <input
                id="weekly_meal_goal"
                name="weekly_meal_goal"
                type="number"
                min="1"
                max="21"
                value={formData.weekly_meal_goal}
                onChange={handleInputChange}
                className="input"
              />
              <small>How many meals do you want to plan per week?</small>
            </div>

            <div className="form-group">
              <label>Dietary Preferences</label>
              <div className="checkbox-group">
                {dietaryOptions.map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.dietary_preferences.includes(option)}
                      onChange={() => handleDietaryPreferenceChange(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {message && (
              <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="loading"></span>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Family Settings */}
        <div className="card">
          <div className="card-header">
            <Users size={20} />
            <h2>Family Settings</h2>
          </div>

          <div className="family-info">
            <div className="family-id">
              <label>Family ID</label>
              <div className="family-id-display">
                <code>{userProfile?.family_id}</code>
                <small>Share this ID with family members to join your account</small>
              </div>
            </div>

            {familyMembers.length > 0 && (
              <div className="family-members">
                <h3>Family Members</h3>
                <div className="members-list">
                  {familyMembers.map(member => (
                    <div key={member.id} className="member-item">
                      <div className="member-info">
                        <strong>{member.profiles?.full_name || member.profiles?.email}</strong>
                        <span className="member-role">{member.relationship}</span>
                      </div>
                      <div className="member-permissions">
                        {member.can_edit ? 'Can Edit' : 'View Only'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <div className="card-header">
            <Settings size={20} />
            <h2>Account Actions</h2>
          </div>

          <div className="account-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              Refresh Data
            </button>
            
            <button 
              className="btn btn-danger"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;