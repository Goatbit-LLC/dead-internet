import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLLMStore } from '../store/llm';
import type { LLMProvider } from '../types';
import { getOllamaModels, getLMStudioModels } from '../utils/llm';

interface LLMSettingsProps {
  onClose: () => void;
}

export const LLMSettings: React.FC<LLMSettingsProps> = ({ onClose }) => {
  const { config, updateConfig } = useLLMStore();
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const providers: { value: LLMProvider; label: string }[] = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'ollama', label: 'Ollama' },
    { value: 'lmstudio', label: 'LM Studio' },
  ];

  const openaiModels = [
    'gpt-4',
    'gpt-4-turbo-preview',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
  ];

  useEffect(() => {
    const fetchModels = async () => {
      if (!config.baseUrl || (config.provider !== 'ollama' && config.provider !== 'lmstudio')) {
        setAvailableModels([]);
        return;
      }

      setIsLoadingModels(true);
      setModelError(null);

      try {
        const models = config.provider === 'ollama'
          ? await getOllamaModels(config.baseUrl)
          : await getLMStudioModels(config.baseUrl);

        setAvailableModels(models);
        
        if (models.length > 0 && !models.includes(config.model || '')) {
          updateConfig({ model: models[0] });
        }
      } catch (error) {
        setModelError('Failed to fetch available models. Please check your connection settings.');
        console.error('Error fetching models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [config.provider, config.baseUrl]);

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">LLM Configuration</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Provider
            </label>
            <select
              value={config.provider}
              onChange={(e) => updateConfig({ provider: e.target.value as LLMProvider })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {providers.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          {config.provider === 'openai' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="sk-..."
              />
            </div>
          )}

          {(config.provider === 'ollama' || config.provider === 'lmstudio') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl || ''}
                onChange={(e) => updateConfig({ baseUrl: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={config.provider === 'ollama' ? 'http://localhost:11434' : 'http://localhost:1234'}
              />
              {config.provider === 'lmstudio' && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Note: The application will proxy requests to LM Studio to avoid CORS issues.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            {config.provider === 'openai' ? (
              <select
                value={config.model || 'gpt-3.5-turbo'}
                onChange={(e) => updateConfig({ model: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {openaiModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                {isLoadingModels ? (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading available models...</span>
                  </div>
                ) : modelError ? (
                  <div className="text-red-500 dark:text-red-400 text-sm">{modelError}</div>
                ) : availableModels.length > 0 ? (
                  <select
                    value={config.model}
                    onChange={(e) => updateConfig({ model: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    No models available. Please check your connection settings.
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Temperature ({config.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              value={config.maxTokens}
              onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="1"
              max="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Auto Post Interval (seconds)
            </label>
            <input
              type="number"
              value={config.autoPostInterval}
              onChange={(e) => {
                const value = Math.max(1, parseInt(e.target.value));
                updateConfig({ autoPostInterval: value });
              }}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="1"
              max="300"
            />
          </div>
        </div>
      </div>
    </>
  );
};