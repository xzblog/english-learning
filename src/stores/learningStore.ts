import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WordProgress, StudyPlan, DailyRecord, ReviewItem } from '../types';
import { REVIEW_INTERVALS } from '../types';

interface LearningState {
  // Word progress
  wordProgress: Record<string, WordProgress>;

  // Study plans
  studyPlans: StudyPlan[];
  activePlanId: string | null;

  // Daily records
  dailyRecords: DailyRecord[];

  // Review queue
  reviewQueue: ReviewItem[];

  // Favorites (生词本)
  favorites: string[];

  // Mistakes (错题本)
  mistakes: string[];

  // Stats
  totalWordsLearned: number;
  currentStreak: number;
  lastStudyDate: string | null;

  // Theme
  theme: 'light' | 'dark';

  // Actions
  learnWord: (wordId: string) => void;
  reviewWord: (wordId: string, correct: boolean) => void;
  toggleFavorite: (wordId: string) => void;
  addMistake: (wordId: string) => void;
  removeMistake: (wordId: string) => void;

  createStudyPlan: (plan: Omit<StudyPlan, 'id'>) => void;
  setActivePlan: (planId: string | null) => void;
  pausePlan: (planId: string) => void;

  updateDailyRecord: (wordsLearned?: number, wordsReviewed?: number, studyTime?: number) => void;

  toggleTheme: () => void;

