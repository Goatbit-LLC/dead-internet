import React from 'react';
import { X } from 'lucide-react';
import type { User } from '../../types';

interface VoteDetailsProps {
  users: User[];
  userIds: string[];
  onClose: () => void;
  onUserClick: (userId: string) => void;
}

export const VoteDetails: React.FC<VoteDetailsProps> = ({ users, userIds, onClose, onUserClick }) => {
  const voters = users.filter(user => userIds.includes(user.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voters</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {voters.length > 0 ? (
            <div className="space-y-4">
              {voters.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    onUserClick(user.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.region}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No votes yet</p>
          )}
        </div>
      </div>
    </div>
  );
};