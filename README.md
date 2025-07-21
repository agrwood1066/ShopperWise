# ShopperWise - Smart Meal Planning App

A comprehensive meal planning and smart inventory management web application built with React and Supabase. Now featuring **AI-powered recipe extraction** with Claude integration and an **advanced two-week meal planner** with shopping coordination.

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

### ✅ Phase 3: Smart Inventory Management (COMPLETE!)
- 🥕 **Flexible Ingredient Tracking** - Open-text ingredient names for maximum usability
- 🚨 **Colour-coded Expiry Alerts** - Red/orange/yellow/green visual indicators
- 📊 **Smart Dashboard Statistics** - Total items, urgent alerts, and total value
- 🧠 **Recipe Integration** - See which recipes you can make with current inventory
- 🔍 **Advanced Filtering** - By location, expiry status, and search
- 🏷️ **Intelligent Auto-Categorisation** - With manual override options
- 💰 **Purchase Tracking** - Cost monitoring and store information
- 📱 **Mobile-Optimised Interface** - Perfect for shopping and kitchen use

### ✅ **NEW: Phase 3B: Enhanced Two-Week Meal Planner (COMPLETE!)**
- 📅 **Two-Week Planning View** - Perfect for shopping coordination
- 🍽️ **Three Meals Per Day** - Breakfast, lunch, and dinner slots
- 🎨 **Colour-Coded Meals** - Orange breakfast, green lunch, blue dinner
- 🛒 **Shopping Status Tracking** - Mark ingredients as purchased/unpurchased
- 🧠 **Smart Recipe Suggestions** - Based on current inventory availability
- 📱 **Mobile-Responsive** - Beautiful calendar view on all devices
- 🔄 **Week Navigation** - Easily browse past and future weeks
- 🎯 **Recipe Filtering** - Smart meal-type suggestions (breakfast vs dinner recipes)

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

## 🍽️ Enhanced Two-Week Meal Planner

### **Revolutionary Features:**
- **🗓️ Two-Week View** - Plan current week + next week for perfect shopping coordination
- **🍳 Three Daily Meals** - Separate slots for breakfast, lunch, and dinner
- **🎨 Visual Meal Types** - Color-coded meals (🥞 orange breakfast, 🥗 green lunch, 🍖 blue dinner)
- **🛒 Shopping Coordination** - Mark ingredients as purchased/unpurchased for each recipe
- **🧠 Inventory Intelligence** - See which recipes you can make with current ingredients
- **📱 Mobile Perfect** - Responsive design works beautifully on phones and tablets

### **How It Works:**
1. **Plan Week 1** - Use current inventory to plan this week's meals
2. **Plan Week 2** - Plan next week in advance for shopping trips
3. **Shopping Integration** - Click 🛒 button next to recipes to mark ingredients as purchased
4. **Smart Suggestions** - See "Recipes You Can Make" based on your current inventory
5. **Easy Navigation** - Browse weeks forward/backward with simple buttons

### **Meal Planning Workflow:**
```
1. Open Two-Week Meal Planner
2. Click "+" on any meal slot (breakfast/lunch/dinner)
3. Filter recipes by meal type if desired
4. Select from available recipes (green border = can make now!)
5. Plan Week 1 with current ingredients
6. Plan Week 2 for your next shopping trip
7. Use 🛒 buttons to track shopping progress
8. Navigate weeks to plan ahead
```

### **Smart Features:**
- **Recipe Availability** - Green highlighting shows recipes you can make now
- **Meal Type Filtering** - Smart suggestions (eggs/toast for breakfast, salads for lunch)
- **Shopping Status** - Visual indicators when ingredients are purchased
- **Week Navigation** - Easy browsing of past and future meal plans
- **Mobile Optimised** - Perfect for planning on-the-go

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

## 📱 Smart Inventory Management

### **How It Works:**
1. **Add any ingredient** - Type ingredient names freely ("Organic free-range chicken breast")
2. **Smart categorisation** - Auto-detects categories or choose manually  
3. **Set storage location** - Fridge, freezer, or pantry with optional details
4. **Track expiry dates** - Set your own dates for complete control
5. **Monitor costs** - Track spending and store information
6. **Get recipe suggestions** - See what you can cook with current inventory

