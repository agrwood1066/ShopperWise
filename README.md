# ShopperWise - Complete Smart Meal Planning Solution

A revolutionary meal planning and smart shopping web application built with React and Supabase. Featuring **AI-powered recipe extraction**, **intelligent inventory management**, **two-week meal planning**, and **smart shopping lists** with professional UI design. Transform your meal planning from chaotic to coordinated! 🍳✨

## 🌟 Complete Feature Set

### ✅ Phase 1: Core Database & Auth (COMPLETE)
- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 👥 **Family Accounts** - Share meal planning with family members
- 📊 **Dashboard** - Overview of recipes, inventory, and meal planning stats
- 👤 **Profile Management** - Set dietary preferences and cooking skills

### ✅ Phase 2: AI-Powered Recipe Management (COMPLETE)
- 📝 **Manual Recipe Entry** - Detailed forms with enhanced ingredient tracking
- 🧠 **AI Recipe Import** - Claude-powered extraction from any recipe website
- 🔍 **Search & Filter** - Find recipes by name, cuisine, or difficulty
- ⭐ **Recipe Rating** - 5-star health rating system and favourites
- 🏷️ **Smart Categorisation** - Cuisine types, dietary tags, cooking methods
- ✏️ **Full CRUD** - Edit, delete, and manage all your recipes
- 📱 **Responsive Design** - Beautiful recipe cards and mobile-optimised forms

### ✅ Phase 3: Smart Inventory Management (COMPLETE)
- 🥕 **Flexible Ingredient Tracking** - Open-text ingredient names for maximum usability
- 🚨 **Colour-coded Expiry Alerts** - Red/orange/yellow/green visual indicators
- 📊 **Smart Dashboard Statistics** - Total items, urgent alerts, and total value
- 🧠 **Recipe Integration** - See which recipes you can make with current inventory
- 🔍 **Advanced Filtering** - By location, expiry status, and search
- 🏷️ **Intelligent Auto-Categorisation** - With manual override options
- 💰 **Purchase Tracking** - Cost monitoring and store information
- 📱 **Mobile-Optimised Interface** - Perfect for shopping and kitchen use

### ✅ Phase 3B: Enhanced Two-Week Meal Planner (COMPLETE)
- 📅 **Two-Week Planning View** - Perfect for shopping coordination
- 🍽️ **Three Meals Per Day** - Breakfast, lunch, and dinner slots
- 🎨 **Colour-Coded Meals** - Orange breakfast, green lunch, blue dinner
- 🛒 **Shopping Status Tracking** - Mark ingredients as purchased/unpurchased
- 🧠 **Smart Recipe Suggestions** - Based on current inventory availability
- 📱 **Mobile-Responsive** - Beautiful calendar view on all devices
- 🔄 **Week Navigation** - Easily browse past and future weeks
- 🎯 **Recipe Filtering** - Smart meal-type suggestions (breakfast vs dinner recipes)

### 🚧 Phase 4: Smart Shopping Lists (IN PROGRESS)
- 🛒 **Shopping List Management** - Create, edit, and manage shopping lists
- 🤖 **One-Click Generation** - Auto-create shopping lists from any meal plan
- 🧠 **Smart Consolidation** - Automatically combines duplicate ingredients across recipes
- 🏪 **Store Category Organisation** - Items organised by UK supermarket sections
- 📊 **List Overview** - Visual progress tracking and list management
- 💰 **Budget Tracking** - Price estimation and spending analysis
- 📤 **Export Functionality** - Export lists to text, CSV, or JSON formats
- 👨‍👩‍👧‍👦 **Family Sharing** - Share lists with family members

#### 🔄 Currently Implemented:
- ✅ **List Creation & Management** - Create new shopping lists manually or from meal plans
- ✅ **Smart Item Addition** - Add items with automatic categorisation
- ✅ **Category Organisation** - Items grouped by supermarket sections with emojis
- ✅ **Progress Tracking** - Visual progress bars and completion stats
- ✅ **Export System** - Export lists in multiple formats

