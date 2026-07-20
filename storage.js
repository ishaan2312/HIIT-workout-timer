/**
 * Storage Module
 * Handles all local storage operations for workouts, settings, and app state
 */

const Storage = (() => {
  // Default workout template
  const DEFAULT_WORKOUT = {
    id: 'default-hiit',
    name: 'Default HIIT',
    exercises: [
      'Skipping',
      'Jacks',
      'Running in Place',
      'Mountain Climbers',
      'Jump Squats',
      'Bicycle Crunches',
      'Burpees',
      'Jab-Jab-Cross'
    ]
  };

  // Default settings
  const DEFAULT_SETTINGS = {
    warmupDuration: 10,
    workDuration: 30,
    restDuration: 10,
    roundRestDuration: 60,
    cooldownDuration: 300,
    numberOfRounds: 2,
    voiceEnabled: true,
    beepsEnabled: true,
    vibrationEnabled: true,
    speechRate: 1,
    speechVolume: 1,
    darkTheme: true
  };

  /**
   * Initialize storage with defaults if empty
   */
  const init = () => {
    if (!getWorkouts()) {
      saveWorkouts([DEFAULT_WORKOUT]);
    }
    if (!getSettings()) {
      saveSettings(DEFAULT_SETTINGS);
    }
    if (!getLastWorkout()) {
      saveLastWorkout('default-hiit');
    }
  };

  /**
   * Get all saved workouts
   */
  const getWorkouts = () => {
    const workouts = localStorage.getItem('workouts');
    return workouts ? JSON.parse(workouts) : null;
  };

  /**
   * Save workouts
   */
  const saveWorkouts = (workouts) => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    return true;
  };

  /**
   * Get a specific workout by ID
   */
  const getWorkout = (id) => {
    const workouts = getWorkouts() || [];
    return workouts.find(w => w.id === id);
  };

  /**
   * Add a new workout
   */
  const addWorkout = (workout) => {
    const workouts = getWorkouts() || [];
    workouts.push(workout);
    saveWorkouts(workouts);
    return workout.id;
  };

  /**
   * Update an existing workout
   */
  const updateWorkout = (id, updates) => {
    const workouts = getWorkouts() || [];
    const index = workouts.findIndex(w => w.id === id);
    if (index !== -1) {
      workouts[index] = { ...workouts[index], ...updates };
      saveWorkouts(workouts);
      return true;
    }
    return false;
  };

  /**
   * Delete a workout
   */
  const deleteWorkout = (id) => {
    const workouts = getWorkouts() || [];
    const filtered = workouts.filter(w => w.id !== id);
    saveWorkouts(filtered);
    return true;
  };

  /**
   * Get app settings
   */
  const getSettings = () => {
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : null;
  };

  /**
   * Save app settings
   */
  const saveSettings = (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
    return true;
  };

  /**
   * Update specific settings
   */
  const updateSettings = (updates) => {
    const currentSettings = getSettings() || DEFAULT_SETTINGS;
    const newSettings = { ...currentSettings, ...updates };
    saveSettings(newSettings);
    return newSettings;
  };

  /**
   * Get last opened workout ID
   */
  const getLastWorkout = () => {
    return localStorage.getItem('lastWorkout');
  };

  /**
   * Save last opened workout ID
   */
  const saveLastWorkout = (workoutId) => {
    localStorage.setItem('lastWorkout', workoutId);
    return true;
  };

  /**
   * Get workout history
   */
  const getHistory = () => {
    const history = localStorage.getItem('workoutHistory');
    return history ? JSON.parse(history) : [];
  };

  /**
   * Add workout completion to history
   */
  const addToHistory = (workoutData) => {
    const history = getHistory();
    history.push({
      ...workoutData,
      completedAt: new Date().toISOString()
    });
    // Keep only last 50 workouts
    const limited = history.slice(-50);
    localStorage.setItem('workoutHistory', JSON.stringify(limited));
    return true;
  };

  /**
   * Clear all data (for debug/reset)
   */
  const clearAll = () => {
    localStorage.clear();
    init();
    return true;
  };

  /**
   * Export all data as JSON
   */
  const exportData = () => {
    return {
      workouts: getWorkouts(),
      settings: getSettings(),
      history: getHistory(),
      exportedAt: new Date().toISOString()
    };
  };

  /**
   * Import data from JSON
   */
  const importData = (data) => {
    try {
      if (data.workouts) saveWorkouts(data.workouts);
      if (data.settings) saveSettings(data.settings);
      if (data.history) localStorage.setItem('workoutHistory', JSON.stringify(data.history));
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  // Initialize on load
  init();

  // Public API
  return {
    init,
    getWorkouts,
    saveWorkouts,
    getWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getSettings,
    saveSettings,
    updateSettings,
    getLastWorkout,
    saveLastWorkout,
    getHistory,
    addToHistory,
    clearAll,
    exportData,
    importData,
    DEFAULT_WORKOUT,
    DEFAULT_SETTINGS
  };
})();
