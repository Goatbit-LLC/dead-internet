import React from 'react';
import { Network, BarChart2, Users, Clock, Calendar } from 'lucide-react';
import type { VisualizationType } from '../types';

interface VisualizationSelectorProps {
  visualizationType: VisualizationType;
  onTypeChange: (type: VisualizationType) => void;
}

export const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({
  visualizationType,
  onTypeChange
}) => {
  const options = [
    { id: 'network', icon: Network, label: 'Tag Relationships' },
    { id: 'engagement', icon: BarChart2, label: 'Engagement Analysis' },
    { id: 'demographics', icon: Users, label: 'Demographics Analysis' },
    { id: 'activity', icon: Clock, label: '24h Activity' },
    { id: 'timeline', icon: Calendar, label: '7-Day Timeline' }
  ] as const;

  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {options.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTypeChange(id)}
          className={`p-2 rounded-lg flex items-center gap-2 ${
            visualizationType === id
              ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
          title={label}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
};