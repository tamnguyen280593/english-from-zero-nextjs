/**
 * Type definitions for lessons, vocabulary, phrases, and practice questions.
 * Each lesson belongs to a topic and contains structured learning content.
 */

import type { Dialogue } from './dialogue';

/** Part of speech classification for vocabulary items */
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection';

/** Quiz question types */
export type QuestionType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'match-meaning';

/** A single vocabulary item with image, pronunciation, and example */
export interface VocabularyItem {
  readonly id: string;
  readonly word: string;
  readonly meaningVi: string;
  readonly ipa: string;
  readonly partOfSpeech: PartOfSpeech;
  readonly image: string;
  readonly exampleSentence: string;
  readonly exampleSentenceVi: string;
}

/** A useful phrase or expression with usage context */
export interface PhraseItem {
  readonly id: string;
  readonly phrase: string;
  readonly meaningVi: string;
  readonly ipa: string;
  readonly usage: string;
  readonly exampleDialogue?: string;
}

/** Optional grammar note for a lesson */
export interface GrammarNote {
  readonly title: string;
  readonly titleVi: string;
  readonly explanation: string;
  readonly explanationVi: string;
  readonly examples: ReadonlyArray<{
    readonly english: string;
    readonly vietnamese: string;
  }>;
}

/** A practice question for the quiz section */
export interface PracticeQuestion {
  readonly id: string;
  readonly type: QuestionType;
  readonly question: string;
  readonly questionVi: string;
  readonly options: ReadonlyArray<string>;
  readonly correctAnswer: number;
  readonly explanation: string;
}

/** A complete lesson with all learning sections */
export interface Lesson {
  readonly id: string;
  readonly slug: string;
  readonly topicSlug: string;
  readonly title: string;
  readonly titleVi: string;
  readonly order: number;
  readonly vocabulary: ReadonlyArray<VocabularyItem>;
  readonly phrases: ReadonlyArray<PhraseItem>;
  readonly dialogues: ReadonlyArray<Dialogue>;
  readonly grammar?: GrammarNote;
  readonly practice: ReadonlyArray<PracticeQuestion>;
}

/** Collection of lessons for a topic, used in JSON data files */
export interface TopicLessonsData {
  readonly topicSlug: string;
  readonly lessons: ReadonlyArray<Lesson>;
}
