import type { LLMConfig } from '../../../types';

export async function generateWithOllama(prompt: string, config: LLMConfig): Promise<string> {
  try {
    if (!config.baseUrl) {
      throw new Error('Base URL is required');
    }
    if (!config.model) {
      throw new Error('Model name is required');
    }

    // Ensure model is a simple string, not an object
    const modelName = typeof config.model === 'object' ? 
      (config.model as any).name || 'mistral' : 
      String(config.model);

    const response = await fetch(`${config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: String(prompt),
        stream: false,
        options: {
          temperature: Number(config.temperature) || 0.7,
          num_predict: Number(config.maxTokens) || 10000
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'Error generating content';
  } catch (error) {
    console.error('Error generating content with Ollama:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return 'Error: Unable to connect to Ollama. Please ensure Ollama is running and the server is accessible.';
    }
    return `Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export async function getOllamaModels(baseUrl: string): Promise<string[]> {
  try {
    if (!baseUrl) {
      throw new Error('Base URL is required');
    }

    const response = await fetch(`${baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the response from /api/tags which returns an array of model objects
    if (Array.isArray(data.models)) {
      return data.models.map(model => model.name);
    } else if (Array.isArray(data)) {
      return data.map(model => {
        if (typeof model === 'string') return model;
        if (typeof model === 'object' && model.name) return model.name;
        return null;
      }).filter(Boolean);
    }

    // Fallback if the response format is unexpected
    console.warn('Unexpected Ollama API response format:', data);
    return ['mistral', 'llama2']; // Provide some default models as fallback
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return ['Error: Unable to connect to Ollama. Please ensure Ollama is running.'];
    }
    return ['mistral', 'llama2']; // Return default models on error
  }
}