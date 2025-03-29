import OpenAI from 'openai';
import type { LLMConfig } from '../../../types';

// Define max token limits for different models
const MODEL_TOKEN_LIMITS: Record<string, number> = {
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-turbo-preview': 128000,
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-16k': 16384
};

export const OPENAI_MODELS = [
  {
    name: 'gpt-4-turbo-paareview',
    label: 'GPT-4 Turbo',
    description: 'Most capable model, optimized for speed and cost',
    tokens: MODEL_TOKEN_LIMITS['gpt-4-turbo-preview']
  },
  {
    name: 'gpt-4',
    label: 'GPT-4',
    description: 'Most capable model for complex tasks',
    tokens: MODEL_TOKEN_LIMITS['gpt-4']
  },
  {
    name: 'gpt-4-32k',
    label: 'GPT-4 32K',
    description: 'Same capabilities as GPT-4 with 4x context length',
    tokens: MODEL_TOKEN_LIMITS['gpt-4-32k']
  },
  {
    name: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective for most tasks',
    tokens: MODEL_TOKEN_LIMITS['gpt-3.5-turbo']
  },
  {
    name: 'gpt-3.5-turbo-16k',
    label: 'GPT-3.5 Turbo 16K',
    description: 'Same capabilities as GPT-3.5 Turbo with 4x context length',
    tokens: MODEL_TOKEN_LIMITS['gpt-3.5-turbo-16k']
  }
];

export async function getOpenAIModels(apiKey: string): Promise<typeof OPENAI_MODELS> {
  try {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Fetch available models
    const response = await openai.models.list();
    
    // Filter for chat completion models and map to our format
    const availableModels = response.data
      .filter(model => 
        model.id.startsWith('gpt-') && 
        OPENAI_MODELS.some(m => m.name === model.id)
      )
      .map(model => {
        const predefinedModel = OPENAI_MODELS.find(m => m.name === model.id);
        return predefinedModel || {
          name: model.id,
          label: model.id,
          description: 'OpenAI chat model',
          tokens: MODEL_TOKEN_LIMITS[model.id as keyof typeof MODEL_TOKEN_LIMITS] || 4096
        };
      });

    return availableModels.length > 0 ? availableModels : OPENAI_MODELS;
  } catch (error) {
    console.error('Error fetching OpenAI models:', error);
    // Return predefined models as fallback
    return OPENAI_MODELS;
  }
}

export async function generateWithOpenAI(prompt: string, config: LLMConfig): Promise<string> {
  try {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const openai = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true
    });

    const model = config.model || 'gpt-3.5-turbo';
    
    // Get the token limit for the selected model, default to 4096 if unknown
    const modelTokenLimit = MODEL_TOKEN_LIMITS[model] || 4096;
    
    // Use either the configured max tokens or 75% of the model's limit, whichever is smaller
    const maxTokens = Math.min(
      config.maxTokens || modelTokenLimit,
      Math.floor(modelTokenLimit * 0.75)
    );

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: model,
      temperature: config.temperature || 0.7,
      max_tokens: maxTokens
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content in OpenAI response');
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Error: Invalid or missing OpenAI API key. Please check your configuration.';
      }
      if (error.message.includes('max_tokens')) {
        return 'Error: Token limit exceeded. Try reducing the length of your prompt or using a model with higher token limits.';
      }
      return `Error generating content: ${error.message}`;
    }
    return 'Error: An unknown error occurred while generating content';
  }
}