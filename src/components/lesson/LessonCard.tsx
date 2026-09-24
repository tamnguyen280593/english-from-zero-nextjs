import Link from 'next/link';
import styles from './LessonCard.module.css';
import type { Lesson } from '../../types/lesson';

interface LessonCardProps {
  lesson: Lesson;
  categorySlug: string;
  topicSlug: string;
  isCompleted: boolean;
  score?: number;
}

export default function LessonCard({ lesson, categorySlug, topicSlug, isCompleted, score }: LessonCardProps) {
  return (
    <Link href={`/categories/${categorySlug}/${topicSlug}/${lesson.slug}`} className={styles.card}>
      <div className={styles.numberBox}>
        <span className={styles.number}>{lesson.order}</span>
        {isCompleted && (
          <div className={styles.checkIcon}>✅</div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{lesson.title}</h3>
        <p className={styles.titleVi}>{lesson.titleVi}</p>
        
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            📚 {lesson.vocabulary.length} từ vựng
          </span>
          <span className={styles.metaItem}>
            💬 {lesson.phrases.length} câu
          </span>
        </div>
      </div>
      
      {isCompleted && score !== undefined && (
        <div className={styles.scoreBadge} title={`Điểm bài tập: ${score}%`}>
          {score === 100 ? '🏆' : `${score}%`}
        </div>
      )}
      
      <div className={styles.arrow}>➡️</div>
    </Link>
  );
}
