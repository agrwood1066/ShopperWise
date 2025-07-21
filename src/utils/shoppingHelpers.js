/**
 * Shopping List Helper Functions
 * Phase 4: Smart Shopping List Management
 */

import { categorizeIngredient } from './ingredientHelpers';

/**
 * Store section mapping based on categories
 * Optimized for typical UK supermarket layouts
 */
const STORE_SECTIONS = {
  vegetables: { section: 'Fresh Produce', order: 1, color: '#10b981' },
  fruits: { section: 'Fresh Produce', order: 1, color: '#f97316' },
  meat: { section: 'Meat & Fish', order: 2, color: '#ef4444' },
  fish: { section: 'Meat & Fish', order: 2, color: '#ef4444' },
  dairy: { section: 'Dairy & Chilled', order: 3, color: '#f59e0b' },
  bakery: { section: 'Bakery', order: 4, color: '#f59e0b' },
  frozen: { section: 'Frozen', order: 5, color: '#6366f1' },
  grains: { section: 'Grocery Aisles', order: 6, color: '#8b5cf6' },
  pantry: { section: 'Grocery Aisles', order: 6, color: '#8b5cf6' },
  oils_condiments: { section: 'Grocery Aisles', order: 6, color: '#84cc16' },
  herbs_spices: { section: 'Grocery Aisles', order: 6, color: '#06b6d4' },
  beverages: { section: 'Beverages', order: 7, color: '#3b82f6' },
  snacks: { section: 'Snacks & Confectionery', order: 8, color: '#ec4899' },
  household: { section: 'Household & Health', order: 9, color: '#6b7280' },
  other: { section: 'Other', order: 10, color: '#9ca3af' }
};

/**
 * Generate optimized shopping list from meal plans
 * @param {Array} mealPlans - Array of meal plan objects
 * @param {Array} currentInventory - Current inventory items
 * @returns {Object} - Optimized shopping list with categorized items
 */
export const generateOptimizedShoppingList = (mealPlans, currentInventory = []) => {
  const ingredientMap = new Map();
  const inventoryMap = new Map();
  
  // Map current inventory for quick lookup
  currentInventory.forEach(item => {
    const key = item.ingredient_name?.toLowerCase() || item.name?.toLowerCase();
    if (key) {
      inventoryMap.set(key, {
        quantity: item.quantity || 0,
        unit: item.unit || '',
        expiry_date: item.expiry_date
      });
    }
  });

  // Process all meal plans
  mealPlans.forEach(mealPlan => {
    const meals = [
      'monday_breakfast', 'monday_lunch', 'monday_dinner',
      'tuesday_breakfast', 'tuesday_lunch', 'tuesday_dinner',
      'wednesday_breakfast', 'wednesday_lunch', 'wednesday_dinner',
      'thursday_breakfast', 'thursday_lunch', 'thursday_dinner',
      'friday_breakfast', 'friday_lunch', 'friday_dinner',
      'saturday_breakfast', 'saturday_lunch', 'saturday_dinner',
      'sunday_breakfast', 'sunday_lunch', 'sunday_dinner'
    ];

    meals.forEach(mealKey => {
      const recipe = mealPlan[mealKey];
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const key = ingredient.item.toLowerCase();
          const category = categorizeIngredient(ingredient.item);
          
          // Check if we already have this ingredient
          const existingInventory = inventoryMap.get(key);
          const needsToBuy = !existingInventory || 
                           (existingInventory.quantity < parseFloat(ingredient.quantity || 1));

          if (needsToBuy) {
            if (ingredientMap.has(key)) {
              // Combine quantities if same ingredient needed multiple times
              const existing = ingredientMap.get(key);
              const existingQty = parseFloat(existing.quantity) || 0;
              const newQty = parseFloat(ingredient.quantity) || 1;
              existing.quantity = (existingQty + newQty).toString();
              existing.recipes.push(recipe.name);
              existing.notes = existing.notes ? 
                `${existing.notes}, ${ingredient.notes || ''}` : 
                ingredient.notes || '';
            } else {
              ingredientMap.set(key, {
                id: Date.now() + Math.random(),
                name: ingredient.item,
                quantity: ingredient.quantity || '1',
                unit: ingredient.unit || '',
                category: category,
                notes: ingredient.notes || '',
                estimated_price: estimatePrice(ingredient.item, category),
                priority: calculatePriority(ingredient.item, existingInventory),
                recipes: [recipe.name],
                purchased: false
              });
            }
          }
        });
      }
    });
  });

  return Array.from(ingredientMap.values());
};

