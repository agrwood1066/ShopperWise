/**
 * Ingredient categorisation utility functions
 */

// Ingredient categories mapping
const INGREDIENT_CATEGORIES = {
  vegetables: [
    'onion', 'onions', 'potato', 'potatoes', 'carrot', 'carrots', 'celery', 'broccoli', 
    'cauliflower', 'cabbage', 'lettuce', 'spinach', 'kale', 'rocket', 'arugula',
    'tomato', 'tomatoes', 'cucumber', 'courgette', 'zucchini', 'aubergine', 'eggplant',
    'pepper', 'peppers', 'chilli', 'chili', 'garlic', 'ginger', 'leek', 'beetroot',
    'radish', 'turnip', 'parsnip', 'swede', 'sprouts', 'brussels sprouts', 'sweetcorn',
    'corn', 'peas', 'green beans', 'broad beans', 'runner beans', 'mushroom', 'mushrooms',
    'asparagus', 'artichoke', 'fennel', 'bok choy', 'pak choi', 'spring onion', 'scallion'
  ],
  
  fruits: [
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'lemon', 'lemons',
    'lime', 'limes', 'strawberry', 'strawberries', 'raspberry', 'raspberries', 
    'blueberry', 'blueberries', 'blackberry', 'blackberries', 'grape', 'grapes',
    'pear', 'pears', 'peach', 'peaches', 'plum', 'plums', 'cherry', 'cherries',
    'pineapple', 'mango', 'mangoes', 'avocado', 'avocados', 'kiwi', 'passion fruit',
    'watermelon', 'melon', 'cantaloupe', 'honeydew', 'grapefruit', 'pomegranate',
    'cranberry', 'cranberries', 'gooseberry', 'gooseberries', 'rhubarb', 'fig', 'figs',
    'date', 'dates', 'apricot', 'apricots', 'nectarine', 'papaya', 'coconut'
  ],
  
  meat: [
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'ham', 'sausage',
    'sausages', 'mince', 'minced beef', 'ground beef', 'steak', 'chop', 'chops',
    'breast', 'thigh', 'leg', 'wing', 'wings', 'ribs', 'brisket', 'roast',
    'venison', 'rabbit', 'pheasant', 'chorizo', 'salami', 'prosciutto', 'pancetta',
    'gammon', 'black pudding', 'liver', 'kidney', 'heart', 'tongue', 'oxtail'
  ],
  
  fish: [
    'salmon', 'cod', 'haddock', 'tuna', 'mackerel', 'sardines', 'anchovies',
    'herring', 'trout', 'sea bass', 'sea bream', 'halibut', 'sole', 'plaice',
    'monkfish', 'john dory', 'red mullet', 'prawns', 'shrimp', 'crab', 'lobster',
    'scallops', 'mussels', 'clams', 'oysters', 'squid', 'octopus', 'cuttlefish',
    'fish', 'seafood', 'shellfish', 'smoked salmon', 'kipper', 'eel'
  ],
  
  dairy: [
    'milk', 'cream', 'butter', 'cheese', 'cheddar', 'mozzarella', 'parmesan',
    'brie', 'camembert', 'goats cheese', 'feta', 'ricotta', 'cottage cheese',
    'cream cheese', 'mascarpone', 'yogurt', 'yoghurt', 'greek yogurt', 'crème fraîche',
    'sour cream', 'double cream', 'single cream', 'whipping cream', 'buttermilk',
    'condensed milk', 'evaporated milk', 'skimmed milk', 'whole milk', 'semi-skimmed'
  ],
  
  grains: [
    'rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'barley', 'bulgur',
    'couscous', 'polenta', 'cornmeal', 'breadcrumbs', 'noodles', 'spaghetti',
    'penne', 'fusilli', 'tagliatelle', 'lasagne', 'ravioli', 'tortilla', 'wrap',
    'pitta', 'naan', 'baguette', 'sourdough', 'wholemeal', 'white bread', 'brown bread',
    'rye bread', 'bagel', 'muffin', 'croissant', 'cereal', 'porridge', 'muesli'
  ],
  
  herbs_spices: [
    'basil', 'oregano', 'thyme', 'rosemary', 'sage', 'parsley', 'coriander', 'cilantro',
    'mint', 'dill', 'chives', 'tarragon', 'bay leaves', 'bay leaf', 'marjoram',
    'salt', 'pepper', 'paprika', 'cumin', 'turmeric', 'cinnamon', 'nutmeg',
    'cardamom', 'cloves', 'allspice', 'garam masala', 'curry powder', 'chili powder',
    'cayenne', 'smoked paprika', 'saffron', 'vanilla', 'star anise', 'fennel seeds',
    'coriander seeds', 'mustard seeds', 'sesame seeds', 'poppy seeds', 'herbs', 'spices'
  ],
  
  oils_condiments: [
    'olive oil', 'vegetable oil', 'sunflower oil', 'coconut oil', 'sesame oil',
    'rapeseed oil', 'groundnut oil', 'vinegar', 'balsamic vinegar', 'white wine vinegar',
    'red wine vinegar', 'apple cider vinegar', 'soy sauce', 'worcestershire sauce',
    'hot sauce', 'ketchup', 'mayonnaise', 'mustard', 'honey', 'maple syrup',
    'jam', 'marmalade', 'peanut butter', 'tahini', 'hummus', 'pesto', 'tomato paste',
    'tomato puree', 'coconut milk', 'stock', 'broth', 'bouillon', 'marmite', 'vegemite'
  ],
  
  pantry: [
    'sugar', 'brown sugar', 'icing sugar', 'caster sugar', 'baking powder', 'bicarbonate of soda',
    'baking soda', 'yeast', 'cornflour', 'cornstarch', 'arrowroot', 'gelatin', 'gelatine',
    'cocoa powder', 'chocolate', 'dark chocolate', 'milk chocolate', 'white chocolate',
    'nuts', 'almonds', 'walnuts', 'pecans', 'cashews', 'pistachios', 'hazelnuts',
    'pine nuts', 'peanuts', 'chestnuts', 'raisins', 'sultanas', 'currants', 'dried fruit',
    'beans', 'lentils', 'chickpeas', 'kidney beans', 'black beans', 'cannellini beans',
    'butter beans', 'flageolet beans', 'split peas', 'red lentils', 'green lentils',
    'tinned tomatoes', 'canned tomatoes', 'passata', 'coconut cream', 'desiccated coconut'
  ]
};

