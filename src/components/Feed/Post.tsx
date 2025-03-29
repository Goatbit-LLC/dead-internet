import React, { useState } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSimulatorStore } from '../../store';
import { LikeButtons } from './LikeButtons';
import { Tags } from './Tags';
import { AvatarSVG } from '../../utils/avatar';
import type { User, Post as PostType } from '../../types';

interface PostProps {
  post: PostType;
  user: User | undefined;
  users: User[];
  selectedUser: User | null;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
  setSelectedUser: (user: User | null) => void;
  isReply?: boolean;
}

export const Post: React.FC<PostProps> = ({
  post,
  user,
  users,
  selectedUser,
  selectedTag,
  onTagClick,
  setSelectedUser,
  isReply = false
}) => {
  const { addPost } = useSimulatorStore();
  const [showReplies, setShowReplies] = useState(false);
  
  // Get all replies to this post
  const replies = useSimulatorStore(state => 
    state.posts.filter(p => p.replyTo === post.id)
  );

  // Check if this is an instruction injection
  const isInjection = post.injectionId !== undefined;

  const handleReply = async () => {
    if (!selectedUser) return;
    await addPost(post.threadId, selectedUser.id, undefined, [], undefined, post.id);
  };

  return (
    <div className={`${
      isInjection 
        ? 'bg-black dark:bg-black text-white dark:text-white'
        : 'bg-white dark:bg-gray-800'
    } rounded-lg shadow-sm p-4 flex flex-col gap-3 ${isReply ? 'ml-12' : ''}`}>
      {isInjection ? (
        // Instruction Injection UI
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white/10">
            <AlertCircle className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">Instruction Injection</h3>
              <p className="text-sm text-white/60">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
            </div>
            <p className="mt-2 text-white/90">{post.content}</p>
          </div>
        </div>
      ) : (
        // Regular Post UI
        <div className="flex items-start gap-3">
          <button
            onClick={() => user && setSelectedUser(user)}
            className="hover:opacity-80 transition-opacity"
          >
            <AvatarSVG seed={user?.id} className="w-10 h-10 rounded-full" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <button
                onClick={() => user && setSelectedUser(user)}
                className="font-medium hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
              >
                {user?.username}
              </button>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{post.content}</p>
            {!isReply && <Tags tags={post.tags} selectedTag={selectedTag} onTagClick={onTagClick} />}
            <div className="flex items-center gap-4 mt-3">
              <LikeButtons
                type="post"
                id={post.id}
                likes={post.likes}
                dislikes={post.dislikes}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
              {!isReply && (
                <div className="flex items-center gap-2">
                  {replies.length > 0 ? (
                    <button
                      onClick={() => setShowReplies(!showReplies)}
                      className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span className="text-sm">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReply}
                      className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${
                        !selectedUser && 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!selectedUser}
                    >
                      <MessageCircle size={18} />
                      <span className="text-sm">Reply</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showReplies && replies.length > 0 && !isInjection && (
        <div className="mt-2 space-y-2">
          {replies.map(reply => (
            <Post
              key={reply.id}
              post={reply}
              user={users.find(u => u.id === reply.userId)}
              users={users}
              selectedUser={selectedUser}
              selectedTag={selectedTag}
              onTagClick={onTagClick}
              setSelectedUser={setSelectedUser}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};