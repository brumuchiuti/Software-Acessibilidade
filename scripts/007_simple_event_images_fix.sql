-- Simple fix for event-images bucket RLS policies
-- This focuses only on the event-images bucket to fix the upload issue

-- Drop any existing policies for event-images
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to manage event images" ON storage.objects;

-- Create a single comprehensive policy for event-images bucket
CREATE POLICY "Allow authenticated users to manage event images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
