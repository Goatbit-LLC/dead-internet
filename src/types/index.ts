export type LLMProvider = 'openai' | 'ollama' | 'lmstudio';

export interface User {
  id: string;
  username: string;
  avatar: string;
  interactionValue: number;
  interests: string[];
  joinedAt: string;
  behavioralProfile: {
    tone: keyof SimulationWeights['tone'];
    verbosity: number;
    responseSpeed: number;
  };
  age: number;
  gender: 'male' | 'female' | 'non-disclosed';
  region: string;
  usedTags: { tag: string; count: number }[];
  preferences: {
    likes: { keyword: string; count: number }[];
    dislikes: { keyword: string; count: number }[];
  };
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  tags: string[];
  threadId: string;
  keywords?: string[];
  eventId?: string;
  injectionId?: string;
  replyTo?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  parentCommentId?: string;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
}

export type { LLMProvider };

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  autoPostInterval?: number;
  instructions?: string;
  instructionSets: InstructionSet[];
  selectedInstructionSet?: string;
  injectedInstructions: InjectedInstruction[];
}

export interface SimulationWeights {
  actions: {
    addUser: number;
    generatePost: number;
    vote: number;
    generateEvent: number;
  };
  gender: {
    male: number;
    female: number;
    'non-disclosed': number;
  };
  ageRanges: {
    '18-25': number;
    '26-35': number;
    '36-50': number;
    '51+': number;
  };
  regions: Record<string, number>;
  useRegionWeights?: boolean;
  interactionValue: {
    low: number;
    medium: number;
    high: number;
  };
  tone: Record<string, number>;
  verbosity: {
    low: number;
    medium: number;
    high: number;
  };
  events: {
    tag: number;
    regional: number;
    world: number;
  };
}

export type TaskType = 'post' | 'comment' | 'user' | 'vote' | 'event';

export interface PendingTask {
  id: string;
  type: TaskType;
  username?: string;
  startTime: number;
}

export type EventType = 'tag' | 'regional' | 'world';

export interface Event {
  id: string;
  type: EventType;
  title: string;
  description: string;
  createdAt: string;
  tags: string[];
  regions?: string[];
  postCount: number;
  maxPosts: number;
  active: boolean;
}

export type RecentActionType = 'user' | 'post' | 'comment' | 'vote' | 'reply';

export interface RecentAction {
  type: RecentActionType;
  userId: string;
  postId?: string;
  commentId?: string;
  timestamp: string;
  description: string;
}

export interface InjectionInstruction {
  id: string;
  content: string;
  createdAt: string;
  expiresAfter: number;
  currentCount: number;
  active: boolean;
}

export interface InstructionSet {
  id: string;
  name: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}