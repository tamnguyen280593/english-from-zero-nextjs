# Task Checklist: Game Arena

- `[ ]` 1. Create `src/hooks/useGameEngine.ts` (Core Logic)
  - `[ ]` Fetch questions from selected topics.
  - `[ ]` Implement Round-based Topic Selection for fairness.
  - `[ ]` Implement Anti-Repetition with `localStorage`.
- `[ ]` 2. Build Setup Screen (`src/app/games/arena/page.tsx`)
  - `[ ]` UI for Mode selection, Player Input (with Avatars), Topic Selection, Question Count.
- `[ ]` 3. Build Gameplay Screen
  - `[ ]` Turn indicator.
  - `[ ]` Multiple-choice quiz UI.
  - `[ ]` Text-to-Speech (TTS) on correct answer.
  - `[ ]` Combo/Streak effects.
- `[ ]` 4. Build Results Screen
  - `[ ]` Single-player ranking logic & messages.
  - `[ ]` Multiplayer leaderboard & winner confetti.
- `[ ]` 5. Add Game entry to Homepage (`src/app/page.tsx`)
