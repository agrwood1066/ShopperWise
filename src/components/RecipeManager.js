import React from 'react';
import { ChefHat, Plus } from 'lucide-react';
import './RecipeManager.css';

const RecipeManager = ({ userProfile }) => {
  return (
    <div className="recipe-manager">
      <div className="page-header">
        <h1>Recipe Manager</h1>
        <p>Manage your family recipes and discover new ones</p>
      </div>

      <div className="coming-soon">
        <ChefHat size={64} />
        <h2>Coming Soon!</h2>
        <p>Recipe management functionality will be available in Phase 2</p>
        <div className="planned-features">
          <h3>Planned Features:</h3>
          <ul>
            <li>Add recipes manually</li>
            <li>Import recipes from URLs</li>
            <li>Browse and search recipes</li>
            <li>Rate and favourite recipes</li>
            <li>Categorise by cuisine and difficulty</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeManager;