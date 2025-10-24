-- NUCLEAR OPTION: Temporarily disable RLS for testing
-- WARNING: This removes security temporarily - only use for testing!

-- Disable RLS on events table temporarily
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Disable RLS on storage.objects temporarily  
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Grant all permissions
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Check status
SELECT 
  'RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname IN ('public', 'storage') 
AND tablename IN ('events', 'objects');

-- IMPORTANT: Re-enable RLS after testing with:
-- ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
