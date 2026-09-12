-- Migration 007: Update check constraint on attendance table for class_name

ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_class_name_check;

ALTER TABLE attendance ADD CONSTRAINT attendance_class_name_check 
CHECK (class_name IN (
    'Kelas 7', 'Kelas 8', 'Kelas 9', 'Kelas 10', 'Kelas 11', 'Kelas 12',
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
));
