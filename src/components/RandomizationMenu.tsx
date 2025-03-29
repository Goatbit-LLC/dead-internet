import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSimulatorStore } from '../store';
import { InputModal } from './InputModal';

export const RandomizationMenu: React.FC = () => {
  const [showVoteModal, setShowVoteModal] = useState(false);
  const { addVotes } = useSimulatorStore();

  return (
    <div className="relative">
      <button
        onClick={() => setShowVoteModal(true)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-2"
      >
        <div className="flex items-center gap-1">
          <ThumbsUp size={14} />
          <ThumbsDown size={14} />
        </div>
        <span>Random Vote</span>
      </button>

      <InputModal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        onSubmit={(count) => addVotes(count)}
        title="Generate Random Votes"
        description="How many random votes would you like to generate?"
        min={1}
        max={100}
      />
    </div>
  );
};