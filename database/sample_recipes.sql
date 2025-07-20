-- Sample Recipe Data for Testing ShopperWise Recipe Manager
-- Run this in your Supabase SQL Editor to add sample recipes
-- Replace 'YOUR_FAMILY_ID' with your actual family_id from the profiles table
-- Replace 'YOUR_USER_ID' with your actual user_id

-- First, check your family_id and user_id:
-- SELECT id, family_id FROM profiles WHERE email = 'your_email@example.com';

-- Sample Recipes (Replace the family_id and added_by values with your actual IDs)

INSERT INTO recipes (
  family_id, 
  added_by, 
  name, 
  description, 
  cuisine_type, 
  main_protein, 
  cooking_method, 
  prep_time, 
  cook_time, 
  servings, 
  difficulty, 
  healthy_rating, 
  ingredients, 
  instructions, 
  dietary_tags, 
  cost_estimate, 
  is_favourite,
  source_type,
  created_at
) VALUES 

-- Classic Spaghetti Bolognese
(
  'YOUR_FAMILY_ID',  -- Replace with your family_id
  'YOUR_USER_ID',    -- Replace with your user_id
  'Classic Spaghetti Bolognese',
  'A traditional Italian meat sauce with rich tomato flavour, perfect for family dinners.',
  'italian',
  'beef',
  'simmer',
  15,
  45,
  4,
  'medium',
  3,
  '[
    {"name": "spaghetti", "quantity": "400", "unit": "g"},
    {"name": "beef mince", "quantity": "500", "unit": "g"},
    {"name": "onion", "quantity": "1", "unit": "large"},
    {"name": "carrots", "quantity": "2", "unit": "medium"},
    {"name": "celery", "quantity": "2", "unit": "stalks"},
    {"name": "garlic", "quantity": "3", "unit": "cloves"},
    {"name": "tinned tomatoes", "quantity": "400", "unit": "g"},
    {"name": "tomato purée", "quantity": "2", "unit": "tbsp"},
    {"name": "red wine", "quantity": "150", "unit": "ml"},
    {"name": "beef stock", "quantity": "200", "unit": "ml"},
    {"name": "olive oil", "quantity": "2", "unit": "tbsp"},
    {"name": "parmesan cheese", "quantity": "50", "unit": "g"}
  ]'::jsonb,
  '1. Heat olive oil in a large pan and brown the mince, breaking it up with a wooden spoon.
2. Add diced onion, carrots, and celery. Cook for 5 minutes until softened.
3. Add minced garlic and cook for 1 minute.
4. Stir in tomato purée and cook for 2 minutes.
5. Add red wine and let it bubble and reduce.
6. Add tinned tomatoes and stock, season well.
7. Simmer gently for 30-40 minutes, stirring occasionally.
8. Cook spaghetti according to package instructions.
9. Serve with grated parmesan cheese.',
  '[]'::jsonb,
  8.50,
  true,
  'manual',
  NOW()
),

-- Quick Chicken Stir Fry
(
  'YOUR_FAMILY_ID',  -- Replace with your family_id
  'YOUR_USER_ID',    -- Replace with your user_id
  'Quick Chicken Stir Fry',
  'A healthy and quick weeknight dinner ready in 20 minutes.',
  'asian',
  'chicken',
  'stir-fry',
  10,
  10,
  4,
  'easy',
  5,
  '[
    {"name": "chicken breast", "quantity": "500", "unit": "g"},
    {"name": "broccoli", "quantity": "200", "unit": "g"},
    {"name": "bell peppers", "quantity": "2", "unit": ""},
    {"name": "snap peas", "quantity": "150", "unit": "g"},
    {"name": "spring onions", "quantity": "4", "unit": ""},
    {"name": "garlic", "quantity": "2", "unit": "cloves"},
    {"name": "fresh ginger", "quantity": "1", "unit": "inch"},
    {"name": "soy sauce", "quantity": "3", "unit": "tbsp"},
    {"name": "sesame oil", "quantity": "1", "unit": "tbsp"},
    {"name": "vegetable oil", "quantity": "2", "unit": "tbsp"},
    {"name": "rice", "quantity": "300", "unit": "g"}
  ]'::jsonb,
  '1. Cook rice according to package instructions.
2. Cut chicken into bite-sized pieces and season.
3. Heat vegetable oil in a wok or large frying pan.
4. Add chicken and stir-fry for 5-6 minutes until cooked through.
5. Add garlic and ginger, stir-fry for 30 seconds.
6. Add all vegetables and stir-fry for 3-4 minutes until tender-crisp.
7. Add soy sauce and sesame oil, toss everything together.
8. Serve immediately over rice.',
  '["gluten-free"]'::jsonb,
  7.00,
  true,
  'manual',
  NOW()
),

