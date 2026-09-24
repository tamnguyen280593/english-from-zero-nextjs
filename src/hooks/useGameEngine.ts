import { useState, useCallback, useEffect } from 'react';
import type { Category } from '../types/category';
import type { Topic } from '../types/topic';
import type { Lesson, PracticeQuestion } from '../types/lesson';
import { getAllTopics, getLessonsByTopicSlug, getAllCategories } from '../lib/data';

export type GameMode = 'single' | 'multi';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

export interface GameConfig {
  mode: GameMode;
  players: Omit<Player, 'score' | 'streak'>[];
  selectedTopicSlugs: string[];
  questionsPerPlayer: number;
  timeLimit: number; // 0 for no limit
}

export interface GameState {
  status: 'setup' | 'playing' | 'results';
  players: Player[];
  currentRound: number;
  currentPlayerIndex: number;
  questions: PracticeQuestion[];
  currentQuestion: PracticeQuestion | null;
  totalRounds: number;
}

// Simple shuffle
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'setup',
    players: [],
    currentRound: 0,
    currentPlayerIndex: 0,
    questions: [],
    currentQuestion: null,
    totalRounds: 0
  });
  
  const [availableTopics] = useState<ReadonlyArray<Topic>>(() => getAllTopics());
  const [availableCategories] = useState<ReadonlyArray<Category>>(() => getAllCategories());

  const startGame = useCallback((config: GameConfig) => {
    // 1. Initialize Players
    const initializedPlayers = config.players.map(p => ({
      ...p,
      score: 0,
      streak: 0
    }));

    // 2. Fetch lessons for selected topics
    const allLessonsByTopic: Record<string, ReadonlyArray<Lesson>> = {};
    for (const slug of config.selectedTopicSlugs) {
      allLessonsByTopic[slug] = getLessonsByTopicSlug(slug);
    }

    // Load seen questions from localStorage
    let seenQuestions: string[] = [];
    try {
      const stored = localStorage.getItem('arena_seen_questions');
      if (stored) seenQuestions = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }

    // 3. Generate Questions (Round-based Topic Selection)
    const totalRounds = config.questionsPerPlayer;
    const numPlayers = initializedPlayers.length;
    const generatedQuestions: PracticeQuestion[] = [];
    
    for (let round = 0; round < totalRounds; round++) {
      // Pick a random topic for this round
      const randomTopicSlug = config.selectedTopicSlugs[Math.floor(Math.random() * config.selectedTopicSlugs.length)];
      const lessons = allLessonsByTopic[randomTopicSlug] || [];
      
      const allVocab = lessons.flatMap(l => l.vocabulary || []);
      
      // Filter out seen vocabs
      let unseenVocab = allVocab.filter(v => !seenQuestions.includes(v.id));
      
      // Anti-Repetition Reset Logic: If not enough unseen vocab for all players, reset storage for this topic
      if (unseenVocab.length < numPlayers) {
        console.log(`Not enough unseen vocab for topic ${randomTopicSlug}. Resetting seen status.`);
        // Remove this topic's vocab from seenQuestions
        const topicVocabIds = allVocab.map(v => v.id);
        seenQuestions = seenQuestions.filter(id => !topicVocabIds.includes(id));
        unseenVocab = allVocab; // Use all vocab again
      }
      
      const shuffledVocab = shuffle(unseenVocab);
      
      // Pick N unique vocabs for N players
      for (let p = 0; p < numPlayers; p++) {
        const vocab = shuffledVocab[p];
        if (!vocab) continue; // Safety check
        
        // Mark as seen
        seenQuestions.push(vocab.id);
        
        // Generate a question for this vocab
        const distractors = shuffle(allVocab.filter(v => v.word !== vocab.word)).slice(0, 3).map(v => v.meaningVi);
        while (distractors.length < 3) distractors.push("Khác");
        
        const options = shuffle([vocab.meaningVi, ...distractors]);
        
        generatedQuestions.push({
          id: `game-${round}-${p}-${vocab.id}`,
          type: 'multiple-choice',
          question: `Từ '${vocab.word}' có nghĩa là gì?`,
          questionVi: `'${vocab.word}' có nghĩa là gì?`,
          options: options,
          correctAnswer: options.indexOf(vocab.meaningVi),
          explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`,
          wordToSpeak: vocab.word
        } as PracticeQuestion & { wordToSpeak?: string });
      }
    }
    
    // Save updated seen list to localStorage
    try {
      localStorage.setItem('arena_seen_questions', JSON.stringify(seenQuestions));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    setGameState({
      status: 'playing',
      players: initializedPlayers,
      currentRound: 1,
      currentPlayerIndex: 0,
      questions: generatedQuestions,
      currentQuestion: generatedQuestions[0] || null,
      totalRounds: totalRounds
    });
  }, []);

  const nextTurn = useCallback((wasCorrect: boolean) => {
    setGameState(prev => {
      // Create a deep copy of the players array to avoid Strict Mode double-mutation bugs
      const newPlayers = prev.players.map(p => ({ ...p }));
      const currentPlayer = newPlayers[prev.currentPlayerIndex];
      
      // Update score and streak right before advancing turn
      if (wasCorrect) {
        currentPlayer.score += 10;
        currentPlayer.streak += 1;
      } else {
        currentPlayer.streak = 0;
      }

      let nextPlayerIndex = prev.currentPlayerIndex + 1;
      let nextRound = prev.currentRound;
      
      if (nextPlayerIndex >= prev.players.length) {
        nextPlayerIndex = 0;
        nextRound += 1;
      }
      
      const nextQuestionIndex = ((nextRound - 1) * prev.players.length) + nextPlayerIndex;
      
      if (nextRound > prev.totalRounds || nextQuestionIndex >= prev.questions.length) {
        return {
          ...prev,
          players: newPlayers,
          status: 'results'
        };
      }
      
      return {
        ...prev,
        players: newPlayers,
        currentRound: nextRound,
        currentPlayerIndex: nextPlayerIndex,
        currentQuestion: prev.questions[nextQuestionIndex]
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: 'setup'
    }));
  }, []);

  return {
    gameState,
    availableTopics,
    availableCategories,
    startGame,
    nextTurn,
    resetGame
  };
}