#### 🚧 Coming Soon:
- 📱 **Mobile Shopping Mode** - AnyList-inspired interface for in-store use
- ⭐ **Favourites System** - Star frequently used items for quick access
- 🔄 **Recent Items** - Track and quickly re-add recently used items
- ✏️ **Advanced Edit Mode** - Complete item editing with all properties
- 💰 **Live Budget Tracking** - Real-time spending vs budget analysis

## 🛠 Tech Stack

- **Frontend**: React 18 with React Router and custom hooks
- **Database & Auth**: Supabase (PostgreSQL) with Row Level Security
- **AI Integration**: Claude API for intelligent recipe extraction
- **Storage**: Supabase Storage for optimised recipe images
- **Styling**: Custom CSS with modern design system
- **Icons**: Lucide React for consistent iconography
- **Smart Algorithms**: Custom JavaScript for shopping optimisation
- **Export Systems**: Multi-format data export (JSON, CSV, TXT)
- **Recipe Import**: LinkPreview.net API + Claude AI processing
- **Hosting**: Cloudflare Pages with automated deployment
- **Version Control**: GitHub with feature branch workflow

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
2. Run the complete database schema from `/database/complete_schema.sql`
3. **For enhanced meal planner:** Run `/database/phase3_enhanced_meal_planner.sql`
4. Get your project URL and anon key from Settings > API

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

### 4. Set Up Database Schema
Choose the appropriate setup:

**For New Installations:**
1. Run `/database/complete_schema.sql` in Supabase SQL Editor
2. Run `/database/phase3_enhanced_meal_planner.sql` for enhanced meal planning

**For Existing Installations:**
1. Run `/database/phase3_inventory_update.sql` for inventory features
2. Run `/database/phase3_enhanced_meal_planner.sql` for enhanced meal planning

### 5. Add Sample Data (Optional)
To test with sample recipes:
1. Open `/database/sample_recipes.sql` OR `/database/sample_breakfast_lunch_recipes.sql`
2. Replace `YOUR_FAMILY_ID` and `YOUR_USER_ID` with your actual IDs
3. Run the SQL in your Supabase SQL Editor

### 6. Run the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🛒 How to Use Shopping Lists

### Getting Started with Shopping Lists:
1. **Navigate to "Shopping Lists"** from the main menu
2. **Choose your approach:**
   - **Auto-generate** from existing meal plans (recommended)
   - **Create manually** for custom shopping trips

### Auto-Generation Workflow:
```
📅 Plan Meals → 🛒 Generate List → 🏪 Shop Smart → 📊 Track Progress

Step 1: Complete your weekly meal planning
Step 2: Click "Generate from meal plan" 
Step 3: Review and edit generated list
Step 4: Use list for shopping with visual progress
Step 5: Track completion and export if needed
```

### Current Shopping List Features:
1. **Smart List Creation** - Auto-generate from meal plans or create manually
2. **Intelligent Categorisation** - Items automatically sorted by store sections:
   - 🥤 **Beverages**
   - 🍗 **Meat & Fish** 
   - 🥛 **Dairy**
   - 🍞 **Bakery**
   - 🧊 **Frozen**
   - 🍿 **Pantry** (Rice, Pasta, Spices)
   - 🥤 **Beverages**
   - 🧽 **Household**
3. **Visual Progress** - See completion percentage and item counts
4. **Export Options** - Download as text file for external use
5. **Family Sharing** - Lists are shared with family members automatically

### Smart Features:
**🤖 Intelligent Consolidation:**
- Recipe A needs "2 onions"
- Recipe B needs "1 large onion" 
- Recipe C needs "onions for garnish"
- → **Result**: Combined into single "onions" entry with notes

**🏪 UK Supermarket Optimised:**
- Items organised by typical UK supermarket layout
- Categories match Tesco, Sainsbury's, ASDA flow
- Efficient shopping route planning

## 🍽️ Enhanced Two-Week Meal Planner

