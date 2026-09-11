-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Admins can read their own profile" ON profiles;
CREATE POLICY "Admins can read their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update their own profile" ON profiles;
CREATE POLICY "Admins can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Sessions Policies
DROP POLICY IF EXISTS "Anyone can read sessions" ON sessions;
CREATE POLICY "Anyone can read sessions"
ON sessions FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated admins can insert sessions" ON sessions;
CREATE POLICY "Authenticated admins can insert sessions"
ON sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated admins can update sessions" ON sessions;
CREATE POLICY "Authenticated admins can update sessions"
ON sessions FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated admins can delete sessions" ON sessions;
CREATE POLICY "Authenticated admins can delete sessions"
ON sessions FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Attendance Policies
DROP POLICY IF EXISTS "Only authenticated admins can read attendance" ON attendance;
CREATE POLICY "Only authenticated admins can read attendance"
ON attendance FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- No policy for INSERT on attendance because it's handled via RPC

DROP POLICY IF EXISTS "Only authenticated admins can delete attendance" ON attendance;
CREATE POLICY "Only authenticated admins can delete attendance"
ON attendance FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);


