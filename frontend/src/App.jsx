import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

function App() {
  const [employeeName, setEmployeeName] = useState('');
  const [hours, setHours] = useState('');
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const totalHours = useMemo(
    () => records.reduce((total, entry) => total + Number(entry.hours), 0),
    [records],
  );

  async function fetchRecords() {
    try {
      const response = await api.get('/timesheet');
      setRecords(response.data);
      setStatus('connected');
      setError('');
    } catch {
      setStatus('offline');
      setError('The API is unavailable. Start the backend and refresh this page.');
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  async function submitTimesheet(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/timesheet', { employeeName, hours });
      setEmployeeName('');
      setHours('');
      await fetchRecords();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save this timesheet. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Fieldwork home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>fieldwork</span>
        </a>
        <div className="topbar-right">
          <span className={`connection ${status}`}><i />{status === 'connected' ? 'API connected' : status === 'offline' ? 'API offline' : 'Connecting'}</span>
          <span className="avatar" aria-label="Team workspace">TW</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> TEAM OPERATIONS <span className="eyebrow-dot">·</span> WEEKLY HOURS</div>
        <h1>Good work<br /><em>deserves a record.</em></h1>
        <p className="hero-copy">A clear view of the hours that move your team forward.</p>
      </section>

      <section className="workspace" aria-label="Timesheet workspace">
        <div className="entry-panel">
          <div className="panel-heading">
            <div><div className="section-kicker">NEW ENTRY</div><h2>Log your hours</h2></div>
            <span className="step-number">01 <span>/ 02</span></span>
          </div>
          <form onSubmit={submitTimesheet}>
            <label htmlFor="employeeName">Employee name</label>
            <input
              id="employeeName"
              value={employeeName}
              onChange={(event) => setEmployeeName(event.target.value)}
              placeholder="e.g. Jordan Lee"
              autoComplete="name"
              required
            />
            <label htmlFor="hours">Hours worked</label>
            <div className="hours-field">
              <input
                id="hours"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                placeholder="0.0"
                required
              />
              <span>HRS</span>
            </div>
            <div className="form-note"><span className="note-icon">↳</span> One entry at a time. Keep it accurate.</div>
            <button className="submit-button" type="submit" disabled={saving || status !== 'connected'}>
              <span>{saving ? 'Saving entry…' : 'Submit timesheet'}</span><span className="button-arrow">↗</span>
            </button>
          </form>
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="privacy-note"><span className="lock-icon">⌑</span> Your team’s time, all in one place.</div>
        </div>

        <div className="records-panel">
          <div className="records-header">
            <div><div className="section-kicker">THE RUNNING LOG</div><h2>Recent entries<span className="entry-count">{String(records.length).padStart(2, '0')}</span></h2></div>
            <div className="total-hours"><span>TOTAL HOURS</span><strong>{totalHours.toFixed(1)}<small>h</small></strong></div>
          </div>
          <div className="records-table-head"><span>TEAM MEMBER</span><span>HOURS</span><span>SUBMITTED</span></div>
          <div className="records-list" aria-live="polite">
            {records.length === 0 ? (
              <div className="empty-state"><span className="empty-symbol">＋</span><strong>No entries yet</strong><span>Submit your first timesheet to get started.</span></div>
            ) : records.map((record) => (
              <article className="record-row" key={record.id}>
                <div className="member-cell"><span className="member-avatar">{record.employeeName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><strong>{record.employeeName}</strong></div>
                <span className="hours-cell">{Number(record.hours).toFixed(1)} <small>hrs</small></span>
                <span className="date-cell">{record.submittedAt ? new Date(record.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}</span>
              </article>
            ))}
          </div>
          <div className="records-footer"><span><span className="live-dot" /> LIVE RECORDS</span><span>{records.length} {records.length === 1 ? 'ENTRY' : 'ENTRIES'}</span></div>
        </div>
      </section>

      <footer className="page-footer"><span>FIELDWORK <span className="footer-separator">/</span> TEAM TIME, MADE CLEAR</span><span>BUILT FOR THE WORK THAT COUNTS <span className="footer-spark">✳</span></span></footer>
    </main>
  );
}

export default App;
