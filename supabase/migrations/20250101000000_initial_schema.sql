-- =============================================================================
-- IFL Jovem SP - Complete Database Schema
-- Reorganized schema for Plataforma Educacional Acessível
-- Run: supabase db push (or supabase db reset for fresh install)
--
-- Note: For existing DBs with different profiles structure, run the ALTER
-- statements below if tables were created by Supabase starter.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT,
  board_role TEXT,
  development_level TEXT DEFAULT 'qualify',
  director_title TEXT,
  bio TEXT,
  phone TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  description TEXT,
  avatar_url TEXT,
  approved BOOLEAN DEFAULT false,
  total_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_profiles_approved ON public.profiles(approved);
CREATE INDEX IF NOT EXISTS idx_profiles_board_role ON public.profiles(board_role);
CREATE INDEX IF NOT EXISTS idx_profiles_development_level ON public.profiles(development_level);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON public.profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name);

COMMENT ON TABLE public.profiles IS 'Member profiles extending auth.users';

-- Ensure columns exist (for DBs migrated from Supabase starter)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS development_level TEXT DEFAULT 'qualify';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS director_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_points INT DEFAULT 0;

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Membro'),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. MEMBER INSTITUTE AREAS (many-to-many)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.member_institute_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, area)
);

ALTER TABLE public.member_institute_areas ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_member_institute_areas_member ON public.member_institute_areas(member_id);
CREATE INDEX IF NOT EXISTS idx_member_institute_areas_area ON public.member_institute_areas(area);

COMMENT ON TABLE public.member_institute_areas IS 'Institute areas each member participates in';

-- -----------------------------------------------------------------------------
-- 3. EVENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  points_value INT NOT NULL DEFAULT 0,
  max_participants INT,
  image_url TEXT,
  google_calendar_event_id TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);

COMMENT ON TABLE public.events IS 'Institute events and activities';

-- -----------------------------------------------------------------------------
-- 4. EVENT ATTENDANCE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  points_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON public.event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user ON public.event_attendance(user_id);

COMMENT ON TABLE public.event_attendance IS 'Event registration and attendance tracking';

-- -----------------------------------------------------------------------------
-- 5. ACTIVITIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL,
  points_value INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

COMMENT ON TABLE public.activities IS 'Engagement activities for points (submissions)';

-- -----------------------------------------------------------------------------
-- 6. ACTIVITY PARTICIPATION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  image_url TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  points_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_participation ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_activity_participation_activity ON public.activity_participation(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_participation_user ON public.activity_participation(user_id);

COMMENT ON TABLE public.activity_participation IS 'Activity submissions awaiting/admin approval';

-- -----------------------------------------------------------------------------
-- 7. OPPORTUNITIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  opportunity_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_opportunities_active ON public.opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);

COMMENT ON TABLE public.opportunities IS 'Stages, mentorship, courses for members';

-- -----------------------------------------------------------------------------
-- 8. TRAINING CYCLE (Ciclo de Formação)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.training_cycle_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.training_cycle_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID NOT NULL REFERENCES public.training_cycle_levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('link', 'file', 'image')),
  content_url TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.training_cycle_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  submitted_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, task_id)
);

ALTER TABLE public.training_cycle_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_cycle_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_training_progress ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_training_tasks_level ON public.training_cycle_tasks(level_id);
CREATE INDEX IF NOT EXISTS idx_member_progress_member ON public.member_training_progress(member_id);
CREATE INDEX IF NOT EXISTS idx_member_progress_task ON public.member_training_progress(task_id);

-- Seed default development levels
INSERT INTO public.training_cycle_levels (name, slug, description, order_index) VALUES
  ('Qualify', 'qualify', 'Etapa inicial de formação - conhecendo o IFL e seus valores', 0),
  ('Associado I', 'associado_i', 'Desenvolvimento das competências básicas de liderança', 1),
  ('Associado II', 'associado_ii', 'Aprofundamento em gestão de times e projetos', 2),
  ('Associado Sênior', 'associado_senior', 'Mentoria, estratégia e desenvolvimento de líderes', 3)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 9. HELPER FUNCTION (avoids RLS recursion)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_board_member()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND board_role IS NOT NULL
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_board_member() TO authenticated;

-- -----------------------------------------------------------------------------
-- 10. RLS POLICIES - PROFILES
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_board_member());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 11. RLS POLICIES - MEMBER INSTITUTE AREAS
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read institute areas" ON public.member_institute_areas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage institute areas" ON public.member_institute_areas
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 12. RLS POLICIES - EVENTS
-- -----------------------------------------------------------------------------
CREATE POLICY "Authenticated can read events" ON public.events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 13. RLS POLICIES - EVENT ATTENDANCE
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read event attendance" ON public.event_attendance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can register for events" ON public.event_attendance
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from events" ON public.event_attendance
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage event attendance" ON public.event_attendance
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 14. RLS POLICIES - ACTIVITIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read activities" ON public.activities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage activities" ON public.activities
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 15. RLS POLICIES - ACTIVITY PARTICIPATION
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read own participation" ON public.activity_participation
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all participation" ON public.activity_participation
  FOR SELECT TO authenticated
  USING (public.is_board_member());

CREATE POLICY "Users can submit participation" ON public.activity_participation
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage participation" ON public.activity_participation
  FOR UPDATE TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

CREATE POLICY "Admins can delete participation" ON public.activity_participation
  FOR DELETE TO authenticated
  USING (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 16. RLS POLICIES - OPPORTUNITIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read active opportunities" ON public.opportunities
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can read all opportunities" ON public.opportunities
  FOR SELECT TO authenticated
  USING (public.is_board_member());

CREATE POLICY "Admins can manage opportunities" ON public.opportunities
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 17. RLS POLICIES - TRAINING CYCLE
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read training levels" ON public.training_cycle_levels
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read training tasks" ON public.training_cycle_tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage training levels" ON public.training_cycle_levels
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

CREATE POLICY "Admins can manage training tasks" ON public.training_cycle_tasks
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

CREATE POLICY "Users can read own progress" ON public.member_training_progress
  FOR SELECT TO authenticated USING (auth.uid() = member_id);

CREATE POLICY "Users can insert own progress" ON public.member_training_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update own progress" ON public.member_training_progress
  FOR UPDATE TO authenticated USING (auth.uid() = member_id);

CREATE POLICY "Admins can manage training progress" ON public.member_training_progress
  FOR ALL TO authenticated
  USING (public.is_board_member())
  WITH CHECK (public.is_board_member());

-- -----------------------------------------------------------------------------
-- 18. BACKFILL: Approve existing members (safe for fresh or migrated DB)
-- -----------------------------------------------------------------------------
UPDATE public.profiles SET approved = true WHERE approved IS NULL OR approved = false;