/**
 * Estimate price for an ingredient based on historical data and category
 * @param {string} itemName - Name of the item
 * @param {string} category - Category of the item
 * @returns {number} - Estimated price in pounds
 */
export const estimatePrice = (itemName, category) => {
  // Basic price estimation - in real app this would use historical data
  const basePrices = {
    vegetables: 2.50,
    fruits: 3.00,
    meat: 8.00,
    fish: 6.50,
    dairy: 3.50,
    grains: 2.00,
    herbs_spices: 1.50,
    oils_condiments: 3.00,
    pantry: 2.50,
    bakery: 2.00,
    frozen: 4.00,
    beverages: 2.50,
    snacks: 3.00,
    household: 4.00,
    other: 3.00
  };

  // Adjust based on specific items
  const itemLower = itemName.toLowerCase();
  let multiplier = 1;

  // Premium items
  if (itemLower.includes('organic') || itemLower.includes('free range')) {
    multiplier = 1.5;
  }
  if (itemLower.includes('salmon') || itemLower.includes('beef')) {
    multiplier = 2;
  }
  if (itemLower.includes('truffle') || itemLower.includes('saffron')) {
    multiplier = 5;
  }

  return Math.round((basePrices[category] || 3.00) * multiplier * 100) / 100;
};

/**
 * Calculate shopping priority for an item
 * @param {string} itemName - Name of the item
 * @param {Object} inventoryItem - Current inventory status
 * @returns {number} - Priority score (1-5, 5 being highest)
 */
export const calculatePriority = (itemName, inventoryItem) => {
  let priority = 3; // Default priority

  // Higher priority for essentials
  const essentials = ['milk', 'bread', 'eggs', 'butter', 'onions', 'garlic'];
  if (essentials.some(essential => itemName.toLowerCase().includes(essential))) {
    priority = 4;
  }

  // Higher priority if completely out of stock
  if (!inventoryItem) {
    priority += 1;
  }

  // Lower priority for luxury items
  const luxury = ['chocolate', 'wine', 'cake', 'biscuits', 'crisps'];
  if (luxury.some(luxItem => itemName.toLowerCase().includes(luxItem))) {
    priority = Math.max(priority - 1, 1);
  }

  return Math.min(priority, 5);
};

/**
 * Organize shopping list by store sections for optimal shopping route
 * @param {Array} items - Shopping list items
 * @returns {Object} - Items organized by store sections
 */
export const organizeByStoreSections = (items) => {
  const sections = {};

  items.forEach(item => {
    const storeSection = STORE_SECTIONS[item.category] || STORE_SECTIONS.other;
    const sectionName = storeSection.section;

    if (!sections[sectionName]) {
      sections[sectionName] = {
        items: [],
        order: storeSection.order,
        color: storeSection.color,
        totalEstimated: 0,
        itemCount: 0
      };
    }

    sections[sectionName].items.push(item);
    sections[sectionName].totalEstimated += parseFloat(item.estimated_price) || 0;
    sections[sectionName].itemCount += 1;
  });

  // Sort sections by shopping order
  return Object.entries(sections)
    .sort(([, a], [, b]) => a.order - b.order)
    .reduce((acc, [sectionName, sectionData]) => {
      acc[sectionName] = sectionData;
      return acc;
    }, {});
};

/**
 * Calculate shopping list statistics
 * @param {Array} items - Shopping list items
 * @returns {Object} - Statistics about the shopping list
 */
