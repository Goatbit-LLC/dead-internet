import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useSimulatorStore } from '../../store';
import { AvatarSVG } from '../../utils/avatar';
import type { User } from '../../types';

interface PostInjectProps {
  onClose: () => void;
}

export const PostInject: React.FC<PostInjectProps> = ({ onClose }) => {
  const { users } = useSimulatorStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [content, setContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showUserSelect, setShowUserSelect] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !content.trim()) return;

    const threadId = crypto.randomUUID();
    await useSimulatorStore.getState().addPost(threadId, selectedUser.id, content, tags);
    onClose();
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const formattedTag = newTag.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.region.toLowerCase().includes(query) ||
      user.interests.some(interest => interest.toLowerCase().includes(query))
    );
  });

  if (showUserSelect) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-xl font-semibold dark:text-white">Select User</h3>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, region, or interests..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setShowUserSelect(false);
              }}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
            >
              <AvatarSVG seed={user.id} className="w-12 h-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.region} • {user.age} years old
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.interests.slice(0, 2).map((interest, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                  {user.interests.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{user.interests.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUserSelect(true)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <AvatarSVG seed={selectedUser?.id} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="text-xl font-semibold dark:text-white">
              Create Post as {selectedUser?.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUser?.region} • {selectedUser?.age} years old
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Write your post content..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
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
          Create Post
        </button>
      </div>
    </form>
  );
};