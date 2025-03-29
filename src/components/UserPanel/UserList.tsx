import React, { useState } from 'react';
import { Trash2, MapPin, User as UserIcon, Tag, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSimulatorStore } from '../../store';
import { InputModal } from '../InputModal';
import { AvatarSVG } from '../../utils/avatar';
import type { User } from '../../types';

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onUserRemove: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedUser,
  onUserSelect,
  onUserRemove
}) => {
  const { addUsers } = useSimulatorStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          Add Users
        </button>
      </div>

      <InputModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(count) => addUsers(count)}
        title="Add Users"
        description="How many users would you like to generate?"
        min={1}
        max={50}
      />

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
              selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onClick={() => onUserSelect(user)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AvatarSVG seed={user.id} className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <p className="font-medium dark:text-white">{user.username}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <UserIcon size={14} />
                    <span>{user.age} • {user.gender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={14} />
                    <span>{user.region}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Tag size={14} />
                    <span>
                      {user.usedTags.length > 0
                        ? `${user.usedTags.length} tags used`
                        : 'No tags used yet'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined {formatDistanceToNow(new Date(user.joinedAt))} ago
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUserRemove(user.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No users match the current filters
          </div>
        )}
      </div>
    </>
  );
};