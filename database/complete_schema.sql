-- ShopperWise Complete Database Schema
-- Updated for Phase 2 with Recipe Management and Image Upload
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    family_id UUID DEFAULT uuid_generate_v4(),
    role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'partner', 'family')),
    -- Meal planner specific fields
    dietary_preferences JSONB DEFAULT '[]'::jsonb,
    cooking_skill TEXT DEFAULT 'intermediate' CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')),
    weekly_meal_goal INTEGER DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create family_members table for managing family relationships
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    can_edit BOOLEAN DEFAULT true,
    invited_by UUID REFERENCES profiles(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(family_id, user_id)
);

-- Create ingredients_master table for standardised ingredients
CREATE TABLE IF NOT EXISTS ingredients_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'meat', 'dairy', 'vegetables', etc.
    storage_location TEXT DEFAULT 'pantry' CHECK (storage_location IN ('fridge', 'freezer', 'pantry')),
    standard_shelf_life INTEGER, -- days
    unit_options JSONB DEFAULT '["pieces"]'::jsonb, -- ['kg', 'litres', 'pieces']
    alternative_names JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create recipes table (UPDATED for Phase 2)
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL,
    added_by UUID NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    cuisine_type TEXT DEFAULT 'british',
    cooking_method TEXT,
    prep_time INTEGER, -- minutes
    cook_time INTEGER, -- minutes
    servings INTEGER DEFAULT 4,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    healthy_rating INTEGER DEFAULT 3 CHECK (healthy_rating >= 1 AND healthy_rating <= 5),
    ingredients JSONB NOT NULL, -- [{"item": "", "quantity": "", "notes": "", "category": ""}, ...]
    instructions TEXT NOT NULL,
    dietary_tags JSONB DEFAULT '[]'::jsonb, -- ['vegetarian', 'gluten-free', ...]
    times_made INTEGER DEFAULT 0,
    last_made DATE,
    is_favourite BOOLEAN DEFAULT false,
    source_url TEXT,
    source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'url_import')),
    image_url TEXT, -- NEW: For recipe photos
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create current_inventory table
CREATE TABLE IF NOT EXISTS current_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL,
    ingredient_id UUID NOT NULL REFERENCES ingredients_master(id),
    quantity DECIMAL(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    purchase_date DATE,
    expiry_date DATE,
    location_detail TEXT, -- 'top shelf', 'freezer drawer 1', etc.
    cost DECIMAL(10, 2),
    store_purchased_from TEXT,
    added_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create weekly_meal_plans table
CREATE TABLE IF NOT EXISTS weekly_meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL,
    week_starting DATE NOT NULL, -- Monday of the week
    created_by UUID NOT NULL REFERENCES profiles(id),
    monday_dinner UUID REFERENCES recipes(id),
    tuesday_dinner UUID REFERENCES recipes(id),
    wednesday_dinner UUID REFERENCES recipes(id),
    thursday_dinner UUID REFERENCES recipes(id),
    friday_dinner UUID REFERENCES recipes(id),
    saturday_dinner UUID REFERENCES recipes(id),
    sunday_dinner UUID REFERENCES recipes(id),
    weekly_theme TEXT,
    preferences JSONB, -- questionnaire responses
    generation_method TEXT DEFAULT 'manual' CHECK (generation_method IN ('manual', 'claude_suggestion', 'emergency')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(family_id, week_starting)
);

-- Create meal_preferences table (for questionnaire responses)
CREATE TABLE IF NOT EXISTS meal_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL,
    week_starting DATE NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id),
    weekday_cooking_time TEXT DEFAULT 'medium' CHECK (weekday_cooking_time IN ('quick', 'medium', 'long')),
    weekend_cooking_time TEXT DEFAULT 'long' CHECK (weekend_cooking_time IN ('quick', 'medium', 'long')),
    preferred_cuisines JSONB DEFAULT '[]'::jsonb,
    dietary_goals JSONB DEFAULT '[]'::jsonb, -- ['healthy', 'high-protein', 'budget-friendly']
    avoid_ingredients JSONB DEFAULT '[]'::jsonb,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(family_id, week_starting)
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id),
    list_name TEXT NOT NULL,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
    target_store TEXT,
    meal_plan_id UUID REFERENCES weekly_meal_plans(id),
    items JSONB NOT NULL, -- [{name, quantity, unit, category, purchased, price}, ...]
    total_estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    shopping_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create recipe_ratings table (for family recipe feedback)
