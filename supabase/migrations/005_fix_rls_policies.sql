-- Update RLS policies to check for authenticated users (auth.uid() IS NOT NULL)

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

DROP POLICY IF EXISTS "Only authenticated admins can read attendance" ON attendance;
CREATE POLICY "Only authenticated admins can read attendance"
ON attendance FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Only authenticated admins can delete attendance" ON attendance;
CREATE POLICY "Only authenticated admins can delete attendance"
ON attendance FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);
