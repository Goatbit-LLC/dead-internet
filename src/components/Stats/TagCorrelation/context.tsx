import React, { createContext, useContext, useMemo } from 'react';
import { useSimulatorStore } from '../../../store';
import type { Post, User } from '../../../types';

interface TagNode {
  id: string;
  name: string;
  count: number;
  x: number;
  y: number;
}

interface TagLink {
  source: string;
  target: string;
  value: number;
}

interface TagData {
  name: string;
  value: number;
  fill: string;
}

interface EngagementData {
  tag: string;
  posts: number;
  likes: number;
  comments: number;
  engagement: string;
}

interface DemographicsData {
  tag: string;
  genders: Record<string, number>;
  ageRanges: Record<string, number>;
  regions: Record<string, number>;
  total?: number;
}

interface ActivityData {
  hour: string;
  posts: number;
}

interface TimelineData {
  date: string;
  posts: number;
  likes: number;
  comments: number;
}

interface TagCorrelationData {
  nodes: TagNode[];
  links: TagLink[];
  tagData: TagData[];
  engagementData: EngagementData[];
  demographicsData: DemographicsData[];
  activityData: ActivityData[];
  timelineData: TimelineData[];
  hourlyData: ActivityData[];
}

interface TagCorrelationContextType extends TagCorrelationData {
  COLORS: string[];
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6b7280'
];

const TagCorrelationContext = createContext<TagCorrelationContextType | null>(null);

export const useTagCorrelation = () => {
  const context = useContext(TagCorrelationContext);
  if (!context) {
    throw new Error('useTagCorrelation must be used within a TagCorrelationProvider');
  }
  return context;
};

interface TagCorrelationProviderProps {
  posts: Post[];
  children: React.ReactNode;
}

export const TagCorrelationProvider: React.FC<TagCorrelationProviderProps> = ({ posts, children }) => {
  const { users, comments } = useSimulatorStore();

  const value = useMemo(() => {
    // Get all unique tags and their counts
    const tagCounts = new Map<string, number>();
    const tagPairs = new Map<string, number>();
    const tagEngagement = new Map<string, { posts: number; likes: number; comments: number }>();
    const tagDemographics = new Map<string, { 
      genders: Record<string, number>,
      ageRanges: Record<string, number>,
      regions: Record<string, number>
    }>();

    posts.forEach(post => {
      // Count tag occurrences and pairs
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        
        // Track engagement
        const tagStats = tagEngagement.get(tag) || { posts: 0, likes: 0, comments: 0 };
        tagStats.posts++;
        tagStats.likes += post.likes.length;
        tagStats.comments += comments.filter(c => c.postId === post.id).length;
        tagEngagement.set(tag, tagStats);
        
        // Track demographics
        const postUser = users.find(u => u.id === post.userId);
        if (postUser) {
          const demographics = tagDemographics.get(tag) || {
            genders: {},
            ageRanges: {},
            regions: {}
          };
          
          demographics.genders[postUser.gender] = (demographics.genders[postUser.gender] || 0) + 1;
          
          const ageRange = (() => {
            if (postUser.age <= 25) return '18-25';
            if (postUser.age <= 35) return '26-35';
            if (postUser.age <= 50) return '36-50';
            return '51+';
          })();
          demographics.ageRanges[ageRange] = (demographics.ageRanges[ageRange] || 0) + 1;
          demographics.regions[postUser.region] = (demographics.regions[postUser.region] || 0) + 1;
          
          tagDemographics.set(tag, demographics);
        }
        
        // Count tag pairs
        post.tags.forEach(otherTag => {
          if (tag !== otherTag) {
            const pairKey = [tag, otherTag].sort().join('|');
            tagPairs.set(pairKey, (tagPairs.get(pairKey) || 0) + 1);
          }
        });
      });
    });

    // Convert to array and sort by count
    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);

    // Create nodes with positions in a spiral
    const nodes: TagNode[] = sortedTags.map(([tag, count], i) => {
      const angle = (i / sortedTags.length) * Math.PI * 8;
      const radius = Math.sqrt(i + 1) * 20;
      return {
        id: tag,
        name: tag,
        count,
        x: Math.cos(angle) * radius + 200,
        y: Math.sin(angle) * radius + 200
      };
    });

    // Create links between nodes
    const links: TagLink[] = [];
    const nodeIds = new Set(nodes.map(n => n.id));
    const maxLinkValue = Math.max(...Array.from(tagPairs.values()));

    tagPairs.forEach((count, pairKey) => {
      const [source, target] = pairKey.split('|');
      if (nodeIds.has(source) && nodeIds.has(target)) {
        links.push({
          source,
          target,
          value: 1 + (count / maxLinkValue) * 4
        });
      }
    });

    // Prepare data for other visualizations
    const tagData = sortedTags.map(([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length]
    }));

    // Prepare engagement data
    const engagementData = Array.from(tagEngagement.entries())
      .sort((a, b) => b[1].posts - a[1].posts)
      .slice(0, 15)
      .map(([tag, stats]) => ({
        tag,
        posts: stats.posts,
        likes: stats.likes,
        comments: stats.comments,
        engagement: ((stats.likes + stats.comments) / stats.posts).toFixed(2)
      }));

    // Prepare demographics data
    const demographicsData = Array.from(tagDemographics.entries())
      .sort((a, b) => tagCounts.get(b[0])! - tagCounts.get(a[0])!)
      .slice(0, 10)
      .map(([tag, data]) => ({
        tag,
        ...data,
        total: tagCounts.get(tag)
      }));

    // Prepare activity data
    const now = new Date();
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const hour = subDays(now, i);
      return {
        hour: format(hour, 'HH:mm'),
        posts: posts.filter(post => {
          const postDate = new Date(post.createdAt);
          return postDate >= startOfHour(hour) && postDate < endOfHour(hour);
        }).length
      };
    }).reverse();

    // Prepare timeline data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, i);
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.createdAt);
        return format(postDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        date: format(date, 'MM/dd'),
        posts: dayPosts.length,
        likes: dayPosts.reduce((sum, post) => sum + post.likes.length, 0),
        comments: dayPosts.reduce((sum, post) => sum + comments.filter(c => c.postId === post.id).length, 0)
      };
    }).reverse();

    // Prepare hourly activity data
    const hourlyActivity = eachHourOfInterval({
      start: subDays(now, 1),
      end: now
    }).map(hour => ({
      hour: format(hour, 'HH:mm'),
      posts: posts.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate >= startOfHour(hour) && postDate < endOfHour(hour);
      }).length
    }));

    return {
      nodes,
      links,
      tagData,
      engagementData,
      demographicsData,
      activityData: last24Hours,
      timelineData: last7Days,
      hourlyData: hourlyActivity,
      COLORS
    };
  }, [posts, users, comments]);

  return (
    <TagCorrelationContext.Provider value={value}>
      {children}
    </TagCorrelationContext.Provider>
  );
};