/**
 * Type definitions for learning topics.
 * Each topic represents a major theme (e.g., Greetings, Food & Drink)
 * containing multiple lessons.
 */

/** Difficulty level of a topic */
export type TopicLevel = 'starter' | 'beginner' | 'elementary';

/** A learning topic with metadata and display properties */
export interface Topic {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly titleVi: string;
  readonly description: string;
  readonly descriptionVi: string;
  readonly icon: string;
  readonly image: string;
  readonly level: TopicLevel;
  readonly order: number;
  readonly lessonCount: number;
  readonly color: string;
}

/** Collection of topics used in JSON data files */
export interface TopicsData {
  readonly topics: ReadonlyArray<Topic>;
}
