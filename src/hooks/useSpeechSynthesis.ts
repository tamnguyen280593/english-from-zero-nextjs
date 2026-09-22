'use client';

import { useState, useEffect, useCallback } from 'react';
import { TTS_LANGUAGE, NORMAL_SPEECH_RATE } from '../constants';

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initialize and check support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(true);
      
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = useCallback((text: string, rate: number = NORMAL_SPEECH_RATE) => {
    if (!isSupported) {
      console.warn('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find an English voice, preferably US
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice = enVoices.find(v => v.lang === TTS_LANGUAGE) || enVoices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.lang = TTS_LANGUAGE;
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
