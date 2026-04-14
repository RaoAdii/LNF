import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
  const isLost = post.type === 'lost';
  const imageUrl = post.imageUrl || '/placeholder.svg';
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
  }, [imageUrl]);

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
        className="glass rounded-2xl overflow-hidden cursor-pointer group h-full"
        whileHover={{
          y: -4,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
          },
        }}
        whileTap={{ scale: 0.98 }}
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
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
            loading="lazy"
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
        <div className="p-4">
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
          <div className="flex items-center text-accent text-sm font-medium gap-1 group-hover:text-ink-primary transition-colors">
            <span>View Details</span>
            <span>→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;

