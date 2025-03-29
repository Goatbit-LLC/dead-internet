import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { EventIcon } from './components/EventIcon';
import { EventProgress } from './components/EventProgress';
import { EventTags } from './components/EventTags';
import { RegionList } from './components/RegionList';
import { useEventStyles } from './hooks/useEventStyles';
import type { Event as EventType } from '../../../types';

interface EventProps {
  event: EventType;
  onTagClick: (tag: string) => void;
}

export const Event: React.FC<EventProps> = ({ event, onTagClick }) => {
  const { backgroundColor, borderColor } = useEventStyles(event.type);

  return (
    <div className={`rounded-lg border ${borderColor} ${backgroundColor} p-4`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-white dark:bg-gray-800">
          <EventIcon type={event.type} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${getTextColor()}`}>{event.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(event.createdAt))} ago
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
          
          <RegionList regions={event.regions} />
          <EventTags tags={event.tags} onTagClick={onTagClick} />
          <EventProgress postCount={event.postCount} maxPosts={event.maxPosts} />
        </div>
      </div>
    </div>
  );
};

function getTextColor() {
  return 'text-gray-800 dark:text-gray-200';
}