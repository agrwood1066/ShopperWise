-- Phase 3 Enhancement: Multi-meal support and shopping integration
-- Run this in your Supabase SQL Editor to update the meal planner

-- Add new columns to weekly_meal_plans table for breakfast and lunch
ALTER TABLE weekly_meal_plans 
ADD COLUMN IF NOT EXISTS monday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS monday_lunch UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS tuesday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS tuesday_lunch UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS wednesday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS wednesday_lunch UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS thursday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS thursday_lunch UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS friday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS friday_lunch UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS saturday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS saturday_lunch UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS sunday_breakfast UUID REFERENCES recipes(id),
ADD COLUMN IF NOT EXISTS sunday_lunch UUID REFERENCES recipes(id);

-- Add shopping status tracking
ALTER TABLE weekly_meal_plans 
ADD COLUMN IF NOT EXISTS shopping_status JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create a new table for meal shopping status tracking
CREATE TABLE IF NOT EXISTS meal_shopping_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_plan_id UUID NOT NULL REFERENCES weekly_meal_plans(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    ingredients_purchased BOOLEAN DEFAULT false,
    purchased_date DATE,
    purchased_manually BOOLEAN DEFAULT true,
    shopping_list_id UUID REFERENCES shopping_lists(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(meal_plan_id, recipe_id, meal_type, day_of_week)
);

-- Enable RLS for the new table
ALTER TABLE meal_shopping_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meal_shopping_status
CREATE POLICY "Users can view family meal shopping status" ON meal_shopping_status FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM weekly_meal_plans wmp 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE wmp.id = meal_shopping_status.meal_plan_id AND wmp.family_id = p.family_id
    )
);

CREATE POLICY "Users can insert family meal shopping status" ON meal_shopping_status FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM weekly_meal_plans wmp 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE wmp.id = meal_shopping_status.meal_plan_id AND wmp.family_id = p.family_id
    )
);

CREATE POLICY "Users can update family meal shopping status" ON meal_shopping_status FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM weekly_meal_plans wmp 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE wmp.id = meal_shopping_status.meal_plan_id AND wmp.family_id = p.family_id
    )
);

CREATE POLICY "Users can delete family meal shopping status" ON meal_shopping_status FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM weekly_meal_plans wmp 
        JOIN profiles p ON p.id = auth.uid() 
        WHERE wmp.id = meal_shopping_status.meal_plan_id AND wmp.family_id = p.family_id
    )
);

