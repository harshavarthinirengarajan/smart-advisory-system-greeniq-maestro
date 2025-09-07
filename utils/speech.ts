
/**
 * Uses the browser's SpeechSynthesis API to speak a given text string aloud.
 * @param text The text to be spoken.
 * @param voiceEnabled A boolean flag to enable or disable speech.
 */
export const speak = (text: string, voiceEnabled: boolean): void => {
  if (!voiceEnabled || !text) {
    return;
  }

  if ('speechSynthesis' in window) {
    // Cancel any previous speech to avoid overlap
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Configure voice, rate, pitch etc. for a more natural sound
    // utterance.lang = 'en-US';
    // utterance.rate = 0.9;
    // utterance.pitch = 1.1;

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-speech is not supported in this browser.');
  }
};
