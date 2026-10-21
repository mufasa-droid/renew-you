-- =============================================================================
-- Renew You V1.1 — Initial Database Schema & Row Level Security (RLS)
-- Target: Supabase PostgreSQL
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Profiles Table
-- Stores user preferences and non-sensitive display info.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  settings JSONB NOT NULL DEFAULT '{"ambientSound": false, "reducedMotion": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Automatic Profile Creation Trigger on Sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. Mood Entries Table
-- Strict 1-entry-per-calendar-day policy enforced by unique constraint.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key DATE NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('very-low', 'low', 'okay', 'good', 'excellent')),
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  note TEXT CHECK (char_length(note) <= 280),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT unique_user_date_entry UNIQUE (user_id, date_key)
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Mood Entries RLS Policies
DROP POLICY IF EXISTS "Users can view their own mood entries" ON public.mood_entries;
CREATE POLICY "Users can view their own mood entries"
  ON public.mood_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own mood entries" ON public.mood_entries;
CREATE POLICY "Users can insert their own mood entries"
  ON public.mood_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own mood entries" ON public.mood_entries;
CREATE POLICY "Users can update their own mood entries"
  ON public.mood_entries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own mood entries" ON public.mood_entries;
CREATE POLICY "Users can delete their own mood entries"
  ON public.mood_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON public.mood_entries (user_id, date_key DESC);

-- -----------------------------------------------------------------------------
-- 3. Reflections Table
-- Stores daily journal reflections and mindful prompts.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  text TEXT NOT NULL,
  date_key DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Reflections RLS Policies
DROP POLICY IF EXISTS "Users can view their own reflections" ON public.reflections;
CREATE POLICY "Users can view their own reflections"
  ON public.reflections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own reflections" ON public.reflections;
CREATE POLICY "Users can insert their own reflections"
  ON public.reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reflections" ON public.reflections;
CREATE POLICY "Users can delete their own reflections"
  ON public.reflections FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reflections_user_created ON public.reflections (user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. Guided Mindful Questionnaire Responses Table
-- Non-diagnostic self-reflection answers stored per user.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questionnaire_id TEXT NOT NULL DEFAULT 'mindful-checkin-v1',
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Questionnaire Responses RLS Policies
DROP POLICY IF EXISTS "Users can view their own questionnaire responses" ON public.questionnaire_responses;
CREATE POLICY "Users can view their own questionnaire responses"
  ON public.questionnaire_responses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own questionnaire responses" ON public.questionnaire_responses;
CREATE POLICY "Users can insert their own questionnaire responses"
  ON public.questionnaire_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own questionnaire responses" ON public.questionnaire_responses;
CREATE POLICY "Users can delete their own questionnaire responses"
  ON public.questionnaire_responses FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_user ON public.questionnaire_responses (user_id, created_at DESC);
