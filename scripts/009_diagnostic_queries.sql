-- Quick diagnostic script to check RLS issues
-- Run this to see what's causing the policy violation

-- Check current user authentication
SELECT 
  'Authentication Status' as check_type,
  auth.uid() as user_id,
  auth.role() as user_role,
  CASE 
    WHEN auth.uid() IS NULL THEN 'NOT AUTHENTICATED'
    WHEN auth.role() = 'authenticated' THEN 'AUTHENTICATED'
    ELSE 'OTHER ROLE: ' || auth.role()
  END as status;

-- Check user profile and role
SELECT 
  'User Profile' as check_type,
  id,
  email,
  role,
  CASE 
    WHEN role IN ('presidente', 'vice_presidente', 'diretor') THEN 'ADMIN'
    ELSE 'REGULAR USER'
  END as admin_status
FROM public.profiles 
WHERE id = auth.uid();

-- Check existing storage policies
SELECT 
  'Storage Policies' as check_type,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Check existing events policies
SELECT 
  'Events Policies' as check_type,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'events';

-- Check if storage buckets exist
SELECT 
  'Storage Buckets' as check_type,
  name,
  public,
  created_at
FROM storage.buckets;

-- Test if we can insert into events (this will show the exact error)
-- Uncomment the next line to test:
-- INSERT INTO public.events (title, description, event_date, location, status, points_value, created_by) VALUES ('Test Event', 'Test Description', NOW(), 'Test Location', 'scheduled', 10, auth.uid());