### Revolutionary Features:
- **🗓️ Two-Week View** - Plan current week + next week for perfect shopping coordination
- **🍳 Three Daily Meals** - Separate slots for breakfast, lunch, and dinner
- **🎨 Visual Meal Types** - Color-coded meals (🥞 orange breakfast, 🥗 green lunch, 🍖 blue dinner)
- **🛒 Shopping Coordination** - Mark ingredients as purchased/unpurchased for each recipe
- **🧠 Inventory Intelligence** - See which recipes you can make with current ingredients
- **📱 Mobile Perfect** - Responsive design works beautifully on phones and tablets

### How It Works:
1. **Plan Week 1** - Use current inventory to plan this week's meals
2. **Plan Week 2** - Plan next week in advance for shopping trips
3. **Shopping Integration** - Click 🛒 button next to recipes to mark ingredients as purchased
4. **Smart Suggestions** - See "Recipes You Can Make" based on your current inventory
5. **Easy Navigation** - Browse weeks forward/backward with simple buttons

## 🧠 AI-Powered Recipe Import

### How It Works:
1. **Paste any recipe URL** from supported websites
2. **Click "AI Import"** - Claude analyzes the webpage
3. **Complete form population** - All recipe data extracted automatically
4. **Review and save** - Make any adjustments and save

### Supported Websites:
- 🇬🇧 **BBC Good Food** - Complete extraction including ingredients and methods
- 🌍 **AllRecipes** - Full recipe data with cooking instructions
- 👨‍🍳 **Jamie Oliver** - Detailed ingredient lists and cooking steps
- 🍽️ **Delicious Magazine** - Complete recipe information
- 🌐 **Any Recipe Website** - Flexible AI extraction from any recipe source

## 📱 Smart Inventory Management

### How It Works:
1. **Add any ingredient** - Type ingredient names freely ("Organic free-range chicken breast")
2. **Smart categorisation** - Auto-detects categories or choose manually  
3. **Set storage location** - Fridge, freezer, or pantry with optional details
4. **Track expiry dates** - Set your own dates for complete control
5. **Monitor costs** - Track spending and store information
6. **Get recipe suggestions** - See what you can cook with current inventory

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🌐 Deployment

The app is configured for Cloudflare Pages deployment:
1. Push to the main branch
2. Cloudflare will automatically build and deploy
3. Set environment variables in Cloudflare Pages dashboard

## 📁 Project Structure & Architecture

```
src/
├── components/
│   ├── Dashboard.js              # Central hub with family stats
│   ├── Login.js                  # Authentication system
│   ├── Navigation.js             # Responsive side navigation
│   ├── Profile.js                # User & family management
│   ├── RecipeManager.js          # AI-enhanced recipe CRUD
│   ├── Inventory.js              # Smart inventory tracking
│   ├── MealPlanner.js            # Two-week meal planning
│   └── ShoppingList.js           # Smart shopping list system
├── utils/
│   ├── ingredientHelpers.js      # Auto-categorisation algorithms
│   └── shoppingHelpers.js        # Shopping optimisation & analytics
├── App.js                        # Main routing and state management
├── supabaseClient.js             # Database connection & config
└── index.js                      # React application bootstrap

database/
├── complete_schema.sql               # Full database schema with RLS
├── phase3_enhanced_meal_planner.sql  # Enhanced meal planning tables
├── sample_recipes.sql               # Sample data for testing
└── setup_storage.sql               # Image storage configuration
```

## 🚨 Troubleshooting

### Enhanced Meal Planner Setup
**⚠️ IMPORTANT: Database Update Required**

To use the enhanced two-week meal planner, you must run the database update:

1. Open your Supabase SQL Editor
2. Copy and paste `/database/phase3_enhanced_meal_planner.sql`
3. Replace `YOUR_FAMILY_ID` and `YOUR_USER_ID` with your actual values
4. Run the SQL to add breakfast/lunch support and shopping status tracking

### Smart Inventory Setup
**⚠️ For Smart Inventory features to work:**

1. Open your Supabase SQL Editor  
2. Copy and paste `/database/phase3_inventory_update.sql`
3. Run the SQL to add open-text ingredient support

