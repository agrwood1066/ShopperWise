-- Phase 3 Inventory Update - Open Text Ingredients
-- Run this in your Supabase SQL Editor to update inventory for open text ingredients
-- This safely migrates from ingredient_id to ingredient_name approach

-- Step 1: Add new columns to current_inventory table
ALTER TABLE current_inventory 
ADD COLUMN IF NOT EXISTS ingredient_name TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS storage_location TEXT DEFAULT 'fridge' CHECK (storage_location IN ('fridge', 'freezer', 'pantry'));

-- Step 2: Migrate existing data (if any exists)
-- Copy ingredient names from ingredients_master to current_inventory
UPDATE current_inventory 
SET 
    ingredient_name = ingredients_master.name,
    category = ingredients_master.category,
    storage_location = COALESCE(ingredients_master.storage_location, 'fridge')
FROM ingredients_master 
WHERE current_inventory.ingredient_id = ingredients_master.id
AND current_inventory.ingredient_name IS NULL;

-- Step 3: Update the inventory view to work with new structure
DROP VIEW IF EXISTS inventory_with_expiry_status;

CREATE OR REPLACE VIEW inventory_with_expiry_status AS
SELECT 
    ci.*,
    ci.ingredient_name,
    ci.category,
    ci.storage_location,
    CASE 
        WHEN ci.expiry_date < CURRENT_DATE THEN 'expired'
        WHEN ci.expiry_date <= CURRENT_DATE + INTERVAL '2 days' THEN 'expiring'
        WHEN ci.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'soon'
        ELSE 'fresh'
    END as expiry_status,
    ci.expiry_date - CURRENT_DATE as days_until_expiry
FROM current_inventory ci;

-- Step 4: After migration is complete and tested, we can safely drop the old constraint
-- (Run this later after testing the new system)
-- ALTER TABLE current_inventory DROP CONSTRAINT IF EXISTS current_inventory_ingredient_id_fkey;
-- ALTER TABLE current_inventory ALTER COLUMN ingredient_id DROP NOT NULL;

-- Step 5: Create indexes for better performance with new structure
CREATE INDEX IF NOT EXISTS idx_inventory_ingredient_name ON current_inventory(ingredient_name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON current_inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_storage_location ON current_inventory(storage_location);

-- Step 6: Update RLS policies to work with new structure (they should still work as they filter by family_id)

COMMENT ON TABLE current_inventory IS 'Updated for Phase 3: Now supports both ingredient_id (legacy) and ingredient_name (new flexible approach)';

-- Verification query - run this to check your data after migration
-- SELECT id, ingredient_name, category, storage_location, quantity, unit, expiry_date 
-- FROM current_inventory 
-- WHERE family_id = 'your-family-id';