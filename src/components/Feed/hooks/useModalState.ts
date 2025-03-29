import { useState } from 'react';

export const useModalState = () => {
  const [showSimulationSettings, setShowSimulationSettings] = useState(false);
  const [showLLMSettings, setShowLLMSettings] = useState(false);
  const [showLLMInstructions, setShowLLMInstructions] = useState(false);
  const [showActionDistribution, setShowActionDistribution] = useState(false);
  const [showSaveManager, setShowSaveManager] = useState(false);

  return {
    showSimulationSettings,
    showLLMSettings,
    showLLMInstructions,
    showActionDistribution,
    showSaveManager,
    setShowSimulationSettings,
    setShowLLMSettings,
    setShowLLMInstructions,
    setShowActionDistribution,
    setShowSaveManager
  };
};