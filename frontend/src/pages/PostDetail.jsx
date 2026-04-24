import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { postAPI, getApiErrorMessage, resolveAssetUrl } from '../services/api';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import MessageBox from '../components/MessageBox';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonCard } from '../components/Skeleton';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    setImgLoaded(false);
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPostById(id);
      setPost(response.data.post);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to fetch post'));
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postAPI.deletePost(id);
      toast.success('Post deleted successfully');
      navigate('/my-posts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container-lg px-6 py-12" data-loading="true">
          <SkeletonCard />
        </div>
      </PageWrapper>
    );
  }

  if (!post) {
    return (
      <PageWrapper>
        <div className="container-lg px-6 py-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-syne font-bold text-ink-primary">Post not found</h2>
        </div>
      </PageWrapper>
    );
  }

  const isOwner = user && post.createdBy && 
    (user._id === post.createdBy._id || user._id === post.createdBy);
  const canContact = user && !isOwner;
  const isLost = post.type === 'lost';
  const imageUrl = resolveAssetUrl(post.imageUrl);

  return (
    <PageWrapper>
      <div className="container-lg px-6 py-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-accent hover:text-ink-primary mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          ← Back
        </motion.button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Image & Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Image Card */}
            <div className="card card-glass overflow-hidden relative">
              <div className="relative overflow-hidden bg-gray-100 rounded-lg" style={{ aspectRatio: '4/3' }}>
                {!imgLoaded && (
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 background-size-200" />
                )}

                <img
                  src={imageUrl}
                  alt={post.title}
                  onLoad={() => setImgLoaded(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.svg';
                    setImgLoaded(true);
                  }}
                  loading="eager"
                  decoding="async"
                  style={{
                    opacity: imgLoaded ? 1 : 0,
                    transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translateZ(0)',
                  }}
                />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className={`badge ${isLost ? 'badge-lost' : 'badge-found'} ${isLost && post.status !== 'resolved' ? 'pulse' : ''}`}>
                    {post.status === 'resolved' ? '✓ Resolved' : (isLost ? '⚠ Lost' : '✓ Found')}
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Details */}
            <div className="card card-glass">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="badge badge-category">{post.category}</div>
              </div>

              <h1 className="text-4xl font-syne font-bold text-ink-primary mb-4">
                {post.title}
              </h1>

              <div className="space-y-3 text-ink-secondary mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span className="font-dm">{post.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <span className="font-dm">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="divider" />

              <p className="text-lg text-ink-secondary font-dm font-light leading-relaxed mb-6">
                {post.description}
              </p>

              {/* Owner Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-accent-soft">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                  {post.createdBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-dm font-medium text-ink-primary">{post.createdBy?.name}</p>
                  <p className="text-sm text-ink-muted">{post.createdBy?.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Contact & Actions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {!user && (
              <Link to="/login" className="btn btn-secondary w-full text-center">
                Login to Contact Owner
              </Link>
            )}

            {canContact && (
              <>
                <motion.button
                  onClick={() => setShowMessageForm(!showMessageForm)}
                  className="btn btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  📬 Contact Owner
                </motion.button>

                {/* Message Form */}
                <AnimatePresence>
                  {showMessageForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="card card-glass mt-4">
                        <MessageBox
                          postId={post._id}
                          recipientId={post.createdBy._id}
                          onSent={() => {
                            setShowMessageForm(false);
                            toast.success('Message sent!');
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {isOwner && (
              <div className="flex gap-3">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="flex-1"
                >
                  <button className="btn btn-secondary w-full">Edit Post</button>
                </Link>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="btn btn-danger flex-1"
                >
                  Delete
                </button>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={showConfirmDelete}
              title="Delete Post"
              message="Are you sure you want to delete this post? This action cannot be undone."
              onConfirm={handleDelete}
              onCancel={() => setShowConfirmDelete(false)}
              confirmText="Delete"
              cancelText="Cancel"
              isDangerous={true}
            />
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PostDetail;
