import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions, createSession, closeSession, deleteSession } from '../../services/sessionService';
import { formatDate, formatTime, getTodayDateString } from '../../utils/date';
import StatusIndicator from '../../components/ui/StatusIndicator';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { Plus, QrCode, Eye, XCircle, CalendarDays, Trash2 } from 'lucide-react';

const AdminSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [sessionToClose, setSessionToClose] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    date: getTodayDateString(),
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const openCreateModal = () => {
    setModalError('');
    setFormData({ name: '', date: getTodayDateString(), startTime: '', endTime: '' });
    setIsCreateModalOpen(true);
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!formData.name || !formData.date) {
      setModalError('Please fill in Session Name and Date.');
      return;
    }

    setSubmitting(true);
    try {
      await createSession(formData);
      setIsCreateModalOpen(false);
      setFormData({ name: '', date: getTodayDateString(), startTime: '', endTime: '' });
      await fetchSessions();
    } catch (err) {
      console.error('Create session error:', err);
      setModalError(err.message || err.details || 'Failed to create session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSession = async () => {
    if (!sessionToClose) return;
    try {
      await closeSession(sessionToClose.id);
      setIsCloseModalOpen(false);
      setSessionToClose(null);
      fetchSessions();
    } catch (err) {
      alert('Failed to close session: ' + err.message);
    }
  };

  const confirmClose = (session) => {
    setSessionToClose(session);
    setIsCloseModalOpen(true);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><LoadingSpinner size="lg" /></div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ margin: 0, color: 'var(--text-main)', fontSize: '24px', fontWeight: 'bold' }}>Sessions</h1>
        <Button onClick={openCreateModal} icon={<Plus size={18} />}>
          Create Session
        </Button>
      </div>

      {error && <div style={{ padding: '16px', backgroundColor: 'var(--error-light)', color: 'var(--error)', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

      {sessions.length === 0 ? (
        <EmptyState icon={<CalendarDays size={48} />} title="No Sessions Found" description="Create a new session to start taking attendance." />
      ) : (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr' }}>
          {sessions.map(session => (
            <div key={session.id} style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderRadius: '12px', 
              padding: '24px', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)' }}>{session.name}</h3>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '14px', flexWrap: 'wrap' }}>
                  <span>{formatDate(session.date)}</span>
                  <span>{session.startTime && formatTime(session.startTime)} - {session.endTime && formatTime(session.endTime) || 'N/A'}</span>
                  <span style={{ fontWeight: '500', color: 'var(--primary)' }}>{session.attendanceCount || 0} attendees</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <StatusIndicator status={session.status} />
                <Button variant="outline" size="sm" icon={<Eye size={16} />} onClick={() => navigate(`/admin/sessions/${session.id}`)}>
                  View
                </Button>
                <Button variant="outline" size="sm" icon={<QrCode size={16} />} onClick={() => navigate(`/admin/qr?sessionId=${session.id}`)}>
                  QR Code
                </Button>
                {session.status === 'OPEN' && (
                  <Button variant="danger" size="sm" icon={<XCircle size={16} />} onClick={() => confirmClose(session)}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <Modal isOpen={true} title="Create New Session" onClose={() => setIsCreateModalOpen(false)}>
          <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {modalError && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {modalError}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }} htmlFor="session-name">Session Name</label>
              <input 
                id="session-name"
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                placeholder="e.g. Youth Service Week 1"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }} htmlFor="session-date">Date</label>
              <input 
                id="session-date"
                type="date" 
                required 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }} htmlFor="session-start-time">Start Time</label>
                <input 
                  id="session-start-time"
                  type="time" 
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }} htmlFor="session-end-time">End Time (Optional)</label>
                <input 
                  id="session-end-time"
                  type="time" 
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={submitting}>Create Session</Button>
            </div>
          </form>
        </Modal>
      )}

      {isCloseModalOpen && (
        <Modal title="Close Session" onClose={() => setIsCloseModalOpen(false)}>
          <div style={{ marginBottom: '24px' }}>
            Are you sure you want to close the session <strong>{sessionToClose?.name}</strong>? 
            Once closed, no more attendance can be recorded for this session.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleCloseSession}>Yes, Close Session</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSessions;
