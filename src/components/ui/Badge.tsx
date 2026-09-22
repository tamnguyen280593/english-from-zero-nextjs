import styles from './Badge.module.css';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  className?: string;
}

export default function Badge({ text, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {text}
    </span>
  );
}
