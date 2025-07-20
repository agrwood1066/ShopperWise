import React from 'react';
import { Calendar, Brain } from 'lucide-react';
import './MealPlanner.css';

const MealPlanner = ({ userProfile }) => {
  return (
    <div className="meal-planner">
      <div className="page-header">
        <h1>Weekly Meal Planner</h1>
        <p>Plan your meals intelligently with AI-powered suggestions</p>
      </div>

      <div className="coming-soon">
        <Calendar size={64} />
        <h2>Coming Soon!</h2>
        <p>Intelligent meal planning functionality will be available in Phase 3</p>
        <div className="planned-features">
          <h3>Planned Features:</h3>
          <ul>
            <li>Weekly meal planning calendar</li>
            <li>Claude AI-powered recipe suggestions</li>
            <li>Weekly questionnaire for preferences</li>
            <li>Prioritise recipes using expiring inventory</li>
            <li>Drag-and-drop meal assignment</li>
            <li>Nutritional balance tracking</li>
            <li>Meal history and variety monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;