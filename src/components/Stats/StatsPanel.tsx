import React, { useState } from 'react';
import { 
  Hash, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  PieChart as BubbleChart, 
  Globe2, 
  MapPin, 
  Tag, 
  Eye,
  MessageSquare,
  User as UserIcon,
  Clock
} from 'lucide-react';
import { TagCorrelationHeatmap } from './TagCorrelationHeatmap';
import { Section } from './Section';
import { HiddenSectionsMenu } from './HiddenSectionsMenu';
import { useSimulatorStore } from '../../store';
import { formatDistanceToNow } from 'date-fns';
import type { User, Post, Comment, RecentAction } from '../../types';

interface StatsPanelProps {
  users: User[];
  posts: Post[];
  comments: Comment[];
  onUserSelect?: (user: User) => void;
  onTagSelect?: (tag: string) => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ 
  users, 
  posts, 
  comments,
  onUserSelect,
  onTagSelect 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showHiddenSections, setShowHiddenSections] = useState(false);

  const { statsConfig, updateStatsConfig } = useSimulatorStore();

  // Calculate total likes and dislikes across both posts and comments
  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0) +
    comments.reduce((sum, comment) => sum + comment.likes.length, 0);
  const totalDislikes = posts.reduce((sum, post) => sum + post.dislikes.length, 0) +
    comments.reduce((sum, comment) => sum + comment.dislikes.length, 0);
  
  // Calculate like ratio
  const totalInteractions = totalLikes + totalDislikes;
  const likeRatio = totalInteractions > 0 ? (totalLikes / totalInteractions * 100).toFixed(1) : '0.0';

  // Get popular tags
  const tagCounts = posts.reduce((counts, post) => {
    post.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Calculate user activity including both posts and comments
  const userActivity = users.map(user => {
    const userPosts = posts.filter(post => post.userId === user.id).length;
    const userComments = comments.filter(comment => comment.userId === user.id).length;
    const totalPosts = userPosts + userComments;
    const userLikes = posts.reduce((sum, post) => sum + (post.likes.includes(user.id) ? 1 : 0), 0) +
      comments.reduce((sum, comment) => sum + (comment.likes.includes(user.id) ? 1 : 0), 0);
    const userDislikes = posts.reduce((sum, post) => sum + (post.dislikes.includes(user.id) ? 1 : 0), 0) +
      comments.reduce((sum, comment) => sum + (comment.dislikes.includes(user.id) ? 1 : 0), 0);
    
    return {
      user,
      activity: totalPosts + userLikes + userDislikes,
      posts: totalPosts,
      interactions: userLikes + userDislikes
    };
  }).sort((a, b) => b.activity - a.activity);

  const mostActiveUsers = userActivity.slice(0, 5);

  // Calculate event counts
  const { events } = useSimulatorStore();
  const eventCounts = events.reduce((counts, event) => {
    counts[event.type] = (counts[event.type] || 0) + 1;
    return counts;
  }, { tag: 0, regional: 0, world: 0 } as Record<'tag' | 'regional' | 'world', number>);

  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const newConfig = [...statsConfig];
    const currentIndex = newConfig.findIndex(s => s.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < newConfig.length) {
      [newConfig[currentIndex], newConfig[newIndex]] = [newConfig[newIndex], newConfig[currentIndex]];
      newConfig.forEach((section, index) => {
        section.order = index;
      });
      updateStatsConfig(newConfig);
    }
  };

  const toggleSectionVisibility = (id: string) => {
    const newConfig = statsConfig.map(section =>
      section.id === id ? { ...section, visible: !section.visible } : section
    );
    updateStatsConfig(newConfig);
  };

  const hiddenSections = statsConfig.filter(section => !section.visible);
  const visibleSections = statsConfig
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Hash className="text-purple-500" />
                <h2 className="text-xl font-semibold dark:text-white">Statistics</h2>
              </div>
              {isOpen ? (
                <ChevronUp size={16} className="text-gray-400 dark:text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
              )}
            </button>
            {isOpen && hiddenSections.length > 0 && (
              <div className="relative ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHiddenSections(!showHiddenSections);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                >
                  <Eye size={16} />
                  <span className="text-sm">Show Hidden</span>
                </button>
                {showHiddenSections && (
                  <HiddenSectionsMenu
                    hiddenSections={hiddenSections}
                    onShowSection={(id) => toggleSectionVisibility(id)}
                    onClose={() => setShowHiddenSections(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {isOpen && (
          <div className="p-4 space-y-4">
            {visibleSections.map((section, index) => (
              <Section
                key={section.id}
                id={section.id}
                title={section.title}
                visible={section.visible}
                onVisibilityToggle={() => toggleSectionVisibility(section.id)}
                onMoveUp={() => moveSection(section.id, 'up')}
                onMoveDown={() => moveSection(section.id, 'down')}
                isFirst={index === 0}
                isLast={index === visibleSections.length - 1}
                defaultOpen={true}
              >
                {section.id === 'overview' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{users.length}</p>
                      <p className="text-gray-600 dark:text-gray-400">Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{posts.length + comments.length}</p>
                      <p className="text-gray-600 dark:text-gray-400">Total Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">
                        {((posts.length + comments.length) / Math.max(users.length, 1)).toFixed(1)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">Posts/User</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-500">{totalEvents}</p>
                      <p className="text-gray-600 dark:text-gray-400">Events</p>
                    </div>
                  </div>
                )}

                {section.id === 'eventDistribution' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <Tag className="text-green-600 dark:text-green-400" size={16} />
                        <span className="text-gray-700 dark:text-gray-300">Tag Events</span>
                      </div>
                      <span className="font-medium text-green-600 dark:text-green-400">{eventCounts.tag}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-blue-600 dark:text-blue-400" size={16} />
                        <span className="text-gray-700 dark:text-gray-300">Regional Events</span>
                      </div>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{eventCounts.regional}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <Globe2 className="text-red-600 dark:text-red-400" size={16} />
                        <span className="text-gray-700 dark:text-gray-300">World Events</span>
                      </div>
                      <span className="font-medium text-red-600 dark:text-red-400">{eventCounts.world}</span>
                    </div>
                  </div>
                )}

                {section.id === 'mostActiveUsers' && (
                  <div className="space-y-3">
                    {mostActiveUsers.map(({ user, activity, posts, interactions }) => (
                      <button
                        key={user.id}
                        onClick={() => onUserSelect?.(user)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium truncate text-blue-600 dark:text-blue-400">{user.username}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{posts} posts</span>
                            <span>{interactions} interactions</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-blue-500 dark:text-blue-400">
                          {activity} actions
                        </div>
                      </button>
                    ))}
                    {mostActiveUsers.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No user activity yet</p>
                    )}
                  </div>
                )}

                {section.id === 'interactionRatio' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <ThumbsUp size={16} />
                          <span>{totalLikes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <ThumbsDown size={16} />
                          <span>{totalDislikes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-green-500 dark:bg-green-400"
                        style={{ width: `${likeRatio}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {likeRatio}% positive
                    </p>
                  </div>
                )}

                {section.id === 'popularTags' && (
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => onTagSelect?.(tag)}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        #{tag}
                        <span className="text-blue-600 dark:text-blue-400 text-xs">({count})</span>
                      </button>
                    ))}
                    {popularTags.length > 0 && (
                      <button
                        onClick={() => setShowHeatmap(true)}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm flex items-center gap-1 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                      >
                        <BubbleChart size={14} />
                        <span>View Correlations</span>
                      </button>
                    )}
                    {popularTags.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tags used yet</p>
                    )}
                  </div>
                )}

                {section.id === 'recentActivity' && (
                  <div className="space-y-2">
                    {useSimulatorStore.getState().recentActions.slice(0, 5).map((action) => {
                      const actionUser = users.find(u => u.id === action.userId);
                      if (!actionUser) return null;

                      const getActionIcon = () => {
                        switch (action.type) {
                          case 'user':
                            return <UserIcon size={16} className="text-purple-500" />;
                          case 'post':
                            return <MessageSquare size={16} className="text-green-500" />;
                          case 'comment':
                            return <MessageSquare size={16} className="text-blue-500" />;
                          case 'vote':
                            return <ThumbsUp size={16} className="text-orange-500" />;
                        }
                      };

                      const handleActionClick = () => {
                        if (action.type === 'user') {
                          onUserSelect?.(actionUser);
                        } else if (action.postId) {
                          const post = posts.find(p => p.id === action.postId);
                          if (post) {
                            const postUser = users.find(u => u.id === post.userId);
                            if (postUser) onUserSelect?.(postUser);
                          }
                        }
                      };

                      return (
                        <button
                          key={`${action.type}-${action.timestamp}`}
                          onClick={handleActionClick}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          {getActionIcon()}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white truncate">
                              {action.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock size={12} />
                              <span>{formatDistanceToNow(new Date(action.timestamp))} ago</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {useSimulatorStore.getState().recentActions.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </div>
                )}
              </Section>
            ))}
          </div>
        )}
      </div>

      {showHeatmap && (
        <TagCorrelationHeatmap
          posts={posts}
          onClose={() => setShowHeatmap(false)}
        />
      )}
    </>
  );
};