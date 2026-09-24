import type { Lesson, PracticeQuestion } from '../types/lesson';

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Generates a dynamic quiz for a given lesson
 * @param lesson The current lesson
 * @param allLessons All lessons in the same topic (for distractors and review)
 * @param count The target number of questions (default 20)
 */
export function generateQuiz(lesson: Lesson, allLessons: readonly Lesson[], count: number = 20): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  
  // 1. Gather all vocab and phrases for distractors
  const allVocab = allLessons.flatMap(l => l.vocabulary || []);
  const allPhrases = allLessons.flatMap(l => l.phrases || []);
  
  // Helper to get 2 random unique distractors
  const getDistractors = (pool: string[], correctAnswer: string): string[] => {
    const filtered = pool.filter(item => item !== correctAnswer && item.trim() !== '');
    return shuffle(filtered).slice(0, 2);
  };

  // 2. Generate questions from current lesson vocabulary
  if (lesson.vocabulary) {
    for (const vocab of lesson.vocabulary) {
      // Type 1: English -> Vietnamese
      const distractorsVi = getDistractors(allVocab.map(v => v.meaningVi), vocab.meaningVi);
      // Fallback if not enough vocab (rare)
      while (distractorsVi.length < 2) distractorsVi.push(distractorsVi.length === 0 ? "Không rõ" : "Khác");
      
      const optionsVi = shuffle([vocab.meaningVi, ...distractorsVi]);
      questions.push({
        id: `q-vocab-en-vi-${vocab.id}-${Date.now()}`,
        type: 'multiple-choice',
        question: `Từ '${vocab.word}' có nghĩa là gì?`,
        questionVi: `'${vocab.word}' có nghĩa là gì?`,
        options: optionsVi,
        correctAnswer: optionsVi.indexOf(vocab.meaningVi),
        explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
      });

      // Type 2: Vietnamese -> English
      const distractorsEn = getDistractors(allVocab.map(v => v.word), vocab.word);
      while (distractorsEn.length < 2) distractorsEn.push(distractorsEn.length === 0 ? "unknown" : "other");
      
      const optionsEn = shuffle([vocab.word, ...distractorsEn]);
      questions.push({
        id: `q-vocab-vi-en-${vocab.id}-${Date.now()}`,
        type: 'multiple-choice',
        question: `Từ nào có nghĩa là '${vocab.meaningVi}'?`,
        questionVi: `Từ nào có nghĩa là '${vocab.meaningVi}'?`,
        options: optionsEn,
        correctAnswer: optionsEn.indexOf(vocab.word),
        explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
      });
    }
  }

  // 3. Generate questions from current lesson phrases
  if (lesson.phrases) {
    for (const phrase of lesson.phrases) {
      const distractorsVi = getDistractors(allPhrases.map(p => p.meaningVi), phrase.meaningVi);
      // If not enough phrase distractors, use vocab meanings
      if (distractorsVi.length < 2) {
        distractorsVi.push(...getDistractors(allVocab.map(v => v.meaningVi), phrase.meaningVi).slice(0, 2 - distractorsVi.length));
      }
      
      const optionsVi = shuffle([phrase.meaningVi, ...distractorsVi]);
      questions.push({
        id: `q-phrase-en-vi-${phrase.id}-${Date.now()}`,
        type: 'multiple-choice',
        question: `Câu '${phrase.phrase}' có nghĩa là gì?`,
        questionVi: `'${phrase.phrase}' có nghĩa là gì?`,
        options: optionsVi,
        correctAnswer: optionsVi.indexOf(phrase.meaningVi),
        explanation: `'${phrase.phrase}' nghĩa là ${phrase.meaningVi}.`
      });

      // Type 4: Phrase Vi -> En
      const distractorsEn = getDistractors(allPhrases.map(p => p.phrase), phrase.phrase);
      if (distractorsEn.length < 2) {
        distractorsEn.push("Hello", "Goodbye"); // fallback
      }
      const optionsEn = shuffle([phrase.phrase, ...distractorsEn]);
      questions.push({
        id: `q-phrase-vi-en-${phrase.id}-${Date.now()}`,
        type: 'multiple-choice',
        question: `Câu nào có nghĩa là '${phrase.meaningVi}'?`,
        questionVi: `Câu nào có nghĩa là '${phrase.meaningVi}'?`,
        options: optionsEn,
        correctAnswer: optionsEn.indexOf(phrase.phrase),
        explanation: `'${phrase.phrase}' nghĩa là ${phrase.meaningVi}.`
      });
    }
  }

  // 4. Add existing static practice questions
  if (lesson.practice && lesson.practice.length > 0) {
    questions.push(...lesson.practice);
  }

  // 5. Fill the remaining slots with review questions from previous lessons, or if not enough, from other lessons
  const otherLessons = allLessons.filter(l => l.slug !== lesson.slug);
  const otherVocabs = shuffle(otherLessons.flatMap(l => l.vocabulary || []));
  
  let i = 0;
  while (questions.length < count && i < otherVocabs.length) {
    const vocab = otherVocabs[i];
    const isEnToVi = Math.random() > 0.5;
    const prefix = "(Mở rộng)";
    
    if (isEnToVi) {
      const distractorsVi = getDistractors(allVocab.map(v => v.meaningVi), vocab.meaningVi);
      while (distractorsVi.length < 2) distractorsVi.push("Khác");
      const optionsVi = shuffle([vocab.meaningVi, ...distractorsVi]);
      
      questions.push({
        id: `q-rev-en-vi-${vocab.id}-${i}-${Date.now()}`,
        type: 'multiple-choice',
        question: `${prefix} '${vocab.word}' có nghĩa là gì?`,
        questionVi: `'${vocab.word}' có nghĩa là gì?`,
        options: optionsVi,
        correctAnswer: optionsVi.indexOf(vocab.meaningVi),
        explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
      });
    } else {
      const distractorsEn = getDistractors(allVocab.map(v => v.word), vocab.word);
      while (distractorsEn.length < 2) distractorsEn.push("other");
      const optionsEn = shuffle([vocab.word, ...distractorsEn]);
      
      questions.push({
        id: `q-rev-vi-en-${vocab.id}-${i}-${Date.now()}`,
        type: 'multiple-choice',
        question: `${prefix} Từ nào có nghĩa là '${vocab.meaningVi}'?`,
        questionVi: `Từ nào có nghĩa là '${vocab.meaningVi}'?`,
        options: optionsEn,
        correctAnswer: optionsEn.indexOf(vocab.word),
        explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
      });
    }
    i++;
  }

  // 6. If STILL not enough (e.g. only 1 lesson exists), duplicate current lesson's vocabs as filler
  let j = 0;
  const currentVocabs = lesson.vocabulary || [];
  while (questions.length < count && currentVocabs.length > 0) {
    const vocab = currentVocabs[j % currentVocabs.length];
    const distractorsVi = getDistractors(allVocab.map(v => v.meaningVi), vocab.meaningVi);
    while (distractorsVi.length < 2) distractorsVi.push("Khác");
    const optionsVi = shuffle([vocab.meaningVi, ...distractorsVi]);
    
    questions.push({
      id: `q-filler-${vocab.id}-${j}-${Date.now()}`,
      type: 'multiple-choice',
      question: `(Luyện thêm) '${vocab.word}' có nghĩa là gì?`,
      questionVi: `'${vocab.word}' có nghĩa là gì?`,
      options: optionsVi,
      correctAnswer: optionsVi.indexOf(vocab.meaningVi),
      explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
    });
    j++;
  }

  // 6. Shuffle final questions and return the requested count (or all if we don't have enough)
  return shuffle(questions).slice(0, count);
}
