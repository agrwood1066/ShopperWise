import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import './Inventory.css';

const Inventory = ({ userProfile }) => {
  return (
    <div className="inventory">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>Track your fridge, freezer, and pantry items with expiry dates</p>
      </div>

      <div className="coming-soon">
        <Package size={64} />
        <h2>Coming Soon!</h2>
        <p>Smart inventory management functionality will be available in Phase 2</p>
        <div className="planned-features">
          <h3>Planned Features:</h3>
          <ul>
            <li>Track items by location (fridge, freezer, pantry)</li>
            <li>Monitor expiry dates with colour-coded alerts</li>
            <li>Quantity tracking and usage monitoring</li>
            <li>Auto-suggest recipes for expiring items</li>
            <li>Shopping list generation from low stock</li>
            <li>Food waste reduction insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inventory;