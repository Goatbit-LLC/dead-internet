import React from 'react';
import { Play, Pause, Settings2, Save } from 'lucide-react';

interface AutomationControlsProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onShowActionDistribution: () => void;
  onShowSaveManager: () => void;
}

export const AutomationControls: React.FC<AutomationControlsProps> = ({
  isSimulating,
  onToggleSimulation,
  onShowActionDistribution,
  onShowSaveManager
}) => {
  return (
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Automation</div>
      <div className="flex">
        <button
          onClick={onToggleSimulation}
          className="flex-1 p-2 bg-purple-600 text-white rounded-l-lg hover:bg-purple-700 flex items-center justify-center gap-2 border-r border-purple-400"
        >
          {isSimulating ? <Pause size={16} /> : <Play size={16} />}
          {isSimulating ? 'Stop' : 'Simulate'}
        </button>
        <button
          onClick={onShowActionDistribution}
          className="flex-1 p-2 bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center gap-2 border-r border-purple-400"
        >
          <Settings2 size={16} />
          Actions
        </button>
        <button
          onClick={onShowSaveManager}
          className="flex-1 p-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 flex items-center justify-center gap-2"
        >
          <Save size={16} />
          State
        </button>
      </div>
    </div>
  );
};