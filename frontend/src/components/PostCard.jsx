import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
  const isLost = post.type === 'lost';
  const imageUrl = post.imageUrl
    ? `http://localhost:5000${post.imageUrl}`
    : 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop';

  const getStatusColor = () => {
    if (post.status === 'resolved') return 'badge-found';
    return isLost ? 'badge-lost' : 'badge-found';
  };

  const StatusBadge = isLost && post.status !== 'resolved' ? (
    <div className={`badge ${getStatusColor()} pulse`}>
      {isLost ? '⚠ Lost' : '✓ Found'}
    </div>
  ) : (
    <div className={`badge ${getStatusColor()}`}>
      {post.status === 'resolved' ? '✓ Resolved' : (isLost ? '⚠ Lost' : '✓ Found')}
    </div>
  );

  return (
    <Link to={`/post/${post._id}`}>
      <motion.div
        className="card overflow-hidden group"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-accent-soft">
          <motion.img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Badge Container */}
          <div className="absolute inset-0 flex items-start justify-between p-3 pointer-events-none">
            <div className="pointer-events-auto">
              {StatusBadge}
            </div>
            <div className="badge badge-category pointer-events-auto">
              {post.category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-syne font-bold mb-2 text-ink-primary line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm font-dm font-light text-ink-secondary mb-4 line-clamp-2 leading-relaxed">
            {post.description}
          </p>

          {/* Meta */}
          <div className="space-y-2 text-xs text-ink-muted mb-4">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="truncate">{post.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🕐 {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center text-accent text-sm font-medium group-hover:gap-2 gap-1 transition-all">
            <span>View Details</span>
            <span>→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;

