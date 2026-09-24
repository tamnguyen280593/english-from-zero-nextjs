/**
 * Type definitions for user progress tracking.
 * Progress is stored in localStorage — no backend needed.
 */

/** User's learning progress across all topics and lessons */
export interface UserProgress {
  readonly completedLessons: ReadonlyArray<string>;
  readonly lastAccessedCategory: string | null;
  readonly lastAccessedTopic: string | null;
  readonly lastAccessedLesson: string | null;
  readonly quizScores: Record<string, number>;
  readonly updatedAt: string;
}

/** Default empty progress for new users */
export const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  lastAccessedCategory: null,
  lastAccessedTopic: null,
  lastAccessedLesson: null,
  quizScores: {},
  updatedAt: new Date().toISOString(),
} as const;
