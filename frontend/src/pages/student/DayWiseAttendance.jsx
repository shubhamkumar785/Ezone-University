import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { studentDashboardService } from '../../services/studentDashboardService';
import { toast } from 'react-toastify';

// ── Attendance status configuration ──────────────────────────────────────────
const STATUS_CONFIG = {
  PRESENT:    { label: 'P',   bg: '#D1FAE5', text: '#059669', border: '#6EE7B7', title: 'Present' },
  ABSENT:     { label: 'A',   bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5', title: 'Absent' },
  EVENT:      { label: 'EL',  bg: '#FEF3C7', text: '#D97706', border: '#FCD34D', title: 'Event Leave' },
  MEDICAL:    { label: 'ML',  bg: '#DBEAFE', text: '#2563EB', border: '#93C5FD', title: 'Medical Leave' },
  HOLIDAY:    { label: 'H',   bg: '#FED7AA', text: '#EA580C', border: '#FDBA74', title: 'Holiday' },
  NO_CLASS:   { label: 'NCS', bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB', title: 'No Class Scheduled' },
  NOT_MARKED: { label: 'NM',  bg: '#E5E7EB', text: '#374151', border: '#9CA3AF', title: 'Not Yet Marked' },
};

// ── Helper: Generate months in term range ────────────────────────────────────
const getMonthsInRange = (startDate, endDate) => {
  const months = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    months.push({ month: current.getMonth() + 1, year: current.getFullYear(), label: `${monthNames[current.getMonth()]} ${current.getFullYear()}` });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
};

// ── Skeleton shimmer ─────────────────────────────────────────────────────────
const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '6px'
};

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.NOT_MARKED;
  return (
    <span
      title={cfg.title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '2px 7px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
        backgroundColor: cfg.bg, color: cfg.text,
        border: `1px solid ${cfg.border}`, minWidth: '32px',
        letterSpacing: '0.03em', whiteSpace: 'nowrap'
      }}
    >
      {cfg.label}
    </span>
  );
};

