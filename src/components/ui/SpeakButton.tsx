'use client';

import { useState } from 'react';
import styles from './SpeakButton.module.css';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { SLOW_SPEECH_RATE, NORMAL_SPEECH_RATE } from '../../constants';

interface SpeakButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function SpeakButton({ text, size = 'medium', className = '' }: SpeakButtonProps) {
  const { speak, isSupported } = useSpeechSynthesis();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false); // Toggle between normal and slow

  if (!isSupported) {
    return null; // Don't render if TTS is not supported
  }

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle speed if clicking again quickly, otherwise use normal
    const rate = isSlow ? SLOW_SPEECH_RATE : NORMAL_SPEECH_RATE;
    setIsSlow(!isSlow); // Next click will be the opposite speed
    
    setIsPlaying(true);
    speak(text, rate);
    
    // Reset animation state after roughly 2 seconds
    // Note: onend event in hook handles actual state, this is just for UI resilience
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  return (
    <button 
      className={`${styles.button} ${styles[size]} ${isPlaying ? 'animate-pulse-btn' : ''} ${className}`}
      onClick={handleSpeak}
      title={isSlow ? "Nghe chậm" : "Nghe phát âm"}
      aria-label="Nghe phát âm"
    >
      <span className={styles.icon}>
        {isPlaying ? '🔊' : '🔈'}
      </span>
    </button>
  );
}
