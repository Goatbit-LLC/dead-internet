import React from 'react';
import { Settings, Settings2, MessageCircle } from 'lucide-react';

interface SettingsButtonsProps {
  onSimulationSettings: () => void;
  onLLMSettings: () => void;
  onLLMInstructions: () => void;
}

export const SettingsButtons: React.FC<SettingsButtonsProps> = ({
  onSimulationSettings,
  onLLMSettings,
  onLLMInstructions
}) => {
  return (
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Settings</div>
      <div className="flex">
        <button
          onClick={onSimulationSettings}
          className="flex-1 p-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 flex items-center justify-center gap-2 border-r border-blue-400"
        >
          <Settings2 size={16} />
          Simulation
        </button>
        <button
          onClick={onLLMSettings}
          className="flex-1 p-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 border-r border-blue-400"
        >
          <Settings size={16} />
          LLM
        </button>
        <button
          onClick={onLLMInstructions}
          className="flex-1 p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} />
          Instructions
        </button>
      </div>
    </div>
  );
};