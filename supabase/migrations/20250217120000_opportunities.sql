-- Oportunidades - Institute opportunities for members
-- Run: supabase db push (or apply via Supabase Dashboard SQL editor)

CREATE TABLE IF NOT EXISTS opportunities (
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

CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at DESC);

-- RLS policies
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active opportunities
CREATE POLICY "Users can read active opportunities" ON opportunities
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Admins (board members) can read all opportunities
CREATE POLICY "Admins can read all opportunities" ON opportunities
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL));

-- Admins can manage (insert, update, delete) opportunities
CREATE POLICY "Admins can insert opportunities" ON opportunities
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL));

CREATE POLICY "Admins can update opportunities" ON opportunities
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL));

CREATE POLICY "Admins can delete opportunities" ON opportunities
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND board_role IS NOT NULL));