export const calculateShoppingStats = (items) => {
  const stats = {
    totalItems: items.length,
    totalEstimated: 0,
    averagePrice: 0,
    categoryBreakdown: {},
    priorityBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    sectionsCount: 0,
    purchasedItems: 0,
    remainingItems: 0,
    actualSpent: 0
  };

  items.forEach(item => {
    stats.totalEstimated += parseFloat(item.estimated_price) || 0;
    
    // Category breakdown
    if (!stats.categoryBreakdown[item.category]) {
      stats.categoryBreakdown[item.category] = { count: 0, estimated: 0 };
    }
    stats.categoryBreakdown[item.category].count += 1;
    stats.categoryBreakdown[item.category].estimated += parseFloat(item.estimated_price) || 0;

    // Priority breakdown
    const priority = item.priority || 3;
    stats.priorityBreakdown[priority] += 1;

    // Purchase status
    if (item.purchased) {
      stats.purchasedItems += 1;
      stats.actualSpent += parseFloat(item.estimated_price) || 0;
    } else {
      stats.remainingItems += 1;
    }
  });

  stats.averagePrice = stats.totalItems > 0 ? stats.totalEstimated / stats.totalItems : 0;
  
  // Count unique sections
  const sections = new Set(items.map(item => 
    STORE_SECTIONS[item.category]?.section || 'Other'
  ));
  stats.sectionsCount = sections.size;

  // Round monetary values
  stats.totalEstimated = Math.round(stats.totalEstimated * 100) / 100;
  stats.averagePrice = Math.round(stats.averagePrice * 100) / 100;
  stats.actualSpent = Math.round(stats.actualSpent * 100) / 100;

  return stats;
};

/**
 * Export shopping list to various formats
 * @param {Object} shoppingList - Shopping list object
 * @param {string} format - Export format ('text', 'csv', 'json')
 * @returns {string} - Formatted export data
 */
export const exportShoppingList = (shoppingList, format = 'text') => {
  const { list_name, target_store, items } = shoppingList;
  
  switch (format.toLowerCase()) {
    case 'csv':
      let csv = 'Item,Quantity,Unit,Category,Estimated Price,Purchased,Notes\n';
      items.forEach(item => {
        csv += `"${item.name}","${item.quantity}","${item.unit}","${item.category}",`;
        csv += `"£${item.estimated_price}","${item.purchased ? 'Yes' : 'No'}","${item.notes || ''}"\n`;
      });
      return csv;

    case 'json':
      return JSON.stringify({
        listName: list_name,
        store: target_store,
        items: items,
        exportDate: new Date().toISOString(),
        stats: calculateShoppingStats(items)
      }, null, 2);

    case 'text':
    default:
      let text = `${list_name}\n`;
      text += target_store ? `Store: ${target_store}\n` : '';
      text += `Generated: ${new Date().toLocaleDateString('en-GB')}\n\n`;
      
      const sections = organizeByStoreSections(items);
      Object.entries(sections).forEach(([sectionName, sectionData]) => {
        text += `=== ${sectionName} ===\n`;
        sectionData.items.forEach(item => {
          const status = item.purchased ? '✓' : '○';
          text += `${status} ${item.name} - ${item.quantity} ${item.unit}`;
          if (item.estimated_price > 0) text += ` (£${item.estimated_price})`;
          if (item.notes) text += ` [${item.notes}]`;
          text += '\n';
        });
        text += '\n';
      });

      const stats = calculateShoppingStats(items);
      text += `=== Summary ===\n`;
      text += `Total Items: ${stats.totalItems}\n`;
      text += `Estimated Total: £${stats.totalEstimated}\n`;
      text += `Purchased: ${stats.purchasedItems}/${stats.totalItems}\n`;
      
      return text;
  }
};

/**
 * Suggest missing common ingredients based on recipes
 * @param {Array} plannedRecipes - Array of planned recipes
 * @param {Array} currentItems - Current shopping list items
 * @returns {Array} - Suggested additional items
 */
