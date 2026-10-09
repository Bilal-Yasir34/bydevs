-- =====================================================================
-- BY DEVS - SUPABASE DATABASE SCHEMA FOR INQUIRIES / CONTACT QUERIES
-- =====================================================================
-- Run this script in your Supabase SQL Editor:
-- 1. Go to https://supabase.com/dashboard/project/yphdtlszwangehzloccb/sql/new
-- 2. Paste this entire script and click "Run".
-- =====================================================================

-- 1. Ensure public schema usage permissions for all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 2. Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  company TEXT DEFAULT '',
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  full_phone TEXT NOT NULL,
  service TEXT NOT NULL,
  budget TEXT DEFAULT 'Not specified',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'called', 'in_progress', 'completed', 'cancelled')),
  notes TEXT DEFAULT ''
);

-- 3. Explicitly grant permissions on table
GRANT ALL ON TABLE public.inquiries TO anon, authenticated, service_role;

-- 4. Create indexes for fast searches and sorting
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries (email);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 6. Ensure policies allow full CRUD for website submissions and admin panel
DROP POLICY IF EXISTS "Allow anonymous insert for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow anon full access" ON public.inquiries;
DROP POLICY IF EXISTS "Allow public insert" ON public.inquiries;
DROP POLICY IF EXISTS "Allow public select" ON public.inquiries;
DROP POLICY IF EXISTS "Allow public update" ON public.inquiries;
DROP POLICY IF EXISTS "Allow public delete" ON public.inquiries;

CREATE POLICY "Allow public insert"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Allow public select"
  ON public.inquiries
  FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

CREATE POLICY "Allow public update"
  ON public.inquiries
  FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete"
  ON public.inquiries
  FOR DELETE
  TO anon, authenticated, service_role
  USING (true);
