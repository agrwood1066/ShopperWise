# ShopperWise - Smart Meal Planning App

A comprehensive meal planning and smart inventory management web application built with React and Supabase. Currently in **Phase 1: Core Database & Auth**.

## 🌟 Current Features (Phase 1)

- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 👥 **Family Accounts** - Share meal planning with family members
- 📊 **Dashboard** - Overview of recipes, inventory, and upcoming features
- 👤 **Profile Management** - Set dietary preferences and cooking skills
- 🎯 **Foundation Ready** - Database schema and UI structure for all planned features

## 🛠 Tech Stack

- **Frontend**: React 18 with React Router
- **Authentication & Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with modern design system
- **Icons**: Lucide React
- **Hosting**: Cloudflare Pages (configured)
- **Version Control**: GitHub

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Supabase account
- GitHub account (already set up)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd ShopperWise
npm install
```

### 2. Set Up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from the specification document
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables
Edit the `.env` file in the root directory with your actual values:

```env
# Supabase Configuration (REQUIRED)
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional for future phases
REACT_APP_LINKPREVIEW_API_KEY=your_linkpreview_api_key
REACT_APP_CLAUDE_API_KEY=your_claude_api_key
```

### 4. Run the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📊 Database Schema Status

✅ **Complete** - All tables and relationships defined
- `profiles` - User accounts with meal planning preferences
- `family_members` - Family account relationships
- `recipes` - Recipe storage and management
- `current_inventory` - Inventory tracking with expiry dates
- `weekly_meal_plans` - Meal planning calendar
- `shopping_lists` - Shopping list management
- `ingredients_master` - Standardised ingredient database

## 🎯 Development Phases

### ✅ Phase 1: Core Database & Auth (Current)
- [x] Supabase database schema
- [x] User authentication
- [x] Family account system
- [x] Basic navigation and dashboard
- [x] Profile management

### 📅 Phase 2: Recipe Management (Coming Next)
- [ ] Manual recipe entry
- [ ] URL-based recipe import
- [ ] Recipe browsing and search
- [ ] Recipe categorisation and rating

### 📅 Phase 3: Inventory & AI Planning
- [ ] Inventory tracking with expiry alerts
- [ ] Claude AI meal suggestions
- [ ] Weekly planning questionnaire
- [ ] Smart meal recommendations

### 📅 Phase 4: Shopping Lists
- [ ] Auto-generated shopping lists
- [ ] Budget tracking and price monitoring
- [ ] Store categorisation
- [ ] Export functionality

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
│   ├── Dashboard.js          # Main dashboard (functional)
│   ├── Login.js              # Authentication (functional)
│   ├── Navigation.js         # Side navigation (functional)
│   ├── Profile.js            # Profile management (functional)
│   ├── RecipeManager.js      # Placeholder for Phase 2
│   ├── Inventory.js          # Placeholder for Phase 3
│   ├── MealPlanner.js        # Placeholder for Phase 3
│   └── ShoppingList.js       # Placeholder for Phase 4
├── App.js                    # Main app with routing
├── supabaseClient.js         # Supabase configuration
└── index.js                  # React bootstrap
```

## 🔒 Security Features

- Row Level Security (RLS) policies implemented
- Family data isolation using `family_id`
- Secure environment variable handling
- Authentication state management

## 🎨 Design System

- **Colour Palette**: Purple primary (#7c3aed), soft grays
- **Typography**: System fonts for optimal performance
- **Responsive**: Mobile-first design approach
- **Icons**: Lucide React for consistency

## 🚨 Troubleshooting

### App won't start?
1. Check your `.env` file has correct Supabase credentials
2. Ensure you've run `npm install`
3. Verify Node.js version is 20+

### Authentication not working?
1. Verify Supabase URL and anon key are correct
2. Check if you've run the database schema
3. Ensure RLS policies are enabled

### Database errors?
1. Confirm you've run the complete schema.sql file
2. Check if all tables were created successfully
3. Verify RLS policies are in place

## 📞 Support

This is a private project. For issues:
1. Check the troubleshooting section above
2. Review Supabase documentation for auth/database issues
3. Ensure all environment variables are correctly set

## 🔮 Coming Soon

Keep an eye out for Phase 2 updates, which will include:
- Full recipe management functionality
- URL-based recipe imports
- Recipe search and categorisation
- Family recipe sharing

---

**Note**: This is Phase 1 of the ShopperWise app. Many features are currently placeholders and will be implemented in future phases according to the development roadmap.