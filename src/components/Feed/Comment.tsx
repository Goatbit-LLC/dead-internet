import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { LikeButtons } from './LikeButtons';
import { AvatarSVG } from '../../utils/avatar';
import type { User, Comment as CommentType } from '../../types';

interface CommentProps {
  comment: CommentType;
  user: User | undefined;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export const Comment: React.FC<CommentProps> = ({ comment, user, selectedUser, setSelectedUser }) => (
  <div className="ml-12 mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm p-3 flex items-start gap-3">
    <button
      onClick={() => user && setSelectedUser(user)}
      className="hover:opacity-80 transition-opacity"
    >
      <AvatarSVG seed={user?.id} className="w-8 h-8 rounded-full" />
    </button>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <button
          onClick={() => user && setSelectedUser(user)}
          className="font-medium hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
        >
          {user?.username}
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {formatDistanceToNow(new Date(comment.createdAt))} ago
        </p>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{comment.content}</p>
      <div className="mt-2">
        <LikeButtons
          type="comment"
          id={comment.id}
          likes={comment.likes}
          dislikes={comment.dislikes}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  </div>
);