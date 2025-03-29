import React, { useState } from 'react';
import { X, Settings, ChevronDown, ChevronUp, Dices } from 'lucide-react';
import { useSimulatorStore } from '../store';
import { ToneDistribution } from './ToneDistribution';
import type { SimulationWeights } from '../types';

interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  description?: string;
}

const WeightSlider: React.FC<WeightSliderProps> = ({ label, value, onChange, disabled, description }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-4">
      <div className="min-w-[140px] text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="flex-1">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
        />
      </div>
      <div className="w-16 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
        {value.toFixed(1)}%
      </div>
    </div>
    {description && (
      <div className="ml-[140px] text-xs text-gray-500 dark:text-gray-400">{description}</div>
    )}
  </div>
);

interface DistributionGroupProps {
  title: string;
  description: string;
  weights: Record<string, number>;
  onChange: (weights: Record<string, number>) => void;
  defaultExpanded?: boolean;
  isToneDistribution?: boolean;
  isRegionDistribution?: boolean;
  useRegionWeights?: boolean;
  onToggleRegionWeights?: (enabled: boolean) => void;
}

const DistributionGroup: React.FC<DistributionGroupProps> = ({
  title,
  description,
  weights = {},
  onChange,
  defaultExpanded = false,
  isToneDistribution = false,
  isRegionDistribution = false,
  useRegionWeights = true,
  onToggleRegionWeights
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Changed to false by default
  const total = Object.values(weights).reduce((sum, val) => sum + val, 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const handleWeightChange = (key: string, value: number) => {
    const remaining = 100 - value;
    const otherKeys = Object.keys(weights).filter(k => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + (weights[k] || 0), 0);
    
    const newWeights = { ...weights };
    newWeights[key] = Number(value.toFixed(1));

    if (otherTotal > 0) {
      const ratio = remaining / otherTotal;
      otherKeys.forEach(k => {
        newWeights[k] = Number((weights[k] * ratio).toFixed(1));
      });
    } else {
      const equalShare = remaining / otherKeys.length;
      otherKeys.forEach(k => {
        newWeights[k] = Number(equalShare.toFixed(1));
      });
    }

    onChange(newWeights);
  };

  const randomizeWeights = () => {
    const keys = Object.keys(weights);
    const newWeights = { ...weights };
    let remainingTotal = 100;

    for (let i = 0; i < keys.length - 1; i++) {
      const maxWeight = remainingTotal - (keys.length - i - 1);
      const weight = Math.random() * maxWeight;
      newWeights[keys[i]] = Number(weight.toFixed(1));
      remainingTotal -= weight;
    }

    newWeights[keys[keys.length - 1]] = Number(remainingTotal.toFixed(1));
    onChange(newWeights);
  };

  const formatKey = (key: string): string => {
    return key
      .split(/(?=[A-Z])|[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div
        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            Total: {total.toFixed(1)}%
          </div>
          <div className="flex items-center gap-2">
            {!isToneDistribution && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  randomizeWeights();
                }}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Randomize weights"
              >
                <Dices size={16} />
              </button>
            )}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 border-t dark:border-gray-700">
          {isRegionDistribution && onToggleRegionWeights && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="useRegionWeights"
                checked={useRegionWeights}
                onChange={(e) => onToggleRegionWeights(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="useRegionWeights" className="text-sm text-gray-700 dark:text-gray-300">
                Use region distribution weights
              </label>
            </div>
          )}
          {isToneDistribution ? (
            <ToneDistribution weights={weights as SimulationWeights['tone']} onChange={onChange} />
          ) : (
            <div className="space-y-4">
              {Object.entries(weights).map(([key, value]) => (
                <WeightSlider
                  key={key}
                  label={formatKey(key)}
                  value={value}
                  onChange={(newValue) => handleWeightChange(key, newValue)}
                  disabled={isRegionDistribution && !useRegionWeights}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface SimulationSettingsProps {
  onClose: () => void;
}

export const SimulationSettings: React.FC<SimulationSettingsProps> = ({ onClose }) => {
  const { simulationWeights, updateSimulationWeights } = useSimulatorStore();

  const handleUpdate = (
    key: keyof SimulationWeights,
    newWeights: Record<string, number>
  ) => {
    updateSimulationWeights({
      ...simulationWeights,
      [key]: newWeights
    });
  };

  const handleToggleRegionWeights = (enabled: boolean) => {
    updateSimulationWeights({
      ...simulationWeights,
      useRegionWeights: enabled
    });
  };

  const randomizeAll = () => {
    const newWeights = { ...simulationWeights };
    Object.keys(newWeights).forEach((key) => {
      if (key !== 'actions' && key !== 'useRegionWeights') {
        const weights = newWeights[key as keyof SimulationWeights];
        if (typeof weights === 'object') {
          const keys = Object.keys(weights);
          const randomizedWeights: Record<string, number> = {};
          let remainingTotal = 100;

          for (let i = 0; i < keys.length - 1; i++) {
            const maxWeight = remainingTotal - (keys.length - i - 1);
            const weight = Math.random() * maxWeight;
            randomizedWeights[keys[i]] = Number(weight.toFixed(1));
            remainingTotal -= weight;
          }

          randomizedWeights[keys[keys.length - 1]] = Number(remainingTotal.toFixed(1));
          newWeights[key as keyof SimulationWeights] = randomizedWeights;
        }
      }
    });

    updateSimulationWeights(newWeights);
  };

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Simulation Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure the behavior and distribution of simulated users</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={randomizeAll}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Dices size={16} />
            Randomize All
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
        <DistributionGroup
          title="Event Type Distribution"
          description="Configure the probability distribution of different event types"
          weights={simulationWeights.events || {
            tag: 60,
            regional: 30,
            world: 10
          }}
          onChange={(weights) => handleUpdate('events', weights)}
        />

        <DistributionGroup
          title="Gender Distribution"
          description="Configure the probability distribution of user genders"
          weights={simulationWeights.gender}
          onChange={(weights) => handleUpdate('gender', weights)}
        />

        <DistributionGroup
          title="Age Range Distribution"
          description="Set the distribution of user age ranges"
          weights={simulationWeights.ageRanges}
          onChange={(weights) => handleUpdate('ageRanges', weights)}
        />

        <DistributionGroup
          title="Region Distribution"
          description="Configure geographical distribution of users"
          weights={simulationWeights.regions}
          onChange={(weights) => handleUpdate('regions', weights)}
          isRegionDistribution={true}
          useRegionWeights={simulationWeights.useRegionWeights}
          onToggleRegionWeights={handleToggleRegionWeights}
        />

        <DistributionGroup
          title="Interaction Value Distribution"
          description="Set the probability of different interaction levels"
          weights={simulationWeights.interactionValue}
          onChange={(weights) => handleUpdate('interactionValue', weights)}
        />

        <DistributionGroup
          title="Tone Distribution"
          description="Set the distribution of communication styles"
          weights={simulationWeights.tone}
          onChange={(weights) => handleUpdate('tone', weights)}
          isToneDistribution={true}
        />

        <DistributionGroup
          title="Verbosity Distribution"
          description="Configure how verbose users are in their communications"
          weights={simulationWeights.verbosity}
          onChange={(weights) => handleUpdate('verbosity', weights)}
        />
      </div>
    </>
  );
};