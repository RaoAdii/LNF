import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import api from '../../services/api';
import { toast } from 'react-toastify';

function StatsCard({ label, value, color }) {
  return (
    <div className="glass" style={{ padding: '20px 24px', textAlign: 'center' }}>
      <div
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: color || 'var(--accent)',
          fontFamily: "'Syne'",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);

    if (tab === 'overview') {
      api
        .get('/admin/stats')
        .then(({ data }) => setStats(data.stats))
        .catch(() => toast.error('Failed to load stats.'))
        .finally(() => setLoading(false));
    } else if (tab === 'users') {
      api
        .get('/admin/users')
        .then(({ data }) => setUsers(data.users || []))
        .catch(() => toast.error('Failed to load users.'))
        .finally(() => setLoading(false));
    } else {
      api
        .get('/admin/posts')
        .then(({ data }) => setPosts(data.posts || []))
        .catch(() => toast.error('Failed to load posts.'))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  const handleBan = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/ban`);
      setUsers((prev) => prev.map((entry) => (entry._id === userId ? data.user : entry)));
      toast.success(data.message);
    } catch {
      toast.error('Action failed.');
    }
  };

  const handlePromote = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/promote`);
      setUsers((prev) => prev.map((entry) => (entry._id === userId ? data.user : entry)));
      toast.success(data.message);
    } catch {
      toast.error('Action failed.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) return;

    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((entry) => entry._id !== postId));
      toast.success('Post deleted.');
    } catch {
      toast.error('Delete failed.');
    }
  };

  const tabs = ['overview', 'users', 'posts'];

  return (
    <PageWrapper className="page-enter">
      <div className="container-lg px-4 py-10">
        <h1 className="text-3xl font-syne font-bold text-ink-primary mb-6">Admin Panel</h1>

        <div
          style={{
            display: 'inline-flex',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '28px',
          }}
        >
          {tabs.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              style={{
                padding: '8px 24px',
                background: tab === entry ? 'var(--accent)' : 'transparent',
                color: tab === entry ? '#fff' : 'var(--ink-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans'",
                fontWeight: 500,
                fontSize: '0.9rem',
                textTransform: 'capitalize',
                transition: 'background 150ms ease, color 150ms ease',
              }}
            >
              {entry}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--ink-muted)' }}>Loading...</p>}

        {!loading && tab === 'overview' && stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
            }}
          >
            <StatsCard label="Total Users" value={stats.totalUsers} />
            <StatsCard label="Total Posts" value={stats.totalPosts} />
            <StatsCard label="Open Posts" value={stats.openPosts} color="var(--lost-color)" />
            <StatsCard label="Resolved Posts" value={stats.resolvedPosts} color="var(--found-color)" />
            <StatsCard label="Messages Sent" value={stats.totalMessages} color="var(--ink-secondary)" />
          </div>
        )}

        {!loading && tab === 'users' && (
          <div className="glass" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Email', 'Flat', 'Role', 'Status', 'Actions'].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: 'var(--ink-secondary)',
                        fontWeight: 500,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((entry) => (
                  <tr key={entry._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-primary)' }}>{entry.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)' }}>{entry.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)' }}>
                      {entry.flatNumber || '-'} {entry.block ? `· ${entry.block}` : ''}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background: entry.role === 'admin' ? 'var(--accent-soft)' : 'var(--bg-surface)',
                          color: entry.role === 'admin' ? 'var(--accent)' : 'var(--ink-secondary)',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      >
                        {entry.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background: entry.isBanned ? 'rgba(239,68,68,0.12)' : 'var(--bg-surface)',
                          color: entry.isBanned ? 'var(--lost-color)' : 'var(--found-color)',
                          fontWeight: 500,
                        }}
                      >
                        {entry.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleBan(entry._id)}
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 10px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: entry.isBanned ? 'var(--found-color)' : 'var(--lost-color)',
                          }}
                        >
                          {entry.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button
                          onClick={() => handlePromote(entry._id)}
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 10px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--accent)',
                          }}
                        >
                          {entry.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-muted)' }}>No users found.</p>
            )}
          </div>
        )}

        {!loading && tab === 'posts' && (
          <div className="glass" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Type', 'Category', 'Status', 'By', 'Actions'].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: 'var(--ink-secondary)',
                        fontWeight: 500,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((entry) => (
                  <tr key={entry._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: 'var(--ink-primary)',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.title}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background:
                            entry.type === 'lost' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                          color: entry.type === 'lost' ? 'var(--lost-color)' : 'var(--found-color)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)' }}>{entry.category}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)', textTransform: 'capitalize' }}>
                      {entry.status}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-secondary)' }}>
                      {entry.createdBy?.name || '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDeletePost(entry._id)}
                        style={{
                          fontSize: '0.78rem',
                          padding: '4px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: 'var(--lost-color)',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {posts.length === 0 && (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-muted)' }}>No posts found.</p>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