/**
 * Automatically categorise an ingredient based on its name
 * @param {string} ingredientName - The name of the ingredient
 * @returns {string} - The category of the ingredient
 */
export const categorizeIngredient = (ingredientName) => {
  if (!ingredientName || typeof ingredientName !== 'string') {
    return 'other';
  }

  const lowerName = ingredientName.toLowerCase().trim();
  
  // Check each category for matches
  for (const [category, ingredients] of Object.entries(INGREDIENT_CATEGORIES)) {
    for (const ingredient of ingredients) {
      // Check for exact matches or if the ingredient name contains the keyword
      if (lowerName === ingredient || 
          lowerName.includes(ingredient) || 
          ingredient.includes(lowerName)) {
        return category;
      }
    }
  }
  
  // If no match found, return 'other'
  return 'other';
};

/**
 * Get all available categories
 * @returns {Array} - Array of category names
 */
export const getAvailableCategories = () => {
  return Object.keys(INGREDIENT_CATEGORIES);
};

/**
 * Get ingredients for a specific category
 * @param {string} category - The category name
 * @returns {Array} - Array of ingredients in that category
 */
export const getIngredientsForCategory = (category) => {
  return INGREDIENT_CATEGORIES[category] || [];
};

/**
 * Check if a category exists
 * @param {string} category - The category name to check
 * @returns {boolean} - Whether the category exists
 */
export const isValidCategory = (category) => {
  return Object.keys(INGREDIENT_CATEGORIES).includes(category);
};
