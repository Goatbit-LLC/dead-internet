import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

interface SectionProps {
  id: string;
  title: string;
  visible: boolean;
  children: React.ReactNode;
  onVisibilityToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  defaultOpen?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  title,
  visible,
  children,
  onVisibilityToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  defaultOpen = true // Changed to true by default
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  return (
    <div className="stats-section">
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-900 dark:text-white font-medium"
          >
            {title}
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
            )}
          </button>
          <div className="flex items-center gap-1">
            {!isFirst && (
              <button
                onClick={onMoveUp}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Move section up"
              >
                <ArrowUp size={16} />
              </button>
            )}
            {!isLast && (
              <button
                onClick={onMoveDown}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Move section down"
              >
                <ArrowDown size={16} />
              </button>
            )}
            <button
              onClick={onVisibilityToggle}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={visible ? 'Hide section' : 'Show section'}
            >
              {visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>
        {isExpanded && <div className="px-4 pb-4">{children}</div>}
      </div>
    </div>
  );
};