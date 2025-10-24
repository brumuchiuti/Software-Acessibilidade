-- Update member structure to support 3 distinct characteristics
-- 1. Board roles (admin access)
-- 2. Institute areas (multiple areas possible)
-- 3. Development pathway levels

-- First, let's create the new enums and tables

-- Create enum for board roles (admin access)
CREATE TYPE board_role AS ENUM (
  'presidente',
  'vice_presidente', 
  'diretor_eventos',
  'diretor_comunicacao',
  'diretor_formacao',
  'diretor_institucional',
  'diretor_financeiro',
  'diretor_forum',
  'conselheiro'
);

-- Create enum for institute areas
CREATE TYPE institute_area AS ENUM (
  'diretoria_financeira',
  'diretoria_comunicacao',
  'diretoria_forum',
  'diretoria_formacao',
  'diretoria_institucional',
  'diretoria_eventos'
);

-- Create enum for development pathway levels
CREATE TYPE development_level AS ENUM (
  'qualify',
  'associado_i',
  'associado_ii',
  'associado_senior'
);

-- Create table for member institute areas (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.member_institute_areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  area institute_area NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(member_id, area)
);

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS board_role board_role,
ADD COLUMN IF NOT EXISTS development_level development_level DEFAULT 'qualify';

-- Update existing profiles to set development_level based on current role
UPDATE public.profiles 
SET development_level = CASE 
  WHEN role = 'associado_i' THEN 'associado_i'::development_level
  WHEN role = 'associado_ii' THEN 'associado_ii'::development_level
  WHEN role = 'associado_iii' THEN 'associado_senior'::development_level
  WHEN role = 'associado_senior' THEN 'associado_senior'::development_level
  ELSE 'qualify'::development_level
END;

-- Update existing profiles to set board_role based on current role
UPDATE public.profiles 
SET board_role = CASE 
  WHEN role = 'presidente' THEN 'presidente'::board_role
  WHEN role = 'vice_presidente' THEN 'vice_presidente'::board_role
  WHEN role = 'diretor' THEN 'diretor_eventos'::board_role  -- Default to eventos for existing diretores
  ELSE NULL
END;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_board_role ON public.profiles(board_role);
CREATE INDEX IF NOT EXISTS idx_profiles_development_level ON public.profiles(development_level);
CREATE INDEX IF NOT EXISTS idx_member_institute_areas_member ON public.member_institute_areas(member_id);
CREATE INDEX IF NOT EXISTS idx_member_institute_areas_area ON public.member_institute_areas(area);

-- Update RLS policies for the new table
ALTER TABLE public.member_institute_areas ENABLE ROW LEVEL SECURITY;

-- Policy for viewing member institute areas (all authenticated users)
CREATE POLICY "Member institute areas are viewable by all authenticated users"
  ON public.member_institute_areas FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy for admins to manage member institute areas
CREATE POLICY "Admins can manage member institute areas"
  ON public.member_institute_areas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

-- Update existing RLS policies to use board_role instead of role for admin checks
DROP POLICY IF EXISTS "Only admins can create events" ON public.events;
CREATE POLICY "Only admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
CREATE POLICY "Only admins can update events"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;
CREATE POLICY "Only admins can delete events"
  ON public.events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can create activities" ON public.activities;
CREATE POLICY "Only admins can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can update activities" ON public.activities;
CREATE POLICY "Only admins can update activities"
  ON public.activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can delete activities" ON public.activities;
CREATE POLICY "Only admins can delete activities"
  ON public.activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can create announcements" ON public.announcements;
CREATE POLICY "Only admins can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can update announcements" ON public.announcements;
CREATE POLICY "Only admins can update announcements"
  ON public.announcements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Only admins can delete announcements" ON public.announcements;
CREATE POLICY "Only admins can delete announcements"
  ON public.announcements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

-- Update storage policies to use board_role
DROP POLICY IF EXISTS "Admins can upload event images" ON storage.objects;
CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;
CREATE POLICY "Admins can delete event images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND board_role IS NOT NULL
    )
  );

-- Add some sample institute areas for existing members
-- You can customize this based on your needs
INSERT INTO public.member_institute_areas (member_id, area)
SELECT 
  id,
  CASE 
    WHEN board_role = 'diretor_eventos' THEN 'diretoria_eventos'::institute_area
    WHEN board_role = 'diretor_comunicacao' THEN 'diretoria_comunicacao'::institute_area
    WHEN board_role = 'diretor_formacao' THEN 'diretoria_formacao'::institute_area
    WHEN board_role = 'diretor_institucional' THEN 'diretoria_institucional'::institute_area
    WHEN board_role = 'diretor_financeiro' THEN 'diretoria_financeira'::institute_area
    WHEN board_role = 'diretor_forum' THEN 'diretoria_forum'::institute_area
    ELSE 'diretoria_eventos'::institute_area  -- Default area
  END
FROM public.profiles 
WHERE board_role IS NOT NULL
ON CONFLICT (member_id, area) DO NOTHING;

-- Create a function to check if a user is admin (has board role)
DROP FUNCTION IF EXISTS is_admin(uuid);
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND board_role IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.board_role IS 'Board role for admin access (presidente, vice_presidente, diretores, conselheiro)';
COMMENT ON COLUMN public.profiles.development_level IS 'Development pathway level (qualify, associado_i, associado_ii, associado_senior)';
COMMENT ON TABLE public.member_institute_areas IS 'Many-to-many relationship between members and institute areas';
COMMENT ON COLUMN public.member_institute_areas.area IS 'Institute area the member belongs to (diretoria_*)';
