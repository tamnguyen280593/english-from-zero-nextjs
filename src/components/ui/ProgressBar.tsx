import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        className={styles.fill} 
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
