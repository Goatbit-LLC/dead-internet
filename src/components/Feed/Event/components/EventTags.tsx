import React from 'react';

interface EventTagsProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

export const EventTags: React.FC<EventTagsProps> = ({ tags, onTagClick }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};