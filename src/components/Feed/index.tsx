import React, { useState } from 'react';
import { useSimulatorStore } from '../../store';
import { Header } from './components/Header';
import { ManualInteraction } from './components/ManualInteraction';
import { SettingsButtons } from './components/SettingsButtons';
import { AutomationControls } from './components/AutomationControls';
import { SearchBar } from './components/SearchBar';
import { ContentList } from './components/ContentList';
import { Modals } from './components/Modals';
import { useModalState } from './hooks/useModalState';
import { useFilteredContent } from './hooks/useFilteredContent';
import type { User, Post as PostType, Comment } from '../../types';

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
  const [searchQuery, setSearchQuery] = useState('');
  const modalState = useModalState();

  const filteredContent = useFilteredContent({
    posts,
    events,
    users,
    comments,
    selectedUser,
    selectedTag,
    searchQuery
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Header />
          </div>

          <div className="flex items-center gap-4">
            <ManualInteraction
              onGeneratePosts={addPosts}
              onGenerateVotes={addVotes}
              onGenerateEvent={addEvent}
            />

            <SettingsButtons
              onSimulationSettings={() => modalState.setShowSimulationSettings(true)}
              onLLMSettings={() => modalState.setShowLLMSettings(true)}
              onLLMInstructions={() => modalState.setShowLLMInstructions(true)}
            />

            <AutomationControls
              isSimulating={isSimulating}
              onToggleSimulation={toggleSimulation}
              onShowActionDistribution={() => modalState.setShowActionDistribution(true)}
              onShowSaveManager={() => modalState.setShowSaveManager(true)}
            />
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedUser={selectedUser}
            selectedTag={selectedTag}
            onClearUser={() => setSelectedUser(null)}
            onClearTag={() => onTagClick(selectedTag || '')}
            onClearAll={() => {
              setSelectedUser(null);
              onTagClick(selectedTag || '');
              setSearchQuery('');
            }}
          />
        </div>
      </div>

      <Modals
        showSimulationSettings={modalState.showSimulationSettings}
        showLLMSettings={modalState.showLLMSettings}
        showLLMInstructions={modalState.showLLMInstructions}
        showActionDistribution={modalState.showActionDistribution}
        showSaveManager={modalState.showSaveManager}
        onCloseSimulationSettings={() => modalState.setShowSimulationSettings(false)}
        onCloseLLMSettings={() => modalState.setShowLLMSettings(false)}
        onCloseLLMInstructions={() => modalState.setShowLLMInstructions(false)}
        onCloseActionDistribution={() => modalState.setShowActionDistribution(false)}
        onCloseSaveManager={() => modalState.setShowSaveManager(false)}
      />

      <ContentList
        content={filteredContent}
        users={users}
        comments={comments}
        selectedUser={selectedUser}
        selectedTag={selectedTag}
        onTagClick={onTagClick}
        setSelectedUser={setSelectedUser}
        searchQuery={searchQuery}
      />
    </div>
  );
};