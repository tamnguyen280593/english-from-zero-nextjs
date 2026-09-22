'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { useProgress } from '../../hooks/useProgress';
import { getTotalLessonCount } from '../../lib/data';
import { APP_NAME } from '../../constants';
import { useEffect, useState } from 'react';

export default function Header() {
  const { progress, isLoaded, resetAllProgress } = useProgress();
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalLessons(getTotalLessonCount());
  }, []);

  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.icon}>🎓</span>
          <span className={styles.title}>{APP_NAME}</span>
        </Link>
        
        {isLoaded && (
          <div className={styles.actions}>
            {completedCount > 0 && (
              <button 
                onClick={resetAllProgress} 
                className={styles.resetBtn}
                title="Học lại từ đầu"
              >
                🔄
              </button>
            )}
            <div className={styles.progressBadge} title={`${completedCount}/${totalLessons} bài học`}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%` }}
              />
              <span className={styles.progressText}>{progressPercent}%</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
