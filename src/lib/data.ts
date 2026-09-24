import categoriesData from '../data/categories.json';
import topicsData from '../data/topics.json';
import greetingsData from '../data/greetings.json';
import introductionsData from '../data/introductions.json';
import dailyLifeData from '../data/daily-life.json';
import foodDrinkData from '../data/food-drink.json';
import travelData from '../data/travel.json';
import businessData from '../data/business.json';
import healthData from '../data/health.json';
import shoppingData from '../data/shopping.json';
import hobbiesData from '../data/hobbies.json';
import weatherData from '../data/weather.json';
import grade1Data from '../data/grade-1.json';
import grade2Data from '../data/grade-2.json';
import grade3Data from '../data/grade-3.json';
import grade4Data from '../data/grade-4.json';
import grade5Data from '../data/grade-5.json';

import type { Category } from '../types/category';
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
  business: businessData as TopicLessonsData,
  health: healthData as TopicLessonsData,
  shopping: shoppingData as TopicLessonsData,
  hobbies: hobbiesData as TopicLessonsData,
  weather: weatherData as TopicLessonsData,
  'grade-1': grade1Data as TopicLessonsData,
  'grade-2': grade2Data as TopicLessonsData,
  'grade-3': grade3Data as TopicLessonsData,
  'grade-4': grade4Data as TopicLessonsData,
  'grade-5': grade5Data as TopicLessonsData,
};

/**
 * Get all available categories, sorted by order
 */
export function getAllCategories(): ReadonlyArray<Category> {
  const data = categoriesData as Category[];
  return [...data].sort((a, b) => a.order - b.order);
}

/**
 * Get a specific category by its slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  const data = categoriesData as Category[];
  return data.find((cat) => cat.slug === slug);
}

/**
 * Get all available topics, sorted by order
 */
export function getAllTopics(): ReadonlyArray<Topic> {
  const data = topicsData as TopicsData;
  return [...data.topics].sort((a, b) => a.order - b.order);
}

/**
 * Get topics by category slug
 */
export function getTopicsByCategory(categorySlug: string): ReadonlyArray<Topic> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  
  const data = topicsData as TopicsData;
  return [...data.topics]
    .filter(t => t.categoryId === category.id)
    .sort((a, b) => a.order - b.order);
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
