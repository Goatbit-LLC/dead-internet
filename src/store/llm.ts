import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMConfig, InstructionSet, InjectedInstruction } from '../types';

interface LLMStore {
  config: LLMConfig;
  updateConfig: (config: Partial<LLMConfig>) => void;
  addInstructionSet: (name: string, instructions: string) => InstructionSet;
  updateInstructionSet: (id: string, name: string, instructions: string) => void;
  deleteInstructionSet: (id: string) => void;
  selectInstructionSet: (id: string | undefined) => void;
  addInjectedInstruction: (content: string, expiresAfter: number) => InjectedInstruction;
  updateInjectedInstructionCount: (id: string) => void;
  deactivateInjectedInstruction: (id: string) => void;
}

const defaultConfig: LLMConfig = {
  provider: (import.meta.env.VITE_LLM_PROVIDER as LLMConfig['provider']) || 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  baseUrl: '',
  temperature: 0.7,
  maxTokens: 10000,
  autoPostInterval: 1,
  instructionSets: [],
  selectedInstructionSet: undefined,
  instructions: '',
  injectedInstructions: []
};

export const useLLMStore = create<LLMStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig }
        })),
      
      addInstructionSet: (name, instructions) => {
        const newSet: InstructionSet = {
          id: crypto.randomUUID(),
          name,
          instructions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          config: {
            ...state.config,
            instructionSets: [...state.config.instructionSets, newSet],
            selectedInstructionSet: newSet.id,
            instructions
          }
        }));

        return newSet;
      },
      
      updateInstructionSet: (id, name, instructions) =>
        set((state) => {
          const updatedSets = state.config.instructionSets.map(set =>
            set.id === id
              ? {
                  ...set,
                  name,
                  instructions,
                  updatedAt: new Date().toISOString()
                }
              : set
          );
          
          return {
            config: {
              ...state.config,
              instructionSets: updatedSets,
              instructions: state.config.selectedInstructionSet === id ? instructions : state.config.instructions
            }
          };
        }),
      
      deleteInstructionSet: (id) =>
        set((state) => {
          const newSets = state.config.instructionSets.filter(set => set.id !== id);
          return {
            config: {
              ...state.config,
              instructionSets: newSets,
              selectedInstructionSet: state.config.selectedInstructionSet === id ? undefined : state.config.selectedInstructionSet,
              instructions: state.config.selectedInstructionSet === id ? '' : state.config.instructions
            }
          };
        }),
      
      selectInstructionSet: (id) =>
        set((state) => {
          const selectedSet = id ? state.config.instructionSets.find(set => set.id === id) : undefined;
          return {
            config: {
              ...state.config,
              selectedInstructionSet: id,
              instructions: selectedSet?.instructions || ''
            }
          };
        }),

      addInjectedInstruction: (content, expiresAfter) => {
        const newInstruction: InjectedInstruction = {
          id: crypto.randomUUID(),
          content,
          createdAt: new Date().toISOString(),
          expiresAfter,
          currentCount: 0,
          active: true
        };

        set((state) => ({
          config: {
            ...state.config,
            injectedInstructions: [...(state.config.injectedInstructions || []), newInstruction]
          }
        }));

        return newInstruction;
      },

      updateInjectedInstructionCount: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            injectedInstructions: (state.config.injectedInstructions || []).map(instruction => {
              if (instruction.id === id) {
                const newCount = instruction.currentCount + 1;
                return {
                  ...instruction,
                  currentCount: newCount,
                  active: newCount < instruction.expiresAfter
                };
              }
              return instruction;
            })
          }
        })),

      deactivateInjectedInstruction: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            injectedInstructions: (state.config.injectedInstructions || []).map(instruction =>
              instruction.id === id ? { ...instruction, active: false } : instruction
            )
          }
        })),
    }),
    {
      name: 'llm-storage',
      version: 1,
    }
  )
);