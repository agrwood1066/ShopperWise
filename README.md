# ShopperWise - Smart Meal Planning App

A comprehensive meal planning and smart inventory management web application built with React and Supabase. Now featuring **AI-powered recipe extraction** with Claude integration for intelligent recipe imports from any website.

## 🌟 Current Features

### ✅ Phase 1: Core Database & Auth
- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 👥 **Family Accounts** - Share meal planning with family members
- 📊 **Dashboard** - Overview of recipes, inventory, and upcoming features
- 👤 **Profile Management** - Set dietary preferences and cooking skills

### ✅ Phase 2: AI-Powered Recipe Management (COMPLETE!)
- 📝 **Manual Recipe Entry** - Detailed forms with enhanced ingredient tracking
- 🧠 **AI Recipe Import** - Claude-powered extraction from any recipe website
- 🔍 **Search & Filter** - Find recipes by name, cuisine, or difficulty
- ⭐ **Recipe Rating** - 5-star health rating system and favourites
- 🏷️ **Smart Categorisation** - Cuisine types, dietary tags, cooking methods
- ✏️ **Full CRUD** - Edit, delete, and manage all your recipes
- 📱 **Responsive Design** - Beautiful recipe cards and mobile-optimised forms

#### 🆕 **Latest AI Enhancement:**
- **🤖 Claude-Powered Import** - Extracts complete recipe data from any website
- **🌐 Universal Support** - Works with BBC Good Food, AllRecipes, Jamie Oliver & more
- **📋 Complete Extraction** - Gets ingredients, instructions, times, and metadata
- **🥕 Individual Ingredients** - Item, Quantity, Notes with auto-categorisation
- **📸 Recipe Photos** - Upload and store recipe images (optimised for storage)
- **🔧 Intelligent Processing** - Auto-categorises ingredients and converts cooking times

## 🛠 Tech Stack

- **Frontend**: React 18 with React Router
- **Authentication & Database**: Supabase (PostgreSQL)
- **AI Integration**: Claude API for recipe extraction
- **Storage**: Supabase Storage (for recipe images)
- **Styling**: Custom CSS with modern design system
- **Icons**: Lucide React
- **Recipe Import**: LinkPreview.net API + Claude AI
- **Hosting**: Cloudflare Pages (configured)
- **Version Control**: GitHub

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Supabase account
- Claude API key (for AI recipe import)
- LinkPreview.net API key (optional, enhances import)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd ShopperWise
npm install
```

### 2. Set Up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the complete database schema from `/database/complete_schema.sql` OR the safe update from `/database/phase2_update.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables
Edit the `.env` file in the root directory with your actual values:

```env
# Supabase Configuration (REQUIRED)
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude API for AI recipe import (RECOMMENDED)
REACT_APP_CLAUDE_API_KEY=your_claude_api_key

# LinkPreview API for enhanced imports (OPTIONAL)
REACT_APP_LINKPREVIEW_API_KEY=your_linkpreview_api_key
```

### 4. Set Up Storage & Database
Choose one option:

**Option A: New Installation**
- Run `/database/complete_schema.sql` in Supabase SQL Editor

**Option B: Existing Installation**
- Run `/database/phase2_update.sql` for safe upgrade without affecting existing data

### 5. Add Sample Data (Optional)
To test the Recipe Manager with sample data:
1. Open `/database/sample_recipes.sql`
2. Replace `YOUR_FAMILY_ID` and `YOUR_USER_ID` with your actual IDs
3. Run the SQL in your Supabase SQL Editor

### 6. Run the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🧠 AI-Powered Recipe Import

### **How It Works:**
1. **Paste any recipe URL** from supported websites
2. **Click "AI Import"** - Claude analyzes the webpage
3. **Complete form population** - All recipe data extracted automatically
4. **Review and save** - Make any adjustments and save

### **Supported Websites:**
- 🇬🇧 **BBC Good Food** - Complete extraction including ingredients and methods
- 🌍 **AllRecipes** - Full recipe data with cooking instructions
- 👨‍🍳 **Jamie Oliver** - Detailed ingredient lists and cooking steps
- 🍽️ **Delicious Magazine** - Complete recipe information
- 🌐 **Any Recipe Website** - Flexible AI extraction from any recipe source

### **What Gets Extracted:**
- ✅ **Recipe Name & Description**
- ✅ **Complete Ingredients List** (individual items with quantities and notes)
- ✅ **Step-by-Step Instructions** (numbered cooking steps)
- ✅ **Cooking Times** (prep and cook time in minutes)
- ✅ **Servings & Difficulty** (auto-detected from content)
- ✅ **Cuisine Type** (British, Italian, Asian, etc.)
- ✅ **Dietary Tags** (Vegetarian, Gluten-Free, etc.)
- ✅ **Health Rating** (1-5 based on nutritional content)
- ✅ **Recipe Photo** (from the source website)
- ✅ **Auto-Categorised Ingredients** (Vegetables, Meat, Dairy, etc.)

