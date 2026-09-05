// src/repositories/MockAttendanceRepository.js
// Persistent local storage repository for attendance prototype (NO dummy data)

import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const SESSIONS_KEY = 'youth_attendance_sessions';
const RECORDS_KEY = 'youth_attendance_records';

// Initial default sessions (clean, no attendance records)
const defaultSessions = [
  {
    id: 'session-1',
    name: 'Youth Community Meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '20:30',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    closedAt: null,
  },
];

// Helper functions for localStorage
function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(defaultSessions));
      return defaultSessions;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultSessions;
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions to localStorage:', e);
  }
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    // Parse ISO dates back to Date objects
    return items.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (e) {
    return [];
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage:', e);
  }
}

const AttendanceRepository = {
  // Sessions
  getSession: (id) => {
    const sessions = loadSessions();
    return sessions.find((s) => s.id === id) || null;
  },

  listSessions: () => {
    return loadSessions();
  },

  createSession: (sessionObj) => {
    const sessions = loadSessions();
    const newSession = {
      id: uuidv4(),
      ...sessionObj,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      closedAt: null,
    };
    sessions.push(newSession);
    saveSessions(sessions);
    return newSession;
  },

  closeSession: (id) => {
    const sessions = loadSessions();
    const sess = sessions.find((s) => s.id === id);
    if (sess) {
      sess.status = 'CLOSED';
      sess.closedAt = new Date().toISOString();
      saveSessions(sessions);
    }
    return sess;
  },

  // Attendance Records (Real guest input only)
  addAttendance: ({ sessionId, name, className, gender }) => {
    const records = loadRecords();
    const dup = records.find(
      (r) => r.sessionId === sessionId && r.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (dup) {
      return { duplicate: true, record: dup };
    }

    const now = new Date();
    const rec = {
      id: uuidv4(),
      sessionId,
      name: name.trim(),
      class: className.trim(),
      gender,
      createdAt: now,
    };
    records.push(rec);
    saveRecords(records);
    return { duplicate: false, record: rec };
  },

  listAttendance: (filters = {}) => {
    let result = loadRecords();

    if (filters.sessionId) {
      result = result.filter((r) => r.sessionId === filters.sessionId);
    }
    if (filters.date) {
      const targetStr = format(new Date(filters.date), 'yyyy-MM-dd');
      result = result.filter((r) => format(r.createdAt, 'yyyy-MM-dd') === targetStr);
    }
    if (filters.class) {
      const classTerm = filters.class.toLowerCase();
      result = result.filter((r) => r.class.toLowerCase().includes(classTerm));
    }
    if (filters.gender) {
      result = result.filter((r) => r.gender === filters.gender);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(term) || r.class.toLowerCase().includes(term)
      );
    }

    // Default sort: newest first
    result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  },

  countToday: () => {
    const records = loadRecords();
    const today = format(new Date(), 'yyyy-MM-dd');
    return records.filter((r) => format(r.createdAt, 'yyyy-MM-dd') === today).length;
  },

  countByGender: (gender) => {
    const records = loadRecords();
    const today = format(new Date(), 'yyyy-MM-dd');
    return records.filter(
      (r) => format(r.createdAt, 'yyyy-MM-dd') === today && r.gender === gender
    ).length;
  },

  clearAllData: () => {
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
  },
};

export default AttendanceRepository;
