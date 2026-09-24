import { PROGRESS_STORAGE_KEY } from '../constants';
import type { UserProgress } from '../types/progress';
import { DEFAULT_PROGRESS } from '../types/progress';

/**
 * Loads user progress from localStorage.
 * Returns default progress if nothing is saved or if there's an error.
 */
export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return DEFAULT_PROGRESS;
  }

  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!saved) {
      return DEFAULT_PROGRESS;
    }
    return JSON.parse(saved) as UserProgress;
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Saves user progress to localStorage.
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const progressWithDate = {
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressWithDate));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
}

/**
 * Marks a lesson as completed.
 */
export function markLessonCompleted(lessonId: string, currentProgress: UserProgress): UserProgress {
  if (currentProgress.completedLessons.includes(lessonId)) {
    return currentProgress;
  }
  
  return {
    ...currentProgress,
    completedLessons: [...currentProgress.completedLessons, lessonId],
  };
}

/**
 * Saves quiz score for a lesson.
 */
export function saveQuizScore(lessonId: string, score: number, currentProgress: UserProgress): UserProgress {
  return {
    ...currentProgress,
    quizScores: {
      ...currentProgress.quizScores,
      [lessonId]: score,
    },
  };
}

/**
 * Updates the last accessed location so user can resume later.
 */
export function updateLastAccessed(categorySlug: string, topicSlug: string, lessonSlug: string, currentProgress: UserProgress): UserProgress {
  return {
    ...currentProgress,
    lastAccessedCategory: categorySlug,
    lastAccessedTopic: topicSlug,
    lastAccessedLesson: lessonSlug,
  };
}

/**
 * Resets all progress (starts over).
 */
export function resetProgress(): UserProgress {
  saveProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
}
