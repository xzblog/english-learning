// Word level - junior is middle school, senior is high school
export type WordLevel = 'junior' | 'senior';

// Word mastery status
export type MasteryStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

// Part of speech
export type PartOfSpeech = 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'conj' | 'pron' | 'num' | 'art' | 'int' | 'phrase';

// Word meaning with part of speech
export interface WordMeaning {
  pos: PartOfSpeech;
  definition: string;
}

// Example sentence
export interface Example {
  en: string;
  cn: string;
}

// Word data structure
export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meanings: WordMeaning[];
  examples: Example[];
  level: WordLevel;
  unit?: number;
}

// Word learning progress
export interface WordProgress {
  wordId: string;
  status: MasteryStatus;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: number;
  nextReviewAt?: number;
  learnedAt?: number;
}

// Study Plan
export interface StudyPlan {
  id: string;
  name: string;
  dailyGoal: number; // words per day
  targetLevel: WordLevel | 'all';
  startDate: number;
  status: 'active' | 'paused' | 'completed';
}

// Daily study record
export interface DailyRecord {
  date: string; // YYYY-MM-DD format
  wordsLearned: number;
  wordsReviewed: number;
  studyTime: number; // in minutes
}

// Review item
export interface ReviewItem {
  wordId: string;
  scheduledFor: number; // timestamp
  reviewStage: number; // 1, 2, 3, 4, 5 based on spaced repetition
}

// Grammar Category
export type GrammarCategory = 'tense' | 'clause' | 'sentence' | 'mood' | 'non-finite';

// Grammar Rule
export interface GrammarRule {
  id: string;
  category: GrammarCategory;
  title: string;
  titleCn: string;
  description: string;
  structure: string;
  examples: Example[];
  tips?: string[];
}

// Quiz types
export type QuizType = 'meaning' | 'spelling' | 'listening' | 'sentence';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  wordId: string;
  question: string;
  options?: string[];
  answer: string;
}

// Spaced Repetition intervals (in days)
export const REVIEW_INTERVALS = [1, 2, 4, 7, 15];

// Learning modes
export type LearningMode = 'flashcard' | 'spelling' | 'listening' | 'quiz';
