import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSession, getSessions } from '../../services/sessionService';
import { formatDate, formatTime } from '../../utils/date';
import QRCode from 'qrcode';
// If koremLogo doesn't exist, we fallback
import { Download, Printer, QrCode as QrIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminQR = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSessionId = searchParams.get('sessionId');
  
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId || '');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState('');
  
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchSession(selectedSessionId);
      setSearchParams({ sessionId: selectedSessionId });
    } else {
      setSession(null);
      setQrUrl('');
    }
  }, [selectedSessionId, setSearchParams]);

  useEffect(() => {
    if (session && canvasRef.current) {
      generateQR();
    }
  }, [session]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data || []);
      if (!initialSessionId && data && data.length > 0) {
        // optionally auto select an OPEN session
        const openSession = data.find(s => s.status === 'OPEN');
        if (openSession) {
          setSelectedSessionId(openSession.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async (id) => {
    try {
      const data = await getSession(id);
      setSession(data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateQR = async () => {
    try {
      const attendanceUrl = `${window.location.origin}/attendance/session/${session.id}`;
      await QRCode.toCanvas(canvasRef.current, attendanceUrl, {
        width: 350,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      const dataUrl = await QRCode.toDataURL(attendanceUrl, { width: 500, margin: 2 });
      setQrUrl(dataUrl);
    } catch (err) {
      console.error('QR generation failed', err);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.download = `QR_${session.name.replace(/\s+/g, '_')}_${session.date}.png`;
    link.href = qrUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><LoadingSpinner size="lg" /></div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }} className="no-print">
        <h1 style={{ margin: 0, color: 'var(--text-main)', fontSize: '24px', fontWeight: 'bold' }}>Session QR Code</h1>
        
        <select 
          value={selectedSessionId} 
          onChange={(e) => setSelectedSessionId(e.target.value)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-main)',
            minWidth: '200px'
          }}
        >
          <option value="" disabled>Select a session</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>{s.name} - {formatDate(s.date)}</option>
          ))}
        </select>
      </div>

      {!selectedSessionId ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Please select a session to generate a QR code.
        </div>
      ) : session ? (
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '12px', 
          padding: '48px 24px', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }} className="qr-print-container">
          
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--text-main)' }}>{session.name}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '32px' }}>
            {formatDate(session.date)} • {session.startTime && formatTime(session.startTime)}
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '32px'
          }}>
            <canvas ref={canvasRef} style={{ display: 'block' }}></canvas>
          </div>
          
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '32px' }}>
            Scan to Record Attendance
          </p>

          <div style={{ display: 'flex', gap: '16px' }} className="no-print">
            <Button variant="outline" icon={<Download size={18} />} onClick={handleDownload}>
              Download PNG
            </Button>
            <Button icon={<Printer size={18} />} onClick={handlePrint}>
              Print QR
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--error)' }}>
          Session not found.
        </div>
      )}
    </div>
  );
};

export default AdminQR;
