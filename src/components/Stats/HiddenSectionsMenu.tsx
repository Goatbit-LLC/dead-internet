import React from 'react';
import { Eye } from 'lucide-react';

interface HiddenSectionsMenuProps {
  hiddenSections: Array<{ id: string; title: string }>;
  onShowSection: (id: string) => void;
  onClose: () => void;
}

export const HiddenSectionsMenu: React.FC<HiddenSectionsMenuProps> = ({
  hiddenSections,
  onShowSection,
  onClose
}) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50 hidden-sections-menu">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Hidden Sections</h3>
      </div>
      <div className="p-2">
        {hiddenSections.map(section => (
          <button
            key={section.id}
            onClick={() => {
              onShowSection(section.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Eye size={16} className="text-gray-400 dark:text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{section.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};