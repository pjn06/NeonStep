export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
}

export interface Goal {
  id: string;
  title: string;
  type: 'STUDY' | 'OUTDOOR' | 'HEALTH' | 'SOCIAL';
  targetValue: number; // e.g., 60 minutes or 1 time
  currentValue: number;
  unit: string; // '분', '회'
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: number;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}