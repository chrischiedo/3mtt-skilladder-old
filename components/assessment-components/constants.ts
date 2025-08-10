// Time Constants
export const ASSESSMENT_SESSION_EXPIRY = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
export const ASSESSMENT_TIME_LIMITS = {
  COHORT_2: 180, // 3 hours in minutes
  COHORT_3: 60, // 1 hour in minutes
  DEEPTECH: 60, // 1 hour in minutes
} as const;

// Question Count Constants
export const QUESTION_COUNTS = {
  MCQ_QUESTIONS_PER_MODULE: 50,
  OPEN_ENDED_QUESTIONS_PER_MODULE: 0,
} as const;

// Security Constants
export const SECURITY = {
  MAX_WARNINGS: 3,
  WINDOW_SIZE_THRESHOLD: 100,
  WARNING_DURATION: 4000, // milliseconds
  ERROR_DURATION: 5000, // milliseconds
  INFO_DURATION: 6000, // milliseconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  GENERATE_MCQ_QUESTIONS:
    '/api/generate_deeptech_assessment_questions/',
  GENERATE_OPEN_ENDED_QUESTIONS:
    '/api/generate_deeptech_openended_questions',
  EVALUATE_OPEN_ENDED_QUESTIONS: '/api/evaluate_open_ended_qs/',
  UPDATE_TECH_SCORE: '/api/update_tech_score/',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ASSESSMENT_SESSION: 'assessmentSession',
} as const;

// UI Constants
export const UI = {
  TIMER_WARNING_THRESHOLD: 60, // seconds
  TIMER_CRITICAL_THRESHOLD: 40, // seconds
  TOAST_POSITION: 'top-center' as const,
} as const;

// Keyboard Shortcuts to Prevent
export const BLOCKED_SHORTCUTS = [
  'F12',
  'Ctrl+Shift+I',
  'Ctrl+Shift+J',
  'Ctrl+Shift+C',
  'Ctrl+U',
] as const;

// Types for Constants
export type CohortType = keyof typeof ASSESSMENT_TIME_LIMITS;
export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type StorageKey = keyof typeof STORAGE_KEYS;
