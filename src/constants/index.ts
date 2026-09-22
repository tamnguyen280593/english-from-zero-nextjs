/**
 * Application-wide constants.
 */

/** localStorage key for user progress */
export const PROGRESS_STORAGE_KEY = 'english-from-zero-progress' as const;

/** Default TTS speech rate for beginners (slower than normal) */
export const DEFAULT_SPEECH_RATE = 0.8 as const;

/** Slow TTS speech rate */
export const SLOW_SPEECH_RATE = 0.5 as const;

/** Normal TTS speech rate */
export const NORMAL_SPEECH_RATE = 1.0 as const;

/** Preferred TTS language */
export const TTS_LANGUAGE = 'en-US' as const;

/** App metadata */
export const APP_NAME = 'English From Zero' as const;
export const APP_DESCRIPTION = 'Học tiếng Anh giao tiếp từ con số 0' as const;

/** GitHub repository URL */
export const GITHUB_REPO_URL = 'https://github.com/tamnh280593/english-from-zero-nextjs' as const;

/** Base path for GitHub Pages deployment */
export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/english-from-zero-nextjs' : '' as const;
