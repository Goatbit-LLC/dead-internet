import React from 'react';
import { LLMSettings } from '../../../LLMSettings';
import { LLMInstructionSets } from '../../../LLMInstructionSets';
import { SimulationSettings } from '../../../SimulationSettings';
import { SimulationControls } from '../../../SimulationControls';
import { SaveStateManager } from '../../../SaveStateManager';

interface ModalsProps {
  showSimulationSettings: boolean;
  showLLMSettings: boolean;
  showLLMInstructions: boolean;
  showActionDistribution: boolean;
  showSaveManager: boolean;
  onCloseSimulationSettings: () => void;
  onCloseLLMSettings: () => void;
  onCloseLLMInstructions: () => void;
  onCloseActionDistribution: () => void;
  onCloseSaveManager: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showSimulationSettings,
  showLLMSettings,
  showLLMInstructions,
  showActionDistribution,
  showSaveManager,
  onCloseSimulationSettings,
  onCloseLLMSettings,
  onCloseLLMInstructions,
  onCloseActionDistribution,
  onCloseSaveManager
}) => {
  return (
    <>
      {showSimulationSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SimulationSettings onClose={onCloseSimulationSettings} />
          </div>
        </div>
      )}

      {showLLMSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <LLMSettings onClose={onCloseLLMSettings} />
          </div>
        </div>
      )}

      {showLLMInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <LLMInstructionSets onClose={onCloseLLMInstructions} />
          </div>
        </div>
      )}

      {showActionDistribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SimulationControls onClose={onCloseActionDistribution} />
          </div>
        </div>
      )}

      {showSaveManager && (
        <SaveStateManager onClose={onCloseSaveManager} />
      )}
    </>
  );
};