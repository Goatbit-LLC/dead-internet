import React from 'react';
import { Post } from '../Post';
import { Event } from '../Event';
import type { User, Post as PostType, Comment, Event as EventType } from '../../../types';

interface ContentListProps {
  content: (PostType | EventType)[];
  users: User[];
  comments: Comment[];
  selectedUser: User | null;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
  setSelectedUser: (user: User | null) => void;
  searchQuery: string;
}

export const ContentList: React.FC<ContentListProps> = ({
  content,
  users,
  comments,
  selectedUser,
  selectedTag,
  onTagClick,
  setSelectedUser,
  searchQuery
}) => {
  if (content.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4 p-4">
      {content.map((item) => (
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
  );
};