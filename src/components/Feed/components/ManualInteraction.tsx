import React, { useState } from 'react';
import { Send, ThumbsUp, ThumbsDown, Globe2, Tag, MapPin, X } from 'lucide-react';
import { InputModal } from '../../InputModal';
import type { EventType } from '../../../types';

interface ManualInteractionProps {
  onGeneratePosts: (count: number) => void;
  onGenerateVotes: (count: number) => void;
  onGenerateEvent: (type: EventType) => void;
}

export const ManualInteraction: React.FC<ManualInteractionProps> = ({
  onGeneratePosts,
  onGenerateVotes,
  onGenerateEvent
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Manual Interaction</div>
      <div className="flex">
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex-1 p-2 bg-green-600 text-white rounded-l-lg hover:bg-green-700 flex items-center justify-center gap-2 border-r border-green-400"
        >
          <Send size={16} />
          Post
        </button>
        <button
          onClick={() => setShowVoteModal(true)}
          className="flex-1 p-2 bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2 border-r border-green-400"
        >
          <div className="flex items-center gap-1">
            <ThumbsUp size={14} />
            <ThumbsDown size={14} />
          </div>
          Vote
        </button>
        <button
          onClick={() => setShowEventModal(true)}
          className="flex-1 p-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <Globe2 size={16} />
          Event
        </button>
      </div>

      <InputModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSubmit={(count) => {
          onGeneratePosts(count);
          setShowGenerateModal(false);
        }}
        title="Generate Posts"
        description="How many posts would you like to generate?"
        min={1}
        max={50}
      />

      <InputModal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        onSubmit={(count) => {
          onGenerateVotes(count);
          setShowVoteModal(false);
        }}
        title="Generate Random Votes"
        description="How many random votes would you like to generate?"
        min={1}
        max={100}
      />

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Generate Event</h3>
              <button onClick={() => setShowEventModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  onGenerateEvent('tag');
                  setShowEventModal(false);
                }}
                className="w-full p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-3"
              >
                <Tag size={16} />
                <div className="text-left">
                  <p className="font-medium">Tag Event</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Topic-specific events like product launches</p>
                </div>
              </button>
              <button
                onClick={() => {
                  onGenerateEvent('regional');
                  setShowEventModal(false);
                }}
                className="w-full p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-3"
              >
                <MapPin size={16} />
                <div className="text-left">
                  <p className="font-medium">Regional Event</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Events affecting specific regions</p>
                </div>
              </button>
              <button
                onClick={() => {
                  onGenerateEvent('world');
                  setShowEventModal(false);
                }}
                className="w-full p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-3"
              >
                <Globe2 size={16} />
                <div className="text-left">
                  <p className="font-medium">World Event</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Global impact events</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};