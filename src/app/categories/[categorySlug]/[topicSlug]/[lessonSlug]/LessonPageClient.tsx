'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { getLessonBySlug, getTopicBySlug, getLessonsByTopicSlug, getCategoryBySlug } from '../../../../../lib/data';
import { useProgress } from '../../../../../hooks/useProgress';
import type { Lesson } from '../../../../../types/lesson';
import type { Topic } from '../../../../../types/topic';
import type { Category } from '../../../../../types/category';

import Breadcrumb from '../../../../../components/common/Breadcrumb';
import VocabularyItem from '../../../../../components/lesson/VocabularyItem';
import PhraseItem from '../../../../../components/lesson/PhraseItem';
import DialogueSection from '../../../../../components/lesson/DialogueSection';
import PracticeSection from '../../../../../components/lesson/PracticeSection';
import { generateQuiz } from '../../../../../lib/quizGenerator';
import type { PracticeQuestion } from '../../../../../types/lesson';

interface LessonPageProps {
  params: Promise<{
    categorySlug: string;
    topicSlug: string;
    lessonSlug: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = use(params);
  const { categorySlug, topicSlug, lessonSlug } = resolvedParams;

  const [category, setCategory] = useState<Category | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<PracticeQuestion[]>([]);
  const [retryKey, setRetryKey] = useState(0);
  
  const { markLessonCompleted, saveQuizScore, setLastAccessed } = useProgress();

  useEffect(() => {
    const foundCategory = getCategoryBySlug(categorySlug);
    const foundTopic = getTopicBySlug(topicSlug);
    const foundLesson = getLessonBySlug(topicSlug, lessonSlug);
    
    if (!foundCategory || !foundTopic || !foundLesson) {
      notFound();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(foundCategory);
    setTopic(foundTopic);
    setLesson(foundLesson);
    
    // Track last accessed for resume functionality
    setLastAccessed(categorySlug, topicSlug, lessonSlug);

    // Find next lesson
    const topicLessons = getLessonsByTopicSlug(topicSlug);
    const currentIndex = topicLessons.findIndex(l => l.slug === lessonSlug);
    if (currentIndex >= 0 && currentIndex < topicLessons.length - 1) {
      setNextLesson(topicLessons[currentIndex + 1]);
    } else {
      setNextLesson(null);
    }

    // Generate dynamic quiz
    setQuizQuestions(generateQuiz(foundLesson, topicLessons, 20));
  }, [categorySlug, topicSlug, lessonSlug, setLastAccessed, retryKey]);

  if (!category || !topic || !lesson) return null;

  const handlePracticeComplete = (score: number) => {
    const lessonId = `${topic.slug}-${lesson.slug}`;
    saveQuizScore(lessonId, score);
    
    // If score > 50%, consider it passed and completed
    if (score >= 50) {
      markLessonCompleted(lessonId);
    }
  };

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <main className={styles.main}>
      <Breadcrumb 
        items={[
          { label: category.title, href: `/categories/${category.slug}` },
          { label: topic.title, href: `/categories/${category.slug}/${topic.slug}` },
          { label: `Bài ${lesson.order}` }
        ]} 
      />

      <header className={styles.header}>
        <div className={styles.numberBadge}>Bài {lesson.order}</div>
        <h1 className={styles.title}>{lesson.title}</h1>
        <p className={styles.titleVi}>{lesson.titleVi}</p>
      </header>

      {/* 1. Vocabulary Section */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 Từ vựng mới</h2>
          <div className={styles.vocabularyList}>
            {lesson.vocabulary.map((vocab, index) => (
              <VocabularyItem key={index} item={vocab} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Phrases Section */}
      {lesson.phrases && lesson.phrases.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💬 Mẫu câu</h2>
          <div className={styles.phraseList}>
            {lesson.phrases.map((phrase, index) => (
              <PhraseItem key={index} item={phrase} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Dialogue Section */}
      {lesson.dialogues && lesson.dialogues.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🗣️ Hội thoại</h2>
          {lesson.dialogues.map((dialogue, index) => (
            <DialogueSection key={index} dialogue={dialogue} />
          ))}
        </section>
      )}

      {/* 4. Practice Section */}
      {quizQuestions && quizQuestions.length > 0 && (
        <section className={styles.section}>
          <PracticeSection 
            key={retryKey}
            questions={quizQuestions} 
            onComplete={handlePracticeComplete} 
            onRetry={handleRetry}
          />
        </section>
      )}

      {/* Navigation Footer */}
      <div className={styles.navFooter}>
        <Link href={`/categories/${category.slug}/${topic.slug}`} className={styles.backBtn}>
          ⬅️ Về danh sách bài
        </Link>
        
        {nextLesson && (
          <Link 
            href={`/categories/${category.slug}/${topic.slug}/${nextLesson.slug}`} 
            className={styles.nextLessonBtn}
          >
            Bài tiếp theo ➡️
          </Link>
        )}
      </div>
    </main>
  );
}
