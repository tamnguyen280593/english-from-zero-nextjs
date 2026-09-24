'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '../types/progress';
import { DEFAULT_PROGRESS } from '../types/progress';
import { 
  loadProgress, 
  saveProgress, 
  markLessonCompleted as markLessonCompletedUtil,
  saveQuizScore as saveQuizScoreUtil,
  updateLastAccessed as updateLastAccessedUtil,
  resetProgress as resetProgressUtil
} from '../lib/progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress on initial mount (client-side only)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  const markLessonCompleted = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const next = markLessonCompletedUtil(lessonId, prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const saveQuizScore = useCallback((lessonId: string, score: number) => {
    setProgress((prev) => {
      const next = saveQuizScoreUtil(lessonId, score, prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const setLastAccessed = useCallback((categorySlug: string, topicSlug: string, lessonSlug: string) => {
    setProgress((prev) => {
      const next = updateLastAccessedUtil(categorySlug, topicSlug, lessonSlug, prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến trình học và bắt đầu lại từ đầu?')) {
      const resetState = resetProgressUtil();
      setProgress(resetState);
    }
  }, []);

  return {
    progress,
    isLoaded,
    markLessonCompleted,
    saveQuizScore,
    setLastAccessed,
    resetAllProgress,
  };
}
