import React, { useState } from 'react';
import { Settings, X, Send, Plus, Tag } from 'lucide-react';
import { useSimulatorStore } from '../../store';
import { AvatarSVG } from '../../utils/avatar';
import type { User } from '../../types';

interface UserSettingsProps {
  user: User;
  onClose: () => void;
  onUpdateInteractionValue: (value: number) => void;
  onTagClick: (tag: string) => void;
  selectedTag: string | null;
}

export const UserSettings: React.FC<UserSettingsProps> = ({
  user,
  onClose,
  onUpdateInteractionValue,
  onTagClick,
  selectedTag
}) => {
  const [postContent, setPostContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const { addPost } = useSimulatorStore();

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const formattedTag = newTag.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    if (!customTags.includes(formattedTag)) {
      setCustomTags([...customTags, formattedTag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    
    const threadId = crypto.randomUUID();
    await addPost(threadId, user.id, postContent, customTags);
    setPostContent('');
    setCustomTags([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow relative overflow-hidden">
      {/* Avatar Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: 'scale(1.5)',
            transformOrigin: 'top'
          }}
        >
          <AvatarSVG seed={user.id} className="w-full h-full" />
        </div>
        <div className="absolute inset-0 backdrop-blur-[10px] bg-white/50 dark:bg-gray-800/50" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AvatarSVG seed={user.id} className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="text-xl font-semibold dark:text-white">{user.username}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">User Settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <p className="mt-1 text-lg dark:text-white">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
              <p className="mt-1 text-lg dark:text-white">{user.age}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <p className="mt-1 text-lg capitalize dark:text-white">{user.gender}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Region</label>
            <p className="mt-1 text-lg dark:text-white">{user.region}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Create Post</label>
            <div className="mt-1 space-y-2">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`Post as ${user.username}...`}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none bg-white/50 dark:bg-gray-700/50"
                rows={3}
              />
              
              <div className="flex flex-wrap gap-2">
                {customTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    #{tag}
                    <X size={12} className="text-blue-600 dark:text-blue-400" />
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-white/50 dark:bg-gray-700/50"
                    />
                    <Tag className="absolute left-2.5 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
                  </div>
                  <button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Tag
                  </button>
                </div>
                <button
                  onClick={handlePost}
                  disabled={!postContent.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={16} />
                  Post
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interaction Value</label>
            <input
              type="range"
              min="1"
              max="10"
              value={user.interactionValue}
              onChange={(e) => onUpdateInteractionValue(Number(e.target.value))}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interests</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Used Tags</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {user.usedTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className={`px-2 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  #{tag}
                  <span className={`text-xs ${selectedTag === tag ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Behavioral Profile</label>
            <div className="mt-1 space-y-2">
              <p className="text-sm dark:text-gray-300">
                Tone: <span className="font-medium">{user.behavioralProfile.tone}</span>
              </p>
              <p className="text-sm dark:text-gray-300">
                Verbosity: <span className="font-medium">{user.behavioralProfile.verbosity}/10</span>
              </p>
              <p className="text-sm dark:text-gray-300">
                Response Speed: <span className="font-medium">{user.behavioralProfile.responseSpeed}/10</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</label>
            <div className="mt-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Likes</h4>
                <div className="flex flex-wrap gap-2">
                  {user.preferences?.likes.map(({ keyword, count }) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-1"
                    >
                      {keyword}
                      <span className="text-xs text-green-600 dark:text-green-400">({count})</span>
                    </span>
                  ))}
                  {(!user.preferences?.likes || user.preferences.likes.length === 0) && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No likes yet</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Dislikes</h4>
                <div className="flex flex-wrap gap-2">
                  {user.preferences?.dislikes.map(({ keyword, count }) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm flex items-center gap-1"
                    >
                      {keyword}
                      <span className="text-xs text-red-600 dark:text-red-400">({count})</span>
                    </span>
                  ))}
                  {(!user.preferences?.dislikes || user.preferences.dislikes.length === 0) && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No dislikes yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};