-- Supabase Storage Setup for Recipe Images
-- Run this in your Supabase SQL Editor

-- Create the storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Set up RLS policies for the storage bucket
CREATE POLICY "Family members can upload recipe images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' 
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Anyone can view recipe images" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Family members can update their recipe images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipe-images' 
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Family members can delete their recipe images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipe-images' 
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- Update the recipes table to ensure image_url field exists
-- (This should already exist from the original schema, but let's make sure)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'recipes' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE recipes ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Verify the setup
SELECT 'Storage bucket created successfully' as status
WHERE EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'recipe-images');

-- Check storage policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%recipe%';