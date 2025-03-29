export type LLMProvider = 'openai' | 'ollama' | 'lmstudio';

export interface InstructionSet {
  id: string;
  name: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface InjectedInstruction {
  id: string;
  content: string;
  createdAt: string;
  expiresAfter: number;
  currentCount: number;
  active: boolean;
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  autoPostInterval?: number;
  instructions?: string;
  instructionSets: InstructionSet[];
  selectedInstructionSet?: string;
  injectedInstructions: InjectedInstruction[];
}