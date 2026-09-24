import Link from 'next/link';
import styles from './CategoryCard.module.css';
import type { Category } from '../../types/category';
import Badge from '../ui/Badge';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className={styles.card}>
      <div 
        className={styles.imageHeader}
        style={{ backgroundColor: category.color }}
      >
        <img 
          src={(process.env.NODE_ENV === 'production' ? '/english-from-zero-nextjs' : '') + category.image} 
          alt={category.title} 
          className={styles.image}
        />
        
        <div className={styles.overlay}></div>
        <div className={styles.badgeContainer}>
          <Badge text={category.titleVi} variant="primary" />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{category.title}</h2>
        </div>
        <p className={styles.description}>{category.descriptionVi}</p>
        <span className={styles.exploreBtn}>Khám phá ➡️</span>
      </div>
    </Link>
  );
}
