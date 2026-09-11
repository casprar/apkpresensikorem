CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_created_at ON attendance(created_at);
CREATE INDEX IF NOT EXISTS idx_attendance_name ON attendance(name);
CREATE INDEX IF NOT EXISTS idx_attendance_class_name ON attendance(class_name);
CREATE INDEX IF NOT EXISTS idx_attendance_gender ON attendance(gender);
CREATE INDEX IF NOT EXISTS idx_attendance_normalized_name ON attendance(normalized_name);

CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);

