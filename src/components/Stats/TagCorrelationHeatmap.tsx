import React, { useMemo, useState } from 'react';
import { X, BarChart2, Network, PieChart, GitBranch, Filter, Users, MessageSquare, ThumbsUp, Calendar, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
  BarChart,
  Bar,
  Cell,
  Treemap,
  RadialBarChart,
  RadialBar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Sector,
  Area,
  AreaChart
} from 'recharts';
import { useSimulatorStore } from '../../store';
import { format, subDays, startOfHour, endOfHour, eachHourOfInterval } from 'date-fns';
import type { Post, User } from '../../types';

interface TagCorrelationHeatmapProps {
  posts: Post[];
  onClose: () => void;
}

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

type VisualizationType = 'network' | 'treemap' | 'radial' | 'bar' | 'engagement' | 'demographics' | 'activity' | 'timeline' | 'hourly';

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6b7280'
];

export const TagCorrelationHeatmap: React.FC<TagCorrelationHeatmapProps> = ({ posts, onClose }) => {
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('network');
  const [activeIndex, setActiveIndex] = useState(0);
  const { users, comments } = useSimulatorStore();

  const { nodes, links, tagData, engagementData, demographicsData, activityData, timelineData, hourlyData } = useMemo(() => {
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
      hourlyData: hourlyActivity
    };
  }, [posts, users, comments]);

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'network':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis type="number" dataKey="x" domain={[0, 400]} hide />
              <YAxis type="number" dataKey="y" domain={[0, 400]} hide />
              <ZAxis type="number" dataKey="z" range={[30, 100]} />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.[0]?.payload) return null;
                  const { name, z } = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded border dark:border-gray-700">
                      <p className="font-medium dark:text-white">#{name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Used in {z} post{z !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                }}
              />
              {links.map((line, i) => (
                <Line
                  key={i}
                  type="linear"
                  dataKey="value"
                  stroke="#94a3b8"
                  strokeWidth={Math.min(line.value * 2, 8)}
                  opacity={0.2}
                  data={[
                    { value: line.value, x: nodes.find(n => n.id === line.source)?.x, y: nodes.find(n => n.id === line.source)?.y },
                    { value: line.value, x: nodes.find(n => n.id === line.target)?.x, y: nodes.find(n => n.id === line.target)?.y }
                  ]}
                  dot={false}
                />
              ))}
              <Scatter
                data={nodes.map(node => ({ ...node, z: node.count }))}
                fill="#3b82f6"
                label={({ name }) => `#${name}`}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'engagement':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={engagementData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="tag"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                      <p className="font-medium dark:text-white">#{label}</p>
                      <div className="mt-2 space-y-1">
                        {payload.map((entry, index) => (
                          <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                          >
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="likes" fill="#3b82f6" name="Likes" />
              <Bar yAxisId="right" dataKey="comments" fill="#ef4444" name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'demographics':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="tag"
                type="category"
                width={100}
                tick={({ x, y, payload }) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fill="#666" fontSize={12}>
                    #{payload.value}
                  </text>
                )}
              />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  const data = demographicsData.find(d => d.tag === label);
                  if (!data) return null;

                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                      <p className="font-medium dark:text-white">#{label}</p>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender Distribution</p>
                          <div className="space-y-1">
                            {Object.entries(data.genders).map(([gender, count]) => (
                              <p key={gender} className="text-sm">
                                {gender}: {count} users ({((count / data.total!) * 100).toFixed(1)}%)
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Age Distribution</p>
                          <div className="space-y-1">
                            {Object.entries(data.ageRanges).map(([range, count]) => (
                              <p key={range} className="text-sm">
                                {range}: {count} users ({((count / data.total!) * 100).toFixed(1)}%)
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Regions</p>
                          <div className="space-y-1">
                            {Object.entries(data.regions)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([region, count]) => (
                                <p key={region} className="text-sm">
                                  {region}: {count} users ({((count / data.total!) * 100).toFixed(1)}%)
                                </p>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="total" fill="#3b82f6">
                {demographicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'activity':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                      <p className="font-medium dark:text-white">{label}</p>
                      <div className="mt-2">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {payload[0].value} posts
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="posts"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'timeline':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded border dark:border-gray-700">
                      <p className="font-medium dark:text-white">{label}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Posts: {payload[0].value}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Likes: {payload[1].value}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Comments: {payload[2].value}
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="posts"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="likes"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="comments"
                stackId="3"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Tag Analysis</h3>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={20} />
            </button>
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No tag correlations found. Tags need to co-occur in posts to show relationships.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Tag Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyzing patterns and relationships between tags
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setVisualizationType('network')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  visualizationType === 'network'
                    ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
                title="Tag Relationships"
              >
                <Network size={20} />
              </button>
              <button
                onClick={() => setVisualizationType('engagement')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  visualizationType === 'engagement'
                    ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
                title="Engagement Analysis"
              >
                <ThumbsUp size={20} />
              </button>
              <button
                onClick={() => setVisualizationType('demographics')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  visualizationType === 'demographics'
                    ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
                title="Demographics Analysis"
              >
                <Users size={20} />
              </button>
              <button
                onClick={() => setVisualizationType('activity')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  visualizationType === 'activity'
                    ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
                title="24h Activity"
              >
                <Clock size={20} />
              </button>
              <button
                onClick={() => setVisualizationType('timeline')}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  visualizationType === 'timeline'
                    ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
                title="7-Day Timeline"
              >
                <Calendar size={20} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="h-[800px]">
          {renderVisualization()}
        </div>
      </div>
    </div>
  );
};