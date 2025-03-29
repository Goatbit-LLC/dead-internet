import React from 'react';
import { Search, X } from 'lucide-react';
import type { User } from '../../../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUser: User | null;
  selectedTag: string | null;
  onClearUser: () => void;
  onClearTag: () => void;
  onClearAll: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedUser,
  selectedTag,
  onClearUser,
  onClearTag,
  onClearAll
}) => {
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts by content, username, or tag..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Active Filters */}
      {(selectedUser || selectedTag || searchQuery) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUser && (
            <button
              onClick={onClearUser}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              User: {selectedUser.username}
              <X size={14} className="text-blue-600 dark:text-blue-400" />
            </button>
          )}
          {selectedTag && (
            <button
              onClick={onClearTag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              #{selectedTag}
              <X size={14} className="text-blue-600 dark:text-blue-400" />
            </button>
          )}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Search: {searchQuery}
              <X size={14} className="text-blue-600 dark:text-blue-400" />
            </button>
          )}
          {(selectedUser || selectedTag || searchQuery) && (
            <button
              onClick={onClearAll}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Clear all filters
              <X size={14} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};