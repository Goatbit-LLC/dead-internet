import type { LLMConfig } from '../../../types';

export async function generateWithLMStudio(prompt: string, config: LLMConfig): Promise<string> {
  try {
    const proxyUrl = '/lmstudio';
    
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    const requestBody = {
      messages,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 10000,
      stream: false
    };

    if (config.model && config.model !== 'default') {
      console.warn('LM Studio only supports a single model. The model parameter will be ignored.');
    }

    const response = await fetch(`${proxyUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LM Studio error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from LM Studio:', data);
      throw new Error('Invalid response format from LM Studio');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content with LM Studio:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return 'Error: Unable to connect to LM Studio. Please ensure LM Studio is running and the server is accessible.';
    }
    if (error instanceof Error && error.message.includes('Invalid response format')) {
      return 'Error: Invalid response from LM Studio. Please check if the server is running correctly.';
    }
    return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please check the console for details.`;
  }
}

export async function getLMStudioModels(baseUrl: string): Promise<string[]> {
  try {
    if (!baseUrl) {
      throw new Error('Base URL is required');
    }
    return ['default'];
  } catch (error) {
    console.error('Error fetching LM Studio models:', error);
    return ['default'];
  }
}