-- Create updated_at trigger
CREATE TRIGGER update_meal_shopping_status_updated_at 
    BEFORE UPDATE ON meal_shopping_status 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meal_shopping_status_meal_plan ON meal_shopping_status(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_shopping_status_recipe ON meal_shopping_status(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_shopping_status_day_meal ON meal_shopping_status(day_of_week, meal_type);

-- Add some sample breakfast and lunch recipes to test with
INSERT INTO recipes (
  family_id, 
  added_by, 
  name, 
  description, 
  cuisine_type, 
  cooking_method, 
  prep_time, 
  cook_time, 
  servings, 
  difficulty, 
  healthy_rating, 
  ingredients, 
  instructions, 
  dietary_tags, 
  is_favourite,
  source_type
) VALUES 
-- Add sample breakfast recipes (replace YOUR_FAMILY_ID and YOUR_USER_ID)
(
  'YOUR_FAMILY_ID',
  'YOUR_USER_ID',
  'Scrambled Eggs on Toast',
  'Quick and easy breakfast with buttery scrambled eggs.',
  'british',
  'fry',
  2,
  5,
  2,
  'easy',
  4,
  '[
    {"name": "eggs", "quantity": "4", "unit": "pieces"},
    {"name": "butter", "quantity": "20", "unit": "g"},
    {"name": "milk", "quantity": "2", "unit": "tbsp"},
    {"name": "bread", "quantity": "4", "unit": "slices"},
    {"name": "salt", "quantity": "1", "unit": "pinch"},
    {"name": "black pepper", "quantity": "1", "unit": "pinch"}
  ]'::jsonb,
  '1. Toast the bread slices.\n2. Beat eggs with milk, salt, and pepper.\n3. Melt butter in a non-stick pan over low heat.\n4. Add eggs and stir gently until just set.\n5. Serve immediately on toast.',
  '["vegetarian"]'::jsonb,
  false,
  'manual'
),
(
  'YOUR_FAMILY_ID',
  'YOUR_USER_ID',
  'Greek Yogurt with Berries',
  'Healthy breakfast with protein and fresh fruit.',
  'mediterranean',
  'no-cook',
  3,
  0,
  1,
  'easy',
  5,
  '[
    {"name": "greek yogurt", "quantity": "200", "unit": "g"},
    {"name": "mixed berries", "quantity": "100", "unit": "g"},
    {"name": "honey", "quantity": "1", "unit": "tbsp"},
    {"name": "granola", "quantity": "30", "unit": "g"}
  ]'::jsonb,
  '1. Place Greek yogurt in a bowl.\n2. Top with mixed berries and granola.\n3. Drizzle with honey and serve.',
  '["vegetarian", "gluten-free"]'::jsonb,
  true,
  'manual'
),
-- Sample lunch recipes
(
  'YOUR_FAMILY_ID',
  'YOUR_USER_ID',
  'Ham and Cheese Sandwich',
  'Classic lunch sandwich with fresh ingredients.',
  'british',
  'no-cook',
  5,
  0,
  1,
  'easy',
  3,
  '[
    {"name": "bread", "quantity": "2", "unit": "slices"},
    {"name": "ham", "quantity": "80", "unit": "g"},
    {"name": "cheese", "quantity": "30", "unit": "g"},
    {"name": "butter", "quantity": "10", "unit": "g"},
    {"name": "lettuce", "quantity": "2", "unit": "leaves"},
    {"name": "tomato", "quantity": "2", "unit": "slices"}
  ]'::jsonb,
  '1. Butter the bread slices.\n2. Layer ham, cheese, lettuce, and tomato.\n3. Close sandwich and cut diagonally if desired.',
  '[]'::jsonb,
  false,
  'manual'
),
(
  'YOUR_FAMILY_ID',
  'YOUR_USER_ID',
  'Caesar Salad',
  'Fresh and crispy salad with homemade dressing.',
  'mediterranean',
  'no-cook',
  10,
  0,
  2,
  'easy',
  4,
  '[
    {"name": "romaine lettuce", "quantity": "1", "unit": "head"},
    {"name": "parmesan cheese", "quantity": "50", "unit": "g"},
    {"name": "croutons", "quantity": "50", "unit": "g"},
    {"name": "caesar dressing", "quantity": "3", "unit": "tbsp"},
    {"name": "lemon", "quantity": "0.5", "unit": "pieces"}
  ]'::jsonb,
  '1. Wash and chop romaine lettuce.\n2. Toss with Caesar dressing.\n3. Top with croutons and grated Parmesan.\n4. Serve with lemon wedges.',
  '["vegetarian"]'::jsonb,
  true,
  'manual'
);

-- Update existing weekly_meal_plans view or create a comprehensive one
-- This helps with querying all meals for a week

