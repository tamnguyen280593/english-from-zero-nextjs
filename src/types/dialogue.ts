/**
 * Type definitions for dialogue/conversation sections.
 * Dialogues simulate real-life conversations to practice listening and speaking.
 */

/** A single line spoken by a character in a dialogue */
export interface DialogueLine {
  readonly speaker: string;
  readonly text: string;
  readonly textVi: string;
  readonly ipa: string;
}

/** A complete dialogue with context and multiple speaker lines */
export interface Dialogue {
  readonly id: string;
  readonly title: string;
  readonly titleVi: string;
  readonly situation: string;
  readonly lines: ReadonlyArray<DialogueLine>;
}