export const suggestMissingIngredients = (plannedRecipes, currentItems = []) => {
  const suggestions = [];
  const currentItemNames = new Set(
    currentItems.map(item => item.name.toLowerCase())
  );

  // Common ingredients that are often forgotten
  const commonAdditions = {
    'salt': { category: 'herbs_spices', reason: 'Essential seasoning' },
    'black pepper': { category: 'herbs_spices', reason: 'Essential seasoning' },
    'olive oil': { category: 'oils_condiments', reason: 'Cooking essential' },
    'onions': { category: 'vegetables', reason: 'Used in many recipes' },
    'garlic': { category: 'vegetables', reason: 'Used in many recipes' },
    'butter': { category: 'dairy', reason: 'Cooking and baking' },
    'eggs': { category: 'dairy', reason: 'Versatile ingredient' },
    'milk': { category: 'dairy', reason: 'Common beverage and ingredient' }
  };

  // Check for missing common ingredients
  Object.entries(commonAdditions).forEach(([ingredient, info]) => {
    if (!currentItemNames.has(ingredient)) {
      suggestions.push({
        name: ingredient,
        category: info.category,
        reason: info.reason,
        estimated_price: estimatePrice(ingredient, info.category),
        quantity: '1',
        unit: '',
        priority: 4
      });
    }
  });

  return suggestions;
};

/**
 * Calculate budget variance and insights
 * @param {Object} shoppingList - Shopping list with actual and estimated costs
 * @returns {Object} - Budget analysis
 */
export const analyzeBudget = (shoppingList) => {
  const stats = calculateShoppingStats(shoppingList.items || []);
  const variance = stats.actualSpent - stats.totalEstimated;
  const variancePercent = stats.totalEstimated > 0 ? 
    (variance / stats.totalEstimated) * 100 : 0;

  return {
    estimated: stats.totalEstimated,
    actual: stats.actualSpent,
    variance: Math.round(variance * 100) / 100,
    variancePercent: Math.round(variancePercent * 100) / 100,
    status: variance > 0 ? 'over' : variance < 0 ? 'under' : 'exact',
    insights: generateBudgetInsights(variance, variancePercent, stats)
  };
};

/**
 * Generate budget insights and recommendations
 * @param {number} variance - Budget variance
 * @param {number} variancePercent - Variance percentage
 * @param {Object} stats - Shopping statistics
 * @returns {Array} - Array of insight messages
 */
const generateBudgetInsights = (variance, variancePercent, stats) => {
  const insights = [];

  if (Math.abs(variancePercent) < 5) {
    insights.push('Excellent budget accuracy! Your estimates are very close to actual spending.');
  } else if (variance > 0) {
    insights.push(`You spent £${Math.abs(variance).toFixed(2)} more than estimated (${Math.abs(variancePercent).toFixed(1)}% over budget).`);
    
    if (variancePercent > 20) {
      insights.push('Consider reviewing your price estimates or looking for better deals.');
    }
  } else {
    insights.push(`You saved £${Math.abs(variance).toFixed(2)} (${Math.abs(variancePercent).toFixed(1)}% under budget). Well done!`);
    insights.push('Your estimates might be conservative - consider updating them for better planning.');
  }

  // Category-specific insights
  const expensiveCategories = Object.entries(stats.categoryBreakdown)
    .sort(([,a], [,b]) => b.estimated - a.estimated)
    .slice(0, 3);

  if (expensiveCategories.length > 0) {
    const topCategory = expensiveCategories[0];
    insights.push(`Your biggest expense category was ${topCategory[0]} at £${topCategory[1].estimated.toFixed(2)}.`);
  }

  return insights;
};

/**
 * Find recipes that can be made with purchased items
 * @param {Array} purchasedItems - Items that have been purchased
 * @param {Array} allRecipes - All available recipes
 * @returns {Array} - Recipes that can be made
 */
export const findMakeableRecipes = (purchasedItems, allRecipes) => {
  const purchasedSet = new Set(
    purchasedItems
      .filter(item => item.purchased)
      .map(item => item.name.toLowerCase())
  );

  return allRecipes.filter(recipe => {
    if (!recipe.ingredients) return false;
    
    return recipe.ingredients.every(ingredient => {
      const ingredientName = ingredient.item.toLowerCase();
      return purchasedSet.has(ingredientName) ||
             Array.from(purchasedSet).some(purchased => 
               purchased.includes(ingredientName) || 
               ingredientName.includes(purchased)
             );
    });
  });
};

export default {
  generateOptimizedShoppingList,
  organizeByStoreSections,
  calculateShoppingStats,
  exportShoppingList,
  suggestMissingIngredients,
  analyzeBudget,
  findMakeableRecipes,
  estimatePrice,
  calculatePriority
};