/**
 * Timer Module
 * Manages workout timer logic, state transitions, and phase management
 */

const Timer = (() => {
  // Timer states
  const STATES = {
    IDLE: 'idle',
    RUNNING: 'running',
    PAUSED: 'paused',
    COMPLETE: 'complete'
  };

  // Phase types
  const PHASES = {
    WARMUP: 'warmup',
    EXERCISE: 'exercise',
    REST: 'rest',
    ROUND_REST: 'roundRest',
    COOLDOWN: 'cooldown'
  };

  let state = STATES.IDLE;
  let currentPhase = PHASES.WARMUP;
  let timeRemaining = 0;
  let totalTime = 0;
  let currentRound = 1;
  let currentExerciseIndex = 0;
  let totalRounds = 1;
  let totalExercises = 0;
  let timerInterval = null;
  let lastTickTime = 0;

  // Configuration
  let config = {
    warmupDuration: 10,
    workDuration: 30,
    restDuration: 10,
    roundRestDuration: 60,
    cooldownDuration: 300,
    numberOfRounds: 2,
    exercises: [],
    voiceEnabled: true,
    beepsEnabled: true,
    vibrationEnabled: true
  };

  // Callback functions
  let callbacks = {
    onTick: () => {},
    onPhaseChange: () => {},
    onRoundChange: () => {},
    onWorkoutComplete: () => {},
    onStateChange: () => {}
  };

  /**
   * Initialize timer with configuration
   */
  const init = (newConfig) => {
    config = { ...config, ...newConfig };
    totalRounds = config.numberOfRounds;
    totalExercises = config.exercises.length;
    calculateTotalTime();
    reset();
  };

  /**
   * Calculate total workout time
   */
  const calculateTotalTime = () => {
    const exerciseDuration = totalExercises * config.workDuration;
    const restDuration = (totalExercises - 1) * config.restDuration;
    const roundRestDuration = (totalRounds - 1) * config.roundRestDuration;
    
    totalTime = 
      config.warmupDuration + 
      (exerciseDuration + restDuration) * totalRounds +
      roundRestDuration +
      config.cooldownDuration;
  };

  /**
   * Reset timer to initial state
   */
  const reset = () => {
    stop();
    state = STATES.IDLE;
    currentPhase = PHASES.WARMUP;
    currentRound = 1;
    currentExerciseIndex = 0;
    timeRemaining = config.warmupDuration;
    triggerCallback('onStateChange', { state, currentPhase, timeRemaining });
  };

  /**
   * Start the timer
   */
  const start = () => {
    if (state === STATES.RUNNING) return;
    
    state = STATES.RUNNING;
    lastTickTime = Date.now();
    
    if (!timerInterval) {
      timerInterval = setInterval(tick, 100); // 100ms for smooth updates
    }
    
    triggerCallback('onStateChange', { state });
  };

  /**
   * Pause the timer
   */
  const pause = () => {
    if (state !== STATES.RUNNING) return;
    
    state = STATES.PAUSED;
    triggerCallback('onStateChange', { state });
  };

  /**
   * Resume the timer
   */
  const resume = () => {
    if (state !== STATES.PAUSED) return;
    
    state = STATES.RUNNING;
    lastTickTime = Date.now();
    triggerCallback('onStateChange', { state });
  };

  /**
   * Stop the timer
   */
  const stop = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  /**
   * Timer tick - updates every 100ms
   */
  const tick = () => {
    if (state !== STATES.RUNNING) return;

    const now = Date.now();
    const deltaTime = (now - lastTickTime) / 1000; // Convert to seconds
    lastTickTime = now;

    timeRemaining = Math.max(0, timeRemaining - deltaTime);

    triggerCallback('onTick', {
      state,
      currentPhase,
      timeRemaining: Math.ceil(timeRemaining),
      totalTime,
      currentRound,
      totalRounds,
      currentExerciseIndex,
      totalExercises,
      exerciseName: config.exercises[currentExerciseIndex],
      nextExerciseName: getNextExerciseName()
    });

    // Check for phase-specific announcements
    checkAnnouncements();

    // Check if phase time is complete
    if (timeRemaining <= 0) {
      advancePhase();
    }
  };

  /**
   * Check for voice/beep announcements during countdown
   */
  const checkAnnouncements = () => {
    const timeInt = Math.ceil(timeRemaining);

    // Countdown announcements (3, 2, 1)
    if (timeInt === 3 && currentPhase !== PHASES.WARMUP) {
      playBeep();
      if (config.voiceEnabled) Speech.announce('3');
    } else if (timeInt === 2) {
      playBeep();
      if (config.voiceEnabled) Speech.announce('2');
    } else if (timeInt === 1) {
      playBeep();
      if (config.voiceEnabled) Speech.announce('1');
    }

    // Halfway announcement
    if (currentPhase === PHASES.EXERCISE && timeInt === Math.ceil(config.workDuration / 2)) {
      if (config.voiceEnabled) Speech.announceHalfway();
    }

    // Time remaining announcements
    if (currentPhase === PHASES.EXERCISE) {
      if (timeInt === 10 || timeInt === 5) {
        if (config.voiceEnabled) Speech.announceTimeRemaining(timeInt);
      }
    }
  };

  /**
   * Advance to next phase
   */
  const advancePhase = () => {
    // Determine next phase
    if (currentPhase === PHASES.WARMUP) {
      currentPhase = PHASES.EXERCISE;
      currentExerciseIndex = 0;
      timeRemaining = config.workDuration;
      if (config.voiceEnabled) Speech.announceExercise(config.exercises[0]);
    } else if (currentPhase === PHASES.EXERCISE) {
      if (currentExerciseIndex < totalExercises - 1) {
        // More exercises in this round
        currentPhase = PHASES.REST;
        timeRemaining = config.restDuration;
        if (config.voiceEnabled) Speech.announceRest();
      } else {
        // Last exercise in round
        if (currentRound < totalRounds) {
          // More rounds to go
          currentPhase = PHASES.ROUND_REST;
          timeRemaining = config.roundRestDuration;
          if (config.voiceEnabled) Speech.announce('Round rest');
        } else {
          // All rounds complete
          currentPhase = PHASES.COOLDOWN;
          timeRemaining = config.cooldownDuration;
          if (config.voiceEnabled) Speech.announce('Cooldown');
        }
      }
    } else if (currentPhase === PHASES.REST) {
      currentPhase = PHASES.EXERCISE;
      currentExerciseIndex++;
      timeRemaining = config.workDuration;
      if (config.voiceEnabled) Speech.announceExercise(config.exercises[currentExerciseIndex]);
    } else if (currentPhase === PHASES.ROUND_REST) {
      currentRound++;
      currentPhase = PHASES.EXERCISE;
      currentExerciseIndex = 0;
      timeRemaining = config.workDuration;
      if (config.voiceEnabled) Speech.announceRound(currentRound);
      triggerCallback('onRoundChange', { currentRound, totalRounds });
    } else if (currentPhase === PHASES.COOLDOWN) {
      completeWorkout();
      return;
    }

    playBeep();
    triggerVibration();
    triggerCallback('onPhaseChange', {
      currentPhase,
      timeRemaining,
      currentRound,
      currentExerciseIndex,
      exerciseName: config.exercises[currentExerciseIndex]
    });
  };

  /**
   * Complete workout
   */
  const completeWorkout = () => {
    state = STATES.COMPLETE;
    stop();
    if (config.voiceEnabled) Speech.announceComplete();
    playBeep();
    triggerVibration('long');
    
    triggerCallback('onWorkoutComplete', {
      totalTime,
      completionTime: totalTime - timeRemaining
    });
  };

  /**
   * Skip to next phase
   */
  const skipPhase = () => {
    if (state === STATES.IDLE || state === STATES.COMPLETE) return;
    timeRemaining = 0;
    advancePhase();
  };

  /**
   * Go to previous phase
   */
  const previousPhase = () => {
    if (state === STATES.IDLE || state === STATES.COMPLETE) return;

    if (currentPhase === PHASES.EXERCISE) {
      if (currentExerciseIndex > 0) {
        currentPhase = PHASES.REST;
        currentExerciseIndex--;
        timeRemaining = config.restDuration;
      } else if (currentRound > 1) {
        currentRound--;
        currentPhase = PHASES.ROUND_REST;
        currentExerciseIndex = totalExercises - 1;
        timeRemaining = config.roundRestDuration;
        triggerCallback('onRoundChange', { currentRound, totalRounds });
      } else {
        currentPhase = PHASES.WARMUP;
        timeRemaining = config.warmupDuration;
      }
    } else if (currentPhase === PHASES.REST) {
      currentPhase = PHASES.EXERCISE;
      timeRemaining = config.workDuration;
    } else if (currentPhase === PHASES.ROUND_REST) {
      currentPhase = PHASES.EXERCISE;
      currentExerciseIndex = totalExercises - 1;
      timeRemaining = config.workDuration;
    } else if (currentPhase === PHASES.WARMUP) {
      // Can't go before warmup
      return;
    }

    triggerCallback('onPhaseChange', {
      currentPhase,
      timeRemaining,
      currentRound,
      currentExerciseIndex
    });
  };

  /**
   * Get next exercise name
   */
  const getNextExerciseName = () => {
    if (currentPhase === PHASES.EXERCISE && currentExerciseIndex < totalExercises - 1) {
      return config.exercises[currentExerciseIndex + 1];
    }
    return null;
  };

  /**
   * Play beep sound
   */
  const playBeep = () => {
    if (!config.beepsEnabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn('Beep error:', e);
    }
  };

  /**
   * Trigger vibration
   */
  const triggerVibration = (type = 'short') => {
    if (!config.vibrationEnabled || !navigator.vibrate) return;

    const pattern = type === 'long' ? [100, 50, 100] : 50;
    navigator.vibrate(pattern);
  };

  /**
   * Register callback
   */
  const on = (eventName, callback) => {
    if (callbacks.hasOwnProperty(eventName)) {
      callbacks[eventName] = callback;
    }
  };

  /**
   * Trigger callback
   */
  const triggerCallback = (eventName, data) => {
    if (callbacks[eventName]) {
      callbacks[eventName](data);
    }
  };

  /**
   * Get current state
   */
  const getState = () => ({
    state,
    currentPhase,
    timeRemaining: Math.ceil(timeRemaining),
    totalTime,
    currentRound,
    totalRounds,
    currentExerciseIndex,
    totalExercises,
    exerciseName: config.exercises[currentExerciseIndex],
    nextExerciseName: getNextExerciseName()
  });

  /**
   * Get formatted time
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    STATES,
    PHASES,
    init,
    reset,
    start,
    pause,
    resume,
    stop,
    skipPhase,
    previousPhase,
    on,
    getState,
    formatTime,
    calculateTotalTime
  };
})();
