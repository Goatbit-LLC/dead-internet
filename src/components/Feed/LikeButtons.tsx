import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSimulatorStore } from '../../store';
import { VoteDetails } from '../UserPanel/VoteDetails';
import type { User } from '../../types';

interface LikeButtonsProps {
  type: 'post' | 'comment';
  id: string;
  likes: string[];
  dislikes: string[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export const LikeButtons: React.FC<LikeButtonsProps> = ({ 
  type, 
  id, 
  likes, 
  dislikes, 
  selectedUser, 
  setSelectedUser 
}) => {
  const { toggleLike, toggleDislike } = useSimulatorStore();
  const [showLikes, setShowLikes] = useState(false);
  const [showDislikes, setShowDislikes] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => selectedUser ? toggleLike(type, id, selectedUser.id) : setShowLikes(true)}
          className={`flex items-center gap-1 transition-colors ${
            selectedUser && likes.includes(selectedUser.id) 
              ? 'text-blue-500 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
          }`}
        >
          <ThumbsUp size={16} />
          <span className="text-sm">{likes.length}</span>
        </button>
        <button
          onClick={() => selectedUser ? toggleDislike(type, id, selectedUser.id) : setShowDislikes(true)}
          className={`flex items-center gap-1 transition-colors ${
            selectedUser && dislikes.includes(selectedUser.id) 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          <ThumbsDown size={16} />
          <span className="text-sm">{dislikes.length}</span>
        </button>
      </div>

      {showLikes && (
        <VoteDetails
          users={useSimulatorStore.getState().users}
          userIds={likes}
          onClose={() => setShowLikes(false)}
          onUserClick={(userId) => {
            const user = useSimulatorStore.getState().users.find(u => u.id === userId);
            if (user) setSelectedUser(user);
          }}
        />
      )}

      {showDislikes && (
        <VoteDetails
          users={useSimulatorStore.getState().users}
          userIds={dislikes}
          onClose={() => setShowDislikes(false)}
          onUserClick={(userId) => {
            const user = useSimulatorStore.getState().users.find(u => u.id === userId);
            if (user) setSelectedUser(user);
          }}
        />
      )}
    </>
  );
};