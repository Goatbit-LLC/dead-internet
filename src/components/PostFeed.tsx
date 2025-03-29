import React, { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Settings, Settings2, Play, Pause, Search, X, Globe2, Tag, MapPin, MessageCircle, Save } from 'lucide-react';
import { LLMSettings } from '../LLMSettings';
import { LLMInstructionSets } from '../LLMInstructionSets';
import { SimulationSettings } from '../SimulationSettings';
import { SimulationControls } from '../SimulationControls';
import { InputModal } from '../InputModal';
import { Post } from './Post';
import { Event } from './Event';
import { useSimulatorStore } from '../../store';
import { SaveStateManager } from '../SaveStateManager';
import type { User, Post as PostType, Comment, EventType } from '../../types';

interface PostFeedProps {
  posts: PostType[];
  users: User[];
  comments: Comment[];
  selectedUser: User | null;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
  setSelectedUser: (user: User | null) => void;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  users,
  comments,
  selectedUser,
  selectedTag,
  onTagClick,
  setSelectedUser
}) => {
  const { addPosts, addVotes, addEvent, isSimulating, toggleSimulation, events } = useSimulatorStore();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSimulationSettings, setShowSimulationSettings] = useState(false);
  const [showLLMSettings, setShowLLMSettings] = useState(false);
  const [showLLMInstructions, setShowLLMInstructions] = useState(false);
  const [showActionDistribution, setShowActionDistribution] = useState(false);
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts and events based on search query and active filters
  const filteredContent = (() => {
    const filteredPosts = posts.filter(post => {
      // Apply user filter
      if (selectedUser && post.userId !== selectedUser.id) {
        const isUserComment = comments.some(
          comment => comment.postId === post.id && comment.userId === selectedUser.id
        );
        if (!isUserComment) return false;
      }

      // Apply tag filter
      if (selectedTag && !post.tags.includes(selectedTag)) return false;

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const user = users.find(u => u.id === post.userId);
        
        // Search in post content
        const matchesContent = post.content.toLowerCase().includes(query);
        
        // Search in username
        const matchesUsername = user?.username.toLowerCase().includes(query);
        
        // Search in tags
        const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(query));

        return matchesContent || matchesUsername || matchesTags;
      }

      return true;
    });

    const filteredEvents = events.filter(event => {
      // Apply tag filter
      if (selectedTag && !event.tags.includes(selectedTag)) return false;

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });

    // Combine and sort by creation date
    return [...filteredEvents, ...filteredPosts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  })();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-green-500" />
              <h2 className="text-xl font-semibold dark:text-white">Posts Feed</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Settings</div>
              <div className="flex">
                <button
                  onClick={() => setShowSimulationSettings(true)}
                  className="flex-1 p-2 bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 flex items-center justify-center gap-2 border-r border-blue-400"
                >
                  <Settings2 size={16} />
                  Simulation
                </button>
                <button
                  onClick={() => setShowLLMSettings(true)}
                  className="flex-1 p-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 border-r border-blue-400"
                >
                  <Settings size={16} />
                  LLM
                </button>
                <button
                  onClick={() => setShowLLMInstructions(true)}
                  className="flex-1 p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Instructions
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Automation</div>
              <div className="flex">
                <button
                  onClick={toggleSimulation}
                  className="flex-1 p-2 bg-purple-600 text-white rounded-l-lg hover:bg-purple-700 flex items-center justify-center gap-2 border-r border-purple-400"
                >
                  {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                  {isSimulating ? 'Stop' : 'Simulate'}
                </button>
                <button
                  onClick={() => setShowActionDistribution(true)}
                  className="flex-1 p-2 bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center gap-2 border-r border-purple-400"
                >
                  <Settings2 size={16} />
                  Actions
                </button>
                <button
                  onClick={() => setShowSaveManager(true)}
                  className="flex-1 p-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  State
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts by content, username, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            {/* Active Filters */}
            {(selectedUser || selectedTag || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUser && (
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    User: {selectedUser.username}
                    <X size={14} className="text-blue-600 dark:text-blue-400" />
                  </button>
                )}
                {selectedTag && (
                  <button
                    onClick={() => onTagClick(selectedTag)}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    #{selectedTag}
                    <X size={14} className="text-blue-600 dark:text-blue-400" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Search: {searchQuery}
                    <X size={14} className="text-blue-600 dark:text-blue-400" />
                  </button>
                )}
                {(selectedUser || selectedTag || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      onTagClick(selectedTag || '');
                      setSearchQuery('');
                    }}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear all filters
                    <X size={14} className="text-gray-600 dark:text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <InputModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSubmit={(count) => {
          addPosts(count);
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
          addVotes(count);
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
                  addEvent('tag');
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
                  addEvent('regional');
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
                  addEvent('world');
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

      {showSimulationSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SimulationSettings onClose={() => setShowSimulationSettings(false)} />
          </div>
        </div>
      )}

      {showLLMSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <LLMSettings onClose={() => setShowLLMSettings(false)} />
          </div>
        </div>
      )}

      {showLLMInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <LLMInstructionSets onClose={() => setShowLLMInstructions(false)} />
          </div>
        </div>
      )}

      {showActionDistribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SimulationControls onClose={() => setShowActionDistribution(false)} />
          </div>
        </div>
      )}

      {showSaveManager && (
        <SaveStateManager onClose={() => setShowSaveManager(false)} />
      )}

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {filteredContent.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? (
              <>No posts found matching "{searchQuery}"</>
            ) : selectedTag ? (
              <>No posts found with tag #{selectedTag}</>
            ) : selectedUser ? (
              <>No posts or comments by {selectedUser.username}</>
            ) : (
              <>No posts yet. Click "Post" to create some!</>
            )}
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {filteredContent.map((item) => (
              'type' in item ? (
                <Event
                  key={item.id}
                  event={item}
                  onTagClick={onTagClick}
                />
              ) : (
                <Post
                  key={item.id}
                  post={item}
                  user={users.find(u => u.id === item.userId)}
                  comments={comments}
                  users={users}
                  selectedUser={selectedUser}
                  selectedTag={selectedTag}
                  onTagClick={onTagClick}
                  setSelectedUser={setSelectedUser}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};