import styles from './VocabularyItem.module.css';
import type { VocabularyItem as VocabularyType } from '../../types/lesson';
import SpeakButton from '../ui/SpeakButton';

interface VocabularyItemProps {
  item: VocabularyType;
}

export default function VocabularyItem({ item }: VocabularyItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.en}>{item.word}</h3>
          <span className={styles.type}>({item.partOfSpeech})</span>
          <span className={styles.pronunciation}>{item.ipa}</span>
        </div>
        <p className={styles.vi}>{item.meaningVi}</p>
        
        {item.exampleSentence && item.exampleSentenceVi && (
          <div className={styles.exampleBox}>
            <p className={styles.exampleEn}>&quot;{item.exampleSentence}&quot;</p>
            <p className={styles.exampleVi}>{item.exampleSentenceVi}</p>
          </div>
        )}
      </div>
      
      <div className={styles.action}>
        <SpeakButton text={item.word} size="medium" />
      </div>
    </div>
  );
}
