-- Quick fix for Supabase Storage RLS policies
-- This is a more permissive approach for immediate testing

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;

-- Create permissive policies for development/testing
-- Allow all authenticated users to manage event images
CREATE POLICY "Allow authenticated users to manage event images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow all authenticated users to manage profile images  
CREATE POLICY "Allow authenticated users to manage profile images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
