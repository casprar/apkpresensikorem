import { supabase } from '../lib/supabase';

// Get a session publicly for attendance checking
export async function getSessionForAttendance(sessionId) {
  const { data, error } = await supabase.rpc('get_session_for_attendance', {
    p_session_id: sessionId
  });
  if (error) throw error;
  // RPC RETURNS TABLE gives an array; normalize to a single object with simple keys
  if (!data || (Array.isArray(data) && data.length === 0)) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    name: row.session_name,
    date: row.session_date,
    start_time: row.session_start_time,
    end_time: row.session_end_time,
    status: row.session_status,
  };
}

// Get all sessions with attendance count (admin only)
export async function getSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, attendance(count)')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

// Get single session (admin only)
export async function getSession(sessionId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  if (error) throw error;
  return data;
}

// Create new session (admin only)
export async function createSession({ name, date, startTime, endTime }) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const payload = {
    name: name.trim(),
    date: date,
    status: 'OPEN'
  };

  if (startTime && startTime.trim() !== '') {
    payload.start_time = startTime;
  }
  if (endTime && endTime.trim() !== '') {
    payload.end_time = endTime;
  }
  if (session?.user?.id) {
    payload.created_by = session.user.id;
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert([payload])
    .select();

  if (error) {
    console.error('Supabase createSession error:', error);
    throw new Error(error.message || error.details || 'Database insert failed');
  }
  
  return Array.isArray(data) ? data[0] : data;
}

// Close session (admin only)
export async function closeSession(sessionId) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ status: 'CLOSED' })
    .eq('id', sessionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete session (admin only)
export async function deleteSession(sessionId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);
  if (error) throw error;
}

// Get latest OPEN session (admin only)
export async function getActiveSession() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'OPEN')
    .order('date', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
  return data || null;
}
