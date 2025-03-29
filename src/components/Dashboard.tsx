import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { useSimulatorStore } from '../store';
import { FilterModal } from './FilterModal';
import { UserList } from './UserPanel/UserList';
import { UserSettings } from './UserPanel/UserSettings';
import { PostFeed } from './Feed/PostFeed';
import { StatsPanel } from './Stats/StatsPanel';
import type { User } from '../types';

export const Dashboard: React.FC = () => {
  const { users, posts, comments, removeUser, updateUserInteractionValue } = useSimulatorStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<{
    gender: string;
    region: string;
    ageRange: string;
  }>({
    gender: '',
    region: '',
    ageRange: ''
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesUser = !selectedUser || post.userId === selectedUser.id;
    return matchesTag && (selectedUser ? matchesUser : true);
  });

  const postsWithUserComments = selectedUser
    ? posts.filter(post => 
        comments.some(comment => 
          comment.postId === post.id && comment.userId === selectedUser.id
        )
      )
    : [];

  const allFilteredPosts = [...new Set([...filteredPosts, ...postsWithUserComments])];

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.usedTags.some(({ tag }) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGender = filterCriteria.gender === '' || user.gender === filterCriteria.gender;
    const matchesRegion = filterCriteria.region === '' || user.region === filterCriteria.region;
    
    let matchesAge = true;
    if (filterCriteria.ageRange) {
      const [min, max] = filterCriteria.ageRange.split('-').map(Number);
      matchesAge = user.age >= min && user.age <= max;
    }

    return matchesSearch && matchesGender && matchesRegion && matchesAge;
  });

  const uniqueRegions = [...new Set(users.map(user => user.region))];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterCriteria={filterCriteria}
        onFilterChange={setFilterCriteria}
        regions={uniqueRegions}
      />

      <div className="lg:col-span-4 space-y-6">
        <StatsPanel
          users={users}
          posts={posts}
          comments={comments}
          onUserSelect={setSelectedUser}
          onTagSelect={handleTagClick}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" />
                <h2 className="text-xl font-semibold dark:text-white">User Management</h2>
              </div>
              <div className="flex gap-2">
                {isUserPanelOpen && (
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                  >
                    <Filter size={16} />
                    {Object.values(filterCriteria).some(v => v !== '') && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {isUserPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          </div>
          {isUserPanelOpen && (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              <UserList
                users={filteredUsers}
                selectedUser={selectedUser}
                onUserSelect={setSelectedUser}
                onUserRemove={(userId) => {
                  removeUser(userId);
                  if (selectedUser?.id === userId) setSelectedUser(null);
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className={`${isUserPanelOpen ? 'lg:col-span-8' : 'lg:col-span-11'} space-y-6`}>
        {selectedUser && (
          <UserSettings
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdateInteractionValue={(value) => updateUserInteractionValue(selectedUser.id, value)}
            onTagClick={handleTagClick}
            selectedTag={selectedTag}
          />
        )}

        <PostFeed
          posts={allFilteredPosts}
          users={users}
          comments={comments}
          selectedUser={selectedUser}
          selectedTag={selectedTag}
          onTagClick={handleTagClick}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};