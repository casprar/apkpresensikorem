import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RequireAuth from './routes/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-load pages for better performance
const AttendanceSession = lazy(() => import('./pages/attendance/AttendanceSession'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAttendance = lazy(() => import('./pages/admin/AdminAttendance'));
const AdminSessions = lazy(() => import('./pages/admin/AdminSessions'));
const AdminSessionDetail = lazy(() => import('./pages/admin/AdminSessionDetail'));
const AdminQR = lazy(() => import('./pages/admin/AdminQR'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing - redirect to admin */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Public attendance route */}
        <Route path="/attendance/session/:sessionId" element={<AttendanceSession />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="sessions/:sessionId" element={<AdminSessionDetail />} />
          <Route path="qr" element={<AdminQR />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
