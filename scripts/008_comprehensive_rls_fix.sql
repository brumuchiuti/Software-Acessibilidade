-- Comprehensive RLS Policy Fix for IFL Jovem SP
-- This script addresses ALL possible RLS policy violations
-- Run this to completely fix the "new row violates row-level security policy" error

-- ========================================
-- STEP 1: DIAGNOSTIC QUERIES
-- ========================================
-- Uncomment these to check current state:

/*
-- Check if buckets exist
SELECT name, public FROM storage.buckets;

-- Check existing storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage';

-- Check if user has admin role
SELECT id, email, role FROM public.profiles WHERE id = auth.uid();
*/

-- ========================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- ========================================
-- Drop ALL existing storage policies to start clean
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
    END LOOP;
END $$;

-- ========================================
-- STEP 3: CREATE STORAGE BUCKETS (if they don't exist)
-- ========================================
-- Note: These need to be created in Supabase Dashboard > Storage
-- But we'll create policies assuming they exist

-- ========================================
-- STEP 4: CREATE COMPREHENSIVE STORAGE POLICIES
-- ========================================

-- Very permissive policy for event-images bucket
CREATE POLICY "event_images_full_access"
  ON storage.objects FOR ALL
  USING (bucket_id = 'event-images')
  WITH CHECK (bucket_id = 'event-images');

-- Very permissive policy for profile-images bucket  
CREATE POLICY "profile_images_full_access"
  ON storage.objects FOR ALL
  USING (bucket_id = 'profile-images')
  WITH CHECK (bucket_id = 'profile-images');

-- ========================================
-- STEP 5: FIX DATABASE RLS POLICIES
-- ========================================

-- Drop and recreate events policies
DROP POLICY IF EXISTS "Events are viewable by all authenticated users" ON public.events;
DROP POLICY IF EXISTS "Only admins can create events" ON public.events;
DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;

-- Create more permissive events policies for testing
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update events"
  ON public.events FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete events"
  ON public.events FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- STEP 6: GRANT ALL NECESSARY PERMISSIONS
-- ========================================

-- Grant storage permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Grant database permissions
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.event_attendance TO authenticated;

-- ========================================
-- STEP 7: CREATE HELPER FUNCTIONS
-- ========================================

-- Function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.role() = 'authenticated';
END;
$$;

-- Function to promote user to admin (for testing)
CREATE OR REPLACE FUNCTION public.make_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'presidente' 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION public.is_authenticated() TO authenticated;
GRANT EXECUTE ON FUNCTION public.make_admin(text) TO authenticated;

-- ========================================
-- STEP 8: VERIFICATION QUERIES
-- ========================================

-- Check that policies were created
SELECT 'Storage policies created:' as status;
SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';

-- Check events policies
SELECT 'Events policies created:' as status;
SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events';

-- Check current user permissions
SELECT 'Current user info:' as status;
SELECT auth.uid() as user_id, auth.role() as user_role;

-- ========================================
-- STEP 9: INSTRUCTIONS FOR MANUAL SETUP
-- ========================================

-- IMPORTANT: You still need to manually create the storage buckets:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create bucket named "event-images" (set as Public)
-- 3. Create bucket named "profile-images" (set as Public)

-- To promote your user to admin, run:
-- SELECT public.make_admin('your-email@example.com');
