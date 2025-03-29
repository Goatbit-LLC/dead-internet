import React from 'react';

interface EventProgressProps {
  postCount: number;
  maxPosts: number;
}

export const EventProgress: React.FC<EventProgressProps> = ({ postCount, maxPosts }) => {
  const progress = (postCount / maxPosts) * 100;

  return (
    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 flex-1 overflow-hidden">
        <div
          className="h-full bg-gray-400 dark:bg-gray-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span>
        {postCount}/{maxPosts} posts
      </span>
    </div>
  );
};