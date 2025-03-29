import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSimulatorStore } from '../store';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useSimulatorStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};