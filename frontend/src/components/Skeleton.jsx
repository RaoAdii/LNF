import React from 'react';

export const SkeletonCard = () => (
  <div className="skeleton skeleton-card" />
);

export const SkeletonText = ({ width = 'w-full', height = 'h-4' }) => (
  <div className={`skeleton ${width} ${height} mb-2`} />
);

export const SkeletonAvatar = () => (
  <div className="skeleton skeleton-avatar" />
);

export const SkeletonPostList = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={`skeleton-post-${i}`} className="flex gap-4 p-4 rounded-lg bg-[#16122a] border border-white/15">
        <SkeletonAvatar />
        <div className="flex-1">
          <SkeletonText width="w-1/3" height="h-4" />
          <SkeletonText width="w-1/2" height="h-3" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={`skeleton-card-${i}`} />
    ))}
  </div>
);

export default SkeletonCard;
