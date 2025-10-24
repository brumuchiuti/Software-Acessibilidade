-- Clean RLS Policy Setup for IFL Jovem SP
-- This script creates all necessary policies from scratch
-- Run this after deleting all previous policies

-- ========================================
-- STEP 1: CREATE STORAGE POLICIES
-- ========================================

-- Simple, permissive policy for event-images bucket
CREATE POLICY "event_images_access"
  ON storage.objects FOR ALL
  USING (bucket_id = 'event-images')
  WITH CHECK (bucket_id = 'event-images');

-- Simple, permissive policy for profile-images bucket
CREATE POLICY "profile_images_access"
  ON storage.objects FOR ALL
  USING (bucket_id = 'profile-images')
  WITH CHECK (bucket_id = 'profile-images');

-- ========================================
-- STEP 2: CREATE EVENTS TABLE POLICIES
-- ========================================

-- Anyone can view events
CREATE POLICY "events_select"
  ON public.events FOR SELECT
  USING (true);

-- Authenticated users can create events
CREATE POLICY "events_insert"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update events
CREATE POLICY "events_update"
  ON public.events FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users can delete events
CREATE POLICY "events_delete"
  ON public.events FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- STEP 3: CREATE PROFILES TABLE POLICIES
-- ========================================

-- Users can view all profiles
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile (handled by trigger)
CREATE POLICY "profiles_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- STEP 4: CREATE EVENT ATTENDANCE POLICIES
-- ========================================

-- Anyone can view event attendance
CREATE POLICY "event_attendance_select"
  ON public.event_attendance FOR SELECT
  USING (true);

-- Users can register for events
CREATE POLICY "event_attendance_insert"
  ON public.event_attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own attendance
CREATE POLICY "event_attendance_update"
  ON public.event_attendance FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- STEP 5: GRANT PERMISSIONS
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
-- STEP 6: CREATE HELPER FUNCTIONS
-- ========================================

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text, new_role text DEFAULT 'presidente')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = new_role::member_role 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role IN ('presidente', 'vice_presidente', 'diretor')
  );
END;
$$;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION public.promote_to_admin(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- ========================================
-- STEP 7: VERIFICATION
-- ========================================

-- Check that policies were created
SELECT 'Storage policies:' as type, policyname as name FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
UNION ALL
SELECT 'Events policies:' as type, policyname as name FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events'
UNION ALL
SELECT 'Profiles policies:' as type, policyname as name FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles'
UNION ALL
SELECT 'Attendance policies:' as type, policyname as name FROM pg_policies WHERE schemaname = 'public' AND tablename = 'event_attendance';

-- ========================================
-- STEP 8: MANUAL SETUP REQUIRED
-- ========================================

-- IMPORTANT: You still need to manually create storage buckets in Supabase Dashboard:
-- 1. Go to Storage > Create Bucket
-- 2. Create bucket named "event-images" (set as Public)
-- 3. Create bucket named "profile-images" (set as Public)

-- To promote your user to admin, run:
-- SELECT public.promote_to_admin('your-email@example.com');
