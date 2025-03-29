import React from 'react';
import { Loader2, MessageSquare, User, ThumbsUp } from 'lucide-react';
import { useSimulatorStore } from '../store';
import type { TaskType } from '../types';

const TaskIcon: React.FC<{ type: TaskType }> = ({ type }) => {
  switch (type) {
    case 'post':
      return <MessageSquare size={14} className="text-green-500" />;
    case 'comment':
      return <MessageSquare size={14} className="text-blue-500" />;
    case 'user':
      return <User size={14} className="text-purple-500" />;
    case 'vote':
      return <ThumbsUp size={14} className="text-orange-500" />;
    case 'event':
      return <MessageSquare size={14} className="text-red-500" />;
  }
};

const TaskLabel: React.FC<{ type: TaskType }> = ({ type }) => {
  switch (type) {
    case 'post':
      return 'Creating post';
    case 'comment':
      return 'Writing comment';
    case 'user':
      return 'Generating user';
    case 'vote':
      return 'Processing vote';
    case 'event':
      return 'Generating event';
  }
};

export const LoadingIndicator: React.FC = () => {
  const { pendingTasks } = useSimulatorStore();

  if (pendingTasks.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-3 z-50 max-w-md w-full mr-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Loader2 size={16} className="text-blue-500 animate-spin" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Processing {pendingTasks.length} task{pendingTasks.length === 1 ? '' : 's'}
        </span>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {pendingTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 animate-pulse"
          >
            <TaskIcon type={task.type} />
            <span className="flex-1">
              <TaskLabel type={task.type} />
              {task.username && (
                <span className="text-gray-500 dark:text-gray-500"> by {task.username}</span>
              )}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {Math.floor((Date.now() - task.startTime) / 1000)}s
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};