-- Create a helpful view for meal planning with all meals
DROP VIEW IF EXISTS weekly_meal_plans_detailed;
CREATE OR REPLACE VIEW weekly_meal_plans_detailed AS
SELECT 
    wmp.*,
    -- Monday meals
    mb.name as monday_breakfast_name, mb.prep_time + mb.cook_time as monday_breakfast_time,
    ml.name as monday_lunch_name, ml.prep_time + ml.cook_time as monday_lunch_time,
    md.name as monday_dinner_name, md.prep_time + md.cook_time as monday_dinner_time,
    -- Tuesday meals
    tb.name as tuesday_breakfast_name, tb.prep_time + tb.cook_time as tuesday_breakfast_time,
    tl.name as tuesday_lunch_name, tl.prep_time + tl.cook_time as tuesday_lunch_time,
    td.name as tuesday_dinner_name, td.prep_time + td.cook_time as tuesday_dinner_time,
    -- Wednesday meals
    wb.name as wednesday_breakfast_name, wb.prep_time + wb.cook_time as wednesday_breakfast_time,
    wl.name as wednesday_lunch_name, wl.prep_time + wl.cook_time as wednesday_lunch_time,
    wd.name as wednesday_dinner_name, wd.prep_time + wd.cook_time as wednesday_dinner_time,
    -- Thursday meals
    thb.name as thursday_breakfast_name, thb.prep_time + thb.cook_time as thursday_breakfast_time,
    thl.name as thursday_lunch_name, thl.prep_time + thl.cook_time as thursday_lunch_time,
    thd.name as thursday_dinner_name, thd.prep_time + thd.cook_time as thursday_dinner_time,
    -- Friday meals
    fb.name as friday_breakfast_name, fb.prep_time + fb.cook_time as friday_breakfast_time,
    fl.name as friday_lunch_name, fl.prep_time + fl.cook_time as friday_lunch_time,
    fd.name as friday_dinner_name, fd.prep_time + fd.cook_time as friday_dinner_time,
    -- Saturday meals
    sb.name as saturday_breakfast_name, sb.prep_time + sb.cook_time as saturday_breakfast_time,
    sl.name as saturday_lunch_name, sl.prep_time + sl.cook_time as saturday_lunch_time,
    sd.name as saturday_dinner_name, sd.prep_time + sd.cook_time as saturday_dinner_time,
    -- Sunday meals
    sub.name as sunday_breakfast_name, sub.prep_time + sub.cook_time as sunday_breakfast_time,
    sul.name as sunday_lunch_name, sul.prep_time + sul.cook_time as sunday_lunch_time,
    sud.name as sunday_dinner_name, sud.prep_time + sud.cook_time as sunday_dinner_time
FROM weekly_meal_plans wmp
-- Monday
LEFT JOIN recipes mb ON wmp.monday_breakfast = mb.id
LEFT JOIN recipes ml ON wmp.monday_lunch = ml.id  
LEFT JOIN recipes md ON wmp.monday_dinner = md.id
-- Tuesday
LEFT JOIN recipes tb ON wmp.tuesday_breakfast = tb.id
LEFT JOIN recipes tl ON wmp.tuesday_lunch = tl.id
LEFT JOIN recipes td ON wmp.tuesday_dinner = td.id
-- Wednesday  
LEFT JOIN recipes wb ON wmp.wednesday_breakfast = wb.id
LEFT JOIN recipes wl ON wmp.wednesday_lunch = wl.id
LEFT JOIN recipes wd ON wmp.wednesday_dinner = wd.id
-- Thursday
LEFT JOIN recipes thb ON wmp.thursday_breakfast = thb.id
LEFT JOIN recipes thl ON wmp.thursday_lunch = thl.id
LEFT JOIN recipes thd ON wmp.thursday_dinner = thd.id
-- Friday
LEFT JOIN recipes fb ON wmp.friday_breakfast = fb.id
LEFT JOIN recipes fl ON wmp.friday_lunch = fl.id
LEFT JOIN recipes fd ON wmp.friday_dinner = fd.id
-- Saturday
LEFT JOIN recipes sb ON wmp.saturday_breakfast = sb.id
LEFT JOIN recipes sl ON wmp.saturday_lunch = sl.id
LEFT JOIN recipes sd ON wmp.saturday_dinner = sd.id
-- Sunday
LEFT JOIN recipes sub ON wmp.sunday_breakfast = sub.id
LEFT JOIN recipes sul ON wmp.sunday_lunch = sul.id
LEFT JOIN recipes sud ON wmp.sunday_dinner = sud.id;

-- Final verification
SELECT 'Enhanced meal planner schema updated successfully!' as status;