/**
 * Speech Module
 * Handles voice coaching via browser Speech Synthesis API
 * Gracefully falls back to beeps if speech is unavailable
 */

const Speech = (() => {
  // Check for Speech Synthesis support
  const synth = window.speechSynthesis || window.webkitSpeechSynthesis || null;
  const isSupported = synth !== null;

  let speechRate = 1;
  let speechVolume = 1;
  let isEnabled = true;

  /**
   * Speak text using Speech Synthesis API
   */
  const speak = (text) => {
    if (!isSupported || !isEnabled) {
      return false;
    }

    try {
      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.volume = speechVolume;
      utterance.pitch = 1;

      // Set voice (use first available)
      const voices = synth.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }

      synth.speak(utterance);
      return true;
    } catch (e) {
      console.error('Speech error:', e);
      return false;
    }
  };

  /**
   * Announce countdown (3, 2, 1)
   */
  const announceCountdown = () => {
    if (!isEnabled) return;
    speak('3');
    setTimeout(() => speak('2'), 500);
    setTimeout(() => speak('1'), 1000);
  };

  /**
   * Announce exercise start
   */
  const announceExercise = (exerciseName) => {
    if (!isEnabled) return;
    speak(exerciseName);
  };

  /**
   * Announce rest period
   */
  const announceRest = () => {
    if (!isEnabled) return;
    speak('Rest');
  };

  /**
   * Announce halfway point
   */
  const announceHalfway = () => {
    if (!isEnabled) return;
    speak('Halfway');
  };

  /**
   * Announce time remaining
   */
  const announceTimeRemaining = (seconds) => {
    if (!isEnabled) return;
    if (seconds === 10 || seconds === 5) {
      speak(`${seconds} seconds remaining`);
    }
  };

  /**
   * Announce round number
   */
  const announceRound = (roundNumber) => {
    if (!isEnabled) return;
    speak(`Round ${roundNumber}`);
  };

  /**
   * Announce workout complete
   */
  const announceComplete = () => {
    if (!isEnabled) return;
    speak('Workout complete');
  };

  /**
   * Announce generic message
   */
  const announce = (message) => {
    if (!isEnabled) return;
    speak(message);
  };

  /**
   * Cancel current speech
   */
  const cancel = () => {
    if (synth) {
      synth.cancel();
    }
  };

  /**
   * Set speech rate (0.5 to 2)
   */
  const setRate = (rate) => {
    speechRate = Math.max(0.5, Math.min(2, rate));
  };

  /**
   * Set speech volume (0 to 1)
   */
  const setVolume = (volume) => {
    speechVolume = Math.max(0, Math.min(1, volume));
  };

  /**
   * Enable/disable speech
   */
  const setEnabled = (enabled) => {
    isEnabled = enabled;
    if (!enabled) {
      cancel();
    }
  };

  /**
   * Get speech enabled state
   */
  const getEnabled = () => isEnabled;

  /**
   * Get available voices
   */
  const getVoices = () => {
    if (!synth) return [];
    return synth.getVoices();
  };

  /**
   * Initialize speech module
   */
  const init = (settings) => {
    if (settings) {
      isEnabled = settings.voiceEnabled || true;
      speechRate = settings.speechRate || 1;
      speechVolume = settings.speechVolume || 1;
    }

    // Some browsers require a user interaction to load voices
    if (synth) {
      synth.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  };

  return {
    isSupported,
    speak,
    announceCountdown,
    announceExercise,
    announceRest,
    announceHalfway,
    announceTimeRemaining,
    announceRound,
    announceComplete,
    announce,
    cancel,
    setRate,
    setVolume,
    setEnabled,
    getEnabled,
    getVoices,
    init
  };
})();
