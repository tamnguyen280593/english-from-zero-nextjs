import topicsData from '../data/topics.json';
import greetingsData from '../data/greetings.json';
import introductionsData from '../data/introductions.json';
import dailyLifeData from '../data/daily-life.json';
import foodDrinkData from '../data/food-drink.json';
import travelData from '../data/travel.json';

import type { Topic, TopicsData } from '../types/topic';
import type { Lesson, TopicLessonsData } from '../types/lesson';

/**
 * Mapping of all lesson data files by topic slug
 */
const LESSON_DATA_MAP: Record<string, TopicLessonsData> = {
  greetings: greetingsData as TopicLessonsData,
  introductions: introductionsData as TopicLessonsData,
  'daily-life': dailyLifeData as TopicLessonsData,
  'food-drink': foodDrinkData as TopicLessonsData,
  travel: travelData as TopicLessonsData,
};

/**
 * Get all available topics, sorted by order
 */
export function getAllTopics(): ReadonlyArray<Topic> {
  const data = topicsData as TopicsData;
  return [...data.topics].sort((a, b) => a.order - b.order);
}

/**
 * Get a specific topic by its slug
 */
export function getTopicBySlug(slug: string): Topic | undefined {
  const data = topicsData as TopicsData;
  return data.topics.find((topic) => topic.slug === slug);
}

/**
 * Get all lessons for a specific topic slug, sorted by order
 */
export function getLessonsByTopicSlug(topicSlug: string): ReadonlyArray<Lesson> {
  const data = LESSON_DATA_MAP[topicSlug];
  if (!data) return [];
  
  return [...data.lessons].sort((a, b) => a.order - b.order);
}

/**
 * Get a specific lesson by topic slug and lesson slug
 */
export function getLessonBySlug(topicSlug: string, lessonSlug: string): Lesson | undefined {
  const data = LESSON_DATA_MAP[topicSlug];
  if (!data) return undefined;
  
  return data.lessons.find((lesson) => lesson.slug === lessonSlug);
}

/**
 * Calculate total lessons across all topics
 */
export function getTotalLessonCount(): number {
  return Object.values(LESSON_DATA_MAP).reduce((total, topicData) => {
    return total + topicData.lessons.length;
  }, 0);
}