### **Key Features:**
- ✅ **Flexible ingredient entry** - No predefined lists, type anything
- ✅ **Intelligent categorisation** - Auto-sorts into vegetables, meat, dairy, etc.
- ✅ **Visual expiry alerts** - Red/orange/yellow/green colour coding
- ✅ **Recipe integration** - "Chicken breast" matches recipes calling for "chicken"
- ✅ **Advanced search** - Filter by name, location, expiry status
- ✅ **Cost tracking** - Monitor spending and favourite stores
- ✅ **Mobile optimised** - Perfect for shopping or kitchen use

### **Integration with Meal Planner:**
- **Real-time availability** - Meal planner shows which recipes you can make
- **Smart suggestions** - Recipes highlighted when ingredients are available
- **Shopping coordination** - Track which ingredients need purchasing
- **Expiry awareness** - Use ingredients before they expire

## 📊 Database Schema

✅ **Complete** - All tables and relationships defined
- `profiles` - User accounts with meal planning preferences
- `family_members` - Family account relationships
- `recipes` - Recipe storage with enhanced ingredient structure (**AI-Enhanced**)
- `current_inventory` - Inventory tracking with expiry dates (**Enhanced with open-text ingredients**)
- `weekly_meal_plans` - Meal planning calendar (**Enhanced with breakfast/lunch/dinner**)
- `meal_shopping_status` - Shopping status tracking for meal plans (**NEW**)
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

### ✅ Phase 3: Smart Inventory Management (Complete!)
- [x] **Flexible ingredient tracking** with open-text ingredient names for maximum usability
- [x] **Colour-coded expiry alerts** (red=expired, orange=expiring, yellow=soon, green=fresh)
- [x] **Smart dashboard statistics** showing total items, urgent alerts, and total value
- [x] **Recipe integration** - see which recipes you can make with current inventory
- [x] **Full CRUD operations** - add, edit, delete inventory items with rich metadata
- [x] **Advanced filtering** by location (fridge/freezer/pantry), expiry status, and search
- [x] **Intelligent auto-categorisation** with manual override options
- [x] **Purchase tracking** with cost monitoring and store information
- [x] **Mobile-optimised interface** with responsive design
- [x] **Fuzzy recipe matching** - works with any ingredient names ("chicken breast" matches "chicken")
- [x] **User-controlled expiry dates** - set your own dates for complete flexibility
- [x] **Multiple storage locations** with detailed location notes

### ✅ **NEW: Phase 3B: Enhanced Two-Week Meal Planner (Complete!)**
- [x] **Two-week calendar view** - Plan current and next week simultaneously
- [x] **Three meals per day** - Breakfast, lunch, and dinner slots with colour coding
- [x] **Shopping status tracking** - Mark recipe ingredients as purchased/unpurchased
- [x] **Smart recipe suggestions** - Integration with inventory to show available recipes
- [x] **Advanced recipe filtering** - By meal type, difficulty, cuisine, and availability
- [x] **Week navigation** - Browse past and future weeks easily
- [x] **Mobile-responsive design** - Perfect planning experience on all devices
- [x] **Visual meal indicators** - 🥞 Breakfast (orange), 🥗 Lunch (green), 🍖 Dinner (blue)
- [x] **Database integration** - Full CRUD operations with enhanced meal plan storage
- [x] **Recipe availability intelligence** - Real-time matching with current inventory

### 📅 Phase 4: Shopping Lists & Budget (Coming Next)
- [ ] Auto-generated shopping lists from meal plans
- [ ] Integration with recipe ingredients for smart lists
- [ ] Budget tracking and price monitoring
- [ ] Store categorisation using ingredient categories
- [ ] Export functionality
- [ ] Automatic shopping status updates when recipes are added to shopping lists

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
│   ├── Inventory.js          # Smart inventory management (functional)
│   ├── MealPlanner.js        # Enhanced two-week meal planner (functional)
│   └── ShoppingList.js       # Placeholder for Phase 4
├── utils/
│   └── ingredientHelpers.js  # Smart ingredient categorisation
├── App.js                    # Main app with routing
├── supabaseClient.js         # Supabase configuration
└── index.js                  # React bootstrap

