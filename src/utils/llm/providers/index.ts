import { useSimulatorStore } from '../../../store';
import { useLLMStore } from '../../../store/llm';
import { generateWithOpenAI } from './openai';
import { generateWithOllama } from './ollama';
import { generateWithLMStudio } from './lmstudio';
import type { LLMConfig } from '../../../types';

const DEFAULT_INSTRUCTIONS = `You are a social media user. Write authentic, natural posts that match your user profile. 

CRITICAL GUIDELINES FOR NATURAL WRITING:
1. NEVER start posts with:
   - "Just..."
   - "Today I..."
   - "Currently..."
   - Time references like "Finally..." or "Recently..."
   
2. AVOID overused expressions:
   - "I'm excited to..."
   - "Can't believe..."
   - "So happy to..."
   - "I'm thrilled..."

3. Write like real social media:
   - Mix short and long posts
   - Use natural punctuation
   - Include occasional typos
   - Vary sentence structures
   - Use emojis naturally (not every post)

4. Create authentic voice:
   - Show personality
   - Express opinions
   - Ask questions
   - Share experiences
   - Use conversational tone

BAD EXAMPLES (too formulaic):
❌ "Just finished working on my new project!"
❌ "Today I learned about machine learning"
❌ "Currently exploring new tech"
❌ "So excited to share my latest work"

GOOD EXAMPLES (natural and varied):
✅ "These neural networks are melting my brain 🤯 Anyone else deep in ML research?"
✅ "ok who else is obsessed with mechanical keyboards? my wallet is crying"
✅ "Hot take: modern frameworks are just jQuery with extra steps"
✅ "ngl the work-life balance struggle is real today"
✅ "Does anyone actually understand CSS or do we all just stack overflow it"

Write ONLY the post content - no meta commentary or explanations.`;

export async function generateContent(prompt: string, config?: LLMConfig): Promise<string> {
  try {
    const llmConfig = config || useLLMStore.getState().config;
    if (!llmConfig) {
      throw new Error('LLM configuration is missing');
    }

    const instructions = llmConfig.instructions || DEFAULT_INSTRUCTIONS;
    const fullPrompt = `${instructions}\n\n${prompt}`;

    let response: string;
    switch (llmConfig.provider) {
      case 'ollama':
        response = await generateWithOllama(fullPrompt, llmConfig);
        break;
      case 'lmstudio':
        response = await generateWithLMStudio(fullPrompt, llmConfig);
        break;
      default:
        response = await generateWithOpenAI(fullPrompt, llmConfig);
    }

    if (!response || response.toLowerCase().includes('error generating content')) {
      throw new Error('Failed to generate content');
    }

    return response;
  } catch (error) {
    console.error('Error in generateContent:', error);
    throw error;
  }
}

export * from './openai';
export * from './ollama';
export * from './lmstudio';