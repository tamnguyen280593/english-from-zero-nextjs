'use client';

import { useState } from 'react';
import styles from './PracticeSection.module.css';
import type { PracticeQuestion } from '../../types/lesson';

interface PracticeSectionProps {
  questions: ReadonlyArray<PracticeQuestion>;
  onComplete: (score: number) => void;
}

export default function PracticeSection({ questions, onComplete }: PracticeSectionProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const progress = Math.round(((currentQIndex) / questions.length) * 100);

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);

    if (selectedOption === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    } else {
      // Trigger shake animation for wrong answer
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      const scorePercent = Math.round((finalScore / questions.length) * 100);
      onComplete(scorePercent);
    }
  };

  if (isFinished) {
    const finalScorePercent = Math.round((score / questions.length) * 100);
    return (
      <div className={styles.container}>
        <div className={styles.completionBox}>
          <div className={styles.trophy}>🏆</div>
          <h3 className={styles.completionTitle}>Hoàn thành bài tập!</h3>
          <p className={styles.completionScore}>
            Đúng {score}/{questions.length} câu ({finalScorePercent}%)
          </p>
          <div className={styles.completionMessage}>
            {finalScorePercent === 100 ? 'Tuyệt vời! Bạn đã nắm vững bài học này.' :
             finalScorePercent >= 70 ? 'Khá lắm! Bạn đang làm rất tốt.' :
             'Cố gắng lên! Hãy xem lại bài học và thử lại nhé.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>✏️ Luyện tập</h2>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressText}>{currentQIndex + 1}/{questions.length}</span>
      </div>

      <div className={`${styles.questionCard} ${shake ? 'animate-shake' : ''}`}>
        <p className={styles.questionEn}>{currentQ.question}</p>
        <p className={styles.questionVi}>{currentQ.questionVi}</p>

        <div className={styles.optionsList}>
          {currentQ.options.map((option, index) => {
            let optionClass = styles.option;
            
            if (selectedOption === index) {
              optionClass += ` ${styles.selected}`;
            }
            
            if (isSubmitted) {
              if (index === currentQ.correctAnswer) {
                optionClass += ` ${styles.correct}`;
              } else if (selectedOption === index) {
                optionClass += ` ${styles.wrong}`;
              } else {
                optionClass += ` ${styles.disabled}`;
              }
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleOptionSelect(index)}
                disabled={isSubmitted}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option}</span>
                {isSubmitted && index === currentQ.correctAnswer && (
                  <span className={styles.statusIcon}>✅</span>
                )}
                {isSubmitted && selectedOption === index && index !== currentQ.correctAnswer && (
                  <span className={styles.statusIcon}>❌</span>
                )}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className={`${styles.feedbackBox} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            <h4 className={styles.feedbackTitle}>
              {isCorrect ? '✅ Chính xác!' : '❌ Sai rồi!'}
            </h4>
            <p className={styles.feedbackText}>{currentQ.explanation}</p>
          </div>
        )}

        <div className={styles.actionRow}>
          {!isSubmitted ? (
            <button 
              className={styles.submitBtn} 
              onClick={handleSubmit}
              disabled={selectedOption === null}
            >
              Kiểm tra
            </button>
          ) : (
            <button 
              className={styles.nextBtn} 
              onClick={handleNext}
            >
              {currentQIndex < questions.length - 1 ? 'Câu tiếp theo ➡️' : 'Hoàn thành 🎉'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
