import { useState, useEffect } from 'react';
import API from '../api/axios';
import SkeletonCard from '../components/SkeletonCard';
import Toast, { useToast } from '../components/Toast';

const STATUS_OPTIONS = ['Applied', 'Interviewing', 'Offered', 'Rejected'];
const BADGE_MAP = {
  Applied: 'badge-applied',
  Interviewing: 'badge-interviewing',
  Offered: 'badge-offered',
  Rejected: 'badge-rejected',
};

const emptyForm = { company: '', role: '', status: 'Applied', jobDescription: '' };

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/jobs');
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setForm({
      company: job.company,
      role: job.role,
      status: job.status,
      jobDescription: job.jobDescription || '',
    });
    setEditingId(job._id);
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/jobs/${editingId}`, form);
        addToast('Job updated successfully!', 'success');
      } else {
        await API.post('/jobs', form);
        addToast('Job added successfully!', 'success');
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job entry?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
      addToast('Job deleted', 'info');
      if (expandedJobId === id) setExpandedJobId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/jobs/${id}`, { status: newStatus });
      setJobs(jobs.map((j) => (j._id === id ? { ...j, status: newStatus } : j)));
      addToast(`Status changed to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const toggleFilter = (status) => {
    setActiveFilter((prev) => (prev === status ? null : status));
  };

  const toggleInsights = (jobId) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  // Stats
  const stats = STATUS_OPTIONS.map((s) => ({
    label: s,
    count: jobs.filter((j) => j.status === s).length,
    badge: BADGE_MAP[s],
  }));

  // Filtered jobs
  const filteredJobs = activeFilter
    ? jobs.filter((j) => j.status === activeFilter)
    : jobs;

  return (
    <div className="page-container">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track and manage your internship applications</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} id="btn-add-job">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Stats — Clickable Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }} className="stagger-children">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card"
            onClick={() => toggleFilter(s.label)}
            id={`filter-${s.label.toLowerCase()}`}
            style={{
              padding: '1.25rem',
              textAlign: 'center',
              cursor: 'pointer',
              borderColor: activeFilter === s.label ? 'var(--accent-primary)' : undefined,
              boxShadow: activeFilter === s.label ? '0 0 16px rgba(99, 102, 241, 0.25)' : undefined,
              transform: activeFilter === s.label ? 'translateY(-3px)' : undefined,
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.count}</div>
            <span className={`badge ${s.badge}`} style={{ marginTop: '0.5rem' }}>{s.label}</span>
            {activeFilter === s.label && (
              <div style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', marginTop: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ✓ Filtering
              </div>
            )}
          </div>
        ))}
        <div
          className="glass-card"
          onClick={() => setActiveFilter(null)}
          style={{
            padding: '1.25rem',
            textAlign: 'center',
            cursor: 'pointer',
            borderColor: activeFilter === null ? 'var(--accent-primary)' : undefined,
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">{jobs.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
        </div>
      </div>

      {/* Active filter indicator */}
      {activeFilter && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredJobs.length}</strong> {activeFilter.toLowerCase()} job{filteredJobs.length !== 1 ? 's' : ''}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveFilter(null)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          >
            Clear filter ✕
          </button>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>{activeFilter ? '🔍' : '📋'}</span>
          <h3 style={{ marginTop: '1rem', fontWeight: 700 }}>
            {activeFilter ? `No ${activeFilter.toLowerCase()} jobs` : 'No jobs tracked yet'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {activeFilter
              ? 'Try a different filter or add new jobs'
              : 'Click "Add Job" to start tracking your applications'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }} className="stagger-children">
          {filteredJobs.map((job) => (
            <div key={job._id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{job.role}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.15rem' }}>{job.company}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <select
                    className="form-select"
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    style={{ padding: '0.35rem 2rem 0.35rem 0.6rem', fontSize: '0.8rem', minWidth: 'auto' }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {/* View Insights button — shown if job has keywords or questions */}
                  {(job.keywords?.length > 0 || job.questions?.length > 0) && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleInsights(job._id)}
                      title="View Insights"
                      style={{
                        background: expandedJobId === job._id ? 'rgba(99, 102, 241, 0.15)' : undefined,
                        borderColor: expandedJobId === job._id ? 'rgba(99, 102, 241, 0.35)' : undefined,
                        color: expandedJobId === job._id ? '#a5b4fc' : undefined,
                      }}
                    >
                      {expandedJobId === job._id ? '🔽' : '💡'} Insights
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(job)} title="Edit">✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)} title="Delete">🗑️</button>
                </div>
              </div>

              {/* Keywords preview (always shown if present) */}
              {job.keywords?.length > 0 && expandedJobId !== job._id && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {job.keywords.slice(0, 5).map((kw, i) => (
                    <span key={i} style={{
                      padding: '0.15rem 0.6rem',
                      fontSize: '0.72rem',
                      background: 'rgba(20, 184, 166, 0.12)',
                      color: 'var(--accent-secondary)',
                      border: '1px solid rgba(20, 184, 166, 0.25)',
                      borderRadius: '9999px',
                      fontWeight: 500,
                    }}>{kw}</span>
                  ))}
                  {job.keywords.length > 5 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                      +{job.keywords.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Expanded Insights Panel */}
              {expandedJobId === job._id && (
                <div className="animate-slide-up" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  {/* ATS Keywords */}
                  {job.keywords?.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>🔑</span> ATS Keywords
                      </h4>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {job.keywords.map((kw, i) => (
                          <span key={i} style={{
                            padding: '0.2rem 0.7rem',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            background: 'rgba(99, 102, 241, 0.12)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: '9999px',
                          }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interview Questions */}
                  {job.questions?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>❓</span> Interview Questions
                      </h4>
                      <ol style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {job.questions.map((q, i) => (
                          <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                            <span style={{ color: 'var(--text-primary)' }}>{q}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Job Description snippet */}
                  {job.jobDescription && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>📄</span> Job Description
                      </h4>
                      <p style={{
                        fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                        maxHeight: '120px', overflow: 'auto',
                        padding: '0.5rem 0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                      }}>
                        {job.jobDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Added {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {editingId ? 'Edit Job' : 'Add New Job'}
            </h2>
            {error && (
              <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="job-company">Company</label>
                <input className="form-input" id="job-company" name="company" placeholder="Google" value={form.company} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-role">Role</label>
                <input className="form-input" id="job-role" name="role" placeholder="Software Engineer Intern" value={form.role} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-status">Status</label>
                <select className="form-select" id="job-status" name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="job-desc">Job Description (optional)</label>
                <textarea className="form-textarea" id="job-desc" name="jobDescription" placeholder="Paste the job description here..." value={form.jobDescription} onChange={handleChange} rows="3" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 1 }} id="btn-save-job">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Job'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)} style={{ flex: 0 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
