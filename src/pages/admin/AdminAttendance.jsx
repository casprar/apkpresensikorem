import React, { useState, useEffect, useCallback } from 'react';
import { getAttendance, getAttendanceForExport } from '../../services/attendanceService';
import { getSessions } from '../../services/sessionService';
import { exportToExcel, exportToCSV, formatAttendanceForExport } from '../../services/exportService';
import { CLASS_OPTIONS } from '../../constants/classOptions';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatTime, formatTimestampToJakarta, formatDateForFilename } from '../../utils/date';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { Download, FileSpreadsheet, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';

const AdminAttendance = () => {
  const { t } = useLanguage();
  const [attendance, setAttendance] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    sessionId: '',
    classGrade: '',
    gender: '',
    startDate: '',
    endDate: ''
  });

  // Pagination & Sort
  const [page, setPage] = useState(1);
  const limit = 20;
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters.search, filters.sessionId, filters.classGrade, filters.gender, filters.startDate, filters.endDate, page, sortField, sortOrder]);

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {
        sessionId: filters.sessionId,
        className: filters.classGrade,
        gender: filters.gender,
        dateFrom: filters.startDate,
        dateTo: filters.endDate,
        search: filters.search,
        page,
        pageSize: limit,
        sortBy: sortField,
        sortOrder
      };

      const result = await getAttendance(params);
      setAttendance(result?.data || []);
      setTotalRecords(result?.count || 0);
    } catch (err) {
      console.error('Fetch attendance error:', err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
    }
  };

  const handleExportExcel = async () => {
    try {
      const dataToExport = await getAttendanceForExport(filters);
      if (!dataToExport || dataToExport.length === 0) {
        alert('No attendance records found to export. Please check in teenagers to a session first.');
        return;
      }
      const sessionName = filters.sessionId 
        ? sessions.find(s => s.id === filters.sessionId)?.name 
        : 'All_Sessions';
      exportToExcel(dataToExport, `Attendance_${sessionName}_${formatDateForFilename()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const dataToExport = await getAttendanceForExport(filters);
      if (!dataToExport || dataToExport.length === 0) {
        alert('No attendance records found to export. Please check in teenagers to a session first.');
        return;
      }
      const sessionName = filters.sessionId 
        ? sessions.find(s => s.id === filters.sessionId)?.name 
        : 'All_Sessions';
      exportToCSV(dataToExport, `Attendance_${sessionName}_${formatDateForFilename()}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data.');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={14} style={{ opacity: 0.5, marginLeft: '4px' }} />;
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} style={{ marginLeft: '4px' }} />
      : <ArrowDown size={14} style={{ marginLeft: '4px' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Export Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Attendance Records</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Manage and view youth community attendance</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" icon={FileSpreadsheet} onClick={handleExportCSV}>Export CSV</Button>
          <Button variant="primary" icon={Download} onClick={handleExportExcel}>Export Excel</Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            placeholder="Search by name..."
          />
          
          <select
            value={filters.sessionId}
            onChange={(e) => handleFilterChange('sessionId', e.target.value)}
            style={{ height: '44px', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0 12px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            <option value="">All Sessions</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({formatDate(s.date)})</option>
            ))}
          </select>

          <select
            value={filters.classGrade}
            onChange={(e) => handleFilterChange('classGrade', e.target.value)}
            style={{ height: '44px', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0 12px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            <option value="">{t('allClasses')}</option>
            {CLASS_OPTIONS.map(c => (
              <option key={c} value={c}>{t(c) || c}</option>
            ))}
          </select>

          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            style={{ height: '44px', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0 12px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" message="Loading attendance records..." />
        </div>
      ) : attendance.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Attendance Found"
          description="There are no attendance records matching your criteria."
        />
      ) : (
        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '20px' }}>
          {/* Desktop Table */}
          <div className="hide-mobile" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Name <SortIcon field="name" />
                  </th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('class_name')}>
                    Class <SortIcon field="class_name" />
                  </th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('gender')}>
                    Gender <SortIcon field="gender" />
                  </th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>Session</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                    Check-in Time <SortIcon field="created_at" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontWeight: '500' }}>{record.name}</td>
                    <td style={{ padding: '12px 16px' }}><Badge>{record.class_name}</Badge></td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{record.gender === 'MALE' ? 'Male' : 'Female'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{record.sessions?.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{formatDate(record.created_at, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="show-mobile" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
            {attendance.map(record => (
              <div key={record.id} style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{record.name}</h3>
                  <Badge>{record.class_name}</Badge>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Gender: {record.gender === 'MALE' ? 'Male' : 'Female'}</span>
                  <span>Session: {record.sessions?.name}</span>
                  <span>Time: {formatDate(record.created_at, true)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Showing {attendance.length} records
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} icon={<ChevronLeft size={16} />}>Prev</Button>
              <span style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>Page {page}</span>
              <Button variant="outline" size="sm" disabled={attendance.length < limit} onClick={() => setPage(p => p + 1)} style={{ flexDirection: 'row-reverse' }}>
                Next <ChevronRight size={16} style={{ marginLeft: '4px' }} />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminAttendance;
