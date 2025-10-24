-- Fix Supabase Storage RLS policies for event-images bucket
-- This addresses the "new row violates row-level security policy" error during image upload

-- First, let's create the event-images bucket if it doesn't exist
-- Note: This needs to be run in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: event-images
-- Public: true (so images can be accessed publicly)

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

-- Alternative: More permissive policies for easier development
-- Uncomment these if you want to allow all authenticated users to manage all images

/*
-- Allow all authenticated users to manage event images
CREATE POLICY "All authenticated users can manage event images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow all authenticated users to manage profile images
CREATE POLICY "All authenticated users can manage profile images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- Add comments for documentation
COMMENT ON POLICY "Authenticated users can upload event images" ON storage.objects IS 'Allows authenticated users to upload images to event-images bucket';
COMMENT ON POLICY "Users can upload their own profile images" ON storage.objects IS 'Allows users to upload images to their own profile folder';
