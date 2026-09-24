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
  
  const allVocab = allLessons.flatMap(l => l.vocabulary || []);
  const allPhrases = allLessons.flatMap(l => l.phrases || []);
  
  // Helper: Get strictly unique distractors
  const getUniqueDistractors = (pool: string[], correctAnswer: string, requiredCount: number, existingDistractors: string[] = []): string[] => {
    const distractors = new Set<string>(existingDistractors);
    const filteredPool = pool.filter(item => item !== correctAnswer && item.trim() !== '');
    const shuffledPool = shuffle(filteredPool);
    
    for (const item of shuffledPool) {
      if (distractors.size >= requiredCount + existingDistractors.length) break;
      distractors.add(item);
    }
    
    return Array.from(distractors).filter(d => !existingDistractors.includes(d)).slice(0, requiredCount);
  };

  // Helper: Apply safe fallbacks
  const applyFallbacks = (currentDistractors: string[], correctAnswer: string, fallbacks: string[]): string[] => {
    const result = [...currentDistractors];
    for (const fb of fallbacks) {
      if (result.length >= 3) break;
      if (!result.includes(fb) && fb !== correctAnswer) {
        result.push(fb);
      }
    }
    return result;
  };

  const viFallbacks = ["Không có nghĩa nào ở trên", "Không xác định", "Khác", "Không rõ"];
  const enFallbacks = ["None of the above", "Unknown", "Other", "Undefined"];

  // 1. Generate ONE unique question per vocabulary (randomly En->Vi or Vi->En)
  if (lesson.vocabulary) {
    for (const vocab of lesson.vocabulary) {
      const isEnToVi = Math.random() > 0.5;
      
      if (isEnToVi) {
        let distractorsVi = getUniqueDistractors(allVocab.map(v => v.meaningVi), vocab.meaningVi, 3);
        distractorsVi = applyFallbacks(distractorsVi, vocab.meaningVi, viFallbacks);
        
        const optionsVi = shuffle([vocab.meaningVi, ...distractorsVi]);
        questions.push({
          id: `q-vocab-en-vi-${vocab.id}`,
          type: 'multiple-choice',
          question: `Từ '${vocab.word}' có nghĩa là gì?`,
          questionVi: `'${vocab.word}' có nghĩa là gì?`,
          options: optionsVi,
          correctAnswer: optionsVi.indexOf(vocab.meaningVi),
          explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
        });
      } else {
        let distractorsEn = getUniqueDistractors(allVocab.map(v => v.word), vocab.word, 3);
        distractorsEn = applyFallbacks(distractorsEn, vocab.word, enFallbacks);
        
        const optionsEn = shuffle([vocab.word, ...distractorsEn]);
        questions.push({
          id: `q-vocab-vi-en-${vocab.id}`,
          type: 'multiple-choice',
          question: `Từ nào có nghĩa là '${vocab.meaningVi}'?`,
          questionVi: `Từ nào có nghĩa là '${vocab.meaningVi}'?`,
          options: optionsEn,
          correctAnswer: optionsEn.indexOf(vocab.word),
          explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
        });
      }
    }
  }

  // 2. Generate ONE unique question per phrase
  if (lesson.phrases) {
    for (const phrase of lesson.phrases) {
      const isEnToVi = Math.random() > 0.5;
      
      if (isEnToVi) {
        let distractorsVi = getUniqueDistractors(allPhrases.map(p => p.meaningVi), phrase.meaningVi, 3);
        if (distractorsVi.length < 3) {
          const extra = getUniqueDistractors(allVocab.map(v => v.meaningVi), phrase.meaningVi, 3 - distractorsVi.length, distractorsVi);
          distractorsVi = [...distractorsVi, ...extra];
        }
        distractorsVi = applyFallbacks(distractorsVi, phrase.meaningVi, viFallbacks);
        
        const optionsVi = shuffle([phrase.meaningVi, ...distractorsVi]);
        questions.push({
          id: `q-phrase-en-vi-${phrase.id}`,
          type: 'multiple-choice',
          question: `Câu '${phrase.phrase}' có nghĩa là gì?`,
          questionVi: `'${phrase.phrase}' có nghĩa là gì?`,
          options: optionsVi,
          correctAnswer: optionsVi.indexOf(phrase.meaningVi),
          explanation: `'${phrase.phrase}' nghĩa là ${phrase.meaningVi}.`
        });
      } else {
        let distractorsEn = getUniqueDistractors(allPhrases.map(p => p.phrase), phrase.phrase, 3);
        distractorsEn = applyFallbacks(distractorsEn, phrase.phrase, enFallbacks);
        
        const optionsEn = shuffle([phrase.phrase, ...distractorsEn]);
        questions.push({
          id: `q-phrase-vi-en-${phrase.id}`,
          type: 'multiple-choice',
          question: `Câu nào có nghĩa là '${phrase.meaningVi}'?`,
          questionVi: `Câu nào có nghĩa là '${phrase.meaningVi}'?`,
          options: optionsEn,
          correctAnswer: optionsEn.indexOf(phrase.phrase),
          explanation: `'${phrase.phrase}' nghĩa là ${phrase.meaningVi}.`
        });
      }
    }
  }

  // 3. Add existing static practice questions
  if (lesson.practice && lesson.practice.length > 0) {
    questions.push(...lesson.practice);
  }

  // 4. Fill the remaining slots with review questions from previous/other lessons (if requested)
  const usedIds = new Set(lesson.vocabulary?.map(v => v.id) || []);
  const otherLessons = allLessons.filter(l => l.slug !== lesson.slug);
  const otherVocabs = shuffle(otherLessons.flatMap(l => l.vocabulary || []));
  
  let i = 0;
  while (questions.length < count && i < otherVocabs.length) {
    const vocab = otherVocabs[i];
    if (!usedIds.has(vocab.id)) {
      usedIds.add(vocab.id);
      const isEnToVi = Math.random() > 0.5;
      const prefix = "(Mở rộng)";
      
      if (isEnToVi) {
        let distractorsVi = getUniqueDistractors(allVocab.map(v => v.meaningVi), vocab.meaningVi, 3);
        distractorsVi = applyFallbacks(distractorsVi, vocab.meaningVi, viFallbacks);
        
        const optionsVi = shuffle([vocab.meaningVi, ...distractorsVi]);
        questions.push({
          id: `q-rev-en-vi-${vocab.id}`,
          type: 'multiple-choice',
          question: `${prefix} '${vocab.word}' có nghĩa là gì?`,
          questionVi: `'${vocab.word}' có nghĩa là gì?`,
          options: optionsVi,
          correctAnswer: optionsVi.indexOf(vocab.meaningVi),
          explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
        });
      } else {
        let distractorsEn = getUniqueDistractors(allVocab.map(v => v.word), vocab.word, 3);
        distractorsEn = applyFallbacks(distractorsEn, vocab.word, enFallbacks);
        
        const optionsEn = shuffle([vocab.word, ...distractorsEn]);
        questions.push({
          id: `q-rev-vi-en-${vocab.id}`,
          type: 'multiple-choice',
          question: `${prefix} Từ nào có nghĩa là '${vocab.meaningVi}'?`,
          questionVi: `Từ nào có nghĩa là '${vocab.meaningVi}'?`,
          options: optionsEn,
          correctAnswer: optionsEn.indexOf(vocab.word),
          explanation: `'${vocab.word}' nghĩa là ${vocab.meaningVi}.`
        });
      }
    }
    i++;
  }

  // 5. Shuffle final questions and return the requested count
  return shuffle(questions).slice(0, count);
}