  getWordProgress: (wordId: string) => WordProgress | undefined;
  getWordsToReview: () => ReviewItem[];
  getTodayRecord: () => DailyRecord | null;
  getWeeklyStats: () => { date: string; learned: number; reviewed: number }[];
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getNextReviewDate = (stage: number): number => {
  const days = REVIEW_INTERVALS[Math.min(stage, REVIEW_INTERVALS.length - 1)];
  return Date.now() + days * 24 * 60 * 60 * 1000;
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      wordProgress: {},
      studyPlans: [],
      activePlanId: null,
      dailyRecords: [],
      reviewQueue: [],
      favorites: [],
      mistakes: [],
      totalWordsLearned: 0,
      currentStreak: 0,
      lastStudyDate: null,
      theme: 'light',

      learnWord: (wordId: string) => {
        const now = Date.now();
        const today = getTodayDate();

        set((state) => {
          const existingProgress = state.wordProgress[wordId];

          // If already learned, don't count again
          if (existingProgress?.status !== 'new') {
            return state;
          }

          const newProgress: WordProgress = {
            wordId,
            status: 'learning',
            correctCount: 0,
            wrongCount: 0,
            lastReviewedAt: now,
            nextReviewAt: getNextReviewDate(0),
            learnedAt: now
          };

          // Update streak
          let newStreak = state.currentStreak;
          if (state.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (state.lastStudyDate === yesterdayStr) {
              newStreak += 1;
            } else if (state.lastStudyDate !== today) {
              newStreak = 1;
            }
          }

          // Add to review queue
          const newReviewItem: ReviewItem = {
            wordId,
            scheduledFor: getNextReviewDate(0),
            reviewStage: 1
          };

          return {
            wordProgress: {
              ...state.wordProgress,
              [wordId]: newProgress
            },
            reviewQueue: [...state.reviewQueue, newReviewItem],
            totalWordsLearned: state.totalWordsLearned + 1,
            currentStreak: newStreak,
            lastStudyDate: today
          };
        });

        // Update daily record
        get().updateDailyRecord(1, 0, 0);
      },

      reviewWord: (wordId: string, correct: boolean) => {
        const now = Date.now();

        set((state) => {
          const progress = state.wordProgress[wordId];
          if (!progress) return state;

          const reviewItem = state.reviewQueue.find(r => r.wordId === wordId);
          const currentStage = reviewItem?.reviewStage || 1;

          let newStatus = progress.status;
          let newStage = currentStage;

          if (correct) {
            newStage = Math.min(currentStage + 1, REVIEW_INTERVALS.length);
            if (newStage >= REVIEW_INTERVALS.length) {
              newStatus = 'mastered';
            } else {
              newStatus = 'reviewing';
            }
          } else {
            // Wrong answer - go back to stage 1
            newStage = 1;
            newStatus = 'learning';
          }

          const updatedProgress: WordProgress = {
            ...progress,
            status: newStatus,
            correctCount: correct ? progress.correctCount + 1 : progress.correctCount,
            wrongCount: correct ? progress.wrongCount : progress.wrongCount + 1,
            lastReviewedAt: now,
            nextReviewAt: newStatus === 'mastered' ? undefined : getNextReviewDate(newStage - 1)
          };

          // Update review queue
          const newReviewQueue = state.reviewQueue.filter(r => r.wordId !== wordId);
          if (newStatus !== 'mastered') {
            newReviewQueue.push({
              wordId,
              scheduledFor: getNextReviewDate(newStage - 1),
              reviewStage: newStage
            });
          }

          return {
            wordProgress: {
              ...state.wordProgress,
              [wordId]: updatedProgress
            },
            reviewQueue: newReviewQueue
          };
        });

        get().updateDailyRecord(0, 1, 0);
      },

      toggleFavorite: (wordId: string) => {
        set((state) => {
          const isFavorite = state.favorites.includes(wordId);
          return {
            favorites: isFavorite
              ? state.favorites.filter(id => id !== wordId)
              : [...state.favorites, wordId]
          };
        });
      },

      addMistake: (wordId: string) => {
        set((state) => ({
          mistakes: state.mistakes.includes(wordId)
            ? state.mistakes
            : [...state.mistakes, wordId]
        }));
      },

      removeMistake: (wordId: string) => {
        set((state) => ({
          mistakes: state.mistakes.filter(id => id !== wordId)
        }));
      },

      createStudyPlan: (plan) => {
        const id = `plan_${Date.now()}`;
        const newPlan: StudyPlan = { ...plan, id };

        set((state) => ({
          studyPlans: [...state.studyPlans, newPlan],
          activePlanId: state.activePlanId || id
        }));
      },

      setActivePlan: (planId) => {
        set({ activePlanId: planId });
      },

      pausePlan: (planId) => {
        set((state) => ({
          studyPlans: state.studyPlans.map(p =>
            p.id === planId ? { ...p, status: p.status === 'paused' ? 'active' : 'paused' } : p
          )
        }));
      },

      updateDailyRecord: (wordsLearned = 0, wordsReviewed = 0, studyTime = 0) => {
        const today = getTodayDate();

        set((state) => {
          const existingIndex = state.dailyRecords.findIndex(r => r.date === today);

          if (existingIndex >= 0) {
            const existing = state.dailyRecords[existingIndex];
            const updated = {
              ...existing,
              wordsLearned: existing.wordsLearned + wordsLearned,
              wordsReviewed: existing.wordsReviewed + wordsReviewed,
              studyTime: existing.studyTime + studyTime
            };
            const newRecords = [...state.dailyRecords];
            newRecords[existingIndex] = updated;
            return { dailyRecords: newRecords };
          } else {
            return {
              dailyRecords: [...state.dailyRecords, {
                date: today,
                wordsLearned,
                wordsReviewed,
                studyTime
              }]
            };
          }
        });
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          return { theme: newTheme };
        });
      },

      getWordProgress: (wordId: string) => {
        return get().wordProgress[wordId];
      },

      getWordsToReview: () => {
        const now = Date.now();
        return get().reviewQueue.filter(item => item.scheduledFor <= now);
      },

      getTodayRecord: () => {
        const today = getTodayDate();
        return get().dailyRecords.find(r => r.date === today) || null;
      },

      getWeeklyStats: () => {
        const records = get().dailyRecords;
        const result = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const record = records.find(r => r.date === dateStr);

          result.push({
            date: dateStr,
            learned: record?.wordsLearned || 0,
            reviewed: record?.wordsReviewed || 0
          });
        }

        return result;
      }
    }),
    {
      name: 'english-learning-storage',
      partialize: (state) => ({
        wordProgress: state.wordProgress,
        studyPlans: state.studyPlans,
        activePlanId: state.activePlanId,
        dailyRecords: state.dailyRecords,
        reviewQueue: state.reviewQueue,
        favorites: state.favorites,
        mistakes: state.mistakes,
        totalWordsLearned: state.totalWordsLearned,
        currentStreak: state.currentStreak,
        lastStudyDate: state.lastStudyDate,
        theme: state.theme
      })
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('english-learning-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.state?.theme) {
        document.documentElement.setAttribute('data-theme', parsed.state.theme);
      }
    } catch {
      // Ignore parse errors
    }
  }
}
