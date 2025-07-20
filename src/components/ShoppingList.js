import React from 'react';
import { ShoppingCart, ListChecks } from 'lucide-react';
import './ShoppingList.css';

const ShoppingList = ({ userProfile }) => {
  return (
    <div className="shopping-list">
      <div className="page-header">
        <h1>Shopping Lists</h1>
        <p>Manage your shopping lists with smart categorisation and budget tracking</p>
      </div>

      <div className="coming-soon">
        <ShoppingCart size={64} />
        <h2>Coming Soon!</h2>
        <p>Smart shopping list functionality will be available in Phase 4</p>
        <div className="planned-features">
          <h3>Planned Features:</h3>
          <ul>
            <li>Auto-generate lists from meal plans</li>
            <li>Categorise items by store sections</li>
            <li>Price tracking and budget integration</li>
            <li>Smart shopping mode for in-store use</li>
            <li>Manual list creation and editing</li>
            <li>Export to CSV for external use</li>
            <li>Shopping history and analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;