/**
 * Main App Module
 * Manages UI, screen transitions, and app state
 */

const App = (() => {
  // App screens
  const SCREENS = {
    HOME: 'home',
    WORKOUT_BUILDER: 'builder',
    TIMER: 'timer',
    SETTINGS: 'settings'
  };

  let currentScreen = SCREENS.HOME;
  let currentWorkoutId = null;
  let editingExerciseIndex = null;

  /**
   * Initialize the app
   */
  const init = () => {
    registerServiceWorker();
    Speech.init(Storage.getSettings());
    setupEventListeners();
    renderScreen(SCREENS.HOME);
    currentWorkoutId = Storage.getLastWorkout();
  };

  /**
   * Register service worker
   */
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch((e) => {
        console.warn('Service Worker registration failed:', e);
      });
    }
  };

  /**
   * Setup global event listeners
   */
  const setupEventListeners = () => {
    // Navigation
    document.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action) {
        handleNavigation(action);
      }

      const timerAction = e.target.dataset.timerAction;
      if (timerAction) {
        handleTimerAction(timerAction);
      }

      const settingChange = e.target.dataset.setting;
      if (settingChange) {
        handleSettingChange(e);
      }

      const builderAction = e.target.dataset.builderAction;
      if (builderAction) {
        handleBuilderAction(builderAction, e);
      }
    });

    // Handle adding new exercise
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.id === 'newExerciseInput') {
        handleBuilderAction('addExercise');
        e.target.value = '';
      }
    });
  };

  /**
   * Handle navigation
   */
  const handleNavigation = (action) => {
    switch (action) {
      case 'home':
        renderScreen(SCREENS.HOME);
        break;
      case 'builder':
        renderScreen(SCREENS.WORKOUT_BUILDER);
        break;
      case 'timer':
        renderScreen(SCREENS.TIMER);
        break;
      case 'settings':
        renderScreen(SCREENS.SETTINGS);
        break;
      case 'startWorkout':
        Timer.reset();
        Timer.init({
          ...Storage.getSettings(),
          exercises: Storage.getWorkout(currentWorkoutId).exercises
        });
        renderScreen(SCREENS.TIMER);
        break;
    }
  };

  /**
   * Render screen content
   */
  const renderScreen = (screen) => {
    currentScreen = screen;
    const container = document.getElementById('screenContainer');
    container.innerHTML = '';

    switch (screen) {
      case SCREENS.HOME:
        renderHomeScreen(container);
        break;
      case SCREENS.WORKOUT_BUILDER:
        renderBuilderScreen(container);
        break;
      case SCREENS.TIMER:
        renderTimerScreen(container);
        break;
      case SCREENS.SETTINGS:
        renderSettingsScreen(container);
        break;
    }
  };

  /**
   * Render home screen
   */
  const renderHomeScreen = (container) => {
    const workouts = Storage.getWorkouts() || [];
    const currentWorkout = currentWorkoutId ? Storage.getWorkout(currentWorkoutId) : (workouts.length > 0 ? workouts[0] : null);
    
    // Save current workout if found
    if (currentWorkout && !currentWorkoutId) {
      currentWorkoutId = currentWorkout.id;
      Storage.saveLastWorkout(currentWorkoutId);
    }

    container.innerHTML = `
      <div class="screen home-screen">
        <div class="screen-header">
          <h1>Workout Timer</h1>
        </div>

        <div class="screen-content">
          ${currentWorkout ? `
            <div class="current-workout-card">
              <h2>${currentWorkout.name}</h2>
              <p class="exercise-count">${currentWorkout.exercises.length} exercises</p>
              <button class="btn btn-primary btn-large" data-action="startWorkout" style="width: 100%; cursor: pointer;">
                Start Workout
              </button>
            </div>
          ` : ''}

          <div class="quick-actions">
            <button class="btn btn-secondary" data-action="builder">
              <span class="icon">✎</span>
              Edit Workout
            </button>
            <button class="btn btn-secondary" data-action="settings">
              <span class="icon">⚙</span>
              Settings
            </button>
          </div>

          ${workouts.length > 1 ? `
            <div class="workouts-list">
              <h3>All Workouts</h3>
              ${workouts.map(w => `
                <div class="workout-item ${w.id === currentWorkoutId ? 'active' : ''}">
                  <div class="workout-info">
                    <h4>${w.name}</h4>
                    <p>${w.exercises.length} exercises</p>
                  </div>
                  <button class="btn btn-small" data-action="selectWorkout" data-id="${w.id}">
                    Select
                  </button>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Handle workout selection
    document.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'selectWorkout') {
        currentWorkoutId = e.target.dataset.id;
        Storage.saveLastWorkout(currentWorkoutId);
        renderHomeScreen(container);
      }
    });
  };

  /**
   * Render workout builder screen
   */
  const renderBuilderScreen = (container) => {
    const workout = Storage.getWorkout(currentWorkoutId);

    container.innerHTML = `
      <div class="screen builder-screen">
        <div class="screen-header">
          <h1>Edit Workout</h1>
        </div>

        <div class="screen-content">
          <div class="builder-form">
            <div class="form-group">
              <label>Workout Name</label>
              <input type="text" id="workoutName" value="${workout.name}" class="form-input">
            </div>

            <div class="exercises-section">
              <h3>Exercises</h3>
              <div class="exercises-list" id="exercisesList">
                ${workout.exercises.map((ex, i) => `
                  <div class="exercise-item" data-index="${i}">
                    <div class="exercise-drag-handle">⋮</div>
                    <input type="text" value="${ex}" class="exercise-input" data-index="${i}">
                    <button class="btn btn-icon" data-builder-action="deleteExercise" data-index="${i}">✕</button>
                  </div>
                `).join('')}
              </div>

              <div class="add-exercise">
                <input type="text" id="newExerciseInput" placeholder="Add new exercise..." class="form-input">
                <button class="btn btn-secondary" data-builder-action="addExercise">
                  + Add Exercise
                </button>
              </div>
            </div>

            <div class="builder-actions">
              <button class="btn btn-primary" data-builder-action="saveWorkout">
                Save Workout
              </button>
              <button class="btn btn-secondary" data-action="home">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Setup drag and drop for exercises
    setupExerciseDragDrop();
  };

  /**
   * Setup exercise drag and drop
   */
  const setupExerciseDragDrop = () => {
    const exercisesList = document.getElementById('exercisesList');
    if (!exercisesList) return;

    let draggedElement = null;
    let draggedIndex = null;

    exercisesList.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('exercise-item')) {
        draggedElement = e.target;
        draggedIndex = Array.from(exercisesList.children).indexOf(e.target);
        e.target.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    exercisesList.addEventListener('dragend', (e) => {
      if (e.target) {
        e.target.style.opacity = '1';
      }
    });

    exercisesList.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (draggedElement && e.target.classList.contains('exercise-item')) {
        const rect = e.target.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (e.clientY < midpoint) {
          e.target.parentNode.insertBefore(draggedElement, e.target);
        } else {
          e.target.parentNode.insertBefore(draggedElement, e.target.nextSibling);
        }
      }
    });

    exercisesList.addEventListener('drop', (e) => {
      e.preventDefault();
    });

    // Also allow clicking to reorder manually
    const addManualReorder = () => {
      const items = exercisesList.querySelectorAll('.exercise-item');
      items.forEach((item, index) => {
        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.className = 'btn btn-small';
        upBtn.style.padding = '4px 8px';
        upBtn.style.fontSize = '12px';
        
        if (index > 0) {
          upBtn.onclick = (e) => {
            e.preventDefault();
            const prev = items[index - 1];
            prev.parentNode.insertBefore(item, prev);
            setupExerciseDragDrop();
          };
          item.appendChild(upBtn);
        }
      });
    };
    
    addManualReorder();
  };

  /**
   * Handle builder actions
   */
  const handleBuilderAction = (action, e) => {
    const workout = Storage.getWorkout(currentWorkoutId);

    if (action === 'addExercise') {
      const input = document.getElementById('newExerciseInput');
      const exerciseName = input.value.trim();
      if (exerciseName) {
        workout.exercises.push(exerciseName);
        Storage.updateWorkout(currentWorkoutId, workout);
        renderBuilderScreen(document.getElementById('screenContainer'));
      }
    } else if (action === 'deleteExercise') {
      const index = parseInt(e.target.dataset.index);
      workout.exercises.splice(index, 1);
      Storage.updateWorkout(currentWorkoutId, workout);
      renderBuilderScreen(document.getElementById('screenContainer'));
    } else if (action === 'saveWorkout') {
      const nameInput = document.getElementById('workoutName');
      workout.name = nameInput.value.trim() || workout.name;

      // Get reordered exercises from DOM
      const exercisesFromDOM = Array.from(document.querySelectorAll('.exercise-input'))
        .map(input => input.value.trim())
        .filter(val => val);

      workout.exercises = exercisesFromDOM;
      Storage.updateWorkout(currentWorkoutId, workout);
      renderHomeScreen(document.getElementById('screenContainer'));
    }
  };

  /**
   * Render timer screen
   */
  const renderTimerScreen = (container) => {
    const timerState = Timer.getState();

    container.innerHTML = `
      <div class="screen timer-screen">
        <div class="timer-display">
          <div class="phase-name">${getPhaseName(timerState.currentPhase)}</div>
          <div class="countdown">
            <span class="timer-value">${Timer.formatTime(timerState.timeRemaining)}</span>
          </div>
          <div class="exercise-name">${timerState.exerciseName || 'Get Ready'}</div>
        </div>

        <div class="timer-info">
          <div class="info-item">
            <span class="label">Round</span>
            <span class="value">${timerState.currentRound}/${timerState.totalRounds}</span>
          </div>
          <div class="info-item">
            <span class="label">Exercise</span>
            <span class="value">${timerState.currentExerciseIndex + 1}/${timerState.totalExercises}</span>
          </div>
        </div>

        <div class="progress-section">
          ${timerState.nextExerciseName ? `
            <div class="next-exercise">
              Next: <strong>${timerState.nextExerciseName}</strong>
            </div>
          ` : ''}
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${getProgressPercentage(timerState)}%"></div>
          </div>
        </div>

        <div class="timer-controls">
          <button class="btn btn-outline" data-action="home" style="width: 100%; margin-bottom: 10px;">← Back to Home</button>
          
          ${timerState.state === 'idle' ? `
            <button class="btn btn-primary btn-large" data-timer-action="start">Start</button>
          ` : timerState.state === 'running' ? `
            <button class="btn btn-secondary" data-timer-action="pause">Pause</button>
          ` : timerState.state === 'paused' ? `
            <button class="btn btn-primary btn-large" data-timer-action="resume">Resume</button>
          ` : ''}

          ${timerState.state !== 'complete' && timerState.state !== 'idle' ? `
            <div class="secondary-controls">
              <button class="btn btn-small" data-timer-action="previous">⏮ Prev</button>
              <button class="btn btn-small" data-timer-action="skip">Skip ⏭</button>
            </div>
          ` : ''}

          ${timerState.state !== 'idle' && timerState.state !== 'complete' ? `
            <button class="btn btn-outline" data-timer-action="restart">Restart</button>
          ` : ''}

          ${timerState.state === 'complete' ? `
            <div class="complete-message">
              <h2>Workout Complete! 🎉</h2>
              <p>Great job!</p>
              <button class="btn btn-primary btn-large" data-action="home">Back to Home</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Attach timer callbacks
    setupTimerCallbacks();
  };

  /**
   * Setup timer callbacks
   */
  const setupTimerCallbacks = () => {
    Timer.on('onTick', (data) => {
      updateTimerDisplay(data);
    });

    Timer.on('onPhaseChange', (data) => {
      updateTimerDisplay(data);
    });

    Timer.on('onWorkoutComplete', (data) => {
      Storage.addToHistory({
        workoutId: currentWorkoutId,
        workoutName: Storage.getWorkout(currentWorkoutId).name,
        duration: data.completionTime
      });
      renderTimerScreen(document.getElementById('screenContainer'));
    });
  };

  /**
   * Update timer display without re-rendering
   */
  const updateTimerDisplay = (data) => {
    const timerValue = document.querySelector('.timer-value');
    const exerciseName = document.querySelector('.exercise-name');
    const phaseName = document.querySelector('.phase-name');
    const progressFill = document.querySelector('.progress-fill');

    if (timerValue) timerValue.textContent = Timer.formatTime(data.timeRemaining);
    
    // Show appropriate name based on phase
    if (exerciseName) {
      if (data.currentPhase === Timer.PHASES.REST) {
        exerciseName.textContent = 'Rest';
      } else if (data.currentPhase === Timer.PHASES.ROUND_REST) {
        exerciseName.textContent = 'Round Rest';
      } else if (data.currentPhase === Timer.PHASES.WARMUP) {
        exerciseName.textContent = 'Get Ready';
      } else if (data.currentPhase === Timer.PHASES.COOLDOWN) {
        exerciseName.textContent = 'Cooldown';
      } else {
        exerciseName.textContent = data.exerciseName || 'Get Ready';
      }
    }
    
    if (phaseName) phaseName.textContent = getPhaseName(data.currentPhase);
    if (progressFill) {
      progressFill.style.width = getProgressPercentage(data) + '%';
    }
  };

  /**
   * Handle timer actions
   */
  const handleTimerAction = (action) => {
    switch (action) {
      case 'start':
        Timer.start();
        break;
      case 'pause':
        Timer.pause();
        break;
      case 'resume':
        Timer.resume();
        break;
      case 'restart':
        Timer.reset();
        Timer.start();
        break;
      case 'skip':
        Timer.skipPhase();
        break;
      case 'previous':
        Timer.previousPhase();
        break;
    }
    renderTimerScreen(document.getElementById('screenContainer'));
  };

  /**
   * Render settings screen
   */
  const renderSettingsScreen = (container) => {
    const settings = Storage.getSettings();

    container.innerHTML = `
      <div class="screen settings-screen">
        <div class="screen-header">
          <h1>Settings</h1>
        </div>

        <div class="screen-content">
          <div class="settings-section">
            <h3>Workout Timings</h3>
            
            <div class="setting-item">
              <label>Warm-up (sec)</label>
              <input type="number" min="0" max="300" value="${settings.warmupDuration}" data-setting="warmupDuration" class="form-input setting-input">
            </div>

            <div class="setting-item">
              <label>Work Duration (sec)</label>
              <input type="number" min="5" max="300" value="${settings.workDuration}" data-setting="workDuration" class="form-input setting-input">
            </div>

            <div class="setting-item">
              <label>Rest Duration (sec)</label>
              <input type="number" min="0" max="300" value="${settings.restDuration}" data-setting="restDuration" class="form-input setting-input">
            </div>

            <div class="setting-item">
              <label>Round Rest (sec)</label>
              <input type="number" min="0" max="300" value="${settings.roundRestDuration}" data-setting="roundRestDuration" class="form-input setting-input">
            </div>

            <div class="setting-item">
              <label>Cooldown (sec)</label>
              <input type="number" min="0" max="600" value="${settings.cooldownDuration}" data-setting="cooldownDuration" class="form-input setting-input">
            </div>

            <div class="setting-item">
              <label>Number of Rounds</label>
              <input type="number" min="1" max="20" value="${settings.numberOfRounds}" data-setting="numberOfRounds" class="form-input setting-input">
            </div>
          </div>

          <div class="settings-section">
            <h3>Audio & Vibration</h3>

            <div class="setting-toggle">
              <label>Voice Coaching</label>
              <input type="checkbox" ${settings.voiceEnabled ? 'checked' : ''} data-setting="voiceEnabled" class="setting-checkbox">
            </div>

            <div class="setting-toggle">
              <label>Beeps</label>
              <input type="checkbox" ${settings.beepsEnabled ? 'checked' : ''} data-setting="beepsEnabled" class="setting-checkbox">
            </div>

            <div class="setting-toggle">
              <label>Vibration</label>
              <input type="checkbox" ${settings.vibrationEnabled ? 'checked' : ''} data-setting="vibrationEnabled" class="setting-checkbox">
            </div>

            ${Speech.isSupported ? `
              <div class="setting-item">
                <label>Speech Rate</label>
                <input type="range" min="0.5" max="2" step="0.1" value="${settings.speechRate}" data-setting="speechRate" class="form-range">
                <span class="range-value">${settings.speechRate.toFixed(1)}x</span>
              </div>

              <div class="setting-item">
                <label>Speech Volume</label>
                <input type="range" min="0" max="1" step="0.1" value="${settings.speechVolume}" class="form-range" data-setting="speechVolume">
                <span class="range-value">${Math.round(settings.speechVolume * 100)}%</span>
              </div>
            ` : ''}
          </div>

          <div class="settings-section">
            <h3>App Data</h3>
            <button class="btn btn-secondary" id="exportBtn">Export Data</button>
            <button class="btn btn-outline" id="resetBtn">Reset to Defaults</button>
          </div>

          <button class="btn btn-primary" data-action="home">Back</button>
        </div>
      </div>
    `;

    // Setup setting change listeners
    document.querySelectorAll('.setting-input, .setting-checkbox, .form-range').forEach(el => {
      el.addEventListener('change', (e) => {
        handleSettingChange(e);
      });
      el.addEventListener('input', (e) => {
        // Update range display value
        const rangeValue = e.target.parentElement.querySelector('.range-value');
        if (rangeValue) {
          if (e.target.dataset.setting === 'speechRate') {
            rangeValue.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
          } else if (e.target.dataset.setting === 'speechVolume') {
            rangeValue.textContent = Math.round(e.target.value * 100) + '%';
          }
        }
      });
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
      const data = Storage.exportData();
      downloadJSON(data, 'workout-timer-backup.json');
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (confirm('Reset all settings to defaults?')) {
        Storage.clearAll();
        renderSettingsScreen(document.getElementById('screenContainer'));
      }
    });
  };

  /**
   * Handle setting changes
   */
  const handleSettingChange = (e) => {
    const setting = e.target.dataset.setting;
    let value = e.target.value;

    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    } else if (e.target.type === 'number' || e.target.type === 'range') {
      value = parseFloat(value);
    }

    const newSettings = Storage.updateSettings({ [setting]: value });
    Speech.init(newSettings);
  };

  /**
   * Download JSON file
   */
  const downloadJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Get phase display name
   */
  const getPhaseName = (phase) => {
    const names = {
      warmup: 'Warm-up',
      exercise: 'Exercise',
      rest: 'Rest',
      roundRest: 'Round Rest',
      cooldown: 'Cooldown'
    };
    return names[phase] || phase;
  };

  /**
   * Get progress percentage
   */
  const getProgressPercentage = (timerState) => {
    if (timerState.totalTime === 0) return 0;
    const completed = timerState.totalTime - timerState.timeRemaining;
    return (completed / timerState.totalTime) * 100;
  };

  return {
    init,
    SCREENS
  };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}
