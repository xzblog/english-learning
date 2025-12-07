import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, lang: 'en-US' | 'en-GB' = 'en-US') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.pitch = 1;

      // Try to get an English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        voice => voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
