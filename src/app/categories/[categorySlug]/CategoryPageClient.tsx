'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getCategoryBySlug, getTopicsByCategory } from '../../../lib/data';
import { useProgress } from '../../../hooks/useProgress';
import type { Category } from '../../../types/category';
import type { Topic } from '../../../types/topic';

import Breadcrumb from '../../../components/common/Breadcrumb';
import TopicCard from '../../../components/topic/TopicCard';

interface CategoryPageClientProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default function CategoryPageClient({ params }: CategoryPageClientProps) {
  const resolvedParams = use(params);
  const { categorySlug } = resolvedParams;

  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<ReadonlyArray<Topic>>([]);
  const { progress, isLoaded } = useProgress();

  useEffect(() => {
    const foundCategory = getCategoryBySlug(categorySlug);
    
    if (!foundCategory) {
      notFound();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(foundCategory);
    setTopics(getTopicsByCategory(categorySlug));
  }, [categorySlug]);

  if (!category) return null;

  return (
    <main className={styles.main}>
      <Breadcrumb items={[{ label: category.title }]} />
      
      <header className={styles.header}>
        <div className={styles.categoryBadge}>{category.titleVi}</div>
        <h1 className={styles.title}>{category.title}</h1>
        <p className={styles.description}>{category.description}</p>
        <p className={styles.descriptionVi}>{category.descriptionVi}</p>
      </header>

      <div className={styles.grid}>
        {topics.map((topic) => {
          let topicProgress = 0;
          if (isLoaded) {
            const completedInTopic = progress.completedLessons.filter(
              id => id.startsWith(`${topic.slug}-`)
            ).length;
            
            topicProgress = topic.lessonCount > 0 
              ? Math.round((completedInTopic / topic.lessonCount) * 100)
              : 0;
            topicProgress = Math.min(100, topicProgress);
          }

          return (
            <TopicCard 
              key={topic.id} 
              topic={topic} 
              progress={topicProgress}
              href={`/categories/${categorySlug}/${topic.slug}`} 
            />
          );
        })}
      </div>
    </main>
  );
}
