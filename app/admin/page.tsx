'use client';

import { FormEvent, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Database,
  Download,
  Eye,
  EyeOff,
  Filter,
  Globe2,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  Send,
  Trash2,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { Inquiry, InquiryStats, InquiryStatus } from '@/lib/types';
import './admin.css';

export default function AdminPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; provider: string; url?: string }>({
    configured: false,
    provider: 'local',
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats>({
    total: 0,
    new: 0,
    called: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [source, setSource] = useState<'supabase' | 'local'>('local');
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modal / Detail state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Check existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Set up periodic auto-refresh and window focus sync when authenticated
  useEffect(() => {
    if (!authenticated) return;

    const interval = setInterval(() => {
      loadInquiries(true); // silent refresh
    }, 8000);

    const handleFocus = () => {
      loadInquiries(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [authenticated]);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/me');
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        setAdminEmail(data.email || 'Admin');
        setDbStatus(data.dbStatus || { configured: false, provider: 'local' });
        await loadInquiries();
      } else {
        setAuthenticated(false);
        if (data.dbStatus) setDbStatus(data.dbStatus);
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setAuthenticated(false);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadInquiries = async (silent = false) => {
    if (!silent) setFetching(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
        setStats(data.stats);
        setSource(data.source);
        if (data.dbStatus) setDbStatus(data.dbStatus);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      if (!silent) setFetching(false);
    }
  };

  // 2. Handle Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }
      setAuthenticated(true);
      setAdminEmail(data.email);
      setLoginPassword('');
      await loadInquiries();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid credentials';
      setLoginError(errorMsg);
    } finally {
      setLoginLoading(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setAuthenticated(false);
      setInquiries([]);
    }
  };

  const computeStats = (list: Inquiry[]): InquiryStats => ({
    total: list.length,
    new: list.filter(i => i.status === 'new').length,
    called: list.filter(i => i.status === 'called').length,
    in_progress: list.filter(i => i.status === 'in_progress').length,
    completed: list.filter(i => i.status === 'completed').length,
    cancelled: list.filter(i => i.status === 'cancelled').length,
  });

  // 4. Update Inquiry Status with Immediate Optimistic UI Feedback
  const handleStatusUpdate = async (id: string, newStatus: InquiryStatus) => {
    // Optimistic UI update
    const previousInquiries = [...inquiries];
    const previousSelected = selectedInquiry;

    const updatedList = inquiries.map(item =>
      item.id === id ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
    );
    setInquiries(updatedList);
    setStats(computeStats(updatedList));

    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus, updated_at: new Date().toISOString() });
    }

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const { inquiry } = await res.json();
        if (inquiry) {
          setInquiries(prev => {
            const next = prev.map(item => (item.id === id ? inquiry : item));
            setStats(computeStats(next));
            return next;
          });
          if (selectedInquiry?.id === id) {
            setSelectedInquiry(inquiry);
          }
        }
      } else {
        console.error('Failed to persist status update to backend');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert if severe network failure occurs
      setInquiries(previousInquiries);
      setStats(computeStats(previousInquiries));
      setSelectedInquiry(previousSelected);
    }
  };

  // 5. Save Notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    setNotesSaved(false);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        const { inquiry } = await res.json();
        if (inquiry) {
          setInquiries(prev => prev.map(item => (item.id === inquiry.id ? inquiry : item)));
          setSelectedInquiry(inquiry);
        }
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // 6. Delete Inquiry
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) {
      return;
    }

    const previousInquiries = [...inquiries];
    const filtered = inquiries.filter(item => item.id !== id);
    setInquiries(filtered);
    setStats(computeStats(filtered));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        // revert on failure
        setInquiries(previousInquiries);
        setStats(computeStats(previousInquiries));
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      setInquiries(previousInquiries);
      setStats(computeStats(previousInquiries));
    } finally {
      setDeletingId(null);
    }
  };

  // 7. Export CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) return;

    const headers = [
      'ID',
      'Date Submitted',
      'Client Name',
      'Company',
      'Email',
      'Country',
      'Phone Number',
      'Full Phone',
      'Service',
      'Budget',
      'Status',
      'Message',
      'Internal Notes',
    ];

    const rows = inquiries.map(i => [
      i.id,
      new Date(i.created_at).toLocaleString(),
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      i.email,
      `"${(i.country || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.full_phone || '').replace(/"/g, '""')}"`,
      `"${(i.service || '').replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      i.status,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bydevs-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Detail Modal
  const openDetailModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
    setNotesSaved(false);
  };

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter(item => {
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            item.name.toLowerCase().includes(q) ||
            item.email.toLowerCase().includes(q) ||
            (item.company && item.company.toLowerCase().includes(q)) ||
            (item.phone && item.phone.toLowerCase().includes(q)) ||
            (item.full_phone && item.full_phone.toLowerCase().includes(q)) ||
            (item.country && item.country.toLowerCase().includes(q)) ||
            item.service.toLowerCase().includes(q) ||
            item.message.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [inquiries, statusFilter, searchQuery, sortOrder]);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getCleanPhoneForWhatsApp = (fullPhone: string) => {
    return fullPhone.replace(/[^0-9]/g, '');
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="admin-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: '#0d2238' }}>
          <div className="brand-mark" style={{ margin: '0 auto 16px', width: 48, height: 48, fontSize: 16 }}>
            <span className="brand-b">B</span>
            <span className="brand-y">Y</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: 14 }}>Connecting to BY Devs Portal...</p>
        </div>
      </div>
    );
  }

  // --- 1. UNAUTHENTICATED LOGIN VIEW ---
  if (!authenticated) {
    return (
      <div className="admin-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="login-card-header">
              <div className="brand-mark">
                <span className="brand-b">B</span>
                <span className="brand-y">Y</span>
              </div>
              <h1>Executive Portal</h1>
              <p>Sign in to view client inquiries, manage lead status, and track business pipeline records.</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {loginError && (
                <div className="form-error-banner" style={{ margin: 0 }}>
                  <AlertCircle size={15} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="login-field">
                <label>Admin Email</label>
                <div className="login-input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="admin@bydevs.com"
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Password</label>
                <div className="login-input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    className="pw-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loginLoading} className="login-submit-btn">
                {loginLoading ? 'Authenticating...' : 'Sign In to Admin Portal'} <ArrowRight size={15} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/" className="back-to-site-link">
                <ArrowLeft size={14} /> Back to BY Devs Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. AUTHENTICATED DASHBOARD VIEW ---
  return (
    <div className="admin-wrapper">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-nav-inner">
          <div className="admin-brand">
            <Link href="/" className="logo logo-light" style={{ textDecoration: 'none' }}>
              <span className="brand-mark" aria-hidden="true" style={{ width: 32, height: 32, fontSize: 11 }}>
                <span className="brand-b">B</span>
                <span className="brand-y">Y</span>
              </span>
              <span>
                BY <b>Devs</b>
              </span>
            </Link>
            <span className="admin-portal-badge">Admin Portal</span>
          </div>

          <div className="admin-nav-actions">
            {source === 'supabase' ? (
              <span className="db-status-pill supabase" title="Live connection to Supabase cloud database">
                <Database size={13} /> Supabase Live
              </span>
            ) : (
              <span
                className="db-status-pill local"
                title="Storing inquiries in data/inquiries.json. Add your Supabase credentials in .env to switch to Supabase cloud."
              >
                <Database size={13} /> Local File Store
              </span>
            )}

            <button
              onClick={() => loadInquiries()}
              disabled={fetching}
              className="admin-btn"
              title="Refresh Inquiries"
            >
              <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={inquiries.length === 0}
              className="admin-btn"
              title="Download CSV for spreadsheet"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <div
              style={{
                fontSize: 12,
                color: '#9cb5d0',
                padding: '4px 10px',
                borderLeft: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {adminEmail}
            </div>

            <button onClick={handleLogout} className="admin-btn danger" title="Sign Out">
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="admin-main">
        {/* Title & Pipeline Intro */}
        <div className="admin-header-row">
          <div>
            <h2>Client Inquiries & Pipeline</h2>
            <p>
              Review project specifications, country and phone records, and manage follow-up progress for all submissions.
            </p>
          </div>
          <Link href="/#contact" target="_blank" className="admin-btn" style={{ background: '#ffffff', color: '#0d2238' }}>
            <span>Test Contact Form</span> <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Stats Metrics Cards (Clickable filters) */}
        <div className="stats-grid">
          <div
            className={`stat-card ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            <div className="stat-header">
              <span>Total Queries</span>
              <span className="stat-dot dot-all" />
            </div>
            <div className="stat-value">{stats.total}</div>
          </div>

          <div
            className={`stat-card ${statusFilter === 'new' ? 'active' : ''}`}
            onClick={() => setStatusFilter('new')}
          >
            <div className="stat-header">
              <span>New / Unread</span>
              <span className="stat-dot dot-new" />
            </div>
            <div className="stat-value" style={{ color: '#0284c7' }}>
              {stats.new}
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === 'called' ? 'active' : ''}`}
            onClick={() => setStatusFilter('called')}
          >
            <div className="stat-header">
              <span>Called / Contacted</span>
              <span className="stat-dot dot-called" />
            </div>
            <div className="stat-value" style={{ color: '#7e22ce' }}>
              {stats.called}
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in_progress')}
          >
            <div className="stat-header">
              <span>In Progress</span>
              <span className="stat-dot dot-in_progress" />
            </div>
            <div className="stat-value" style={{ color: '#d97706' }}>
              {stats.in_progress}
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            <div className="stat-header">
              <span>Completed</span>
              <span className="stat-dot dot-completed" />
            </div>
            <div className="stat-value" style={{ color: '#059669' }}>
              {stats.completed}
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            <div className="stat-header">
              <span>Cancelled</span>
              <span className="stat-dot dot-cancelled" />
            </div>
            <div className="stat-value" style={{ color: '#dc2626' }}>
              {stats.cancelled}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="controls-bar">
          <div className="search-box">
            <Search size={15} color="#7c93ac" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, company, or message..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8aa2bd', padding: 2 }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-tabs">
            {(
              [
                { label: 'All', value: 'all', count: stats.total },
                { label: 'New', value: 'new', count: stats.new },
                { label: 'Called', value: 'called', count: stats.called },
                { label: 'In Progress', value: 'in_progress', count: stats.in_progress },
                { label: 'Completed', value: 'completed', count: stats.completed },
                { label: 'Cancelled', value: 'cancelled', count: stats.cancelled },
              ] as const
            ).map(tab => (
              <button
                key={tab.value}
                className={`filter-tab ${statusFilter === tab.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab.value)}
              >
                <span>{tab.label}</span>
                <span className="filter-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="inquiries-card">
          {filteredInquiries.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={36} />
              <h3>No inquiries found</h3>
              <p>
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search query or status filter.'
                  : 'Queries submitted via the website contact form will appear here instantly.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="inquiry-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Client / Company</th>
                    <th>Date Received</th>
                    <th>Country & Phone</th>
                    <th>Email</th>
                    <th>Service & Budget</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map(inquiry => {
                    const cleanPhone = getCleanPhoneForWhatsApp(inquiry.full_phone || inquiry.phone);
                    return (
                      <tr key={inquiry.id} className="inquiry-row">
                        {/* Status dropdown & badge */}
                        <td>
                          <select
                            className={`status-select status-${inquiry.status}`}
                            value={inquiry.status}
                            onChange={e => handleStatusUpdate(inquiry.id, e.target.value as InquiryStatus)}
                            title="Click to change status"
                          >
                            <option value="new">● New</option>
                            <option value="called">● Called</option>
                            <option value="in_progress">● In Progress</option>
                            <option value="completed">● Completed</option>
                            <option value="cancelled">● Cancelled</option>
                          </select>
                        </td>

                        {/* Client & Company */}
                        <td>
                          <div className="client-name-cell">
                            <strong>{inquiry.name}</strong>
                            <small>{inquiry.company ? inquiry.company : 'Individual / Private'}</small>
                          </div>
                        </td>

                        {/* Date */}
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#5b7593' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Clock size={13} />
                            <span>{formatDate(inquiry.created_at)}</span>
                          </div>
                        </td>

                        {/* Country & Phone */}
                        <td>
                          <div className="contact-cell">
                            <span style={{ fontSize: 11, color: '#6884a4', fontWeight: 600 }}>
                              {inquiry.country}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <a
                                href={`tel:${inquiry.full_phone}`}
                                className="contact-link phone"
                                title="Click to call"
                              >
                                <Phone size={13} />
                                {inquiry.full_phone}
                              </a>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Chat on WhatsApp"
                                  style={{ color: '#25d366' }}
                                >
                                  <Send size={13} />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td>
                          <a
                            href={`mailto:${inquiry.email}?subject=BY%20Devs%20-%20Project%20Inquiry%20Follow-up`}
                            className="contact-link"
                          >
                            <Mail size={13} />
                            {inquiry.email}
                          </a>
                        </td>

                        {/* Service & Budget */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <strong style={{ fontSize: 12, color: '#0d2238' }}>{inquiry.service}</strong>
                            <span style={{ fontSize: 11, color: '#748da9' }}>{inquiry.budget || 'Not specified'}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => openDetailModal(inquiry)}
                              className="icon-btn"
                              title="View full details and message"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              disabled={deletingId === inquiry.id}
                              className="icon-btn danger"
                              title="Delete inquiry"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- INQUIRY DETAILS & NOTES MODAL --- */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{selectedInquiry.name}</h3>
                <p>
                  {selectedInquiry.company ? `Company: ${selectedInquiry.company} • ` : ''}
                  Submitted on {formatDate(selectedInquiry.created_at)}
                </p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="modal-close-btn" aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="modal-actions-row">
              <a
                href={`mailto:${selectedInquiry.email}?subject=BY%20Devs%20-%20Regarding%20Your%20Project%20Inquiry`}
                className="modal-action-btn btn-email"
              >
                <Mail size={15} /> Email Client
              </a>
              <a href={`tel:${selectedInquiry.full_phone}`} className="modal-action-btn btn-call">
                <PhoneCall size={15} /> Call ({selectedInquiry.full_phone})
              </a>
              {selectedInquiry.full_phone && (
                <a
                  href={`https://wa.me/${getCleanPhoneForWhatsApp(selectedInquiry.full_phone)}?text=Hello%20${encodeURIComponent(selectedInquiry.name)},%20this%20is%20Bilal%20from%20BY%20Devs%20regarding%20your%20project%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-action-btn btn-whatsapp"
                >
                  <Send size={15} /> Chat on WhatsApp
                </a>
              )}
            </div>

            {/* Key Information Grid */}
            <div className="modal-grid">
              <div className="modal-info-block">
                <small>Service Requested</small>
                <strong>{selectedInquiry.service}</strong>
              </div>

              <div className="modal-info-block">
                <small>Budget Range</small>
                <strong>{selectedInquiry.budget || 'Not specified'}</strong>
              </div>

              <div className="modal-info-block">
                <small>Country & Dial Code</small>
                <strong>
                  {selectedInquiry.country} ({selectedInquiry.country_code})
                </strong>
              </div>

              <div className="modal-info-block">
                <small>Pipeline Status</small>
                <select
                  className={`status-select status-${selectedInquiry.status}`}
                  style={{ width: '100%', marginTop: 4 }}
                  value={selectedInquiry.status}
                  onChange={e => handleStatusUpdate(selectedInquiry.id, e.target.value as InquiryStatus)}
                >
                  <option value="new">New Inquiry</option>
                  <option value="called">Called / Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed / Signed</option>
                  <option value="cancelled">Cancelled / Unresponsive</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a7491', marginBottom: 6 }}>
                Project Overview & Requirements
              </div>
              <div className="message-box">{selectedInquiry.message}</div>
            </div>

            {/* Internal Notes / Remarks */}
            <div className="notes-editor">
              <label>Internal Admin Remarks / Follow-up Notes</label>
              <textarea
                rows={3}
                placeholder="Add confidential notes (e.g. Call outcomes, client timeline, proposed tech stack, next meeting date)..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="admin-btn"
                  style={{ background: '#0d2238', color: '#ffffff', border: 'none' }}
                >
                  {savingNotes ? 'Saving Notes...' : 'Save Remarks'}
                </button>
                {notesSaved && (
                  <span style={{ fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={14} /> Notes saved to record
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
