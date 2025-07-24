-- Fix for Row Level Security policies to allow updates
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON services;
DROP POLICY IF EXISTS "Allow authenticated insert" ON services;

-- Create more permissive policies for development
-- NOTE: In production, you'd want more restrictive policies

-- Allow anyone to read active services
CREATE POLICY "Allow public read access" ON services
FOR SELECT USING (active = true);

-- Allow anyone to insert services (for demo purposes)
CREATE POLICY "Allow public insert" ON services
FOR INSERT WITH CHECK (true);

-- Allow anyone to update services (for demo purposes)
CREATE POLICY "Allow public update" ON services
FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anyone to "delete" services (set active = false)
CREATE POLICY "Allow public delete" ON services
FOR UPDATE USING (true) WITH CHECK (active = false);

-- Alternative: Disable RLS entirely for development (less secure but simpler)
-- Uncomment the line below if you want to disable RLS completely:
-- ALTER TABLE services DISABLE ROW LEVEL SECURITY;
