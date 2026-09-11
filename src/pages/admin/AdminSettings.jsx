import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import { LogOut, User, Info, Settings } from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const user = supabase.auth.user?.() || { email: 'admin@korem.com' }; // Use proper auth state if available in app

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ margin: '0 0 24px 0', color: 'var(--text-main)', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={28} />
        Settings
      </h1>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Account Section */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '12px', 
          padding: '24px', 
          border: '1px solid var(--border-color)' 
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} />
            Admin Account
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Email</label>
              <div style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '500' }}>{user.email || 'Admin Email'}</div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Role</label>
              <div style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '500' }}>Administrator</div>
            </div>
          </div>

          <Button variant="danger" icon={<LogOut size={18} />} onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* App Info Section */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '12px', 
          padding: '24px', 
          border: '1px solid var(--border-color)' 
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={20} />
            Application Info
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Organization</label>
              <div style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '500' }}>KOREM GKI Pamulang</div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>System Name</label>
              <div style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '500' }}>Youth Attendance System</div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Version</label>
              <div style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '500' }}>1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
