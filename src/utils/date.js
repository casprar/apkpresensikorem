import { format, parseISO } from 'date-fns';

const JAKARTA_OFFSET = 7 * 60; // UTC+7 in minutes

/**
 * Get the current date/time in Asia/Jakarta timezone
 * @returns {Date}
 */
export function getJakartaNow() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + JAKARTA_OFFSET * 60000);
}

/**
 * Format a date string to a human-readable format
 * @param {string} dateStr - ISO date string or YYYY-MM-DD
 * @returns {string} e.g. "12 September 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'd MMMM yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Format a date string for short display
 * @param {string} dateStr
 * @returns {string} e.g. "12 Sep 2026"
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'd MMM yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Format a time string (HH:mm:ss or HH:mm) to display format
 * @param {string} timeStr
 * @returns {string} e.g. "14:30"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
}

/**
 * Format a timestamp to Jakarta time string
 * @param {string} timestamp - ISO timestamp
 * @returns {string} e.g. "14:32"
 */
export function formatTimestampToJakarta(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  } catch {
    return '';
  }
}

/**
 * Format a full timestamp to Jakarta date and time
 * @param {string} timestamp - ISO timestamp
 * @returns {{ date: string, time: string }}
 */
export function formatTimestampFull(timestamp) {
  if (!timestamp) return { date: '', time: '' };
  try {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      }),
    };
  } catch {
    return { date: '', time: '' };
  }
}

/**
 * Get today's date in YYYY-MM-DD format (Jakarta timezone)
 * @returns {string}
 */
export function getTodayDateString() {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta',
  });
}

/**
 * Format a date for file export naming
 * @param {string} dateStr
 * @returns {string} e.g. "2026-09-12"
 */
export function formatDateForFilename(dateStr) {
  if (!dateStr) {
    return getTodayDateString();
  }
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'yyyy-MM-dd');
  } catch {
    return getTodayDateString();
  }
}
