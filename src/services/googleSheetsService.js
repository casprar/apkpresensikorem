import { supabase } from '../lib/supabase';

/**
 * Sync attendance to Google Sheets via Supabase Edge Function.
 * This is a fire-and-forget call — if it fails, attendance is still safe in Supabase.
 *
 * @param {string} attendanceId - The UUID of the attendance record
 * @param {string} sessionId - The UUID of the session
 * @returns {Promise<{status: string}>}
 */
export async function syncToGoogleSheets(attendanceId, sessionId) {
  try {
    const { data, error } = await supabase.functions.invoke('sync-google-sheets', {
      body: {
        attendance_id: attendanceId,
        session_id: sessionId,
      },
    });

    if (error) {
      console.warn('Google Sheets sync failed (non-critical):', error.message);
      return { status: 'SYNC_ERROR' };
    }

    return data || { status: 'SYNC_NOT_CONFIGURED' };
  } catch (err) {
    // Non-critical — attendance is safely stored in Supabase
    console.warn('Google Sheets sync unavailable:', err.message);
    return { status: 'SYNC_ERROR' };
  }
}
