# ShopperWise - Smart Meal Planning App

A comprehensive meal planning and smart inventory management web application built with React and Supabase. Now featuring **enhanced Recipe Management** with individual ingredient tracking, auto-categorisation, and photo uploads.

## 🌟 Current Features

### ✅ Phase 1: Core Database & Auth
- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 👥 **Family Accounts** - Share meal planning with family members
- 📊 **Dashboard** - Overview of recipes, inventory, and upcoming features
- 👤 **Profile Management** - Set dietary preferences and cooking skills

### ✅ Phase 2: Enhanced Recipe Management (UPDATED!)
- 📝 **Add Recipes** - Manual recipe entry with detailed forms
- 🔗 **URL Import** - Import recipes from websites using LinkPreview API
- 🔍 **Search & Filter** - Find recipes by name, cuisine, or difficulty
- ⭐ **Recipe Rating** - 5-star health rating system and favourites
- 🏷️ **Categorisation** - Cuisine types, dietary tags, cooking methods
- ✏️ **Full CRUD** - Edit, delete, and manage all your recipes
- 📱 **Responsive Design** - Beautiful recipe cards and mobile-optimised forms

#### 🆕 **New in Latest Update:**
- **🥕 Individual Ingredients** - Track Item, Quantity, Notes with auto-categorisation
- **📸 Recipe Photos** - Upload and store recipe images (optimised for storage)
- **🤖 Smart Categorisation** - Auto-detect ingredient categories (Vegetables, Meat, Dairy, etc.)
- **✂️ Simplified Form** - Removed unused fields for cleaner UX
- **🔧 Enhanced UI** - Better mobile experience and ingredient management

## 🛠 Tech Stack

- **Frontend**: React 18 with React Router
- **Authentication & Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for recipe images)
- **Styling**: Custom CSS with modern design system
- **Icons**: Lucide React
- **Recipe Import**: LinkPreview.net API
- **Hosting**: Cloudflare Pages (configured)
- **Version Control**: GitHub

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Supabase account
- LinkPreview.net API key (optional, for URL imports)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd ShopperWise
npm install
```

### 2. Set Up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the complete database schema from `/database/complete_schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables
Edit the `.env` file in the root directory with your actual values:

```env
# Supabase Configuration (REQUIRED)
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# LinkPreview API for URL imports (OPTIONAL)
REACT_APP_LINKPREVIEW_API_KEY=your_linkpreview_api_key

# Claude API for future AI features (OPTIONAL)
REACT_APP_CLAUDE_API_KEY=your_claude_api_key
```

### 4. Set Up Storage Bucket
The complete schema includes storage setup, but if you need to run it separately:
```sql
-- Run this in Supabase SQL Editor if storage isn't working
-- (Already included in complete_schema.sql)
```

### 5. Add Sample Data (Optional)
To test the Recipe Manager with sample data:
1. Open `/database/sample_recipes.sql`
2. Replace `YOUR_FAMILY_ID` and `YOUR_USER_ID` with your actual IDs from the profiles table
3. Run the SQL in your Supabase SQL Editor

### 6. Run the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

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
- **Quantity** - How much needed (flexible text: "2 tbsp", "1 large", "500g")
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

Categories can be manually corrected if auto-detection is wrong.

## 📊 Database Schema

✅ **Complete** - All tables and relationships defined
- `profiles` - User accounts with meal planning preferences
- `family_members` - Family account relationships
- `recipes` - Recipe storage with enhanced ingredient structure (**Updated**)
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

### ✅ Phase 2: Enhanced Recipe Management (Complete!)
- [x] Manual recipe entry with enhanced ingredient forms
- [x] URL-based recipe import using LinkPreview API
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
│   ├── RecipeManager.js      # Enhanced recipe CRUD (functional)
│   ├── Inventory.js          # Placeholder for Phase 3
│   ├── MealPlanner.js        # Placeholder for Phase 3
│   └── ShoppingList.js       # Placeholder for Phase 4
├── App.js                    # Main app with routing
├── supabaseClient.js         # Supabase configuration
└── index.js                  # React bootstrap

database/
├── complete_schema.sql       # Complete database schema with storage
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

## 🚨 Troubleshooting

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

## 🎉 What's New in This Update

### **Major Improvements:**
1. **Individual Ingredient Tracking** - Much more detailed and AnyList-like
2. **Smart Auto-Categorisation** - Ingredients sorted automatically
3. **Recipe Photo Uploads** - Store and display recipe images
4. **Simplified Forms** - Removed unused fields, cleaner UX
5. **Enhanced Mobile Experience** - Better touch interactions and camera support
6. **Storage Integration** - Complete image storage with compression

### **Technical Enhancements:**
1. **Supabase Storage Setup** - Complete image storage solution
2. **Image Compression** - Automatic optimisation for storage efficiency
3. **Enhanced Database Schema** - Support for new ingredient structure
4. **Mobile Optimisation** - Better responsive design
5. **Performance Improvements** - Faster loading and smoother interactions

## 🔮 Coming Soon (Phase 3)

The next phase will integrate your recipe collection with smart inventory management:
- Link recipe ingredients to inventory tracking
- AI-powered meal suggestions based on expiring ingredients  
- Smart shopping list generation from your recipe database
- Weekly meal planning with personalised recommendations

---

**Ready to cook?** Add your recipes with detailed ingredients and photos! 🍳👨‍🍳

---

*ShopperWise Recipe Manager - Now with AnyList-inspired ingredient tracking and photo storage*