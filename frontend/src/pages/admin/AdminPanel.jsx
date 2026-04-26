import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  CircleSlash,
  ListChecks,
  Loader2,
  Shield,
  ShieldAlert,
  Trash2,
  UserRoundCog,
  Users,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import ConfirmModal from '../../components/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, getApiErrorMessage } from '../../services/api';

const TABS = ['overview', 'users', 'listings'];
const USER_ACTION_BUTTON_CLASS = 'btn btn-secondary w-full px-3 py-1.5 text-xs disabled:opacity-50';
const LISTING_ACTION_BUTTON_CLASS = 'btn btn-secondary w-full px-3 py-1.5 text-xs disabled:opacity-50';
const LISTING_DELETE_BUTTON_CLASS = 'btn btn-danger w-full px-3 py-1.5 text-xs disabled:opacity-50';
const USER_DELETE_BUTTON_CLASS = 'btn btn-danger w-full px-3 py-1.5 text-xs disabled:opacity-50';

function StatsCard({ label, value, icon: Icon, tone = 'text-accent' }) {
  return (
    <div className="glass rounded-2xl border border-white/20 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-dm text-ink-secondary">{label}</p>
        <Icon size={16} className={tone} />
      </div>
      <p className="mt-3 text-3xl font-syne font-bold text-ink-primary">{value}</p>
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
  const [busyKey, setBusyKey] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadActiveTab = async () => {
      setLoading(true);

      try {
        if (tab === 'overview') {
          const { data } = await adminAPI.getStats();
          setStats(data?.stats || null);
          return;
        }

        if (tab === 'users') {
          const { data } = await adminAPI.getUsers();
          setUsers(data?.users || []);
          return;
        }

        const { data } = await adminAPI.getPosts();
        setPosts(data?.posts || []);
      } catch (error) {
        toast.error(getApiErrorMessage(error, `Failed to load ${tab}`));
      } finally {
        setLoading(false);
      }
    };

    loadActiveTab();
  }, [tab]);

  const withBusy = async (key, action) => {
    setBusyKey(key);
    try {
      await action();
    } finally {
      setBusyKey('');
    }
  };

  const handleBan = async (targetUserId) => {
    await withBusy(`user-ban-${targetUserId}`, async () => {
      try {
        const { data } = await adminAPI.toggleBanUser(targetUserId);
        setUsers((previous) =>
          previous.map((entry) => (entry._id === targetUserId ? data.user : entry))
        );
        toast.success(data.message || 'User status updated.');
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to update user status.'));
      }
    });
  };

  const handlePromote = async (targetUserId) => {
    await withBusy(`user-role-${targetUserId}`, async () => {
      try {
        const { data } = await adminAPI.toggleAdminRole(targetUserId);
        setUsers((previous) =>
          previous.map((entry) => (entry._id === targetUserId ? data.user : entry))
        );
        toast.success(data.message || 'User role updated.');
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to update user role.'));
      }
    });
  };

  const handleDeleteUser = async () => {
    if (!deleteUserTarget?._id) {
      return;
    }

    const { _id: targetUserId } = deleteUserTarget;

    await withBusy(`user-delete-${targetUserId}`, async () => {
      try {
        const { data } = await adminAPI.deleteUser(targetUserId);
        setUsers((previous) => previous.filter((entry) => entry._id !== targetUserId));
        setPosts((previous) =>
          previous.filter(
            (entry) => String(entry?.createdBy?._id || entry?.createdBy || '') !== String(targetUserId)
          )
        );
        setDeleteUserTarget(null);
        toast.success(data?.message || 'User deleted permanently.');
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to delete user.'));
      }
    });
  };

  const handleDeletePost = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    const { _id: postId } = deleteTarget;

    await withBusy(`post-delete-${postId}`, async () => {
      try {
        await adminAPI.deletePost(postId);
        setPosts((previous) => previous.filter((entry) => entry._id !== postId));
        toast.success('Listing deleted.');
        setDeleteTarget(null);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to delete listing.'));
      }
    });
  };

  const handleTypeToggle = async (post) => {
    const nextType = post.type === 'lost' ? 'found' : 'lost';

    await withBusy(`post-type-${post._id}`, async () => {
      try {
        const { data } = await adminAPI.updatePostFlags(post._id, { type: nextType });
        setPosts((previous) =>
          previous.map((entry) => (entry._id === post._id ? data.post : entry))
        );
        toast.success(`Listing type updated to ${nextType}.`);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to update listing type.'));
      }
    });
  };

  const handleStatusToggle = async (post) => {
    const nextStatus = post.status === 'open' ? 'resolved' : 'open';

    await withBusy(`post-status-${post._id}`, async () => {
      try {
        const { data } = await adminAPI.updatePostFlags(post._id, { status: nextStatus });
        setPosts((previous) =>
          previous.map((entry) => (entry._id === post._id ? data.post : entry))
        );
        toast.success(`Listing marked as ${nextStatus}.`);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to update listing status.'));
      }
    });
  };

  return (
    <PageWrapper>
      <div className="container-lg px-4 md:px-6 py-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-syne font-bold text-ink-primary">Admin Console</h1>
            <p className="mt-1 text-sm font-dm text-ink-secondary">
              Manage users, listings, and lost/found flags.
            </p>
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-white/15 bg-[#17132a]/80 p-1">
          {TABS.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              className={`rounded-lg px-4 py-2 text-sm font-dm font-medium capitalize transition-colors ${
                tab === entry ? 'bg-accent text-white' : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {entry}
            </button>
          ))}
        </div>

        {loading && (
          <div className="glass rounded-xl border border-white/20 px-4 py-8 text-center text-sm font-dm text-ink-secondary">
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Loading {tab}...</span>
            </span>
          </div>
        )}

        {!loading && tab === 'overview' && stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard label="Users" value={stats.totalUsers} icon={Users} />
            <StatsCard label="Listings" value={stats.totalPosts} icon={ListChecks} />
            <StatsCard label="Open" value={stats.openPosts} icon={CircleSlash} tone="text-lost-color" />
            <StatsCard label="Resolved" value={stats.resolvedPosts} icon={BadgeCheck} tone="text-found-color" />
            <StatsCard label="Messages" value={stats.totalMessages} icon={Shield} tone="text-ink-secondary" />
          </div>
        )}

        {!loading && tab === 'users' && (
          <div className="glass overflow-x-auto rounded-xl border border-white/20">
            <table className="min-w-full text-sm">
              <thead className="bg-[#1b1630] text-left text-ink-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((entry) => {
                  const isOwnRecord = String(entry._id) === String(user?._id);
                  return (
                    <tr key={entry._id} className="border-t border-white/10">
                      <td className="px-4 py-3 font-dm text-ink-primary">
                        <p>{entry.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {entry.flatNumber || '-'} {entry.block ? `• ${entry.block}` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-dm text-ink-secondary">{entry.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-dm font-medium capitalize ${
                            entry.role === 'admin'
                              ? 'bg-accent-soft text-accent'
                              : 'bg-[#231d3f] text-ink-secondary border border-white/12'
                          }`}
                        >
                          {entry.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-dm font-medium ${
                            entry.isBanned
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : 'bg-green-50 text-green-700 border border-green-100'
                          }`}
                        >
                          {entry.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="grid grid-cols-[112px_132px_112px] gap-2">
                          <button
                            type="button"
                            disabled={isOwnRecord || busyKey === `user-ban-${entry._id}`}
                            onClick={() => handleBan(entry._id)}
                            className={USER_ACTION_BUTTON_CLASS}
                          >
                            <span className="inline-flex items-center gap-1">
                              <ShieldAlert size={13} />
                              <span>{entry.isBanned ? 'Unban' : 'Ban'}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={isOwnRecord || busyKey === `user-role-${entry._id}`}
                            onClick={() => handlePromote(entry._id)}
                            className={USER_ACTION_BUTTON_CLASS}
                          >
                            <span className="inline-flex items-center gap-1">
                              <UserRoundCog size={13} />
                              <span>{entry.role === 'admin' ? 'Demote' : 'Make Admin'}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={
                              isOwnRecord ||
                              entry.role === 'admin' ||
                              busyKey === `user-delete-${entry._id}`
                            }
                            onClick={() => setDeleteUserTarget(entry)}
                            className={USER_DELETE_BUTTON_CLASS}
                          >
                            <span className="inline-flex items-center gap-1">
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="px-4 py-8 text-center text-sm font-dm text-ink-muted">No users found.</p>
            )}
          </div>
        )}

        {!loading && tab === 'listings' && (
          <div className="glass overflow-x-auto rounded-xl border border-white/20">
            <table className="min-w-full text-sm">
              <thead className="bg-[#1b1630] text-left text-ink-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created By</th>
                  <th className="px-4 py-3 font-medium w-[412px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((entry) => (
                  <tr key={entry._id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-dm text-ink-primary">
                      <p className="max-w-[240px] truncate">{entry.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{entry.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-dm font-semibold uppercase ${
                          entry.type === 'lost'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-green-50 text-green-700 border border-green-100'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-dm font-medium capitalize ${
                          entry.status === 'resolved'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-[#231d3f] text-ink-secondary border border-white/12'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-dm text-ink-secondary">{entry.createdBy?.name || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="grid grid-cols-[120px_148px_112px] gap-2">
                        <button
                          type="button"
                          disabled={busyKey === `post-type-${entry._id}`}
                          onClick={() => handleTypeToggle(entry)}
                          className={LISTING_ACTION_BUTTON_CLASS}
                        >
                          {entry.type === 'lost' ? 'Set Found' : 'Set Lost'}
                        </button>
                        <button
                          type="button"
                          disabled={busyKey === `post-status-${entry._id}`}
                          onClick={() => handleStatusToggle(entry)}
                          className={LISTING_ACTION_BUTTON_CLASS}
                        >
                          {entry.status === 'open' ? 'Mark Resolved' : 'Mark Open'}
                        </button>
                        <button
                          type="button"
                          disabled={busyKey === `post-delete-${entry._id}`}
                          onClick={() => setDeleteTarget(entry)}
                          className={LISTING_DELETE_BUTTON_CLASS}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {posts.length === 0 && (
              <p className="px-4 py-8 text-center text-sm font-dm text-ink-muted">No listings found.</p>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Listing?"
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.title}". This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteTarget(null)}
        isDangerous
      />

      <ConfirmModal
        isOpen={Boolean(deleteUserTarget)}
        title="Delete User?"
        message={
          deleteUserTarget
            ? `This will permanently remove ${deleteUserTarget.name} (${deleteUserTarget.email}) and related data (posts/messages). This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUserTarget(null)}
        isDangerous
      />
    </PageWrapper>
  );
}
