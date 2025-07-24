-- Add duration column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS duration TEXT;

-- Update existing services to have a default duration if needed
-- UPDATE services SET duration = '60 minutes' WHERE duration IS NULL;
