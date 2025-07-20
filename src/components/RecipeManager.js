import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Globe, 
  Edit, 
  Trash2,
  X,
  Save,
  Link as LinkIcon,
  AlertCircle,
  Camera,
  Upload,
  Minus,
  Brain
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './RecipeManager.css';

const RecipeManager = ({ userProfile }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  // Form state for adding/editing recipes
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: 'british',
    cooking_method: '',
    prep_time: '',
    cook_time: '',
    servings: 4,
    difficulty: 'medium',
    healthy_rating: 3,
    ingredients: [{ item: '', quantity: '', notes: '', category: '' }],
    instructions: '',
    dietary_tags: [],
    source_url: '',
    image_url: '',
    notes: ''
  });

  // Auto-categorization for ingredients
  const categorizeIngredient = (itemName) => {
    const item = itemName.toLowerCase();
    
    const categories = {
      'vegetables': ['onion', 'garlic', 'carrot', 'celery', 'potato', 'tomato', 'pepper', 'courgette', 'broccoli', 'spinach', 'lettuce', 'cucumber', 'mushroom', 'leek', 'parsnip', 'beetroot', 'cabbage', 'cauliflower', 'aubergine', 'sweetcorn'],
      'fruits': ['apple', 'banana', 'orange', 'lemon', 'lime', 'berry', 'grape', 'pear', 'peach', 'plum', 'mango', 'pineapple', 'kiwi', 'melon', 'strawberry', 'raspberry', 'blueberry', 'cherry'],
      'meat': ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'ham', 'sausage', 'mince', 'steak', 'fillet', 'breast', 'thigh', 'wing'],
      'fish': ['salmon', 'cod', 'tuna', 'mackerel', 'haddock', 'trout', 'prawns', 'shrimp', 'crab', 'lobster', 'mussels', 'scallops', 'sardines', 'anchovies'],
      'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'crème', 'mascarpone', 'mozzarella', 'cheddar', 'parmesan', 'feta'],
      'grains': ['rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'barley', 'couscous', 'noodles', 'spaghetti', 'linguine', 'penne'],
      'herbs_spices': ['basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'coriander', 'mint', 'sage', 'paprika', 'cumin', 'turmeric', 'ginger', 'cinnamon', 'nutmeg', 'pepper', 'salt'],
      'oils_condiments': ['oil', 'vinegar', 'sauce', 'stock', 'honey', 'syrup', 'mustard', 'ketchup', 'mayonnaise'],
      'pantry': ['tin', 'can', 'jar', 'packet', 'dried', 'beans', 'lentils', 'chickpeas', 'nuts', 'seeds', 'sugar', 'vanilla']
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.some(ingredient => item.includes(ingredient))) {
        return category;
      }
    }
    
    return 'other';
  };

  useEffect(() => {
    if (userProfile?.family_id) {
      fetchRecipes();
    }
  }, [userProfile]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('family_id', userProfile.family_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Error loading recipes. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cuisine_type: 'british',
      cooking_method: '',
      prep_time: '',
      cook_time: '',
      servings: 4,
      difficulty: 'medium',
      healthy_rating: 3,
      ingredients: [{ item: '', quantity: '', notes: '', category: '' }],
      instructions: '',
      dietary_tags: [],
      source_url: '',
      image_url: '',
      notes: ''
    });
    setEditingRecipe(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value
      };
      
      // Auto-categorize when item name changes
      if (field === 'item' && value.trim()) {
        newIngredients[index].category = categorizeIngredient(value);
      }
      
      return {
        ...prev,
        ingredients: newIngredients
      };
    });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', quantity: '', notes: '', category: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleDietaryTagChange = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter(t => t !== tag)
        : [...prev.dietary_tags, tag]
    }));
  };

  const uploadImage = async (file) => {
    try {
      setImageUploading(true);
      
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `recipe-${Date.now()}.${fileExt}`;
      const filePath = `recipes/${userProfile.family_id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, compressedFile);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width)
        const maxWidth = 800;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image too large. Please choose a file under 5MB.');
      return;
    }

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
    }
  };

  // Enhanced recipe extraction using Claude API
  const extractRecipeWithClaude = async (url, basicPreview) => {
    try {
      const claudeApiKey = process.env.REACT_APP_CLAUDE_API_KEY;
      if (!claudeApiKey) {
        console.log('Claude API key not configured, using basic preview only');
        return null;
      }

      // Fetch the full webpage content
      const pageContent = await fetchPageContent(url);
      if (!pageContent) {
        throw new Error('Could not fetch page content');
      }

      // Create a comprehensive prompt for Claude
      const prompt = `Extract detailed recipe information from this webpage content. This could be from BBC Good Food, AllRecipes, Jamie Oliver, Delicious Magazine, or any other recipe website.

WEBPAGE URL: ${url}
BASIC INFO: ${JSON.stringify(basicPreview, null, 2)}

WEBPAGE CONTENT:
${pageContent}

Please extract and return ONLY a valid JSON object with this exact structure:

{
  "name": "Recipe name",
  "description": "Brief description",
  "cuisine_type": "british|italian|asian|mexican|indian|french|mediterranean|american|other",
  "cooking_method": "roast|fry|grill|bake|simmer|etc",
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4,
  "difficulty": "easy|medium|hard",
  "healthy_rating": 3,
  "ingredients": [
    {"item": "chicken breast", "quantity": "500g", "notes": "diced", "category": "meat"},
    {"item": "onion", "quantity": "1 large", "notes": "finely chopped", "category": "vegetables"}
  ],
  "instructions": "1. Heat oil in pan...\\n2. Add onion and cook...",
  "dietary_tags": ["gluten-free", "dairy-free"],
  "cooking_method": "pan-fry"
}

IMPORTANT GUIDELINES:
- Extract ingredients as individual items with quantity, notes, and auto-suggested category
- Categories: vegetables, fruits, meat, fish, dairy, grains, herbs_spices, oils_condiments, pantry, other
- Convert all cooking times to minutes (e.g., "1 hour 30 mins" → 90)
- Instructions should be numbered steps separated by \\n
- Dietary tags should include things like: vegetarian, vegan, gluten-free, dairy-free, etc.
- Difficulty: easy (under 30 mins, simple), medium (30-60 mins, moderate skill), hard (60+ mins or advanced techniques)
- Health rating: 1 (treat/indulgent) to 5 (very healthy/nutritious)
- If any field is unclear or missing, make a reasonable guess based on the recipe type

Return ONLY the JSON object, no other text.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.content[0].text;

      // Clean up the response and parse JSON
      let cleanedResponse = responseText.trim();
      
      // Remove any markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse the JSON response
      const extractedData = JSON.parse(cleanedResponse);
      
      // Auto-categorize ingredients if not already categorized
      if (extractedData.ingredients) {
        extractedData.ingredients = extractedData.ingredients.map(ing => ({
          ...ing,
          category: ing.category || categorizeIngredient(ing.item)
        }));
      }

      return extractedData;
    } catch (error) {
      console.error('Error extracting recipe with Claude:', error);
      return null;
    }
  };

  // Fetch full webpage content for Claude analysis
  const fetchPageContent = async (url) => {
    try {
      // Use a CORS proxy to fetch the page content
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch page content');
      }

      const data = await response.json();
      let content = data.contents;

      // Clean up HTML and extract text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Remove script and style elements
      const scripts = tempDiv.querySelectorAll('script, style, nav, header, footer, .ads, .advertisement');
      scripts.forEach(el => el.remove());
      
      // Get clean text content
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Limit content size for Claude (max ~10000 chars to stay within token limits)
      return textContent.slice(0, 10000);
    } catch (error) {
      console.error('Error fetching page content:', error);
      return null;
    }
  };

  const importFromUrl = async () => {
    if (!importUrl.trim()) return;
    
    setImportLoading(true);
    setMessage('');

    try {
      console.log('Starting recipe import from:', importUrl);
      
      // Step 1: Get basic preview data from LinkPreview
      let basicPreview = null;
      const linkPreviewKey = process.env.REACT_APP_LINKPREVIEW_API_KEY;
      
      if (linkPreviewKey) {
        console.log('Fetching basic preview with LinkPreview...');
        const response = await fetch('https://api.linkpreview.net', {
          method: 'POST',
          headers: {
            'X-Linkpreview-Api-Key': linkPreviewKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ q: importUrl })
        });

        if (response.ok) {
          basicPreview = await response.json();
          console.log('LinkPreview data:', basicPreview);
        } else {
          console.log('LinkPreview failed, proceeding with Claude only');
        }
      }

      // Step 2: Extract detailed recipe data with Claude
      console.log('Extracting detailed recipe data with Claude...');
      setMessage('🧠 Analyzing recipe with AI...');
      
      const extractedData = await extractRecipeWithClaude(importUrl, basicPreview);
      
      if (extractedData) {
        console.log('Claude extracted data:', extractedData);
        
        // Merge basic preview with Claude-extracted data
        const mergedData = {
          name: extractedData.name || basicPreview?.title || '',
          description: extractedData.description || basicPreview?.description || '',
          cuisine_type: extractedData.cuisine_type || 'british',
          cooking_method: extractedData.cooking_method || '',
          prep_time: extractedData.prep_time || '',
          cook_time: extractedData.cook_time || '',
          servings: extractedData.servings || 4,
          difficulty: extractedData.difficulty || 'medium',
          healthy_rating: extractedData.healthy_rating || 3,
          ingredients: extractedData.ingredients?.length > 0 
            ? extractedData.ingredients 
            : [{ item: '', quantity: '', notes: '', category: '' }],
          instructions: extractedData.instructions || '',
          dietary_tags: extractedData.dietary_tags || [],
          source_url: importUrl,
          image_url: basicPreview?.image || '',
          notes: 'Imported with AI assistance'
        };

        setFormData(prev => ({
          ...prev,
          ...mergedData
        }));

        setImportUrl('');
        setShowAddForm(true);
        setMessage('✨ Recipe imported successfully with AI! Please review and adjust as needed.');
      } else {
        // Fallback to basic preview only
        console.log('Using basic preview only');
        const fallbackData = {
          name: basicPreview?.title || '',
          description: basicPreview?.description || '',
          source_url: importUrl,
          image_url: basicPreview?.image || ''
        };

        setFormData(prev => ({
          ...prev,
          ...fallbackData
        }));

        setImportUrl('');
        setShowAddForm(true);
        setMessage('📄 Basic recipe data imported! Please add ingredients and instructions manually.');
      }
    } catch (error) {
      console.error('Error importing recipe:', error);
      setMessage('Error importing recipe. Please try adding manually.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Filter out empty ingredients
      const validIngredients = formData.ingredients.filter(ing => ing.item.trim());
      
      if (validIngredients.length === 0) {
        setMessage('Please add at least one ingredient.');
        setLoading(false);
        return;
      }

      const recipeData = {
        family_id: userProfile.family_id,
        added_by: userProfile.id,
        name: formData.name,
        description: formData.description,
        cuisine_type: formData.cuisine_type,
        cooking_method: formData.cooking_method,
        prep_time: formData.prep_time ? parseInt(formData.prep_time) : null,
        cook_time: formData.cook_time ? parseInt(formData.cook_time) : null,
        servings: parseInt(formData.servings),
        difficulty: formData.difficulty,
        healthy_rating: parseInt(formData.healthy_rating),
        ingredients: validIngredients,
        instructions: formData.instructions,
        dietary_tags: formData.dietary_tags,
        source_url: formData.source_url,
        source_type: formData.source_url ? 'url_import' : 'manual',
        image_url: formData.image_url,
        notes: formData.notes
      };

      let result;
      if (editingRecipe) {
        result = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id)
          .select();
      } else {
        result = await supabase
          .from('recipes')
          .insert([recipeData])
          .select();
      }

      if (result.error) throw result.error;

      setMessage(`Recipe ${editingRecipe ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      setMessage('Error saving recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipe) => {
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      cuisine_type: recipe.cuisine_type,
      cooking_method: recipe.cooking_method || '',
      prep_time: recipe.prep_time || '',
      cook_time: recipe.cook_time || '',
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      healthy_rating: recipe.healthy_rating,
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ item: '', quantity: '', notes: '', category: '' }],
      instructions: recipe.instructions,
      dietary_tags: recipe.dietary_tags || [],
      source_url: recipe.source_url || '',
      image_url: recipe.image_url || '',
      notes: recipe.notes || ''
    });
    setEditingRecipe(recipe);
    setShowAddForm(true);
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setMessage('Recipe deleted successfully!');
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setMessage('Error deleting recipe. Please try again.');
    }
  };

  const toggleFavourite = async (recipe) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ is_favourite: !recipe.is_favourite })
        .eq('id', recipe.id);

      if (error) throw error;
      fetchRecipes();
    } catch (error) {
      console.error('Error updating favourite:', error);
    }
  };

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !filterCuisine || recipe.cuisine_type === filterCuisine;
    const matchesDifficulty = !filterDifficulty || recipe.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCuisine && matchesDifficulty;
  });

  const cuisineOptions = [...new Set(recipes.map(r => r.cuisine_type))].filter(Boolean);
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'];
  const categoryOptions = ['vegetables', 'fruits', 'meat', 'fish', 'dairy', 'grains', 'herbs_spices', 'oils_condiments', 'pantry', 'other'];

  if (loading && recipes.length === 0) {
    return (
      <div className="recipe-manager">
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading your recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-manager">
      <div className="page-header">
        <h1>Recipe Manager</h1>
        <p>Manage your family recipes and discover new ones</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
          <button onClick={() => setMessage('')} className="alert-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="recipe-actions">
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Recipe
        </button>

        <div className="import-section">
          <div className="import-input">
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="Paste recipe URL to import with AI..."
              className="input"
            />
            <button
              onClick={importFromUrl}
              disabled={importLoading || !importUrl.trim()}
              className="btn btn-secondary ai-import"
            >
              {importLoading ? (
                <div className="loading small"></div>
              ) : (
                <>
                  <Brain size={16} />
                  AI Import
                </>
              )}
            </button>
          </div>
          <small className="import-help">
            🧠 Supports BBC Good Food, AllRecipes, Jamie Oliver, Delicious Magazine & more
          </small>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="recipe-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            className="input"
          />
        </div>

        <select
          value={filterCuisine}
          onChange={(e) => setFilterCuisine(e.target.value)}
          className="input filter-select"
        >
          <option value="">All Cuisines</option>
          {cuisineOptions.map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="input filter-select"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="recipe-grid">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              {recipe.image_url && (
                <div className="recipe-image">
                  <img src={recipe.image_url} alt={recipe.name} />
                </div>
              )}
              
              <div className="recipe-content">
                <div className="recipe-header">
                  <h3>{recipe.name}</h3>
                  <div className="recipe-actions-menu">
                    <button
                      onClick={() => toggleFavourite(recipe)}
                      className={`btn-icon ${recipe.is_favourite ? 'favourite' : ''}`}
                    >
                      <Star size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="btn-icon"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="btn-icon delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {recipe.description && (
                  <p className="recipe-description">{recipe.description}</p>
                )}

                <div className="recipe-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="meta-item">
                    <ChefHat size={16} />
                    <span className={`difficulty ${recipe.difficulty}`}>{recipe.difficulty}</span>
                  </div>
                </div>

                <div className="recipe-tags">
                  <span className="cuisine-tag">{recipe.cuisine_type}</span>
                  {recipe.dietary_tags?.map(tag => (
                    <span key={tag} className="dietary-tag">{tag}</span>
                  ))}
                </div>

                <div className="recipe-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < recipe.healthy_rating ? 'filled' : ''}
                    />
                  ))}
                  <span>Health Rating</span>
                </div>

                {recipe.source_url && (
                  <div className="recipe-source">
                    <Globe size={14} />
                    <a href={recipe.source_url} target="_blank" rel="noopener noreferrer">
                      View Original
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ChefHat size={48} />
          <h3>No Recipes Found</h3>
          <p>
            {searchTerm || filterCuisine || filterDifficulty
              ? 'Try adjusting your search filters'
              : 'Start building your recipe collection!'
            }
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Add Your First Recipe
          </button>
        </div>
      )}

      {/* Add/Edit Recipe Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
              <button onClick={resetForm} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="recipe-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Recipe Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="servings">Servings *</label>
                  <input
                    id="servings"
                    name="servings"
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                />
              </div>

              {/* Photo Upload */}
              <div className="form-group">
                <label>Recipe Photo</label>
                <div className="image-upload-section">
                  {formData.image_url ? (
                    <div className="image-preview">
                      <img src={formData.image_url} alt="Recipe preview" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="remove-image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="image-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-input"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="image-upload-label">
                        {imageUploading ? (
                          <div className="loading small"></div>
                        ) : (
                          <>
                            <Camera size={24} />
                            <span>Add Photo</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
                <small>Images are compressed to ~200KB. Supports JPG, PNG (max 5MB)</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cuisine_type">Cuisine</label>
                  <select
                    id="cuisine_type"
                    name="cuisine_type"
                    value={formData.cuisine_type}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="british">British</option>
                    <option value="italian">Italian</option>
                    <option value="asian">Asian</option>
                    <option value="mexican">Mexican</option>
                    <option value="indian">Indian</option>
                    <option value="french">French</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="american">American</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prep_time">Prep Time (minutes)</label>
                  <input
                    id="prep_time"
                    name="prep_time"
                    type="number"
                    min="0"
                    value={formData.prep_time}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cook_time">Cook Time (minutes)</label>
                  <input
                    id="cook_time"
                    name="cook_time"
                    type="number"
                    min="0"
                    value={formData.cook_time}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="healthy_rating">Health Rating (1-5)</label>
                  <select
                    id="healthy_rating"
                    name="healthy_rating"
                    value={formData.healthy_rating}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="1">1 - Treat</option>
                    <option value="2">2 - Moderate</option>
                    <option value="3">3 - Balanced</option>
                    <option value="4">4 - Healthy</option>
                    <option value="5">5 - Very Healthy</option>
                  </select>
                </div>
              </div>

              {/* Enhanced Ingredients Section */}
              <div className="form-group">
                <label>Ingredients *</label>
                <div className="ingredients-section">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-row">
                      <div className="ingredient-item">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={ingredient.item}
                          onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="ingredient-quantity">
                        <input
                          type="text"
                          placeholder="Quantity"
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="ingredient-category">
                        <select
                          value={ingredient.category}
                          onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}
                          className="input"
                        >
                          <option value="">Auto-detect</option>
                          {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>
                              {cat.replace('_', ' & ').replace(/\b\w/g, l => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="ingredient-notes">
                        <input
                          type="text"
                          placeholder="Notes (optional)"
                          value={ingredient.notes}
                          onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                          className="input"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="btn-icon remove-ingredient"
                        disabled={formData.ingredients.length === 1}
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="btn btn-secondary add-ingredient"
                  >
                    <Plus size={16} />
                    Add Ingredient
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Cooking Instructions *</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="input"
                  rows="6"
                  placeholder="1. Heat oil in a large pan...&#10;2. Add onion and cook until soft...&#10;3. Add chicken and cook until browned..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Dietary Tags</label>
                <div className="checkbox-group">
                  {dietaryOptions.map(tag => (
                    <label key={tag} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.dietary_tags.includes(tag)}
                        onChange={() => handleDietaryTagChange(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cooking_method">Cooking Method</label>
                  <input
                    id="cooking_method"
                    name="cooking_method"
                    type="text"
                    value={formData.cooking_method}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Roast, Fry, Slow Cook"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="source_url">Source URL</label>
                  <input
                    id="source_url"
                    name="source_url"
                    type="url"
                    value={formData.source_url}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Personal Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  placeholder="Any modifications, tips, or notes..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? (
                    <div className="loading small"></div>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingRecipe ? 'Update Recipe' : 'Save Recipe'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeManager;