import { CLASS_OPTIONS } from '../constants/classOptions';

/**
 * Validate a name field
 * @param {string} name
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Please enter your name.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name is too long.' };
  }
  return { valid: true, error: null };
}

/**
 * Validate a class_name field
 * @param {string} className
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateClass(className) {
  if (!className || !CLASS_OPTIONS.includes(className)) {
    return { valid: false, error: 'Please select your class.' };
  }
  return { valid: true, error: null };
}

/**
 * Validate a gender field
 * @param {string} gender
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateGender(gender) {
  if (!gender || !['MALE', 'FEMALE'].includes(gender)) {
    return { valid: false, error: 'Please select your gender.' };
  }
  return { valid: true, error: null };
}

/**
 * Validate all attendance form fields
 * @param {{ name: string, className: string, gender: string }} data
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateAttendanceForm(data) {
  const nameResult = validateName(data.name);
  const classResult = validateClass(data.className);
  const genderResult = validateGender(data.gender);

  return {
    valid: nameResult.valid && classResult.valid && genderResult.valid,
    errors: {
      name: nameResult.error,
      className: classResult.error,
      gender: genderResult.error,
    },
  };
}

/**
 * Normalize a name for duplicate checking (lowercase + trimmed)
 * @param {string} name
 * @returns {string}
 */
export function normalizeName(name) {
  return (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
