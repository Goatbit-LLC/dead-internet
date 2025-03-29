import React from 'react';
import { X } from 'lucide-react';
import { useSimulatorStore } from '../store';

interface ActionWeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

const ActionWeightSlider: React.FC<ActionWeightSliderProps> = ({ label, value, onChange, description }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-4">
      <div className="min-w-[140px] text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="flex-1">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={value || 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="w-16 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
        {(value || 0).toFixed(1)}%
      </div>
    </div>
    {description && (
      <div className="ml-[140px] text-xs text-gray-500 dark:text-gray-400">{description}</div>
    )}
  </div>
);

const defaultActions = {
  addUser: 19,
  generatePost: 47.5,
  vote: 28.5,
  generateEvent: 5
};

interface SimulationControlsProps {
  onClose: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({ onClose }) => {
  const { simulationWeights, updateSimulationWeights } = useSimulatorStore();

  const handleActionWeightChange = (key: string, value: number) => {
    const actions = simulationWeights.actions || defaultActions;
    const remaining = 100 - value;
    const otherKeys = Object.keys(actions).filter(k => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + (actions[k] || 0), 0);
    
    const newWeights = { ...actions };
    newWeights[key] = Number(value.toFixed(1));

    if (otherTotal > 0) {
      const ratio = remaining / otherTotal;
      otherKeys.forEach(k => {
        newWeights[k] = Number((actions[k] * ratio).toFixed(1));
      });
    } else {
      const equalShare = remaining / otherKeys.length;
      otherKeys.forEach(k => {
        newWeights[k] = Number(equalShare.toFixed(1));
      });
    }

    updateSimulationWeights({
      ...simulationWeights,
      actions: newWeights
    });
  };

  const actions = simulationWeights.actions || defaultActions;
  const total = Object.values(actions).reduce((sum, val) => sum + (val || 0), 0);
  const isValid = Math.abs(total - 100) < 0.01;

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Action Distribution</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure the probability of different simulation actions</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Action Weights</h3>
          <div className={`text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            Total: {total.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-4">
          <ActionWeightSlider
            label="Add User"
            value={actions.addUser}
            onChange={(value) => handleActionWeightChange('addUser', value)}
            description="Probability of adding a new user to the simulation"
          />
          <ActionWeightSlider
            label="Generate Post"
            value={actions.generatePost}
            onChange={(value) => handleActionWeightChange('generatePost', value)}
            description="Probability of generating a new post"
          />
          <ActionWeightSlider
            label="Vote"
            value={actions.vote}
            onChange={(value) => handleActionWeightChange('vote', value)}
            description="Probability of generating likes/dislikes"
          />
          <ActionWeightSlider
            label="Generate Event"
            value={actions.generateEvent}
            onChange={(value) => handleActionWeightChange('generateEvent', value)}
            description="Probability of generating a new event"
          />
        </div>
      </div>
    </>
  );
};