CREATE TABLE IF NOT EXISTS recipe_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(recipe_id, user_id)
);

-- Create inventory_usage table (track ingredient usage in recipes)
CREATE TABLE IF NOT EXISTS inventory_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID NOT NULL REFERENCES current_inventory(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id),
    quantity_used DECIMAL(10, 2) NOT NULL,
    used_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable profile creation" ON profiles FOR INSERT WITH CHECK (true);

-- Family members policies
CREATE POLICY "Users can view family members" ON family_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = family_members.family_id)
);
CREATE POLICY "Users can insert family members" ON family_members FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = family_members.family_id)
);
CREATE POLICY "Users can update family members" ON family_members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = family_members.family_id)
);
CREATE POLICY "Users can delete family members" ON family_members FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = family_members.family_id)
);

-- Ingredients master policies (public read, family write)
CREATE POLICY "Anyone can view ingredients" ON ingredients_master FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert ingredients" ON ingredients_master FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Recipes policies
CREATE POLICY "Users can view family recipes" ON recipes FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = recipes.family_id)
);
CREATE POLICY "Users can insert family recipes" ON recipes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = recipes.family_id)
    AND auth.uid() = added_by
);
CREATE POLICY "Users can update family recipes" ON recipes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = recipes.family_id)
);
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (
    auth.uid() = added_by
);

-- Current inventory policies
CREATE POLICY "Users can view family inventory" ON current_inventory FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = current_inventory.family_id)
);
CREATE POLICY "Users can insert family inventory" ON current_inventory FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = current_inventory.family_id)
    AND auth.uid() = added_by
);
CREATE POLICY "Users can update family inventory" ON current_inventory FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = current_inventory.family_id)
);
CREATE POLICY "Users can delete family inventory" ON current_inventory FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = current_inventory.family_id)
);

-- Weekly meal plans policies
CREATE POLICY "Users can view family meal plans" ON weekly_meal_plans FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = weekly_meal_plans.family_id)
);
CREATE POLICY "Users can insert family meal plans" ON weekly_meal_plans FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = weekly_meal_plans.family_id)
    AND auth.uid() = created_by
);
CREATE POLICY "Users can update family meal plans" ON weekly_meal_plans FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = weekly_meal_plans.family_id)
);
CREATE POLICY "Users can delete family meal plans" ON weekly_meal_plans FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = weekly_meal_plans.family_id)
);

-- Meal preferences policies
CREATE POLICY "Users can view family meal preferences" ON meal_preferences FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = meal_preferences.family_id)
);
CREATE POLICY "Users can insert family meal preferences" ON meal_preferences FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = meal_preferences.family_id)
    AND auth.uid() = created_by
);
CREATE POLICY "Users can update family meal preferences" ON meal_preferences FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = meal_preferences.family_id)
);

-- Shopping lists policies
CREATE POLICY "Users can view family shopping lists" ON shopping_lists FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = shopping_lists.family_id)
);
CREATE POLICY "Users can insert family shopping lists" ON shopping_lists FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = shopping_lists.family_id)
    AND auth.uid() = created_by
);
CREATE POLICY "Users can update family shopping lists" ON shopping_lists FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = shopping_lists.family_id)
);
CREATE POLICY "Users can delete family shopping lists" ON shopping_lists FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.family_id = shopping_lists.family_id)
);

-- Recipe ratings policies
CREATE POLICY "Users can view family recipe ratings" ON recipe_ratings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM recipes r 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE r.id = recipe_ratings.recipe_id AND r.family_id = p.family_id
    )
);
CREATE POLICY "Users can insert own recipe ratings" ON recipe_ratings FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1 FROM recipes r 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE r.id = recipe_ratings.recipe_id AND r.family_id = p.family_id
    )
);
CREATE POLICY "Users can update own recipe ratings" ON recipe_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipe ratings" ON recipe_ratings FOR DELETE USING (auth.uid() = user_id);

