import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { CheckCircle2, CirclePlus, Inbox, MapPin, Clock3 } from 'lucide-react';
import { postAPI, getApiErrorMessage, resolveAssetUrl } from '../services/api';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonPostList } from '../components/Skeleton';
import { AuthContext } from '../context/AuthContext';

const DASHBOARD_FETCH_ERROR_TOAST_ID = 'dashboard-fetch-posts-error';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState(null);
  const [isDeletingModal, setIsDeletingModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postAPI.getMyPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to fetch posts'), {
        toastId: DASHBOARD_FETCH_ERROR_TOAST_ID,
      });
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (postId) => {
    setDeletePostId(postId);
    setIsDeletingModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await postAPI.deletePost(deletePostId);
      toast.success('Post deleted successfully');
      setIsDeletingModal(false);
      setDeletePostId(null);
      fetchMyPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleMarkResolved = async (postId) => {
    try {
      await postAPI.updatePost(postId, { status: 'resolved' });
      toast.success('Post marked as resolved');
      fetchMyPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    }
  };

  return (
    <PageWrapper>
      <div className="container-lg px-6 py-12">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-4xl font-syne font-bold text-ink-primary mb-2">
              Your Posts
            </h1>
            <p className="text-ink-secondary font-dm">Welcome, {user?.name}!</p>
          </div>

          <Link to="/create-post" className="btn btn-primary hidden sm:block">
            <span className="inline-flex items-center gap-2">
              <CirclePlus size={16} />
              <span>New Post</span>
            </span>
          </Link>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div data-loading="true">
            <SkeletonPostList count={3} />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft mb-4">
              <Inbox size={30} className="text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-ink-primary mb-2">
              No posts yet
            </h3>
            <p className="text-ink-muted mb-6">
              You haven't posted any lost or found items yet.
            </p>
            <Link to="/create-post">
              <button className="btn btn-primary">Post Your First Item</button>
            </Link>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              data-loading="true"
            >
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => {
              const isLost = post.type === 'lost';
              const imageUrl = resolveAssetUrl(post.imageUrl);

              return (
                <motion.div
                  key={post._id}
                  layout
                  className="glass rounded-2xl border border-white/80 flex items-center gap-4 p-4 group"
                  whileHover={{
                    x: 4,
                    transition: { type: 'spring', stiffness: 420, damping: 30 },
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
                  transition={{ delay: index * 0.04, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'} text-xs`}>
                        {isLost ? 'Lost' : 'Found'}
                      </span>
                      <h3 className="font-dm font-medium text-ink-primary truncate">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        <span>{post.location}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    {post.status === 'resolved' && (
                      <div className="text-xs text-found-color font-dm font-medium mt-1 inline-flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Resolved</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.status !== 'resolved' && (
                      <button
                        onClick={() => handleMarkResolved(post._id)}
                        className="btn btn-secondary text-xs px-2 py-1"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <Link
                      to={`/edit-post/${post._id}`}
                      className="btn btn-secondary text-xs px-2 py-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(post._id)}
                      className="btn btn-danger text-xs px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}

        {/* Mobile Floating Action */}
        <Link
          to="/create-post"
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-transform hover:scale-110 sm:hidden"
        >
          <CirclePlus size={28} />
        </Link>

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={isDeletingModal}
          title="Delete Post?"
          message="This action cannot be undone. Are you sure you want to delete this post?"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeletingModal(false);
            setDeletePostId(null);
          }}
          isDangerous
        />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
