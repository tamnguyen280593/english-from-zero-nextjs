'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getAllTopics } from '../lib/data';
import TopicCard from '../components/topic/TopicCard';
import { useProgress } from '../hooks/useProgress';
import type { Topic } from '../types/topic';

export default function Home() {
  const [topics, setTopics] = useState<ReadonlyArray<Topic>>([]);
  const { progress, isLoaded } = useProgress();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTopics(getAllTopics());
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.title}>English From <span className={styles.highlight}>Zero</span></h1>
        <p className={styles.subtitle}>
          Học tiếng Anh giao tiếp từ con số 0. Chọn một chủ đề bên dưới để bắt đầu.
        </p>
      </header>

      <section className={styles.topicsGrid}>
        {topics.map((topic) => {
          // Calculate progress for this topic
          let topicProgress = 0;
          if (isLoaded) {
            // Count completed lessons that belong to this topic
            // Since we don't have a direct reverse lookup in UserProgress, 
            // we approximate by looking if the lessonId starts with the topicSlug
            // e.g. "greetings-hello" starts with "greetings-"
            const completedInTopic = progress.completedLessons.filter(
              id => id.startsWith(`${topic.slug}-`)
            ).length;
            
            topicProgress = topic.lessonCount > 0 
              ? Math.round((completedInTopic / topic.lessonCount) * 100)
              : 0;
              
            // Cap at 100
            topicProgress = Math.min(100, topicProgress);
          }

          return (
            <TopicCard 
              key={topic.slug} 
              topic={topic} 
              progress={topicProgress} 
            />
          );
        })}
      </section>
    </main>
  );
}