database/
├── complete_schema.sql               # Complete database schema with storage
├── phase2_update.sql                # Safe update for Phase 2 features
├── phase3_inventory_update.sql      # Inventory management update
├── phase3_enhanced_meal_planner.sql # Enhanced meal planner schema
├── sample_recipes.sql               # Sample dinner recipes
├── sample_breakfast_lunch_recipes.sql # Sample breakfast & lunch recipes
└── setup_storage.sql               # Storage bucket setup
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
- **Meal Planning**: Color-coded meals (orange/green/blue)

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

### **🍽️ Revolutionary Two-Week Meal Planner:**
1. **Two-Week View** - Plan current and next week for perfect shopping coordination
2. **Three Daily Meals** - Breakfast, lunch, and dinner with color-coded visual design
3. **Shopping Integration** - Track ingredient purchase status for each planned recipe
4. **Smart Suggestions** - Real-time recipe availability based on current inventory
5. **Mobile Perfect** - Beautiful responsive design for planning on any device

### **🧠 Enhanced Intelligence:**
1. **Inventory Integration** - See which recipes you can make with current ingredients
2. **Meal Type Filtering** - Smart categorisation (breakfast vs dinner recipes)
3. **Availability Highlighting** - Green borders show immediately cookable recipes
4. **Shopping Coordination** - Visual tracking of ingredient purchase status

### **📱 User Experience:**
1. **Visual Meal Types** - 🥞 Orange breakfast, 🥗 green lunch, 🍖 blue dinner
2. **Touch-Friendly** - Perfect mobile experience for meal planning
3. **Easy Navigation** - Simple week browsing with clear date displays
4. **Status Tracking** - 🛒 → ✅ buttons for shopping progress

### **🔧 Technical Excellence:**
1. **Database Enhanced** - New meal plan structure supporting all meal types
2. **Shopping Status Table** - Dedicated tracking for ingredient purchase status
3. **Smart Queries** - Efficient loading of two weeks of meal data
4. **Error Handling** - Robust fallbacks and user feedback

## 🔮 Coming Soon (Phase 4)

The next phase will complete the shopping experience:
- **Auto-generated shopping lists** from your meal plans
- **Smart list organisation** by store sections using ingredient categories
- **Budget tracking** with price monitoring and spending insights
- **Automatic status sync** - shopping list completion updates meal plan status
- **Store integration** - favourite stores and optimised shopping routes

---

## 🍽️ **How to Use the Enhanced Meal Planner**

### **Getting Started:**
1. **Navigate to "Two-Week Meal Planner"** from the main menu
2. **See both weeks** - Current week and next week displayed side by side
3. **Click "+" on any meal slot** to add breakfast, lunch, or dinner
4. **Use filters** to find recipes by meal type, difficulty, or cuisine
5. **Look for green borders** - these recipes you can make with current inventory!

### **Planning Workflow:**
```
Week 1 (Current): Plan with existing inventory
📅 Monday: 🥞 Greek Yogurt, 🥗 Caesar Salad, 🍖 Spaghetti Bolognese
📅 Tuesday: 🥞 Scrambled Eggs, 🥗 Ham Sandwich, 🍖 Chicken Stir Fry
📅 Wednesday: 🥞 Avocado Toast, 🥗 Tomato Soup, 🍖 Salmon & Veg

Week 2 (Next): Plan for shopping trip
📅 Monday: 🥞 Porridge, 🥗 Chicken Wrap, 🍖 Beef Curry
...and so on
```

### **Shopping Integration:**
1. **Plan your meals** for two weeks
2. **Click 🛒 next to each recipe** to mark ingredients as "need to buy"
3. **Go shopping** and use the list
4. **Click ✅ when purchased** - recipes turn green to show ingredients are ready
5. **Navigate weeks** to see your planned meals and shopping progress

### **Smart Features:**
- **Green highlighting** = Can make this recipe now with current inventory
- **Meal type icons** = 🥞 Breakfast, 🥗 Lunch, 🍖 Dinner for easy identification
- **Week navigation** = Browse future weeks to plan ahead
- **Mobile optimised** = Perfect for planning while shopping or cooking

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

**Ready to revolutionise your meal planning?** Try the enhanced two-week planner with shopping coordination! 🍳📅🛒

---

*ShopperWise - Complete meal planning solution with AI-powered recipes, smart inventory, and coordinated shopping*