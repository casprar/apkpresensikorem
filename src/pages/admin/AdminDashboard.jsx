import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/attendanceService';
import { getActiveSession, getSessions } from '../../services/sessionService';
import { CLASS_OPTIONS } from '../../constants/classOptions';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/date';
import StatCard from '../../components/ui/StatCard';
import StatusIndicator from '../../components/ui/StatusIndicator';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Users, UserCheck, UserX, CalendarDays, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchStats(selectedSessionId === 'all' ? null : selectedSessionId);
    }
  }, [selectedSessionId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [session, sessionsList] = await Promise.all([
        getActiveSession(),
        getSessions()
      ]);
      
      setActiveSession(session);
      setSessions(sessionsList || []);
      
      if (session) {
        setSelectedSessionId(session.id);
      } else {
        fetchStats(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchStats = async (sessionId) => {
    try {
      setLoading(true);
      const data = await getDashboardStats(sessionId);
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', color: 'var(--error)' }}>
        Error: {error}
      </div>
    );
  }

  const gradeColors = {
    'Kelas 7': 'var(--korem-magenta, #D946EF)',
    'Kelas 8': 'var(--korem-purple, #A855F7)',
    'Kelas 9': 'var(--korem-orange, #F97316)',
    'Kelas 10': 'var(--korem-teal, #14B8A6)',
    'Kelas 11': 'var(--korem-blue, #3B82F6)',
    'Kelas 12': 'var(--korem-green, #22C55E)',
    'Grade 7': 'var(--korem-magenta, #D946EF)',
    'Grade 8': 'var(--korem-purple, #A855F7)',
    'Grade 9': 'var(--korem-orange, #F97316)',
    'Grade 10': 'var(--korem-teal, #14B8A6)',
    'Grade 11': 'var(--korem-blue, #3B82F6)',
    'Grade 12': 'var(--korem-green, #22C55E)',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ margin: 0, color: 'var(--text-main)', fontSize: '24px', fontWeight: 'bold' }}>{t('dashboard')}</h1>
        
        <select 
          value={selectedSessionId} 
          onChange={(e) => setSelectedSessionId(e.target.value)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-main)'
          }}
        >
          <option value="all">All Time</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>{s.name} - {formatDate(s.date)}</option>
          ))}
        </select>
      </div>

      {activeSession && selectedSessionId === activeSession.id && (
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '18px' }}>{t('activeSession')}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{activeSession.name}</span>
              <span>•</span>
              <span>{formatDate(activeSession.date)}</span>
            </div>
          </div>
          <StatusIndicator status="OPEN" />
        </div>
      )}

      {stats ? (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px',
            marginBottom: '32px'
          }}>
            <StatCard 
              title={t('totalAttendance')} 
              value={stats.totalAttendance || 0} 
              icon={<Users size={24} />} 
              color="var(--primary)" 
            />
            <StatCard 
              title={t('maleCount')} 
              value={stats.maleCount || 0} 
              icon={<UserCheck size={24} />} 
              color="var(--korem-blue, #3B82F6)" 
            />
            <StatCard 
              title={t('femaleCount')} 
              value={stats.femaleCount || 0} 
              icon={<UserX size={24} />} 
              color="var(--korem-magenta, #D946EF)" 
            />
            <StatCard 
              title={t('totalSessions')} 
              value={stats.totalSessions || 0} 
              icon={<CalendarDays size={24} />} 
              color="var(--korem-teal, #14B8A6)" 
            />
          </div>

          <div style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderRadius: '12px', 
            padding: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} />
              {t('classBreakdown')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {CLASS_OPTIONS.map(grade => {
                const count = stats.classBreakdown?.[grade] || stats.gradeBreakdown?.[grade] || 0;
                const breakdownObj = stats.classBreakdown || stats.gradeBreakdown || {};
                const maxCount = Math.max(...Object.values(breakdownObj), 1);
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '80px', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>
                      {t(grade) || grade}
                    </div>
                    <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: gradeColors[grade] || 'var(--primary)', 
                        height: '100%',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ width: '40px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          No data available for the selected period.
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
