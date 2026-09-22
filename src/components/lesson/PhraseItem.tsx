import styles from './PhraseItem.module.css';
import type { PhraseItem as PhraseType } from '../../types/lesson';
import SpeakButton from '../ui/SpeakButton';

interface PhraseItemProps {
  item: PhraseType;
}

export default function PhraseItem({ item }: PhraseItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.en}>{item.phrase}</h3>
        <p className={styles.vi}>{item.meaningVi}</p>
        
        {item.usage && (
          <div className={styles.usage}>
            <span className={styles.usageIcon}>💡</span>
            <span>{item.usage}</span>
          </div>
        )}
      </div>
      <div className={styles.action}>
        <SpeakButton text={item.phrase} size="large" />
      </div>
    </div>
  );
}
