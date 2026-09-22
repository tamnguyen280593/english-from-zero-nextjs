import styles from './DialogueSection.module.css';
import type { Dialogue } from '../../types/dialogue';
import SpeakButton from '../ui/SpeakButton';

interface DialogueSectionProps {
  dialogue: Dialogue;
}

export default function DialogueSection({ dialogue }: DialogueSectionProps) {
  if (!dialogue || !dialogue.lines || dialogue.lines.length === 0) {
    return null;
  }

  // Get unique speakers to assign colors
  const speakers = Array.from(new Set(dialogue.lines.map(line => line.speaker)));

  return (
    <div className={styles.container}>
      {dialogue.situation && (
        <div className={styles.context}>
          <span className={styles.contextIcon}>📍</span>
          <p>{dialogue.situation}</p>
        </div>
      )}

      <div className={styles.chatBox}>
        {dialogue.lines.map((line, index) => {
          // Assign alternating classes based on speaker index
          const speakerIndex = speakers.indexOf(line.speaker);
          const isPrimary = speakerIndex % 2 === 0;

          return (
            <div 
              key={index} 
              className={`${styles.messageWrapper} ${isPrimary ? styles.left : styles.right}`}
            >
              <div className={styles.speakerAvatar}>
                {line.speaker.charAt(0)}
              </div>
              <div className={styles.messageContent}>
                <span className={styles.speakerName}>{line.speaker}</span>
                <div className={styles.bubble}>
                  <p className={styles.en}>{line.text}</p>
                  <p className={styles.vi}>{line.textVi}</p>
                </div>
              </div>
              <div className={styles.action}>
                <SpeakButton text={line.text} size="small" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