-- Vegetarian Lentil Curry
(
  'YOUR_FAMILY_ID',  -- Replace with your family_id
  'YOUR_USER_ID',    -- Replace with your user_id
  'Hearty Lentil Curry',
  'A warming and nutritious vegetarian curry packed with protein and flavour.',
  'indian',
  'vegetarian',
  'simmer',
  15,
  30,
  6,
  'easy',
  5,
  '[
    {"name": "red lentils", "quantity": "250", "unit": "g"},
    {"name": "onion", "quantity": "1", "unit": "large"},
    {"name": "garlic", "quantity": "3", "unit": "cloves"},
    {"name": "fresh ginger", "quantity": "1", "unit": "inch"},
    {"name": "tinned tomatoes", "quantity": "400", "unit": "g"},
    {"name": "coconut milk", "quantity": "400", "unit": "ml"},
    {"name": "vegetable stock", "quantity": "300", "unit": "ml"},
    {"name": "curry powder", "quantity": "2", "unit": "tbsp"},
    {"name": "turmeric", "quantity": "1", "unit": "tsp"},
    {"name": "cumin", "quantity": "1", "unit": "tsp"},
    {"name": "spinach", "quantity": "200", "unit": "g"},
    {"name": "coconut oil", "quantity": "2", "unit": "tbsp"},
    {"name": "basmati rice", "quantity": "300", "unit": "g"}
  ]'::jsonb,
  '1. Rinse lentils and cook rice according to package instructions.
2. Heat coconut oil in a large pan and sauté diced onion until soft.
3. Add minced garlic and ginger, cook for 1 minute.
4. Add curry powder, turmeric, and cumin. Cook for 30 seconds.
5. Add tinned tomatoes and cook for 5 minutes.
6. Add lentils, coconut milk, and stock. Bring to boil.
7. Simmer for 20-25 minutes until lentils are tender.
8. Stir in spinach and cook until wilted.
9. Season with salt and pepper, serve over rice.',
  '["vegetarian", "vegan", "gluten-free"]'::jsonb,
  5.50,
  false,
  'manual',
  NOW()
),

-- Easy Salmon with Roasted Vegetables
(
  'YOUR_FAMILY_ID',  -- Replace with your family_id
  'YOUR_USER_ID',    -- Replace with your user_id
  'Baked Salmon with Roasted Vegetables',
  'A healthy one-tray dinner that''s perfect for busy weeknights.',
  'british',
  'fish',
  'roast',
  10,
  25,
  4,
  'easy',
  5,
  '[
    {"name": "salmon fillets", "quantity": "4", "unit": ""},
    {"name": "new potatoes", "quantity": "500", "unit": "g"},
    {"name": "courgettes", "quantity": "2", "unit": ""},
    {"name": "cherry tomatoes", "quantity": "200", "unit": "g"},
    {"name": "red onion", "quantity": "1", "unit": ""},
    {"name": "olive oil", "quantity": "3", "unit": "tbsp"},
    {"name": "lemon", "quantity": "1", "unit": ""},
    {"name": "fresh dill", "quantity": "2", "unit": "tbsp"},
    {"name": "garlic", "quantity": "2", "unit": "cloves"}
  ]'::jsonb,
  '1. Preheat oven to 200°C/180°C fan.
2. Halve new potatoes and toss with 2 tbsp olive oil, salt, and pepper.
3. Roast potatoes for 15 minutes.
4. Meanwhile, slice courgettes and red onion.
5. Add courgettes, onion, and cherry tomatoes to the tray.
6. Roast for another 10 minutes.
7. Place salmon fillets on the tray, drizzle with remaining oil and lemon juice.
8. Season salmon and scatter with dill and minced garlic.
9. Roast for 12-15 minutes until salmon flakes easily.
10. Serve with lemon wedges.',
  '["gluten-free", "dairy-free"]'::jsonb,
  12.00,
  true,
  'manual',
  NOW()
),

-- Classic Chicken Roast Dinner
(
  'YOUR_FAMILY_ID',  -- Replace with your family_id
  'YOUR_USER_ID',    -- Replace with your user_id
  'Sunday Roast Chicken',
  'A traditional British Sunday roast with all the trimmings.',
  'british',
  'chicken',
  'roast',
  20,
  90,
  6,
  'medium',
  4,
  '[
    {"name": "whole chicken", "quantity": "1.5", "unit": "kg"},
    {"name": "roasting potatoes", "quantity": "1", "unit": "kg"},
    {"name": "carrots", "quantity": "500", "unit": "g"},
    {"name": "parsnips", "quantity": "400", "unit": "g"},
    {"name": "onion", "quantity": "1", "unit": "large"},
    {"name": "butter", "quantity": "50", "unit": "g"},
    {"name": "olive oil", "quantity": "3", "unit": "tbsp"},
    {"name": "fresh thyme", "quantity": "4", "unit": "sprigs"},
    {"name": "lemon", "quantity": "1", "unit": ""},
    {"name": "plain flour", "quantity": "2", "unit": "tbsp"},
    {"name": "chicken stock", "quantity": "500", "unit": "ml"}
  ]'::jsonb,
  '1. Preheat oven to 220°C/200°C fan.
2. Rub chicken with butter, season well, and stuff with lemon and thyme.
3. Place in roasting tin and roast for 20 minutes.
4. Reduce to 190°C/170°C fan and continue for 50-60 minutes.
5. Meanwhile, peel and chop potatoes, carrots, and parsnips.
6. Boil potatoes for 5 minutes, then drain and shake to roughen edges.
7. Heat oil in roasting tin and add potatoes, season well.
8. Roast vegetables for 45 minutes until golden.
9. Rest chicken for 10 minutes before carving.
10. Make gravy with pan juices, flour, and stock.',
  '[]'::jsonb,
  15.00,
  false,
  'manual',
  NOW()
);

-- After inserting, you can verify with:
-- SELECT name, cuisine_type, difficulty, healthy_rating FROM recipes ORDER BY created_at DESC;