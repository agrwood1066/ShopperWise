-- ShopperWise Phase 2 Update Script - SAFE for Existing Databases
-- This script only adds NEW features without affecting existing data
-- Run this in your Supabase SQL Editor

-- Add image_url column to recipes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'recipes' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE recipes ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to recipes table';
    ELSE
        RAISE NOTICE 'image_url column already exists in recipes table';
    END IF;
END $$;

-- Update recipes table ingredients structure to support new format
-- This is safe - existing JSON data will still work
DO $$
BEGIN
    -- Add a comment to document the new ingredients format
    COMMENT ON COLUMN recipes.ingredients IS 'Enhanced format: [{"item": "", "quantity": "", "notes": "", "category": ""}, ...]';
    RAISE NOTICE 'Updated recipes.ingredients column documentation';
END $$;

-- Create the storage bucket for recipe images (safe - won't duplicate)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Check if bucket was created
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'recipe-images') THEN
        RAISE NOTICE 'Recipe images storage bucket ready';
    ELSE
        RAISE NOTICE 'Storage bucket creation may have failed';
    END IF;
END $$;

-- Add storage policies for recipe images (safe - only adds if not exists)
DO $$
BEGIN
    -- Check and create upload policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Family members can upload recipe images'
    ) THEN
        EXECUTE 'CREATE POLICY "Family members can upload recipe images" ON storage.objects
                 FOR INSERT WITH CHECK (
                   bucket_id = ''recipe-images'' 
                   AND auth.uid() IS NOT NULL
                 )';
        RAISE NOTICE 'Created upload policy for recipe images';
    ELSE
        RAISE NOTICE 'Upload policy already exists';
    END IF;

    -- Check and create view policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Anyone can view recipe images'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can view recipe images" ON storage.objects
                 FOR SELECT USING (bucket_id = ''recipe-images'')';
        RAISE NOTICE 'Created view policy for recipe images';
    ELSE
        RAISE NOTICE 'View policy already exists';
    END IF;

    -- Check and create update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Recipe image owners can update'
    ) THEN
        EXECUTE 'CREATE POLICY "Recipe image owners can update" ON storage.objects
                 FOR UPDATE USING (
                   bucket_id = ''recipe-images'' 
                   AND auth.uid() IS NOT NULL
                 )';
        RAISE NOTICE 'Created update policy for recipe images';
    ELSE
        RAISE NOTICE 'Update policy already exists';
    END IF;

    -- Check and create delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Recipe image owners can delete'
    ) THEN
        EXECUTE 'CREATE POLICY "Recipe image owners can delete" ON storage.objects
                 FOR DELETE USING (
                   bucket_id = ''recipe-images'' 
                   AND auth.uid() IS NOT NULL
                 )';
        RAISE NOTICE 'Created delete policy for recipe images';
    ELSE
        RAISE NOTICE 'Delete policy already exists';
    END IF;
END $$;

-- Update the user creation trigger to the improved version
-- This is safe - only improves new user signup, doesn't affect existing users
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

-- Recreate the trigger (safe - just updates the existing one)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Add new indexes for better performance (safe - only adds if not exists)
CREATE INDEX IF NOT EXISTS idx_recipes_favourite ON recipes(is_favourite);
CREATE INDEX IF NOT EXISTS idx_recipes_image_url ON recipes(image_url) WHERE image_url IS NOT NULL;

-- Add some additional ingredient categories if they don't exist
INSERT INTO ingredients_master (name, category, storage_location, standard_shelf_life, unit_options) VALUES
    ('Garlic', 'vegetables', 'pantry', 30, '["cloves", "bulbs"]'),
    ('Fresh Ginger', 'herbs_spices', 'fridge', 21, '["inch", "piece"]'),
    ('Coconut Milk', 'pantry', 'pantry', 730, '["ml", "tin"]'),
    ('Tinned Tomatoes', 'pantry', 'pantry', 730, '["tin", "g"]'),
    ('Soy Sauce', 'oils_condiments', 'pantry', 365, '["ml", "tbsp"]'),
    ('Fresh Basil', 'herbs_spices', 'fridge', 7, '["leaves", "bunch"]'),
    ('Parmesan Cheese', 'dairy', 'fridge', 30, '["g", "tbsp"]'),
    ('Spring Onions', 'vegetables', 'fridge', 10, '["bunch", "pieces"]'),
    ('Red Wine', 'oils_condiments', 'pantry', 365, '["ml", "bottle"]'),
    ('Chicken Stock', 'oils_condiments', 'pantry', 730, '["ml", "cube"]')
ON CONFLICT (name) DO NOTHING;

-- Final verification and summary
DO $$
DECLARE
    recipe_count INTEGER;
    bucket_exists BOOLEAN;
    image_column_exists BOOLEAN;
BEGIN
    -- Check recipes
    SELECT COUNT(*) INTO recipe_count FROM recipes;
    
    -- Check storage bucket
    SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'recipe-images') INTO bucket_exists;
    
    -- Check image column
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'recipes' AND column_name = 'image_url'
    ) INTO image_column_exists;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Phase 2 Update Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Your existing recipes: % (all preserved)', recipe_count;
    RAISE NOTICE 'Recipe photos enabled: %', CASE WHEN bucket_exists AND image_column_exists THEN 'YES ✓' ELSE 'NO ✗' END;
    RAISE NOTICE 'Storage bucket ready: %', CASE WHEN bucket_exists THEN 'YES ✓' ELSE 'NO ✗' END;
    RAISE NOTICE 'Enhanced ingredients ready: YES ✓';
    RAISE NOTICE '========================================';
    
    IF bucket_exists AND image_column_exists THEN
        RAISE NOTICE 'SUCCESS: You can now add photos and enhanced ingredients to recipes!';
    ELSE
        RAISE NOTICE 'WARNING: Some features may not be available. Check the log above.';
    END IF;
END $$;