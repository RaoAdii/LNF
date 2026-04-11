import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postAPI } from '../services/api';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import MessageBox from '../components/MessageBox';
import { SkeletonCard, SkeletonText } from '../components/Skeleton';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPostById(id);
      setPost(response.data.post);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch post');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container-lg px-6 py-12">
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

  const isOwner = user && post.createdBy?._id === user?.id;
  const isLost = post.type === 'lost';
  const imageUrl = post.imageUrl
    ? `http://localhost:5000${post.imageUrl}`
    : 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=500&fit=crop';

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
              <div className="relative h-96 overflow-hidden rounded-lg bg-accent-soft">
                <motion.img
                  src={imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.4 }}
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
            {!isOwner && (
              <>
                {isAuthenticated ? (
                  <motion.button
                    onClick={() => setShowMessageForm(!showMessageForm)}
                    className="btn btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    📬 Contact Owner
                  </motion.button>
                ) : (
                  <Link to="/login" className="btn btn-accent w-full text-center">
                    Login to Contact
                  </Link>
                )}

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
              <div className="space-y-2">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="btn btn-secondary w-full text-center"
                >
                  ✏️ Edit Post
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-danger w-full"
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PostDetail;
