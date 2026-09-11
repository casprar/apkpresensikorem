/**
 * KOREM GKI Pamulang — Class Options
 * Single source of truth for all grade selections.
 * Used by: AttendanceForm, ClassSelect, AdminFilters, Dashboard, Exports, Validation
 */

export const CLASS_OPTIONS = [
  'Kelas 7',
  'Kelas 8',
  'Kelas 9',
  'Kelas 10',
  'Kelas 11',
  'Kelas 12',
];

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

export const SESSION_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export const SUBMISSION_STATUS = {
  SUCCESS: 'SUCCESS',
  DUPLICATE: 'DUPLICATE',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_CLOSED: 'SESSION_CLOSED',
  INVALID_CLASS: 'INVALID_CLASS',
  INVALID_GENDER: 'INVALID_GENDER',
  INVALID_NAME: 'INVALID_NAME',
};
