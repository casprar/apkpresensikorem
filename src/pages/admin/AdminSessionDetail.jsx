import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, closeSession, deleteSession } from '../../services/sessionService';
import { getAttendance } from '../../services/attendanceService';
import { formatDate, formatTime } from '../../utils/date';
import { useLanguage } from '../../context/LanguageContext';
import StatusIndicator from '../../components/ui/StatusIndicator';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { QrCode, XCircle, ArrowLeft, Users, Trash2 } from 'lucide-react';

const AdminSessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [session, setSession] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const sessionData = await getSession(sessionId);
      if (!sessionData) throw new Error('Session not found');
      setSession(sessionData);

      const attendanceResult = await getAttendance({ sessionId });
      setAttendees(Array.isArray(attendanceResult?.data) ? attendanceResult.data : []);
    } catch (err) {
      console.error('Fetch session details error:', err);
      setError(err.message || 'Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    try {
      await closeSession(sessionId);
      setIsCloseModalOpen(false);
      fetchSessionDetails();
    } catch (err) {
      alert('Failed to close session: ' + err.message);
    }
  };

  const handleDeleteSession = async () => {
    setDeleting(true);
    try {
      await deleteSession(sessionId);
      setIsDeleteModalOpen(false);
      navigate('/admin/sessions');
    } catch (err) {
      alert('Failed to delete session: ' + (err.message || 'An error occurred'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><LoadingSpinner size="lg" /></div>;
  if (error) return <div style={{ padding: '24px', color: 'var(--error)' }}>Error: {error}</div>;
  if (!session) return <div style={{ padding: '24px' }}>Session not found.</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Button variant="outline" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/sessions')} style={{ marginBottom: '24px' }}>
        Back to Sessions
      </Button>

      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: 'var(--text-main)' }}>{session.name}</h1>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span>{formatDate(session.date)}</span>
              <span>{session.startTime && formatTime(session.startTime)} - {session.endTime && formatTime(session.endTime) || 'N/A'}</span>
            </div>
            <StatusIndicator status={session.status} />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="outline" icon={<QrCode size={18} />} onClick={() => navigate(`/admin/qr?sessionId=${session.id}`)}>
              {t('qrCode')}
            </Button>
            {session.status === 'OPEN' && (
              <Button variant="danger" icon={<XCircle size={18} />} onClick={() => setIsCloseModalOpen(true)}>
                {t('closeSession')}
              </Button>
            )}
            <Button 
              variant="danger" 
              icon={<Trash2 size={18} />} 
              onClick={() => setIsDeleteModalOpen(true)}
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              {t('deleteSession')}
            </Button>
          </div>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          {(() => {
            const safeAttendees = Array.isArray(attendees) ? attendees : [];
            return (
              <>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} />
                  Attendees ({safeAttendees.length})
                </h2>

                {safeAttendees.length === 0 ? (
                  <EmptyState title="No Attendees Yet" description="No one has checked in to this session yet." />
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '600' }}>Name</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '600' }}>{t('classLabel')}</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '600' }}>{t('genderLabel')}</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '600' }}>Check-in Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeAttendees.map(attendee => (
                          <tr key={attendee.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text-main)', fontWeight: '500' }}>{attendee.name || attendee.youth_profiles?.full_name || 'Unknown'}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-main)' }}>{t(attendee.class_name) || attendee.class_name || attendee.youth_profiles?.class_grade || 'Unknown'}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-main)' }}>{attendee.gender === 'MALE' ? t('male') : attendee.gender === 'FEMALE' ? t('female') : 'Unknown'}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-main)' }}>{formatDate(attendee.created_at || attendee.check_in_time, true)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Close Session Modal */}
      {isCloseModalOpen && (
        <Modal title={t('closeSession')} onClose={() => setIsCloseModalOpen(false)}>
          <div style={{ marginBottom: '24px' }}>
            Are you sure you want to close this session? Once closed, no more attendance can be recorded.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleCloseSession}>{t('closeSession')}</Button>
          </div>
        </Modal>
      )}

      {/* Delete Session Modal */}
      {isDeleteModalOpen && (
        <Modal title={t('deleteSession')} onClose={() => setIsDeleteModalOpen(false)}>
          <div style={{ marginBottom: '24px', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '15px' }}>
              {t('deleteSessionConfirm')}
            </p>
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#DC2626', fontWeight: '500', fontSize: '14px' }}>
              Session to delete: <strong>{session?.name}</strong> ({formatDate(session?.date)})
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>{t('cancel')}</Button>
            <Button variant="danger" onClick={handleDeleteSession} loading={deleting}>{t('deleteSession')}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSessionDetail;
