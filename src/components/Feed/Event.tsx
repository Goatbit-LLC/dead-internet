import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Globe2, MapPin, Tag } from 'lucide-react';
import type { Event } from '../../types';

interface EventProps {
  event: Event;
  onTagClick: (tag: string) => void;
}

export const Event: React.FC<EventProps> = ({ event, onTagClick }) => {
  const getBgColor = () => {
    switch (event.type) {
      case 'tag':
        return 'bg-green-50 dark:bg-green-900';
      case 'regional':
        return 'bg-blue-50 dark:bg-blue-900';
      case 'world':
        return 'bg-red-50 dark:bg-red-900';
    }
  };

  const getBorderColor = () => {
    switch (event.type) {
      case 'tag':
        return 'border-green-200 dark:border-green-800';
      case 'regional':
        return 'border-blue-200 dark:border-blue-800';
      case 'world':
        return 'border-red-200 dark:border-red-800';
    }
  };

  const getIcon = () => {
    switch (event.type) {
      case 'tag':
        return <Tag className="text-green-600 dark:text-green-400" />;
      case 'regional':
        return <MapPin className="text-blue-600 dark:text-blue-400" />;
      case 'world':
        return <Globe2 className="text-red-600 dark:text-red-400" />;
    }
  };

  const getTextColor = () => {
    switch (event.type) {
      case 'tag':
        return 'text-green-800 dark:text-green-200';
      case 'regional':
        return 'text-blue-800 dark:text-blue-200';
      case 'world':
        return 'text-red-800 dark:text-red-200';
    }
  };

  return (
    <div className={`rounded-lg border ${getBorderColor()} ${getBgColor()} p-4`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-white dark:bg-gray-800">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${getTextColor()}`}>{event.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(event.createdAt))} ago
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
          
          {event.regions && (
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={14} className="text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Affects: {event.regions.join(', ')}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {event.tags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 flex-1 overflow-hidden">
              <div
                className="h-full bg-gray-400 dark:bg-gray-300"
                style={{ width: `${(event.postCount / event.maxPosts) * 100}%` }}
              />
            </div>
            <span>
              {event.postCount}/{event.maxPosts} posts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};