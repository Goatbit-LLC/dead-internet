import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Post, Comment, Thread, SimulationWeights, Event, EventType, PendingTask, TaskType, RecentAction } from '../types';
import { generateUser, generatePostContent, generateTags, generateVoteKeywords, generateEvent, generateReplyContent } from '../utils/llm';
import { useLLMStore } from './llm';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface StatsSectionConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

interface SimulatorState extends ThemeState {
  users: User[];
  posts: Post[];
  comments: Comment[];
  threads: Thread[];
  isSimulating: boolean;
  simulationTimer: number | null;
  simulationWeights: SimulationWeights;
  pendingRequests: number;
  pendingTasks: PendingTask[];
  events: Event[];
  statsConfig: StatsSectionConfig[];
  recentActions: RecentAction[];
  addUser: () => Promise<void>;
  addUsers: (count: number) => Promise<void>;
  removeUser: (userId: string) => void;
  updateUserInteractionValue: (userId: string, value: number) => void;
  addPost: (threadId: string, userId?: string, content?: string, tags?: string[], injectionId?: string, replyTo?: string) => Promise<void>;
  addPosts: (count: number) => Promise<void>;
  addComment: (postId: string, parentCommentId?: string) => Promise<void>;
  toggleSimulation: () => void;
  toggleLike: (type: 'post' | 'comment', id: string, userId: string) => void;
  toggleDislike: (type: 'post' | 'comment', id: string, userId: string) => void;
  updateUserTags: (userId: string, tags: string[]) => void;
  addVotes: (count: number) => Promise<void>;
  updateSimulationWeights: (weights: SimulationWeights) => void;
  addPendingTask: (type: TaskType, username?: string) => string;
  removePendingTask: (taskId: string) => void;
  simulateAction: () => Promise<void>;
  addEvent: (type?: EventType, customData?: any) => Promise<void>;
  addEvents: (count: number) => Promise<void>;
  updateEventPostCount: (eventId: string) => void;
  deactivateEvent: (eventId: string) => void;
  updateStatsConfig: (config: StatsSectionConfig[]) => void;
  importState: (data: {
    users: User[];
    posts: Post[];
    comments: Comment[];
    events: Event[];
    simulationWeights: SimulationWeights;
    statsConfig: StatsSectionConfig[];
    recentActions: RecentAction[];
  }) => void;
}

const defaultStatsConfig: StatsSectionConfig[] = [
  { id: 'overview', title: 'Overview', visible: true, order: 0 },
  { id: 'eventDistribution', title: 'Event Distribution', visible: true, order: 1 },
  { id: 'mostActiveUsers', title: 'Most Active Users', visible: true, order: 2 },
  { id: 'interactionRatio', title: 'Interaction Ratio', visible: true, order: 3 },
  { id: 'popularTags', title: 'Popular Tags', visible: true, order: 4 },
  { id: 'recentActivity', title: 'Recent Activity', visible: true, order: 5 }
];

