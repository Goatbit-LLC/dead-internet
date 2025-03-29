import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TagCorrelationProvider } from './context';
import { NetworkView } from './components/NetworkView';
import { EngagementView } from './components/EngagementView';
import { DemographicsView } from './components/DemographicsView';
import { ActivityView } from './components/ActivityView';
import { TimelineView } from './components/TimelineView';
import { VisualizationSelector } from './components/VisualizationSelector';
import type { Post } from '../../../types';
import type { VisualizationType } from './types';

interface TagCorrelationProps {
  posts: Post[];
  onClose: () => void;
}

export const TagCorrelation: React.FC<TagCorrelationProps> = ({ posts, onClose }) => {
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('network');

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'network':
        return <NetworkView />;
      case 'engagement':
        return <EngagementView />;
      case 'demographics':
        return <DemographicsView />;
      case 'activity':
        return <ActivityView />;
      case 'timeline':
        return <TimelineView />;
      default:
        return null;
    }
  };

  if (posts.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Tag Analysis</h3>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={20} />
            </button>
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No tag correlations found. Tags need to co-occur in posts to show relationships.
          </div>
        </div>
      </div>
    );
  }

  return (
    <TagCorrelationProvider posts={posts}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Tag Analysis</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analyzing patterns and relationships between tags
              </p>
            </div>
            <div className="flex items-center gap-2">
              <VisualizationSelector
                visualizationType={visualizationType}
                onTypeChange={setVisualizationType}
              />
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="h-[800px]">
            {renderVisualization()}
          </div>
        </div>
      </div>
    </TagCorrelationProvider>
  );
};