### **Example URLs to Test:**
```
https://www.bbcgoodfood.com/recipes/classic-spaghetti-bolognese
https://www.jamieoliver.com/recipes/chicken-recipes/perfect-roast-chicken/
https://www.allrecipes.com/recipe/231506/simple-macaroni-and-cheese/
```

## 📸 Recipe Photos & Storage

### **Storage Details:**
- **Free Tier**: 1GB Supabase storage
- **Compression**: Images auto-compressed to ~200KB
- **Capacity**: ~5,000 recipe photos per 1GB
- **Formats**: JPG, PNG, WebP (max 5MB upload)
- **Cost**: Only £0.021/GB/month if you exceed free tier

### **Upload Features:**
- Drag & drop or click to upload
- Automatic image compression
- Preview before saving
- Easy removal/replacement
- Mobile camera support

## 🥕 Enhanced Ingredients System

### **Individual Ingredient Tracking:**
- **Item Name** - What ingredient you're adding
- **Quantity** - How much needed (flexible: "2 tbsp", "1 large", "500g")
- **Notes** - Additional details ("diced", "fresh", "optional")
- **Auto-Category** - Smart detection of ingredient types

### **Smart Categorisation:**
Ingredients are automatically categorised into:
- 🥬 **Vegetables** - Onions, carrots, broccoli, etc.
- 🍎 **Fruits** - Apples, lemons, berries, etc.
- 🥩 **Meat** - Chicken, beef, pork, etc.
- 🐟 **Fish** - Salmon, cod, prawns, etc.
- 🥛 **Dairy** - Milk, cheese, butter, etc.
- 🌾 **Grains** - Rice, pasta, bread, etc.
- 🌿 **Herbs & Spices** - Basil, salt, pepper, etc.
- 🫒 **Oils & Condiments** - Olive oil, soy sauce, etc.
- 🥫 **Pantry** - Tinned goods, dried items, etc.

Categories can be manually corrected if auto-detection needs adjustment.

## 📊 Database Schema

✅ **Complete** - All tables and relationships defined
- `profiles` - User accounts with meal planning preferences
- `family_members` - Family account relationships
- `recipes` - Recipe storage with enhanced ingredient structure (**AI-Enhanced**)
- `current_inventory` - Inventory tracking with expiry dates
- `weekly_meal_plans` - Meal planning calendar
- `shopping_lists` - Shopping list management
- `ingredients_master` - Standardised ingredient database
- **Storage**: `recipe-images` bucket for photo uploads

## 🎯 Development Phases

### ✅ Phase 1: Core Database & Auth (Complete)
- [x] Supabase database schema
- [x] User authentication
- [x] Family account system
- [x] Basic navigation and dashboard
- [x] Profile management

### ✅ Phase 2: AI-Enhanced Recipe Management (Complete!)
- [x] Manual recipe entry with enhanced ingredient forms
- [x] **Claude AI-powered recipe extraction from any website**
- [x] **Universal recipe import (BBC Good Food, AllRecipes, etc.)**
- [x] Recipe search and filtering (name, cuisine, difficulty)
- [x] Recipe categorisation (cuisine, dietary tags, cooking methods)
- [x] Full CRUD operations (create, read, update, delete)
- [x] Recipe favourites and 5-star health rating system
- [x] Individual ingredient tracking with auto-categorisation
- [x] Recipe photo uploads with image compression
- [x] Responsive design with beautiful recipe cards
- [x] Dashboard integration showing recipe stats
- [x] Mobile-optimised forms and camera support

### 📅 Phase 3: Inventory & AI Planning (Coming Next)
- [ ] Inventory tracking with expiry alerts
- [ ] Claude AI meal suggestions based on available ingredients
- [ ] Weekly planning questionnaire
- [ ] Smart meal recommendations using recipe database
- [ ] Integration between inventory and recipe ingredients

### 📅 Phase 4: Shopping Lists & Budget
- [ ] Auto-generated shopping lists from meal plans
- [ ] Integration with recipe ingredients for smart lists
- [ ] Budget tracking and price monitoring
- [ ] Store categorisation using ingredient categories
- [ ] Export functionality

## 🎨 Recipe Manager Features

### **AI-Enhanced Recipe Import**
- **Universal Website Support**: Works with any recipe website
- **Complete Data Extraction**: Gets all recipe information automatically
- **Smart Processing**: Auto-categorises ingredients and converts times
- **Fallback Support**: Works even if AI is unavailable

### **Enhanced Recipe Forms**
- **Smart Ingredient Entry**: Add items individually with quantity and notes
- **Auto-Categorisation**: Ingredients automatically sorted into categories
- **Photo Upload**: Add recipe photos with automatic compression
- **Flexible Data**: Support for any quantity format and cooking style

### **Beautiful Recipe Display**
- **Recipe Cards**: Clean, modern design with photos
- **Ingredient Grouping**: Visual organisation by category
- **Quick Actions**: Edit, delete, favourite with one click
- **Source Tracking**: Links back to original recipe websites

### **Mobile Experience**
- **Touch-Friendly**: Optimised for mobile recipe browsing
- **Camera Integration**: Take photos directly from mobile
- **Responsive Forms**: All inputs work perfectly on mobile
- **Ingredient Management**: Easy to add/remove ingredients on small screens

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🌐 Deployment