// ── CSV Export ───────────────────────────────────────────────────────────────
const exportCSV = (data) => {
  if (!data) return;
  const { student, term, month, periods, calendar, attendance } = data;

  const periodHeaders = periods.map(p => `${p.periodName} (${p.startTime}-${p.endTime})`);
  const header = ['Date', 'Day', ...periodHeaders];

  const rows = calendar.map(day => {
    const periodCells = periods.map(p => {
      if (day.isHoliday) return day.holidayName || 'HOLIDAY';
      const dayAttendance = attendance?.[day.date];
      if (!dayAttendance) return 'NCS';
      const status = dayAttendance[p.periodId];
      return STATUS_CONFIG[status]?.label || status || 'NM';
    });
    return [day.date, day.dayName, ...periodCells];
  });

  const info = [
    [`Student: ${student.fullName}`, `ID: ${student.studentId}`, `Dept: ${student.department}`, `Section: ${student.section}`].join(','),
    [`Term: ${term.termName} (${term.termCode})`, `Month: ${month.monthName} ${month.year}`].join(','),
    ''
  ];

  const csvContent = [
    ...info,
    header.join(','),
    ...rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DayWiseAttendance_${student.studentId}_${month.monthName}_${month.year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Main Component ────────────────────────────────────────────────────────────
const DayWiseAttendance = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [allTerms, setAllTerms] = useState([]);
  const [selectedTermCode, setSelectedTermCode] = useState(searchParams.get('term') || null);
  const [selectedMonth, setSelectedMonth] = useState(null); // { month, year }
  const [availableMonths, setAvailableMonths] = useState([]);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const sseRef = useRef(null);

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Phase 1: Load term info on mount ────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const [active, terms] = await Promise.all([
          studentDashboardService.getActiveTerm(),
          studentDashboardService.getAllTerms()
        ]);
        setAllTerms(terms || []);
        const termCode = selectedTermCode || active?.termCode;
        setActiveTerm(active);
        if (termCode) setSelectedTermCode(termCode);
      } catch (err) {
        console.error('Failed to load terms:', err);
        setError('Failed to load academic term information.');
        setLoading(false);
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Phase 2: When term selected, compute available months ────────────────────
  useEffect(() => {
    if (!selectedTermCode || !allTerms.length) return;
    const term = allTerms.find(t => t.termCode === selectedTermCode);
    if (!term) return;

    const months = getMonthsInRange(term.startDate, term.endDate);
    setAvailableMonths(months);

    // Default to current month if within term, otherwise first month
    const now = new Date();
    const currentMonthEntry = months.find(m => m.month === now.getMonth() + 1 && m.year === now.getFullYear());
    const defaultMonth = currentMonthEntry || months[0];
    if (defaultMonth) setSelectedMonth(defaultMonth);
  }, [selectedTermCode, allTerms]);

  // ── Phase 3: Fetch attendance when term+month are ready ──────────────────────
  const fetchAttendance = useCallback(async (termCode, month, year) => {
    if (!termCode || !month || !year) return;
    setLoading(true);
    setError(null);
    try {
      const result = await studentDashboardService.getDayWiseAttendance(termCode, month, year);
      setData(result);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }
      if (status === 403) {
        toast.error('You are not authorized to view this attendance.');
        navigate('/student/attendance');
        return;
      }
      const msg = err.response?.data?.message || 'Failed to load day-wise attendance.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedTermCode && selectedMonth) {
      fetchAttendance(selectedTermCode, selectedMonth.month, selectedMonth.year);
    }
  }, [selectedTermCode, selectedMonth, fetchAttendance]);

  // ── SSE: Real-time attendance updates ────────────────────────────────────────
  useEffect(() => {
    if (!selectedTermCode) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    // Attempt SSE connection for real-time updates from teacher
    try {
      const es = new EventSource(
        `http://localhost:8082/api/student/attendance/stream/${selectedTermCode}?token=${token}`
      );
      es.onmessage = () => {
        if (selectedMonth) fetchAttendance(selectedTermCode, selectedMonth.month, selectedMonth.year);
      };
      es.onerror = () => es.close(); // Gracefully close on error — fallback via visibilitychange
      sseRef.current = es;
    } catch (_) { /* SSE not supported or unavailable — fallback handles it */ }

    // Fallback: refresh when tab becomes active
    const onVisible = () => {
      if (document.visibilityState === 'visible' && selectedMonth) {
        fetchAttendance(selectedTermCode, selectedMonth.month, selectedMonth.year);
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      sseRef.current?.close();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [selectedTermCode, selectedMonth, fetchAttendance]);

  // ── Render helpers ───────────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <div style={{ padding: '24px' }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      {/* Summary skeleton */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ ...shimmerStyle, width: '140px', height: '76px' }} />
        ))}
      </div>
      {/* Table skeleton */}
      <div style={{ ...shimmerStyle, height: '32px', marginBottom: '2px', borderRadius: '8px 8px 0 0' }} />
      {[1,2,3,4,5,6,7,8].map(i => (
        <div key={i} style={{ ...shimmerStyle, height: '44px', marginBottom: '2px' }} />
      ))}
    </div>
  );

  const lockBadge = (status) => {
    const map = { SUBMITTED: ['#EFF6FF','#2563EB','Submitted'], VERIFIED: ['#ECFDF5','#059669','Verified'], LOCKED: ['#FFF7ED','#EA580C','🔒 Locked'] };
    const [bg, clr, lbl] = map[status] || ['#F3F4F6','#6B7280', status];
    return <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, backgroundColor: bg, color: clr }}>{lbl}</span>;
  };

  const selectedTermInfo = data?.term || allTerms.find(t => t.termCode === selectedTermCode);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .dw-fade { animation: fadeIn 0.3s ease; }
        .dw-sticky-table { overflow-x: auto; overflow-y: auto; max-height: calc(100vh - 280px); border-radius: 12px; }
        .dw-sticky-table table { border-collapse: separate; border-spacing: 0; min-width: 100%; }
        .dw-sticky-table th { position: sticky; top: 0; z-index: 10; }
        .dw-sticky-table td:nth-child(1),.dw-sticky-table th:nth-child(1) { position: sticky; left: 0; z-index: 11; }
        .dw-sticky-table td:nth-child(2),.dw-sticky-table th:nth-child(2) { position: sticky; left: 48px; z-index: 11; }
        .dw-sticky-table td:nth-child(3),.dw-sticky-table th:nth-child(3) { position: sticky; left: 126px; z-index: 11; }
        .dw-row:hover td { background-color: #EEF2FF !important; }
        .dw-export-btn:hover { background-color: #2563EB !important; color: #fff !important; }
        .dw-month-select { border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 6px 12px; font-size: 13px; cursor: pointer; background: white; outline: none; transition: border-color 0.2s; color: #374151; }
        .dw-month-select:focus { border-color: #4F7CFE; box-shadow: 0 0 0 3px rgba(79,124,254,0.15); }
      `}</style>

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
        padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px',
        position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 1px 8px rgba(0,0,0,0.07)'
      }}>
        <button
          onClick={() => navigate('/student/attendance')}
          style={{
            background: 'none', border: '1.5px solid #CBD5E1', cursor: 'pointer',
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
            color: '#374151', fontSize: '13px', fontWeight: 500, borderRadius: '8px',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.borderColor = '#94A3B8'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
        >
          ← Back
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#1E293B', margin: 0, letterSpacing: '-0.01em' }}>
            📅 Day Wise Attendance
          </h1>
          {data?.student && (
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {data.student.fullName} · {data.student.department} · Section {data.student.section} · {data.student.semester}
            </p>
          )}
        </div>

        {/* Month selector */}
        {availableMonths.length > 0 && (
          <select
            className="dw-month-select"
            value={selectedMonth ? `${selectedMonth.month}_${selectedMonth.year}` : ''}
            onChange={e => {
              const [m, y] = e.target.value.split('_').map(Number);
              setSelectedMonth({ month: m, year: y });
            }}
          >
            {availableMonths.map(m => (
              <option key={`${m.month}_${m.year}`} value={`${m.month}_${m.year}`}>{m.label}</option>
            ))}
          </select>
        )}

        {/* Export dropdown */}
        <div ref={exportRef} style={{ position: 'relative' }}>
          <button
            className="dw-export-btn"
            onClick={() => setExportOpen(o => !o)}
            disabled={!data || loading}
            style={{
              padding: '7px 14px', fontSize: '13px', fontWeight: 600,
              backgroundColor: '#EFF6FF', color: '#2563EB',
              border: '1.5px solid #BFDBFE', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s', opacity: (!data || loading) ? 0.5 : 1
            }}
          >
            ⬇ Export ▾
          </button>
          {exportOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)', backgroundColor: '#fff',
              border: '1px solid #E2E8F0', borderRadius: '10px', padding: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 300, minWidth: '160px'
            }}>
              {[
                { icon: '📊', label: 'CSV', action: () => { exportCSV(data); setExportOpen(false); toast.success('CSV exported!'); } },
                { icon: '📄', label: 'PDF (Coming Soon)', action: () => { toast.info('PDF export coming in next release'); setExportOpen(false); } },
                { icon: '📋', label: 'Excel (Coming Soon)', action: () => { toast.info('Excel export coming in next release'); setExportOpen(false); } },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={opt.action}
                  style={{
                    width: '100%', padding: '9px 14px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: '#374151',
                    borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Controls Bar ─────────────────────────────────────────────────── */}
      {data && !loading && (
        <div style={{
          backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0',
          padding: '10px 24px', display: 'flex', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Term: <strong style={{ color: '#1E293B' }}>{data.term.termName} ({data.term.termCode})</strong>
          </span>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Period: <strong style={{ color: '#1E293B' }}>{data.term.startDate}</strong> — <strong style={{ color: '#1E293B' }}>{data.term.endDate}</strong>
          </span>
          {data.lockStatus && (
            <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Status: {lockBadge(data.lockStatus)}
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B' }}>
                <span style={{ padding: '1px 5px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                {cfg.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Error State ──────────────────────────────────────────────────── */}
      {error && !loading && (
        <div style={{ padding: '24px' }}>
          <div style={{
            backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px',
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#991B1B', fontSize: '14px' }}>Failed to load attendance</p>
              <p style={{ margin: '4px 0 12px', color: '#DC2626', fontSize: '13px' }}>{error}</p>
              <button
                onClick={() => selectedTermCode && selectedMonth && fetchAttendance(selectedTermCode, selectedMonth.month, selectedMonth.year)}
                style={{
                  padding: '7px 16px', backgroundColor: '#DC2626', color: '#fff', border: 'none',
                  borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading Skeleton ─────────────────────────────────────────────── */}
      {loading && renderSkeleton()}

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      {!loading && data && (
        <div className="dw-fade" style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {[
              { label: 'Total Classes', value: data.summary.totalDeliveredClasses, icon: '📚', color: '#4F7CFE', bg: '#EEF2FF' },
              { label: 'Present', value: data.summary.presentCount, icon: '✅', color: '#059669', bg: '#ECFDF5' },
              { label: 'Absent', value: data.summary.absentCount, icon: '❌', color: '#DC2626', bg: '#FEF2F2' },
              { label: 'Event Leave', value: data.summary.eventLeaveCount, icon: '🎓', color: '#D97706', bg: '#FFFBEB' },
              { label: 'Medical Leave', value: data.summary.medicalLeaveCount, icon: '🏥', color: '#2563EB', bg: '#EFF6FF' },
              {
                label: 'Attendance %',
                value: `${data.summary.attendancePercentage}%`,
                icon: data.summary.isEligible ? '🏆' : '⚠️',
                color: data.summary.isEligible ? '#059669' : '#DC2626',
                bg: data.summary.isEligible ? '#ECFDF5' : '#FEF2F2',
                extra: data.summary.isEligible ? 'Eligible' : 'Below 75%'
              }
            ].map((card, i) => (
              <div key={i} style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '14px 18px',
                border: `1px solid ${card.bg}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                minWidth: '120px', flex: '1 1 120px', maxWidth: '180px'
              }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{card.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px', fontWeight: 500 }}>{card.label}</div>
                {card.extra && <div style={{ fontSize: '10px', color: card.color, fontWeight: 600, marginTop: '2px' }}>{card.extra}</div>}
              </div>
            ))}
          </div>

          {/* ── Grid Table ───────────────────────────────────────────────── */}
          {data.periods.length === 0 ? (
            <div style={{
              backgroundColor: '#fff', borderRadius: '12px', padding: '48px 24px',
              textAlign: 'center', border: '1px solid #E2E8F0'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', margin: '0 0 8px' }}>No Timetable Found</h3>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                No active timetable periods have been configured for this term. Please contact the academic administration.
              </p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', overflow: 'hidden' }}>
              <div className="dw-sticky-table">
                <table>
                  <thead>
                    <tr>
                      {/* Sticky cols */}
                      <th style={{ backgroundColor: '#1E293B', color: '#F8FAFC', padding: '12px 10px', fontSize: '11px', fontWeight: 700, textAlign: 'center', width: '46px', borderRight: '1px solid #334155' }}>
                        Sr
                      </th>
                      <th style={{ backgroundColor: '#1E293B', color: '#F8FAFC', padding: '12px 14px', fontSize: '11px', fontWeight: 700, textAlign: 'left', width: '90px', borderRight: '1px solid #334155', whiteSpace: 'nowrap' }}>
                        Date
                      </th>
                      <th style={{ backgroundColor: '#1E293B', color: '#F8FAFC', padding: '12px 14px', fontSize: '11px', fontWeight: 700, textAlign: 'left', width: '96px', borderRight: '2px solid #4F7CFE' }}>
                        Day
                      </th>
                      {/* Period cols */}
                      {data.periods.map((p, i) => (
                        <th key={p.periodId} style={{
                          backgroundColor: '#1E293B', color: '#F8FAFC', padding: '10px 12px',
                          fontSize: '10px', fontWeight: 700, textAlign: 'center', minWidth: '80px',
                          borderRight: i < data.periods.length - 1 ? '1px solid #334155' : 'none',
                          letterSpacing: '0.02em'
                        }}>
                          <div>{p.periodName}</div>
                          <div style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 400, marginTop: '2px' }}>{p.startTime}–{p.endTime}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.calendar.map((day, idx) => {
                      const isHoliday = day.isHoliday;
                      const isWeekend = day.dayName === 'Sunday';
                      const dayAttendance = data.attendance?.[day.date];

                      const rowBg = isHoliday
                        ? '#FFF7ED'
                        : isWeekend
                        ? '#FAFAFA'
                        : idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

                      return (
                        <tr key={day.date} className="dw-row" style={{ transition: 'background 0.15s' }}>
                          {/* Sr No */}
                          <td style={{
                            backgroundColor: rowBg, padding: '10px 10px', textAlign: 'center',
                            fontSize: '11px', color: '#94A3B8', fontWeight: 600,
                            borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #F1F5F9'
                          }}>
                            {idx + 1}
                          </td>
                          {/* Date */}
                          <td style={{
                            backgroundColor: rowBg, padding: '10px 14px', whiteSpace: 'nowrap',
                            borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #F1F5F9'
                          }}>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: isHoliday ? '#EA580C' : '#1E293B', lineHeight: 1 }}>
                              {day.dayOfMonth}
                            </span>
                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '1px' }}>
                              {day.date?.slice(0, 7)}
                            </div>
                          </td>
                          {/* Day */}
                          <td style={{
                            backgroundColor: rowBg, padding: '10px 14px', whiteSpace: 'nowrap',
                            borderRight: '2px solid #E2E8F0', borderBottom: '1px solid #F1F5F9'
                          }}>
                            <span style={{
                              fontSize: '12px', fontWeight: 600,
                              color: isHoliday ? '#EA580C' : isWeekend ? '#6B7280' : '#334155'
                            }}>
                              {day.dayName}
                            </span>
                          </td>

                          {/* Holiday row spanning all periods */}
                          {isHoliday ? (
                            <td
                              colSpan={data.periods.length}
                              style={{
                                backgroundColor: '#FFF7ED', borderBottom: '1px solid #F1F5F9',
                                padding: '10px 18px', textAlign: 'left'
                              }}
                            >
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                  padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                  backgroundColor: '#FED7AA', color: '#EA580C', border: '1px solid #FDBA74'
                                }}>H</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#92400E' }}>
                                  {day.holidayName}
                                </span>
                                {day.calendarEventType && (
                                  <span style={{ fontSize: '10px', color: '#B45309', backgroundColor: '#FEF3C7', padding: '1px 7px', borderRadius: '8px' }}>
                                    {day.calendarEventType}
                                  </span>
                                )}
                              </span>
                            </td>
                          ) : (
                            data.periods.map((p, pi) => {
                              const status = isWeekend ? 'NO_CLASS' : (dayAttendance ? (dayAttendance[p.periodId] || 'NOT_MARKED') : 'NOT_MARKED');
                              return (
                                <td key={p.periodId} style={{
                                  backgroundColor: rowBg, padding: '8px 12px', textAlign: 'center',
                                  borderRight: pi < data.periods.length - 1 ? '1px solid #F1F5F9' : 'none',
                                  borderBottom: '1px solid #F1F5F9'
                                }}>
                                  <StatusBadge status={status} />
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Empty State (no data, no error, not loading) ─────────────────── */}
      {!loading && !data && !error && (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', padding: '48px 24px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
              Select a Term & Month
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Choose an academic term and month to view day-wise attendance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayWiseAttendance;