### AI Recipe Import Issues
- **Import not working?** Check your Claude API key in `.env`
- **Partial extraction?** Some websites may block automated access - try a different URL
- **Missing ingredients?** The AI will extract what's available - you can manually add more

### Storage Issues
- **Images not displaying?** Check if bucket 'recipe-images' exists and is public
- **Upload failing?** Ensure image is under 5MB and in JPG/PNG format
- **Storage full?** Check Supabase storage usage in dashboard

### General Issues
- **App won't start?** Ensure `.env` has correct Supabase credentials
- **Authentication failing?** Verify Supabase URL and anon key
- **Database errors?** Confirm complete schema was run successfully

## 🔮 Future Enhancements (Phase 5+)

### Shopping List Enhancements:
- **📱 AnyList-Style Mobile Mode** - Professional shopping interface with iOS design
- **⭐ Favourites System** - Star frequently used items for quick access
- **🔄 Recent Items** - Intelligent tracking of recently added items
- **✏️ Advanced Edit Mode** - Complete item editing with all properties
- **💰 Live Budget Tracking** - Real-time spending vs budget analysis
- **🏪 Store Maps** - Visual store layout with optimised shopping routes

### Additional Features:
- **📷 Barcode Scanning** - Quick item addition via camera
- **🔊 Voice Shopping** - "Add milk to shopping list" voice commands
- **🍽️ Recipe Recommendations** - AI-powered meal suggestions based on preferences
- **🥗 Nutritional Analysis** - Complete nutritional breakdown of meal plans
- **📊 Advanced Analytics** - Spending patterns and meal planning insights

---

## 🚀 What's Complete - The ShopperWise Experience

**ShopperWise is a comprehensive meal planning ecosystem with AI-powered features!** 🎆

✅ **🤖 AI Recipe Management** - Import any recipe with Claude AI intelligence  
✅ **🥕 Smart Inventory Tracking** - Track ingredients with intelligent expiry alerts  
✅ **📅 Two-Week Meal Planner** - Plan meals with beautiful visual calendar  
✅ **🛒 Smart Shopping Lists** - Create and manage lists with intelligent features  
✅ **📤 Universal Export** - Share and backup your data in any format  
✅ **🔄 Seamless Integration** - All components work together harmoniously  

### The Complete Workflow:
```
🌍 Import Recipes (AI) → 🥕 Track Inventory → 📅 Plan Meals → 🛒 Generate Shopping → 📊 Analyse

✅ One-click recipe import from any website
✅ Smart ingredient categorisation and inventory tracking  
✅ Visual two-week meal planning with family coordination
✅ Intelligent shopping list creation and management
✅ Export and sharing capabilities across all features
```

### What Makes ShopperWise Special:
- **🤖 AI-First Approach** - Claude integration for intelligent recipe processing
- **👥 Family-Focused** - Built for households with shared meal planning
- **📱 Mobile-Optimised** - Great experience on phones and tablets
- **🇬🇧 UK-Tailored** - Store layouts, currency, and shopping patterns
- **🔄 Fully Integrated** - Every feature works seamlessly with others
- **🔒 Privacy-Focused** - Your data stays with your family using RLS
- **🚀 Production-Ready** - Scalable architecture with modern tech stack

**Ready to revolutionise your meal planning?** 🍳✨

**No more:**
- ❌ Forgetting ingredients at the store
- ❌ Buying duplicates of what you already have
- ❌ Wandering aimlessly through supermarket aisles
- ❌ Wondering "what's for dinner?"
- ❌ Meal planning chaos and food waste

**Instead, enjoy:**
- ✅ AI-generated shopping lists from your meal plans
- ✅ Smart inventory management with expiry alerts
- ✅ Family coordination with shared meal planning
- ✅ Recipe discovery from any website with one click
- ✅ Intelligent categorisation and organisation
- ✅ Beautiful, intuitive user interface

---

*ShopperWise - Complete meal planning solution with AI-powered recipes, smart inventory, intelligent shopping, and family coordination*