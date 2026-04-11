import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postAPI } from '../services/api';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonPostList } from '../components/Skeleton';
import { AuthContext } from '../context/AuthContext';

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
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
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
            + New Post
          </Link>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <SkeletonPostList count={3} />
        ) : posts.length === 0 ? (
          <motion.div
            className="text-center py-16 card card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-syne font-bold text-ink-primary mb-4">
              No posts yet
            </h2>
            <Link to="/create-post" className="btn btn-primary inline-block">
              Create Your First Post
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {posts.map((post, index) => {
              const isLost = post.type === 'lost';
              const imageUrl = post.imageUrl
                ? `http://localhost:5000${post.imageUrl}`
                : 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=100&h=100&fit=crop';

              return (
                <motion.div
                  key={post._id}
                  className="card card-glass flex items-center gap-4 p-4 group hover:shadow-md transition-all"
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Thumbnail */}
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />

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
                      <span>📍 {post.location}</span>
                      <span>•</span>
                      <span>🕐 {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {post.status === 'resolved' && (
                      <div className="text-xs text-found-color font-dm font-medium mt-1">
                        ✓ Resolved
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
          </motion.div>
        )}

        {/* Mobile Floating Action */}
        <Link
          to="/create-post"
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 sm:hidden font-bold text-2xl"
        >
          +
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
