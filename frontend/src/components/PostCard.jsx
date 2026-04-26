import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, MapPin } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';

const PostCard = ({ post, priority = false }) => {
  const isLost = post.type === 'lost';
  const imageUrl = resolveAssetUrl(post.imageUrl);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
  }, [imageUrl]);

  const getStatusColor = () => {
    if (post.status === 'resolved') return 'badge-found';
    return isLost ? 'badge-lost' : 'badge-found';
  };

  const statusLabel = post.status === 'resolved' ? 'Resolved' : isLost ? 'Lost' : 'Found';
  const statusIcon = post.status === 'resolved' || !isLost ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />;

  return (
    <Link to={`/post/${post._id}`}>
      <div
        className="glass rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col post-card"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
          {!imgLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 background-size-200" />
          )}

          <img
            src={imageUrl}
            alt={post.title}
            width={800}
            height={600}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.svg';
              setImgLoaded(true);
            }}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: 'translateZ(0)',
            }}
          />

          <div className="absolute inset-0 flex items-start justify-between p-3 pointer-events-none">
            <div className="pointer-events-auto">
              <div className={`badge ${getStatusColor()} ${isLost && post.status !== 'resolved' ? 'pulse' : ''}`}>
                <span className="inline-flex items-center gap-1">
                  {statusIcon}
                  <span>{statusLabel}</span>
                </span>
              </div>
            </div>
            <div className="badge badge-category pointer-events-auto">
              {post.category}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-syne font-bold mb-2 text-ink-primary line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm font-dm font-light text-ink-secondary mb-4 line-clamp-2 leading-relaxed flex-1">
            {post.description}
          </p>

          <div className="space-y-2 text-xs text-ink-muted mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} aria-hidden="true" />
              <span className="truncate">{post.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Clock3 size={14} aria-hidden="true" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center text-accent text-sm font-medium gap-1 group-hover:text-ink-primary transition-colors">
            <span>View Details</span>
            <ArrowRight size={15} aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