The app is configured for Cloudflare Pages deployment:
1. Push to the main branch
2. Cloudflare will automatically build and deploy
3. Set environment variables in Cloudflare Pages dashboard

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Dashboard with recipe stats (functional)
│   ├── Login.js              # Authentication (functional)
│   ├── Navigation.js         # Side navigation (functional)
│   ├── Profile.js            # Profile management (functional)
│   ├── RecipeManager.js      # AI-enhanced recipe CRUD (functional)
│   ├── Inventory.js          # Placeholder for Phase 3
│   ├── MealPlanner.js        # Placeholder for Phase 3
│   └── ShoppingList.js       # Placeholder for Phase 4
├── App.js                    # Main app with routing
├── supabaseClient.js         # Supabase configuration
└── index.js                  # React bootstrap

database/
├── complete_schema.sql       # Complete database schema with storage
├── phase2_update.sql         # Safe update for existing installations
├── sample_recipes.sql        # Sample data for testing
└── setup_storage.sql        # Storage bucket setup (included in complete_schema)
```

## 🔒 Security Features

- Row Level Security (RLS) policies implemented
- Family data isolation using `family_id`
- Secure image storage with access controls
- Secure environment variable handling
- Authentication state management

## 🎨 Design System

- **Colour Palette**: Purple primary (#7c3aed), soft grays
- **Typography**: System fonts for optimal performance
- **Responsive**: Mobile-first design approach
- **Icons**: Lucide React for consistency
- **Images**: Auto-compressed for optimal storage usage
- **AI Elements**: Gradient styling for AI-powered features

## 🚨 Troubleshooting

### AI Recipe Import Issues
- **Import not working?** Check your Claude API key in `.env`
- **Partial extraction?** Some websites may block automated access - try a different URL
- **Missing ingredients?** The AI will extract what's available - you can manually add more

### Recipe Manager Issues
- **Can't upload photos?** Check if storage bucket exists and RLS policies are set
- **Auto-categorisation not working?** Check ingredient spelling and try manual category
- **Recipes not saving?** Verify at least one ingredient is added

### Storage Issues
- **Images not displaying?** Check if bucket 'recipe-images' exists and is public
- **Upload failing?** Ensure image is under 5MB and in JPG/PNG format
- **Storage full?** Check Supabase storage usage in dashboard

### General Issues
- **App won't start?** Ensure `.env` has correct Supabase credentials
- **Authentication failing?** Verify Supabase URL and anon key
- **Database errors?** Confirm complete schema was run successfully

## 💾 Storage Management

### **Optimisation Features:**
- Images compressed to ~200KB automatically
- Original quality preserved with smart compression
- WebP format support for modern browsers
- Automatic cleanup of unused images

### **Usage Monitoring:**
- Free tier: 1GB storage
- Current compression: ~5,000 photos per GB
- Monitor usage in Supabase dashboard
- Upgrade available from £0.021/GB/month

## 🎉 What's New in Latest Update

### **Revolutionary AI Import:**
1. **Universal Recipe Extraction** - Import from any recipe website with AI
2. **Complete Data Population** - Ingredients, instructions, times, everything
3. **Smart Processing** - Auto-categorisation and intelligent parsing
4. **Website Support** - BBC Good Food, AllRecipes, Jamie Oliver & more

### **Enhanced User Experience:**
1. **AI Import Button** - Gradient-styled button with brain icon
2. **Progress Feedback** - Clear status messages during import
3. **Graceful Fallbacks** - Works even without API keys
4. **Mobile Optimisation** - Perfect mobile import experience

### **Technical Improvements:**
1. **Claude API Integration** - Full AI-powered recipe analysis
2. **CORS Proxy Support** - Fetch content from any website
3. **Intelligent Parsing** - Extract structured data from unstructured content
4. **Error Handling** - Robust fallbacks and error recovery

## 🔮 Coming Soon (Phase 3)

The next phase will integrate your recipe collection with smart inventory management:
- Link recipe ingredients to inventory tracking
- AI-powered meal suggestions based on expiring ingredients  
- Smart shopping list generation from your recipe database
- Weekly meal planning with personalised recommendations

---

## 🧠 **How to Use AI Import**

1. **Find a recipe online** (BBC Good Food, AllRecipes, etc.)
2. **Copy the URL** from your browser
3. **Paste into the AI Import field** in ShopperWise
4. **Click "AI Import"** and watch the magic happen
5. **Review the extracted data** and make any adjustments
6. **Save your recipe** with complete ingredient lists and instructions

**Example workflow:**
```
1. Visit: https://www.bbcgoodfood.com/recipes/classic-spaghetti-bolognese
2. Copy URL
3. Paste in ShopperWise AI Import
4. Click "AI Import" 
5. Watch as ingredients, instructions, and details populate automatically
6. Save and enjoy your perfectly imported recipe!
```

---

**Ready to revolutionise your recipe collection?** Try the AI import with your favourite recipe websites! 🍳🤖

---

*ShopperWise Recipe Manager - Now with revolutionary AI-powered recipe extraction from any website*