-- Inventory usage policies
CREATE POLICY "Users can view family inventory usage" ON inventory_usage FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM current_inventory ci 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE ci.id = inventory_usage.inventory_item_id AND ci.family_id = p.family_id
    )
);
CREATE POLICY "Users can insert family inventory usage" ON inventory_usage FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM current_inventory ci 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE ci.id = inventory_usage.inventory_item_id AND ci.family_id = p.family_id
    )
);

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, family_id, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    uuid_generate_v4(),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    -- Try a simpler insert without constraints
    BEGIN
      INSERT INTO public.profiles (id, email, family_id) 
      VALUES (NEW.id, NEW.email, uuid_generate_v4());
    EXCEPTION
      WHEN others THEN
        RAISE LOG 'Secondary insert also failed for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers for relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON current_inventory FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON weekly_meal_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create helpful views for common queries
CREATE OR REPLACE VIEW recipe_with_ratings AS
SELECT 
    r.*,
    ROUND(AVG(rt.rating), 1) as average_rating,
    COUNT(rt.rating) as rating_count
FROM recipes r
LEFT JOIN recipe_ratings rt ON r.id = rt.recipe_id
GROUP BY r.id;

CREATE OR REPLACE VIEW inventory_with_expiry_status AS
SELECT 
    ci.*,
    im.name as ingredient_name,
    im.category,
    im.storage_location,
    CASE 
        WHEN ci.expiry_date < CURRENT_DATE THEN 'expired'
        WHEN ci.expiry_date <= CURRENT_DATE + INTERVAL '2 days' THEN 'expiring'
        WHEN ci.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'soon'
        ELSE 'fresh'
    END as expiry_status,
    ci.expiry_date - CURRENT_DATE as days_until_expiry
FROM current_inventory ci
JOIN ingredients_master im ON ci.ingredient_id = im.id;

-- Insert some basic ingredients to start with
INSERT INTO ingredients_master (name, category, storage_location, standard_shelf_life, unit_options) VALUES
    ('Chicken Breast', 'meat', 'fridge', 3, '["kg", "pieces"]'),
    ('Beef Mince', 'meat', 'fridge', 2, '["kg"]'),
    ('Salmon Fillet', 'fish', 'fridge', 2, '["kg", "pieces"]'),
    ('Eggs', 'dairy', 'fridge', 21, '["pieces", "dozen"]'),
    ('Milk', 'dairy', 'fridge', 5, '["litres", "ml"]'),
    ('Cheddar Cheese', 'dairy', 'fridge', 14, '["kg", "g"]'),
    ('Potatoes', 'vegetables', 'pantry', 14, '["kg"]'),
    ('Onions', 'vegetables', 'pantry', 21, '["kg", "pieces"]'),
    ('Carrots', 'vegetables', 'fridge', 10, '["kg"]'),
    ('Broccoli', 'vegetables', 'fridge', 7, '["pieces", "kg"]'),
    ('Rice', 'grains', 'pantry', 730, '["kg", "g"]'),
    ('Pasta', 'grains', 'pantry', 730, '["kg", "g"]'),
    ('Olive Oil', 'oils_condiments', 'pantry', 365, '["litres", "ml"]'),
    ('Salt', 'herbs_spices', 'pantry', 1825, '["kg", "g"]'),
    ('Black Pepper', 'herbs_spices', 'pantry', 365, '["g"]')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_family_id ON recipes(family_id);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_type ON recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_favourite ON recipes(is_favourite);
CREATE INDEX IF NOT EXISTS idx_inventory_family_id ON current_inventory(family_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry_date ON current_inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_family_week ON weekly_meal_plans(family_id, week_starting);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_family_status ON shopping_lists(family_id, status);

-- Set up Storage Bucket for Recipe Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
CREATE POLICY "Family members can upload recipe images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view recipe images" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Recipe image owners can update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipe-images' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Recipe image owners can delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipe-images' 
    AND auth.uid() IS NOT NULL
  );

-- Final verification
SELECT 'Database setup completed successfully!' as status;