const defaultSimulationWeights: SimulationWeights = {
  actions: {
    addUser: 19,
    generatePost: 47.5,
    vote: 28.5,
    generateEvent: 5
  },
  gender: {
    male: 45,
    female: 45,
    'non-disclosed': 10
  },
  ageRanges: {
    '18-25': 30,
    '26-35': 35,
    '36-50': 25,
    '51+': 10
  },
  regions: {
    'North America': 20,
    'South America': 10,
    'Europe': 20,
    'Asia': 20,
    'Africa': 10,
    'Oceania': 5,
    'Middle East': 5,
    'Caribbean': 5,
    'Central America': 5
  },
  useRegionWeights: true,
  interactionValue: {
    low: 20,
    medium: 60,
    high: 20
  },
  tone: {
    friendly: 3,
    formal: 3,
    casual: 3,
    enthusiastic: 3,
    professional: 3,
    humorous: 3,
    sarcastic: 3,
    intellectual: 3,
    empathetic: 3,
    inspirational: 3,
    analytical: 3,
    diplomatic: 3,
    creative: 3,
    philosophical: 3,
    technical: 3,
    educational: 3,
    supportive: 3,
    controversial: 3,
    playful: 3,
    serious: 3,
    poetic: 3,
    journalistic: 3,
    storytelling: 3,
    cynical: 3,
    pessimistic: 3,
    aggressive: 3,
    bitter: 3,
    critical: 3,
    snarky: 3,
    condescending: 3,
    hostile: 3,
    dismissive: 3,
    argumentative: 3,
    neutral: 4
  },
  verbosity: {
    low: 25,
    medium: 50,
    high: 25
  },
  events: {
    tag: 60,
    regional: 30,
    world: 10
  }
};

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set, get) => ({
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),

      users: [],
      posts: [],
      comments: [],
      threads: [],
      isSimulating: false,
      simulationTimer: null,
      simulationWeights: defaultSimulationWeights,
      pendingRequests: 0,
      pendingTasks: [],
      events: [],
      statsConfig: defaultStatsConfig,
      recentActions: [],

      addPendingTask: (type: TaskType, username?: string) => {
        const taskId = crypto.randomUUID();
        set(state => ({
          pendingTasks: [...state.pendingTasks, {
            id: taskId,
            type,
            username,
            startTime: Date.now()
          }]
        }));
        return taskId;
      },

      removePendingTask: (taskId: string) => {
        set(state => ({
          pendingTasks: state.pendingTasks.filter(task => task.id !== taskId)
        }));
      },

      addUser: async () => {
        const taskId = get().addPendingTask('user');
        try {
          const existingUsernames = get().users.map(u => u.username.toLowerCase());
          const newUser = await generateUser(get().simulationWeights, existingUsernames);
          set((state) => ({ 
            users: [...state.users, newUser],
            recentActions: [{
              type: 'user',
              userId: newUser.id,
              timestamp: new Date().toISOString(),
              description: `New user ${newUser.username} joined`
            }, ...state.recentActions.slice(0, 49)]
          }));
          return newUser;
        } finally {
          get().removePendingTask(taskId);
        }
      },

      addUsers: async (count: number) => {
        for (let i = 0; i < count; i++) {
          await get().addUser();
        }
      },

      removeUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
          posts: state.posts.filter((post) => post.userId !== userId),
          comments: state.comments.filter((comment) => comment.userId !== userId),
        }));
      },

      updateUserInteractionValue: (userId: string, value: number) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, interactionValue: value } : user
          ),
        }));
      },

      updateUserTags: (userId: string, newTags: string[]) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userId) {
              const updatedTags = [...user.usedTags];
              
              newTags.forEach(tag => {
                const existingTag = updatedTags.find(t => t.tag === tag);
                if (existingTag) {
                  existingTag.count++;
                } else {
                  updatedTags.push({ tag, count: 1 });
                }
              });

              const frequentTags = updatedTags
                .filter(t => t.count >= 3)
                .map(t => t.tag);
              
              const newInterests = [...new Set([...user.interests, ...frequentTags])];

              return {
                ...user,
                usedTags: updatedTags,
                interests: newInterests
              };
            }
            return user;
          }),
        }));
      },

      addPost: async (threadId: string, userId?: string, content?: string, tags?: string[], injectionId?: string, replyTo?: string) => {
        const state = get();
        const { users, posts, events } = state;
        
        if (users.length === 0) return;

        let selectedUser = userId ? users.find(u => u.id === userId) : null;
        
        if (!selectedUser) {
          const totalWeight = users.reduce((sum, user) => sum + user.interactionValue, 0);
          let random = Math.random() * totalWeight;
          
          for (const user of users) {
            random -= user.interactionValue;
            if (random <= 0) {
              selectedUser = user;
              break;
            }
          }
        }

        if (!selectedUser) return;

        const taskId = get().addPendingTask('post', selectedUser.username);
        try {
          const activeEvents = events.filter(event => event.active);
          let selectedEvent: Event | undefined;

          if (!content) {
            for (const event of activeEvents) {
              if (event.postCount >= event.maxPosts) {
                get().deactivateEvent(event.id);
                continue;
              }

              const isRelevant = (() => {
                switch (event.type) {
                  case 'tag':
                    return event.tags.some(tag => 
                      selectedUser!.interests.some(interest => 
                        interest.toLowerCase().includes(tag)
                      )
                    );
                  case 'regional':
                    return event.regions?.includes(selectedUser!.region);
                  case 'world':
                    return true;
                  default:
                    return false;
                }
              })();

              if (isRelevant && Math.random() < 0.6) {
                selectedEvent = event;
                break;
              }
            }
          }

          let finalContent = content;
          let finalTags = tags;

          if (!finalContent) {
            if (replyTo) {
              // Get the original post and any previous replies
              const originalPost = posts.find(p => p.id === replyTo);
              if (!originalPost) return;

              const previousReplies = posts
                .filter(p => p.replyTo === replyTo)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

              finalContent = await generateReplyContent(selectedUser, originalPost, previousReplies);
              finalTags = []; // Replies don't get tags
            } else {
              finalContent = await generatePostContent(selectedUser, selectedEvent);
              if (!finalTags) {
                finalTags = await generateTags(finalContent, selectedUser);
              }
            }
          }
          
          if (!finalTags || finalTags.length === 0) {
            finalTags = [selectedUser.interests[Math.floor(Math.random() * selectedUser.interests.length)]
              .toLowerCase()
              .replace(/\s+/g, '-')];
          }

          const postTags = selectedEvent 
            ? [...new Set([...finalTags, ...selectedEvent.tags])]
            : finalTags;
          
          get().updateUserTags(selectedUser.id, postTags);

          const newPost: Post = {
            id: crypto.randomUUID(),
            userId: selectedUser.id,
            content: finalContent,
            tags: postTags,
            createdAt: new Date().toISOString(),
            likes: [],
            dislikes: [],
            threadId,
            eventId: selectedEvent?.id,
            injectionId,
            replyTo
          };

          if (selectedEvent) {
            get().updateEventPostCount(selectedEvent.id);
          }

          set((state) => ({ 
            posts: [...state.posts, newPost],
            recentActions: [{
              type: replyTo ? 'reply' : 'post',
              userId: selectedUser!.id,
              postId: newPost.id,
              timestamp: new Date().toISOString(),
              description: `${selectedUser!.username} ${replyTo ? 'replied to a post' : 'created a new post'}`
            }, ...state.recentActions.slice(0, 49)]
          }));
          
          return newPost;
        } finally {
          get().removePendingTask(taskId);
        }
      },

      addPosts: async (count: number) => {
        const threadId = crypto.randomUUID();
        for (let i = 0; i < count; i++) {
          await get().addPost(threadId);
        }
      },

      addComment: async (postId: string, parentCommentId?: string) => {
        const { users, posts } = get();
        if (users.length === 0) return;

        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const totalWeight = users.reduce((sum, user) => sum + user.interactionValue, 0);
        let random = Math.random() * totalWeight;
        let selectedUser = users[0];
        
        for (const user of users) {
          random -= user.interactionValue;
          if (random <= 0) {
            selectedUser = user;
            break;
          }
        }

        const taskId = get().addPendingTask('comment', selectedUser.username);
        try {
          const { content } = await generatePostContent(selectedUser, post);

          const newComment: Comment = {
            id: crypto.randomUUID(),
            postId,
            userId: selectedUser.id,
            content,
            createdAt: new Date().toISOString(),
            likes: [],
            dislikes: [],
            parentCommentId,
          };

          set((state) => ({ 
            comments: [...state.comments, newComment],
            recentActions: [{
              type: 'comment',
              userId: selectedUser.id,
              postId,
              commentId: newComment.id,
              timestamp: new Date().toISOString(),
              description: `${selectedUser.username} commented on a post`
            }, ...state.recentActions.slice(0, 49)]
          }));
          
          return newComment;
        } finally {
          get().removePendingTask(taskId);
        }
      },

      toggleLike: (type: 'post' | 'comment', id: string, userId: string) => {
        set((state) => {
          const items = type === 'post' ? state.posts : state.comments;
          const user = state.users.find(u => u.id === userId);
          
          return {
            [type === 'post' ? 'posts' : 'comments']: items.map(item => {
              if (item.id === id) {
                const hasLiked = item.likes.includes(userId);
                const hasDisliked = item.dislikes.includes(userId);
                
                if (!hasLiked && user) {
                  state.recentActions = [{
                    type: 'vote',
                    userId: user.id,
                    postId: type === 'post' ? id : undefined,
                    commentId: type === 'comment' ? id : undefined,
                    timestamp: new Date().toISOString(),
                    description: `${user.username} liked a ${type}`
                  }, ...state.recentActions.slice(0, 49)];
                }
                
                return {
                  ...item,
                  likes: hasLiked 
                    ? item.likes.filter(id => id !== userId)
                    : [...item.likes, userId],
                  dislikes: hasDisliked 
                    ? item.dislikes.filter(id => id !== userId)
                    : item.dislikes
                };
              }
              return item;
            })
          };
        });
      },

      toggleDislike: (type: 'post' | 'comment', id: string, userId: string) => {
        set((state) => {
          const items = type === 'post' ? state.posts : state.comments;
          const user = state.users.find(u => u.id === userId);
          
          return {
            [type === 'post' ? 'posts' : 'comments']: items.map(item => {
              if (item.id === id) {
                const hasLiked = item.likes.includes(userId);
                const hasDisliked = item.dislikes.includes(userId);
                
                if (!hasDisliked && user) {
                  state.recentActions = [{
                    type: 'vote',
                    userId: user.id,
                    postId: type === 'post' ? id : undefined,
                    commentId: type === 'comment' ? id : undefined,
                    timestamp: new Date().toISOString(),
                    description: `${user.username} disliked a ${type}`
                  }, ...state.recentActions.slice(0, 49)];
                }
                
                return {
                  ...item,
                  dislikes: hasDisliked 
                    ? item.dislikes.filter(id => id !== userId)
                    : [...item.dislikes, userId],
                  likes: hasLiked 
                    ? item.likes.filter(id => id !== userId)
                    : item.likes
                };
              }
              return item;
            })
          };
        });
      },

      toggleSimulation: () => {
        const { users, isSimulating, simulationTimer } = get();
        const llmConfig = useLLMStore.getState().config;
        
        if (!isSimulating && users.length < 10) {
          get().addUsers(10 - users.length);
        }

        if (simulationTimer) {
          clearInterval(simulationTimer);
        }

        if (!isSimulating) {
          const timer = window.setInterval(async () => {
            const { pendingRequests } = get();
            if (pendingRequests === 0) {
              await get().simulateAction();
            }
          }, (llmConfig.autoPostInterval || 1) * 1000);

          set({ isSimulating: true, simulationTimer: timer });
        } else {
          set({ isSimulating: false, simulationTimer: null });
        }
      },

      addVotes: async (count: number) => {
        for (let i = 0; i < count; i++) {
          const { users, posts } = get();
          if (users.length === 0 || posts.length === 0) return;

          const totalWeight = users.reduce((sum, user) => sum + user.interactionValue, 0);
          let random = Math.random() * totalWeight;
          let selectedUser = users[0];
          
          for (const user of users) {
            random -= user.interactionValue;
            if (random <= 0) {
              selectedUser = user;
              break;
            }
          }

          const availablePosts = posts.filter(post => 
            post.userId !== selectedUser.id && 
            !post.likes.includes(selectedUser.id) && 
            !post.dislikes.includes(selectedUser.id)
          );

          if (availablePosts.length === 0) continue;

          const selectedPost = availablePosts[Math.floor(Math.random() * availablePosts.length)];
          
          const taskId = get().addPendingTask('vote', selectedUser.username);
          try {
            const { isLike, keywords } = await generateVoteKeywords(selectedUser, selectedPost);

            set((state) => {
              const updatedPosts = state.posts.map(post => {
                if (post.id === selectedPost.id) {
                  return {
                    ...post,
                    likes: isLike ? [...post.likes, selectedUser.id] : post.likes,
                    dislikes: !isLike ? [...post.dislikes, selectedUser.id] : post.dislikes,
                    keywords: [...(post.keywords || []), ...keywords]
                  };
                }
                return post;
              });

              const updatedUsers = state.users.map(user => {
                if (user.id === selectedUser.id) {
                  const preferences = user.preferences || { likes: [], dislikes: [] };
                  const targetList = isLike ? preferences.likes : preferences.dislikes;

                  const updatedList = [...targetList];
                  keywords.forEach(keyword => {
                    const existing = updatedList.find(k => k.keyword === keyword);
                    if (existing) {
                      existing.count++;
                    } else {
                      updatedList.push({ keyword, count: 1 });
                    }
                  });

                  return {
                    ...user,
                    preferences: {
                      ...preferences,
                      [isLike ? 'likes' : 'dislikes']: updatedList
                    }
                  };
                }
                return user;
              });

              const recentActions = [{
                type: 'vote' as const,
                userId: selectedUser.id,
                postId: selectedPost.id,
                timestamp: new Date().toISOString(),
                description: `${selectedUser.username} ${isLike ? 'liked' : 'disliked'} a post`
              }, ...state.recentActions.slice(0, 49)];

              return {
                posts: updatedPosts,
                users: updatedUsers,
                recentActions
              };
            });
          } finally {
            get().removePendingTask(taskId);
          }
        }
      },

      simulateAction: async () => {
        const { simulationWeights, pendingRequests, posts } = get();
        if (pendingRequests > 0) return;

        const actions = simulationWeights.actions || defaultSimulationWeights.actions;
        const totalWeight = Object.values(actions).reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        
        if (random < actions.addUser) {
          await get().addUser();
        } else if (random < actions.addUser + actions.generatePost) {
          // 70% chance for new post, 30% chance for reply
          const isReply = Math.random() < 0.3;
          
          if (isReply && posts.length > 0) {
            // Find a random post to reply to
            const availablePosts = posts.filter(p => !p.replyTo); // Only reply to parent posts
            if (availablePosts.length > 0) {
              const randomPost = availablePosts[Math.floor(Math.random() * availablePosts.length)];
              await get().addPost(randomPost.threadId, undefined, undefined, [], undefined, randomPost.id);
            } else {
              await get().addPost(crypto.randomUUID()); // Fallback to new post if no posts to reply to
            }
          } else {
            await get().addPost(crypto.randomUUID());
          }
        } else if (random < actions.addUser + actions.generatePost + actions.vote) {
          await get().addVotes(1);
        } else {
          await get().addEvent();
        }
      },

      updateSimulationWeights: (weights: SimulationWeights) => {
        const updatedWeights = {
          ...weights,
          events: weights.events || defaultSimulationWeights.events
        };
        set({ simulationWeights: updatedWeights });
      },

      addEvent: async (type?: EventType, customData?: any) => {
        const taskId = get().addPendingTask('event');
        try {
          let eventType = type;
          if (!eventType) {
            const weights = get().simulationWeights.events || defaultSimulationWeights.events;
            const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
            let random = Math.random() * total;
            
            if (random < weights.tag) {
              eventType = 'tag';
            } else if (random < weights.tag + weights.regional) {
              eventType = 'regional';
            } else {
              eventType = 'world';
            }
          }

          const event = await generateEvent(eventType, customData);
          set(state => ({ events: [...state.events, event] }));
          return event;
        } finally {
          get().removePendingTask(taskId);
        }
      },

      addEvents: async (count: number) => {
        for (let i = 0; i < count; i++) {
          await get().addEvent();
        }
      },

      updateEventPostCount: (eventId: string) => {
        set(state => ({
          events: state.events.map(event => 
            event.id === eventId
              ? { ...event, postCount: event.postCount + 1 }
              : event
          )
        }));
      },

      deactivateEvent: (eventId: string) => {
        set(state => ({
          events: state.events.map(event =>
            event.id === eventId
              ? { ...event, active: false }
              : event
          )
        }));
      },

      updateStatsConfig: (config) => set({ statsConfig: config }),

      importState: (data) => {
        const { isSimulating, simulationTimer } = get();
        
        if (isSimulating && simulationTimer) {
          clearInterval(simulationTimer);
        }

        set({
          users: data.users,
          posts: data.posts,
          comments: data.comments,
          events: data.events,
          simulationWeights: data.simulationWeights,
          statsConfig: data.statsConfig,
          recentActions: data.recentActions,
          isSimulating: false,
          simulationTimer: null,
          pendingTasks: [],
          pendingRequests: 0
        });
      }
    }),
    {
      name: 'simulator-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        posts: state.posts,
        comments: state.comments,
        events: state.events,
        simulationWeights: state.simulationWeights,
        isDarkMode: state.isDarkMode,
        statsConfig: state.statsConfig,
        recentActions: state.recentActions
      })
    }
  )
);