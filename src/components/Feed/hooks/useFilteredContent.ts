import { useMemo } from 'react';
import type { Post, Event, User, Comment } from '../../../types';

interface UseFilteredContentProps {
  posts: Post[];
  events: Event[];
  users: User[];
  comments: Comment[];
  selectedUser: User | null;
  selectedTag: string | null;
  searchQuery: string;
}

export const useFilteredContent = ({
  posts,
  events,
  users,
  comments,
  selectedUser,
  selectedTag,
  searchQuery
}: UseFilteredContentProps) => {
  return useMemo(() => {
    // First, get all parent posts (posts that aren't replies)
    const parentPosts = posts.filter(post => !post.replyTo);

    const filteredPosts = parentPosts.filter(post => {
      // For user filter, include:
      // 1. Posts by the user
      // 2. Posts with replies by the user
      // 3. Posts the user commented on
      if (selectedUser) {
        const isUserPost = post.userId === selectedUser.id;
        const hasUserReply = posts.some(p => p.replyTo === post.id && p.userId === selectedUser.id);
        const hasUserComment = comments.some(comment => comment.postId === post.id && comment.userId === selectedUser.id);
        
        if (!isUserPost && !hasUserReply && !hasUserComment) return false;
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

        // Search in replies
        const replies = posts.filter(p => p.replyTo === post.id);
        const matchesReplies = replies.some(reply => {
          const replyUser = users.find(u => u.id === reply.userId);
          return (
            reply.content.toLowerCase().includes(query) ||
            replyUser?.username.toLowerCase().includes(query)
          );
        });

        return matchesContent || matchesUsername || matchesTags || matchesReplies;
      }

      return true;
    });

    // Only include events if there's no user filter
    const filteredEvents = selectedUser ? [] : events.filter(event => {
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
  }, [posts, events, users, comments, selectedUser, selectedTag, searchQuery]);
};