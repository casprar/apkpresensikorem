import { supabase } from '../lib/supabase';
import { CLASS_OPTIONS } from '../constants/classOptions';

// Submit attendance via RPC (public - no auth needed)
// Calls the submit_attendance RPC function
export async function submitAttendance(sessionId, name, className, gender) {
  const { data, error } = await supabase.rpc('submit_attendance', {
    p_session_id: sessionId,
    p_name: name.trim(),
    p_class_name: className,
    p_gender: gender,
  });
  if (error) throw error;
  return data;
}

// Get attendance for a session (admin only)
export async function getAttendanceBySession(sessionId) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*, sessions(name, date)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Get all attendance with filters (admin only)
export async function getAttendance({ sessionId, className, gender, dateFrom, dateTo, search, sortBy, sortOrder, page, pageSize }) {
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => {
      console.warn('getAttendance timed out after 2.5s');
      resolve({ data: [], count: 0 });
    }, 2500)
  );

  const fetchPromise = (async () => {
    try {
      let query = supabase
        .from('attendance')
        .select('*, sessions(name, date)', { count: 'exact' });
      
      if (sessionId) query = query.eq('session_id', sessionId);
      if (className) query = query.eq('class_name', className);
      if (gender) query = query.eq('gender', gender);
      if (search) query = query.ilike('name', `%${search}%`);
      
      const validSortColumns = ['created_at', 'name', 'class_name', 'gender'];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
      const ascending = sortOrder === 'asc';
      query = query.order(sortColumn, { ascending });
      
      const size = pageSize || 25;
      const from = ((page || 1) - 1) * size;
      query = query.range(from, from + size - 1);
      
      const { data, error, count } = await query;
      if (error) {
        console.error('Supabase getAttendance query error:', error);
        const fallback = await supabase.from('attendance').select('*').order('created_at', { ascending: false });
        return { data: fallback.data || [], count: fallback.data?.length || 0 };
      }
      return { data: data || [], count: count || 0 };
    } catch (err) {
      console.error('getAttendance exception:', err);
      return { data: [], count: 0 };
    }
  })();

  return Promise.race([fetchPromise, timeoutPromise]);
}

// Get all attendance for export (admin only) - no pagination
export async function getAttendanceForExport({ sessionId, className, gender, dateFrom, dateTo, search }) {
  try {
    let query = supabase
      .from('attendance')
      .select('name, class_name, gender, created_at, sessions(name, date)');
    
    if (sessionId) query = query.eq('session_id', sessionId);
    if (className) query = query.eq('class_name', className);
    if (gender) query = query.eq('gender', gender);
    if (search) query = query.ilike('name', `%${search}%`);
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) {
      console.error('Supabase getAttendanceForExport query error:', error);
      const fallback = await supabase.from('attendance').select('*').order('created_at', { ascending: false });
      return fallback.data || [];
    }
    return data || [];
  } catch (err) {
    console.error('getAttendanceForExport exception:', err);
    return [];
  }
}

// Get dashboard stats (admin only)
export async function getDashboardStats(sessionId) {
  // Total count for a session
  let query = supabase.from('attendance').select('id, class_name, gender', { count: 'exact' });
  if (sessionId) query = query.eq('session_id', sessionId);
  
  const { data, error, count } = await query;
  if (error) throw error;
  
  const maleCount = data.filter(a => a.gender === 'MALE').length;
  const femaleCount = data.filter(a => a.gender === 'FEMALE').length;
  
  const classBreakdown = {};
  CLASS_OPTIONS.forEach(c => { classBreakdown[c] = 0; });
  
  data.forEach(a => {
    if (a.class_name) {
      const normalizedClass = a.class_name.replace(/^Grade\s+/i, 'Kelas ');
      if (classBreakdown.hasOwnProperty(normalizedClass)) {
        classBreakdown[normalizedClass]++;
      } else if (classBreakdown.hasOwnProperty(a.class_name)) {
        classBreakdown[a.class_name]++;
      }
    }
  });
  
  return {
    total: count || data.length,
    male: maleCount,
    female: femaleCount,
    classBreakdown,
  };
}

// Delete attendance record (admin only)
export async function deleteAttendance(id) {
  const { error } = await supabase.from('attendance').delete().eq('id', id);
  if (error) throw error;
}
