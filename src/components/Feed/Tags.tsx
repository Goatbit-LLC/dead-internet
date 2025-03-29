import React from 'react';

interface TagsProps {
  tags: string[];
  selectedTag: string | null;
  onTagClick?: (tag: string) => void;
}

export const Tags: React.FC<TagsProps> = ({ tags, selectedTag, onTagClick }) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`px-2 py-1 text-xs rounded-full transition-colors ${
            selectedTag === tag
              ? 'bg-blue-500 text-white dark:bg-blue-600'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};