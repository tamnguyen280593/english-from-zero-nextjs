'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getTopicBySlug, getLessonsByTopicSlug, getCategoryBySlug } from '../../../../lib/data';
import { useProgress } from '../../../../hooks/useProgress';
import type { Topic } from '../../../../types/topic';
import type { Category } from '../../../../types/category';
import type { Lesson } from '../../../../types/lesson';
import LessonCard from '../../../../components/lesson/LessonCard';
import Breadcrumb from '../../../../components/common/Breadcrumb';

interface TopicPageProps {
  params: Promise<{
    categorySlug: string;
    topicSlug: string;
  }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const resolvedParams = use(params);
  const { categorySlug, topicSlug } = resolvedParams;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lessons, setLessons] = useState<ReadonlyArray<Lesson>>([]);
  const { progress, isLoaded } = useProgress();

  useEffect(() => {
    const foundCategory = getCategoryBySlug(categorySlug);
    const foundTopic = getTopicBySlug(topicSlug);
    if (!foundCategory || !foundTopic) {
      notFound();
      return;
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(foundCategory);
    setTopic(foundTopic);
    setLessons(getLessonsByTopicSlug(topicSlug));
  }, [categorySlug, topicSlug]);

  if (!category || !topic) {
    return null; // Or a loading spinner
  }

  return (
    <main className={styles.main}>
      <Breadcrumb 
        items={[
          { label: category.title, href: `/categories/${category.slug}` },
          { label: topic.title }
        ]} 
      />

      <header className={styles.header}>
        <div className={styles.iconWrapper} style={{ backgroundColor: topic.color }}>
          <span className={styles.icon}>{topic.icon}</span>
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{topic.title}</h1>
          <p className={styles.titleVi}>{topic.titleVi}</p>
          <p className={styles.description}>{topic.descriptionVi}</p>
        </div>
      </header>

      <section className={styles.lessonList}>
        <h2 className={styles.sectionTitle}>Danh sách bài học</h2>
        
        <div className={styles.grid}>
          {lessons.map((lesson) => {
            const lessonId = `${topic.slug}-${lesson.slug}`;
            const isCompleted = isLoaded && progress.completedLessons.includes(lessonId);
            const score = isLoaded ? progress.quizScores[lessonId] : undefined;

            return (
              <LessonCard 
                key={lesson.slug}
                lesson={lesson}
                topicSlug={topic.slug}
                categorySlug={category.slug}
                isCompleted={isCompleted}
                score={score}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
