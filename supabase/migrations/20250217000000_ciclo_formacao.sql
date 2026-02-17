-- Ciclo de Formação - Supabase schema
-- Run: supabase db push (or apply via Supabase Dashboard SQL editor)

-- 1. Training cycle levels (development levels with their metadata)
CREATE TABLE IF NOT EXISTS training_cycle_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tasks per level (link, file, or image)
CREATE TABLE IF NOT EXISTS training_cycle_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID NOT NULL REFERENCES training_cycle_levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('link', 'file', 'image')),
  content_url TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_tasks_level ON training_cycle_tasks(level_id);

-- 3. Member progress (which tasks each member has completed)
CREATE TABLE IF NOT EXISTS member_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES training_cycle_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  submitted_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, task_id)
);

CREATE INDEX idx_member_progress_member ON member_training_progress(member_id);
CREATE INDEX idx_member_progress_task ON member_training_progress(task_id);

-- RLS policies
ALTER TABLE training_cycle_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_cycle_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_training_progress ENABLE ROW LEVEL SECURITY;

-- Levels and tasks: readable by all authenticated users
CREATE POLICY "Users can read training levels" ON training_cycle_levels
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read training tasks" ON training_cycle_tasks
  FOR SELECT TO authenticated USING (true);

-- Member progress: users can read/write their own
CREATE POLICY "Users can read own progress" ON member_training_progress
  FOR SELECT TO authenticated USING (auth.uid() = member_id);

CREATE POLICY "Users can insert own progress" ON member_training_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update own progress" ON member_training_progress
  FOR UPDATE TO authenticated USING (auth.uid() = member_id);

-- Admin policies: board members can manage levels and tasks
CREATE POLICY "Admins can manage training levels" ON training_cycle_levels
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL));

CREATE POLICY "Admins can manage training tasks" ON training_cycle_tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL));

-- Seed default development levels
INSERT INTO training_cycle_levels (name, slug, description, order_index) VALUES
  ('Qualify', 'qualify', 'Etapa inicial de formação - conhecendo o IFL e seus valores', 0),
  ('Associado I', 'associado_i', 'Desenvolvimento das competências básicas de liderança', 1),
  ('Associado II', 'associado_ii', 'Aprofundamento em gestão de times e projetos', 2),
  ('Associado Sênior', 'associado_senior', 'Mentoria, estratégia e desenvolvimento de líderes', 3)
ON CONFLICT (slug) DO NOTHING;
