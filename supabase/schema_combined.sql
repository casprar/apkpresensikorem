-- =======================================================
-- KOREM GKI PAMULANG - COMBINED SQL MIGRATION SCRIPT
-- Run this script in the Supabase SQL Editor
-- =======================================================

-- 1. TABLES & TRIGGERS
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    class_name TEXT NOT NULL CHECK (class_name IN ('Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12')),
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_session_attendance UNIQUE (session_id, normalized_name)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Admins can read their own profile" ON profiles;
CREATE POLICY "Admins can read their own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update their own profile" ON profiles;
CREATE POLICY "Admins can update their own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Sessions Policies
DROP POLICY IF EXISTS "Anyone can read sessions" ON sessions;
CREATE POLICY "Anyone can read sessions" ON sessions FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated admins can insert sessions" ON sessions;
CREATE POLICY "Authenticated admins can insert sessions" ON sessions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Authenticated admins can update sessions" ON sessions;
CREATE POLICY "Authenticated admins can update sessions" ON sessions FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Authenticated admins can delete sessions" ON sessions;
CREATE POLICY "Authenticated admins can delete sessions" ON sessions FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Attendance Policies
DROP POLICY IF EXISTS "Only authenticated admins can read attendance" ON attendance;
CREATE POLICY "Only authenticated admins can read attendance" ON attendance FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Only authenticated admins can delete attendance" ON attendance;
CREATE POLICY "Only authenticated admins can delete attendance" ON attendance FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_created_at ON attendance(created_at);
CREATE INDEX IF NOT EXISTS idx_attendance_name ON attendance(name);
CREATE INDEX IF NOT EXISTS idx_attendance_class_name ON attendance(class_name);
CREATE INDEX IF NOT EXISTS idx_attendance_gender ON attendance(gender);
CREATE INDEX IF NOT EXISTS idx_attendance_normalized_name ON attendance(normalized_name);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);

-- 4. RPC FUNCTIONS
CREATE OR REPLACE FUNCTION submit_attendance(
    p_session_id UUID,
    p_name TEXT,
    p_class_name TEXT,
    p_gender TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session_status TEXT;
    v_normalized_name TEXT;
    v_inserted_id UUID;
    v_created_at TIMESTAMPTZ;
BEGIN
    SELECT status INTO v_session_status FROM sessions WHERE id = p_session_id;

    IF v_session_status IS NULL THEN
        RETURN jsonb_build_object('status', 'SESSION_NOT_FOUND');
    END IF;

    IF v_session_status != 'OPEN' THEN
        RETURN jsonb_build_object('status', 'SESSION_CLOSED');
    END IF;

    IF p_class_name NOT IN ('Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12') THEN
        RETURN jsonb_build_object('status', 'INVALID_CLASS');
    END IF;

    IF p_gender NOT IN ('MALE', 'FEMALE') THEN
        RETURN jsonb_build_object('status', 'INVALID_GENDER');
    END IF;

    IF length(trim(p_name)) < 2 THEN
        RETURN jsonb_build_object('status', 'INVALID_NAME');
    END IF;

    v_normalized_name := lower(trim(p_name));

    IF EXISTS (
        SELECT 1 FROM attendance WHERE session_id = p_session_id AND normalized_name = v_normalized_name
    ) THEN
        RETURN jsonb_build_object('status', 'DUPLICATE');
    END IF;

    INSERT INTO attendance (session_id, name, normalized_name, class_name, gender)
    VALUES (p_session_id, trim(p_name), v_normalized_name, p_class_name, p_gender)
    RETURNING id, created_at INTO v_inserted_id, v_created_at;

    RETURN jsonb_build_object(
        'status', 'SUCCESS',
        'data', jsonb_build_object(
            'id', v_inserted_id,
            'name', trim(p_name),
            'class_name', p_class_name,
            'gender', p_gender,
            'created_at', v_created_at
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION submit_attendance(UUID, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION submit_attendance(UUID, TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION get_session_for_attendance(
    p_session_id UUID
) RETURNS TABLE (
    session_name TEXT,
    session_date DATE,
    session_start_time TIME,
    session_end_time TIME,
    session_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT name, date, start_time, end_time, status FROM sessions WHERE id = p_session_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_session_for_attendance(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_session_for_attendance(UUID) TO authenticated;
