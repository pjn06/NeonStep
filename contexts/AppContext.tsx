import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Goal, Post, Achievement } from '../types';

interface AppContextType {
  user: User | null;
  goals: Goal[];
  posts: Post[];
  isLoading: boolean;
  login: (name: string) => void;
  logout: () => void;
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (id: string, value: number) => void;
  addPost: (content: string) => void;
  toggleLike: (postId: string) => void;
  xpGained: number | null; // For animation popups
  clearXpPopup: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: '첫 걸음', description: '첫 목표를 달성하세요', icon: '🌱', unlocked: false },
  { id: '2', title: '소통왕', description: '커뮤니티에 글을 남기세요', icon: '💬', unlocked: false },
];

const SAMPLE_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    userName: '새벽러',
    userAvatar: 'https://picsum.photos/seed/u2/100',
    content: '오늘 아침 10분 산책 성공! 공기가 상쾌하네요 🏃‍♂️',
    likes: 5,
    comments: 2,
    timestamp: Date.now() - 3600000,
    tags: ['#외출', '#상쾌']
  },
  {
    id: 'p2',
    userId: 'u3',
    userName: '코딩왕',
    userAvatar: 'https://picsum.photos/seed/u3/100',
    content: '알고리즘 문제 3개 풀기 완료. 머리가 지끈거리지만 뿌듯합니다.',
    likes: 12,
    comments: 4,
    timestamp: Date.now() - 7200000,
    tags: ['#공부', '#코딩']
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [xpGained, setXpGained] = useState<number | null>(null);

  // Simulate loading user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('neon_user');
    const storedGoals = localStorage.getItem('neon_goals');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
    setIsLoading(false);
  }, []);

  // Persist updates
  useEffect(() => {
    if (user) localStorage.setItem('neon_user', JSON.stringify(user));
    if (goals) localStorage.setItem('neon_goals', JSON.stringify(goals));
  }, [user, goals]);

  const login = (name: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      avatar: `https://picsum.photos/seed/${name}/100`,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      streak: 1,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neon_user');
    localStorage.removeItem('neon_goals');
  };

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals((prev) => prev.map(g => {
      if (g.id !== id) return g;
      
      const newValue = Math.min(g.targetValue, g.currentValue + amount);
      const isJustCompleted = !g.completed && newValue >= g.targetValue;
      
      if (isJustCompleted) {
        awardXp(50); // XP Reward for goal completion
      }

      return {
        ...g,
        currentValue: newValue,
        completed: newValue >= g.targetValue
      };
    }));
  };

  const awardXp = (amount: number) => {
    if (!user) return;
    setXpGained(amount);
    
    setUser(prev => {
      if (!prev) return null;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;

      if (newXp >= prev.nextLevelXp) {
        newXp -= prev.nextLevelXp;
        newLevel += 1;
        newNextXp = Math.floor(prev.nextLevelXp * 1.2);
        // Could add level up modal trigger here
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextXp
      };
    });
  };

  const clearXpPopup = () => setXpGained(null);

  const addPost = (content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      likes: 0,
      comments: 0,
      timestamp: Date.now(),
      tags: ['#일상']
    };
    setPosts([newPost, ...posts]);
    awardXp(20); // XP for social interaction
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  return (
    <AppContext.Provider value={{ 
      user, goals, posts, isLoading, 
      login, logout, addGoal, updateGoalProgress, 
      addPost, toggleLike, xpGained, clearXpPopup 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};