-- Fix RLS policy issues for event creation
-- This script addresses the "new row violates row-level security policy" error

-- First, let's create a function to check if a user is an admin
-- This will be more reliable than the inline policy check
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND role IN ('presidente', 'vice_presidente', 'diretor')
  );
END;
$$;

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Only admins can create events" ON public.events;
DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;

-- Recreate the policies using the function
CREATE POLICY "Only admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update events"
  ON public.events FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete events"
  ON public.events FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Also fix similar issues for other admin-only tables
DROP POLICY IF EXISTS "Only admins can create activities" ON public.activities;
DROP POLICY IF EXISTS "Only admins can update activities" ON public.activities;

CREATE POLICY "Only admins can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update activities"
  ON public.activities FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Fix announcements policies
DROP POLICY IF EXISTS "Only admins can create announcements" ON public.announcements;
DROP POLICY IF EXISTS "Only admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Only admins can delete announcements" ON public.announcements;

CREATE POLICY "Only admins can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update announcements"
  ON public.announcements FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete announcements"
  ON public.announcements FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Create a function to promote a user to admin (for initial setup)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile_id uuid;
BEGIN
  -- Get the user ID from email
  SELECT id INTO user_profile_id
  FROM public.profiles
  WHERE email = user_email;
  
  IF user_profile_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Update the role
  UPDATE public.profiles
  SET role = new_role::member_role
  WHERE id = user_profile_id;
  
  RETURN true;
END;
$$;

-- Create a function to create the first admin user
CREATE OR REPLACE FUNCTION public.create_first_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Promote the user to presidente (highest admin role)
  RETURN public.promote_to_admin(user_email, 'presidente');
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_first_admin(text) TO authenticated;

-- Add a comment explaining the fix
COMMENT ON FUNCTION public.is_admin(uuid) IS 'Checks if a user has admin privileges (presidente, vice_presidente, or diretor)';
COMMENT ON FUNCTION public.promote_to_admin(text, text) IS 'Promotes a user to admin role by email';
COMMENT ON FUNCTION public.create_first_admin(text) IS 'Creates the first admin user for initial setup';
