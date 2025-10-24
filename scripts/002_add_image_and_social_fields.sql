-- Add image and social media fields to existing tables

-- Add image_url field to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS image_url text;

-- Add social media and description fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS description text;

-- Update the bio field to be more descriptive if needed
-- (bio already exists, but we're adding description as a separate field for more detailed info)

-- Create storage buckets for file uploads (if using Supabase Storage)
-- Note: These would typically be created through the Supabase dashboard or API
-- But we can add policies here

-- Create policy for event image uploads (admins only)
-- This assumes you have a 'event-images' bucket in Supabase Storage
CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('presidente', 'vice_presidente', 'diretor')
    )
  );

-- Create policy for profile image uploads (users can upload their own)
-- This assumes you have a 'profile-images' bucket in Supabase Storage
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for reading event images (all authenticated users)
CREATE POLICY "Event images are viewable by all authenticated users"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'event-images' AND
    auth.uid() IS NOT NULL
  );

-- Create policy for reading profile images (all authenticated users)
CREATE POLICY "Profile images are viewable by all authenticated users"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'profile-images' AND
    auth.uid() IS NOT NULL
  );

-- Create policy for updating profile images (users can update their own)
CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for deleting profile images (users can delete their own)
CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for deleting event images (admins only)
CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('presidente', 'vice_presidente', 'diretor')
    )
  );
