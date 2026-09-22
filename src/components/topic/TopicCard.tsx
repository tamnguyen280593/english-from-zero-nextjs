import Link from 'next/link';
import styles from './TopicCard.module.css';
import type { Topic } from '../../types/topic';
import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';

interface TopicCardProps {
  topic: Topic;
  progress: number; // percentage 0-100
}

export default function TopicCard({ topic, progress }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}`} className={styles.card}>
      <div 
        className={styles.imageHeader}
        style={{ 
          // Fallback background color based on topic.color
          backgroundColor: topic.color 
        }}
      >
        <span className={styles.icon}>{topic.icon}</span>
        
        {/* We use an img tag instead of next/image for static export compatibility */}
        <img 
          src={topic.image} 
          alt={topic.title} 
          className={styles.image}
          loading="lazy"
        />
        
        <div className={styles.overlay}></div>
        <div className={styles.badgeContainer}>
          <Badge text={topic.level} variant="primary" />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{topic.title}</h2>
          <span className={styles.lessonCount}>{topic.lessonCount} bài</span>
        </div>
        
        <p className={styles.titleVi}>{topic.titleVi}</p>
        <p className={styles.description}>{topic.descriptionVi}</p>
        
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Tiến độ</span>
            <span className={styles.progressValue}>{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </Link>
  );
}
