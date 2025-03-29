import React from 'react';
import { Tag, MapPin, Globe2 } from 'lucide-react';
import type { EventType } from '../../../../types';

interface EventIconProps {
  type: EventType;
}

export const EventIcon: React.FC<EventIconProps> = ({ type }) => {
  switch (type) {
    case 'tag':
      return <Tag className="text-green-600 dark:text-green-400" size={16} />;
    case 'regional':
      return <MapPin className="text-blue-600 dark:text-blue-400" size={16} />;
    case 'world':
      return <Globe2 className="text-red-600 dark:text-red-400" size={16} />;
  }
};