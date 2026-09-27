import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProgress, Badge } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'daa_mastery_progress_v1';

export const BADGES: Badge[] = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first DAA topic', icon: '🚀', requiredXP: 50, condition: '1 topic completed' },
  { id: 'complexity_master', name: 'Asymptotic Analyst', description: 'Score 100% on a Unit I Quiz', icon: '⚡', requiredXP: 200, condition: 'Unit I Quiz Ace' },
  { id: 'divide_conquer', name: 'Divide & Conqueror', description: 'Master Merge Sort & Quick Sort', icon: '⚔️', requiredXP: 450, condition: 'Unit II Sorting Master' },
  { id: 'dp_explorer', name: 'Optimal Substructure', description: 'Complete 3 Dynamic Programming topics', icon: '🧩', requiredXP: 750, condition: '3 DP topics done' },
  { id: 'greedy_thinker', name: 'Greedy Strategist', description: 'Complete Kruskal, Prim, or Dijkstra', icon: '💎', requiredXP: 1000, condition: 'Greedy topic done' },
  { id: 'backtracking_solver', name: 'Pruning Champion', description: 'Solve N-Queens or Sudoku visualizer', icon: '♟️', requiredXP: 1300, condition: 'Backtracking master' },
  { id: 'flow_expert', name: 'Max Flow Wizard', description: 'Complete Network Flow Ford-Fulkerson', icon: '🌊', requiredXP: 1600, condition: 'Flow topic done' },
  { id: 'np_theorist', name: 'Complexity Pioneer', description: 'Understand Cook-Levin & 3-SAT Reduction', icon: '🌌', requiredXP: 2000, condition: 'Unit VI explored' },
  { id: 'streak_week', name: 'Relentless Scholar', description: 'Maintain a 7-day study streak', icon: '🔥', requiredXP: 1500, condition: '7-day streak' },
];

const DEFAULT_PROGRESS: UserProgress = {
  completedTopics: ['intro-algorithms', 'asymptotic-notations'],
  bookmarkedTopics: ['merge-sort', 'matrix-chain-multiplication'],
  notes: {
    'master-theorem': 'Remember: f(n) must be polynomially larger or smaller than n^(log_b a), not just asymptotically larger!',
    'quick-sort': 'Worst case O(n^2) occurs when pivot is consistently the extreme element (e.g. already sorted array with first element as pivot).'
  },
  quizScores: {
    'intro-algorithms': { score: 6, total: 6, timestamp: Date.now() - 86400000 * 2, completed: true },
    'asymptotic-notations': { score: 5, total: 6, timestamp: Date.now() - 86400000, completed: true },
    'binary-search': { score: 4, total: 6, timestamp: Date.now() - 40000000, completed: true },
  },
  unitTestScores: {
    'unit-1': { score: 26, total: 30, percentage: 86.6, timestamp: Date.now() - 86400000 }
  },
  mockTestScores: [],
  streakCount: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  xp: 420,
  unlockedBadges: ['first_step', 'complexity_master'],
  history: [
    { topicId: 'merge-sort', timestamp: Date.now() - 3600000 },
    { topicId: 'binary-search', timestamp: Date.now() - 7200000 },
    { topicId: 'asymptotic-notations', timestamp: Date.now() - 14400000 },
  ],
  soundEnabled: true,
  reducedMotion: false,
};

interface ProgressContextType {
  progress: UserProgress;
  markTopicCompleted: (topicId: string) => void;
  toggleTopicBookmark: (topicId: string) => void;
  saveTopicNote: (topicId: string, note: string) => void;
  recordQuizScore: (topicId: string, score: number, total: number) => void;
  recordUnitTestScore: (unitId: string, score: number, total: number) => void;
  recordMockTestScore: (score: number, total: number) => void;
  addToHistory: (topicId: string) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  resetProgress: () => void;
  addXP: (amount: number, reason?: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Save on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Check and update study streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const last = new Date(progress.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      
      setProgress(prev => {
        let newStreak = prev.streakCount;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
        return {
          ...prev,
          streakCount: newStreak,
          lastActiveDate: today
        };
      });
    }
  }, [progress.lastActiveDate]);

  const addXP = (amount: number, _reason?: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      // Check for new badges
      const newUnlocked = [...prev.unlockedBadges];
      BADGES.forEach(badge => {
        if (!newUnlocked.includes(badge.id) && newXP >= badge.requiredXP) {
          newUnlocked.push(badge.id);
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.7 }
            });
          } catch {
            // ignore
          }
        }
      });
      return {
        ...prev,
        xp: newXP,
        unlockedBadges: newUnlocked,
      };
    });
  };

  const markTopicCompleted = (topicId: string) => {
    setProgress(prev => {
      const isAlready = prev.completedTopics.includes(topicId);
      const newCompleted = isAlready
        ? prev.completedTopics.filter(id => id !== topicId)
        : [...prev.completedTopics, topicId];

      if (!isAlready) {
        addXP(60, 'Completed topic');
      }

      return {
        ...prev,
        completedTopics: newCompleted,
      };
    });
  };

  const toggleTopicBookmark = (topicId: string) => {
    setProgress(prev => ({
      ...prev,
      bookmarkedTopics: prev.bookmarkedTopics.includes(topicId)
        ? prev.bookmarkedTopics.filter(id => id !== topicId)
        : [...prev.bookmarkedTopics, topicId],
    }));
  };

  const saveTopicNote = (topicId: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [topicId]: note,
      },
    }));
  };

  const recordQuizScore = (topicId: string, score: number, total: number) => {
    setProgress(prev => {
      const earnedXP = score * 20;
      const isPerfect = score === total;
      if (isPerfect) {
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}
      }

      const existing = prev.quizScores[topicId];
      const highestScore = existing ? Math.max(existing.score, score) : score;

      return {
        ...prev,
        xp: prev.xp + earnedXP,
        quizScores: {
          ...prev.quizScores,
          [topicId]: {
            score: highestScore,
            total,
            timestamp: Date.now(),
            completed: true,
          }
        },
        completedTopics: prev.completedTopics.includes(topicId) 
          ? prev.completedTopics 
          : [...prev.completedTopics, topicId],
      };
    });
  };

  const recordUnitTestScore = (unitId: string, score: number, total: number) => {
    setProgress(prev => {
      const pct = Math.round((score / total) * 100);
      return {
        ...prev,
        xp: prev.xp + score * 15,
        unitTestScores: {
          ...prev.unitTestScores,
          [unitId]: {
            score,
            total,
            percentage: pct,
            timestamp: Date.now(),
          }
        }
      };
    });
  };

  const recordMockTestScore = (score: number, total: number) => {
    setProgress(prev => {
      const pct = Math.round((score / total) * 100);
      return {
        ...prev,
        xp: prev.xp + score * 10 + 200,
        mockTestScores: [
          ...prev.mockTestScores,
          { score, total, percentage: pct, timestamp: Date.now() }
        ]
      };
    });
  };

  const addToHistory = (topicId: string) => {
    setProgress(prev => {
      const filtered = prev.history.filter(h => h.topicId !== topicId);
      return {
        ...prev,
        history: [{ topicId, timestamp: Date.now() }, ...filtered].slice(0, 15),
      };
    });
  };

  const toggleSound = () => {
    setProgress(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleReducedMotion = () => {
    setProgress(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markTopicCompleted,
        toggleTopicBookmark,
        saveTopicNote,
        recordQuizScore,
        recordUnitTestScore,
        recordMockTestScore,
        addToHistory,
        toggleSound,
        toggleReducedMotion,
        resetProgress,
        addXP,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
};
