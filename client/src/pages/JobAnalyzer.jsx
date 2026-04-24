import { useState } from 'react';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import Toast, { useToast } from '../components/Toast';

const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveForm, setSaveForm] = useState({ company: '', role: '' });
  const [saved, setSaved] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    setError('');
    setResults(null);
    setLoading(true);
    setSaved(false);
    try {
      const { data } = await API.post('/jobs/analyze', { jobDescription });
      setResults(data);
      addToast('Analysis complete!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!saveForm.company.trim() || !saveForm.role.trim()) {
      return setError('Company and role are required to save');
    }
    setSaving(true);
    setError('');
    try {
      await API.post('/jobs', {
        company: saveForm.company,
        role: saveForm.role,
        jobDescription,
        keywords: results?.atsKeywords || [],
        questions: results?.interviewQuestions || [],
      });
      setSaved(true);
      setSaveForm({ company: '', role: '' });
      addToast('Analysis saved to Dashboard!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Job Analyzer</h1>
        <p className="page-subtitle">Paste a job description to get ATS keywords, interview questions, and fit insights</p>
      </div>

      {/* Input Section */}
      <form onSubmit={handleAnalyze} className="glass-card animate-slide-up" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="jd-input">Job Description</label>
          <textarea
            className="form-textarea"
            id="jd-input"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows="6"
            style={{ minHeight: '160px' }}
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !jobDescription.trim()}
          id="btn-analyze"
          style={{ marginTop: '1.25rem', width: '100%' }}
        >
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 50 50" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray="80, 200" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Analyze Job Description
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <Spinner size={48} />}

      {/* Results */}
      {results && !loading && (
        <div className="stagger-children" style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Fit Score */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Fit Score
            </div>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-glass)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="url(#scoreGradient)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(results.fitScore / 100) * 327} 327`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">{results.fitScore}%</span>
              </div>
            </div>
          </div>

          {/* ATS Keywords */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔑</span> ATS Keywords
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {results.atsKeywords.map((kw, i) => (
                <span key={i} style={{
                  padding: '0.3rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '9999px',
                }}>{kw}</span>
              ))}
            </div>
          </div>

          {/* Interview Questions */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>❓</span> Interview Questions
            </h3>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.interviewQuestions.map((q, i) => (
                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{q}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Suggestions */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span> Suggestions
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.suggestions.map((s, i) => (
                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Save to Tracker */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💾</span> Save to Job Tracker
            </h3>
            {saved ? (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.85rem' }}>
                ✅ Saved to your Dashboard — keywords and questions are stored!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" htmlFor="save-company">Company</label>
                  <input className="form-input" id="save-company" placeholder="Google" value={saveForm.company} onChange={(e) => setSaveForm({ ...saveForm, company: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" htmlFor="save-role">Role</label>
                  <input className="form-input" id="save-role" placeholder="SWE Intern" value={saveForm.role} onChange={(e) => setSaveForm({ ...saveForm, role: e.target.value })} />
                </div>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} id="btn-save-analysis" style={{ height: 'fit-content' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;
