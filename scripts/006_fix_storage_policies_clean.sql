-- Fix Supabase Storage RLS policies for event-images bucket
-- This addresses the "new row violates row-level security policy" error during image upload
-- This version handles existing policies by dropping them first

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "All authenticated users can manage event images" ON storage.objects;
DROP POLICY IF EXISTS "All authenticated users can manage profile images" ON storage.objects;

-- Create storage policies for event-images bucket
-- Allow authenticated users to upload images (for admins creating events)
CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to view event images
CREATE POLICY "Authenticated users can view event images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update event images (for admins editing events)
CREATE POLICY "Authenticated users can update event images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete event images (for admins deleting events)
CREATE POLICY "Authenticated users can delete event images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Also create policies for profile-images bucket (if it exists)
-- Allow users to upload their own profile images
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view profile images
CREATE POLICY "Users can view profile images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own profile images
CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- Add comments for documentation
COMMENT ON POLICY "Authenticated users can upload event images" ON storage.objects IS 'Allows authenticated users to upload images to event-images bucket';
COMMENT ON POLICY "Users can upload their own profile images" ON storage.objects IS 'Allows users to upload images to their own profile folder';
