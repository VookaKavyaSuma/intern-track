import { useState, useEffect } from 'react';
import API from '../api/axios';
import SkeletonCard from '../components/SkeletonCard';

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
      } else {
        await API.post('/jobs', form);
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
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/jobs/${id}`, { status: newStatus });
      setJobs(jobs.map((j) => (j._id === id ? { ...j, status: newStatus } : j)));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Stats
  const stats = STATUS_OPTIONS.map((s) => ({
    label: s,
    count: jobs.filter((j) => j.status === s).length,
    badge: BADGE_MAP[s],
  }));

  return (
    <div className="page-container">
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

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }} className="stagger-children">
        {stats.map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.count}</div>
            <span className={`badge ${s.badge}`} style={{ marginTop: '0.5rem' }}>{s.label}</span>
          </div>
        ))}
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">{jobs.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>📋</span>
          <h3 style={{ marginTop: '1rem', fontWeight: 700 }}>No jobs tracked yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Click "Add Job" to start tracking your applications
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }} className="stagger-children">
          {jobs.map((job) => (
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
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(job)} title="Edit">✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)} title="Delete">🗑️</button>
                </div>
              </div>
              {/* Keywords */}
              {job.keywords?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {job.keywords.map((kw, i) => (
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
