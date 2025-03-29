import React, { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useLLMStore } from '../../store/llm';
import { useSimulatorStore } from '../../store';

interface InstructionInjectProps {
  onClose: () => void;
}

export const InstructionInject: React.FC<InstructionInjectProps> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [expiresAfter, setExpiresAfter] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Add the instruction to the LLM store
    const instruction = useLLMStore.getState().addInjectedInstruction(content.trim(), expiresAfter);
    
    // Create a post to show the injection
    const threadId = crypto.randomUUID();
    await useSimulatorStore.getState().addPost(
      threadId,
      undefined,
      content.trim(),
      ['instruction-injection'],
      instruction.id
    );
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-semibold dark:text-white">Create Instruction Injection</h3>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Purpose</h4>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Instruction injections allow you to temporarily modify how users interact on the platform.
              These instructions will influence user behavior, content generation, and responses for a
              specified number of posts before expiring.
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Examples:</strong>
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                <li>Users consider certain topics taboo or controversial</li>
                <li>Users are excited about a specific event or trend</li>
                <li>Users are skeptical of certain claims or ideas</li>
                <li>Users prefer specific communication styles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Instruction Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Enter the instruction that will influence user behavior..."
          required
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Write clear, specific instructions about how users should behave or what they should consider
          when interacting.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expires After ({expiresAfter} posts)
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={expiresAfter}
          onChange={(e) => setExpiresAfter(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>5 posts</span>
          <span>50 posts</span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The instruction will be active for this many posts before expiring.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Instruction
        </button>
      </div>
    </form>
  );
};