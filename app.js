// app.js — Treino da Simone - Premium Fitness PWA
// All state persisted in localStorage

(function() {
  'use strict';

  // ── Constants ──
  const LS_KEY = 'treino_simone_data';
  const DAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
  const MONTH_NAMES = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  // ── State ──
  let state = loadState();
  let activeTab = 'home';
  let expandedExercise = null;
  let timerInterval = null;
  let timerRemaining = 0;

  function getDefaultState() {
    return {
      name: 'Simone',
      age: 64,
      restrictions: 'Artrose na cervical e joelho direito',
      reminderTime: '07:00',
      remindersEnabled: false,
      workouts: {},
      health: {},
      painDiary: {},
      streak: 0,
      totalCompleted: 0,
      calendarMonth: new Date().getMonth(),
      calendarYear: new Date().getFullYear()
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return { ...getDefaultState(), ...JSON.parse(raw) };
    } catch(e) { console.error('Load error', e); }
    return getDefaultState();
  }

  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
    catch(e) { console.error('Save error', e); }
  }

  // ── Utility ──
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function dateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function dayOfWeek() { return new Date().getDay(); }

  function getTrainingDay() { return DAY_MAP[dayOfWeek()] || 0; }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function getDailyQuote() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }

  function $(sel, parent) { return (parent || document).querySelector(sel); }
  function $$(sel, parent) { return [...(parent || document).querySelectorAll(sel)]; }

  // ── Streak Calculator ──
  function calculateStreak() {
    let streak = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    while(true) {
      const ds = dateStr(d);
      const dow = d.getDay();
      if (dow === 0) { d.setDate(d.getDate() - 1); continue; }
      if (state.workouts[ds] && state.workouts[ds].completed) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else { break; }
    }
    const today = todayStr();
    if (state.workouts[today] && state.workouts[today].completed) streak++;
    return streak;
  }

  function countTotalWorkouts() {
    return Object.values(state.workouts).filter(w => w.completed).length;
  }

  function getWeekProgress() {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    let done = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = dateStr(d);
      if (state.workouts[ds] && state.workouts[ds].completed) done++;
    }
    return done;
  }

  function getTodayWorkout() {
    const today = todayStr();
    const tDay = getTrainingDay();
    if (tDay === 0) return null;
    if (!state.workouts[today]) {
      state.workouts[today] = { day: tDay, exercises: {}, completed: false };
      saveState();
    }
    return state.workouts[today];
  }

  // ── Progress Ring SVG ──
  function progressRingSVG(size, stroke, progress, color1, color2) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress * circ);
    const id = 'pr' + Math.random().toString(36).substr(2,5);
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color1}"/>
            <stop offset="100%" stop-color="${color2}"/>
          </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#F0F0F5" stroke-width="${stroke}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${stroke}" stroke-linecap="round"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
          class="progress-ring__circle"/>
      </svg>`;
  }

  // ════════════════════════════════════
  // HOME TAB
  // ════════════════════════════════════
  function renderHome() {
    const el = $('#home-content');
    const greeting = getGreeting();
    const quote = getDailyQuote();
    const tDay = getTrainingDay();
    const dayData = EXERCISE_DB[tDay];
    const streak = calculateStreak();
    const total = countTotalWorkouts();
    const weekDone = getWeekProgress();
    const today = todayStr();
    const workout = state.workouts[today];
    const isComplete = workout && workout.completed;

    // Week dots
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    let weekDotsHTML = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = dateStr(d);
      const dow = d.getDay();
      const isToday = ds === today;
      const isDone = state.workouts[ds] && state.workouts[ds].completed;
      const isRest = dow === 0;
      let cls = 'pending';
      if (isToday) cls = 'today';
      else if (isDone) cls = 'done';
      else if (isRest) cls = 'rest';
      weekDotsHTML += `<div class="week-dot ${cls}">${DAY_NAMES_SHORT[dow].charAt(0)}</div>`;
    }

    el.innerHTML = `
      <!-- Hero Greeting -->
      <div class="card-gradient grad-primary mt-4 mb-5" style="position:relative; overflow:hidden;">
        <div style="position:absolute; top:-20px; right:-20px; font-size:80px; opacity:0.15;">💪</div>
        <p class="text-white/80 text-sm font-semibold mb-1">${greeting}</p>
        <h1 class="font-heading text-3xl font-extrabold mb-3">Simone!</h1>
        <p class="text-white/70 text-sm italic leading-relaxed">"${quote.text}"</p>
        <p class="text-white/50 text-xs mt-1">— ${quote.author}</p>
      </div>

      <!-- Today's Workout Card -->
      ${tDay === 0 ? `
        <div class="card mb-5 text-center py-8">
          <div class="text-5xl mb-3">🧘</div>
          <h2 class="font-heading text-xl font-bold mb-2">Domingo de Descanso</h2>
          <p class="text-txt-sec text-sm">Aproveite para relaxar e se recuperar.</p>
        </div>
      ` : `
        <div class="card-gradient ${dayData.gradient} mb-5 cursor-pointer" onclick="switchToWorkout()" style="position:relative; overflow:hidden;">
          <div style="position:absolute; top:-10px; right:-10px; font-size:64px; opacity:0.15;">${dayData.icon}</div>
          <p class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Treino de Hoje</p>
          <h2 class="font-heading text-2xl font-bold mb-1">${dayData.dayName}</h2>
          <p class="text-white/80 text-sm mb-4">${dayData.dayLabel} — ${dayData.exercises.length} exercicios</p>
          ${isComplete ? `
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="3"><path d="M2 8l4 4 8-8"/></svg>
              </div>
              <span class="text-white/90 font-semibold text-sm">Treino completo!</span>
            </div>
          ` : `
            <button class="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-2xl text-base hover:bg-white/30 transition-all" onclick="event.stopPropagation(); switchToWorkout()">
              Comecar Treino
            </button>
          `}
        </div>
      `}

      <!-- Weekly Overview -->
      <div class="section-title mt-6">Semana Atual</div>
      <div class="card mb-5">
        <div class="flex justify-between items-center">${weekDotsHTML}</div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="stat-card">
          <div class="text-2xl mb-1">🔥</div>
          <div class="font-heading text-2xl font-extrabold" style="background:linear-gradient(135deg,#F2994A,#F2C94C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${streak}</div>
          <div class="text-txt-sec text-xs font-semibold">Sequencia</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl mb-1">🏆</div>
          <div class="font-heading text-2xl font-extrabold" style="background:linear-gradient(135deg,#667EEA,#764BA2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${total}</div>
          <div class="text-txt-sec text-xs font-semibold">Treinos</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl mb-1">📅</div>
          <div class="font-heading text-2xl font-extrabold" style="background:linear-gradient(135deg,#11998E,#38EF7D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${weekDone}/6</div>
          <div class="text-txt-sec text-xs font-semibold">Esta Semana</div>
        </div>
      </div>

      <!-- Quick Health Log -->
      <button class="w-full btn-gradient grad-secondary flex items-center justify-center gap-2 mb-8" onclick="switchTab('health')">
        <span class="text-lg">❤️</span> Registrar Saude de Hoje
      </button>
    `;
  }

  // Make switchToWorkout global
  window.switchToWorkout = function() { switchTab('workout'); };

  // ════════════════════════════════════
  // WORKOUT TAB
  // ════════════════════════════════════
  function renderWorkout() {
    const el = $('#workout-content');
    const tDay = getTrainingDay();

    if (tDay === 0) {
      el.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">🧘</div>
          <h2 class="font-heading text-2xl font-bold mb-2">Dia de Descanso</h2>
          <p class="text-txt-sec">Aproveite o domingo para relaxar!</p>
        </div>`;
      return;
    }

    const dayData = EXERCISE_DB[tDay];
    const today = todayStr();
    const workout = getTodayWorkout();
    const exercises = dayData.exercises;
    const doneCount = exercises.filter(ex => workout.exercises[ex.id] && workout.exercises[ex.id].done).length;
    const progress = exercises.length > 0 ? doneCount / exercises.length : 0;

    // Header with progress ring
    let html = `
      <div class="flex items-center gap-4 mt-4 mb-6">
        <div class="relative">
          ${progressRingSVG(80, 6, progress, '#667EEA', '#764BA2')}
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="font-heading text-lg font-extrabold">${doneCount}/${exercises.length}</span>
          </div>
        </div>
        <div>
          <h1 class="font-heading text-2xl font-bold">${dayData.dayName}</h1>
          <p class="text-txt-sec text-sm">${dayData.dayLabel}</p>
        </div>
      </div>
    `;

    // Exercise cards
    exercises.forEach((ex, idx) => {
      const exState = workout.exercises[ex.id] || {};
      const isDone = !!exState.done;
      const isExpanded = expandedExercise === ex.id;

      html += `
        <div class="exercise-card ${isDone ? 'done' : ''}" id="ex-${ex.id}">
          <div class="flex items-center gap-3 p-4 cursor-pointer" onclick="toggleExercise('${ex.id}')">
            <div class="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0" style="background:${isDone ? 'linear-gradient(135deg,#11998E,#38EF7D)' : '#F0F0F5'}">
              ${isDone ? '<svg width="20" height="20" fill="none" stroke="#fff" stroke-width="3"><path d="M3 10l5 5 10-10"/></svg>' : ex.muscleEmoji}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-heading text-base font-bold ${isDone ? 'line-through opacity-60' : ''}">${ex.name}</h3>
              <p class="text-txt-sec text-xs">${ex.sets}x${ex.reps} &middot; <span class="equip-tag">${ex.equipment}</span></p>
            </div>
            <div class="check-circle ${isDone ? 'checked' : ''}" onclick="event.stopPropagation(); toggleDone('${ex.id}')">
              <svg fill="none" stroke="#fff" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>

          <div class="exercise-expand ${isExpanded ? 'open' : ''}" id="expand-${ex.id}">
            <!-- YouTube Video (lazy) -->
            <div class="video-container mb-4">
              ${isExpanded ? `<iframe src="https://www.youtube.com/embed/${ex.youtubeId}?rel=0" allowfullscreen loading="lazy"></iframe>` : ''}
            </div>

            <!-- Como Fazer -->
            <div class="mb-4">
              <div class="instruction-label">Posicao Inicial</div>
              <div class="instruction-text text-sm">${ex.startPosition}</div>
            </div>
            <div class="mb-4">
              <div class="instruction-label">Execucao</div>
              <div class="instruction-text text-sm">${ex.execution}</div>
            </div>
            <div class="mb-4">
              <div class="instruction-label">Respiracao</div>
              <div class="instruction-text text-sm">${ex.breathing}</div>
            </div>

            <!-- Caution -->
            <div class="caution-box mb-4">
              <span class="font-bold">⚠️ Cuidado (artrose):</span> ${ex.caution}
            </div>

            <!-- Weight Input -->
            <div class="flex items-center gap-3 mb-3">
              <span class="text-sm font-semibold text-txt-sec">Carga:</span>
              <input type="text" class="weight-input" placeholder="Ex: 1L" value="${exState.weight || ''}" onchange="saveWeight('${ex.id}', this.value)">
            </div>

            <!-- Timer (for isometric) -->
            ${ex.isometric ? `
              <button class="w-full btn-gradient grad-primary flex items-center justify-center gap-2 py-3 rounded-2xl" onclick="startTimer(${ex.duration || 25}, '${ex.name}')">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Iniciar Timer (${ex.duration || 25}s)
              </button>
            ` : ''}
          </div>
        </div>
      `;
    });

    el.innerHTML = html;
  }

  // Toggle exercise expansion
  window.toggleExercise = function(id) {
    if (expandedExercise === id) {
      expandedExercise = null;
    } else {
      expandedExercise = id;
    }
    renderWorkout();
    if (expandedExercise) {
      setTimeout(() => {
        const card = document.getElementById('ex-' + id);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Toggle exercise done
  window.toggleDone = function(id) {
    const today = todayStr();
    const workout = getTodayWorkout();
    if (!workout) return;
    if (!workout.exercises[id]) workout.exercises[id] = {};
    workout.exercises[id].done = !workout.exercises[id].done;

    // Check if all done
    const tDay = getTrainingDay();
    const dayData = EXERCISE_DB[tDay];
    if (dayData) {
      const allDone = dayData.exercises.every(ex => workout.exercises[ex.id] && workout.exercises[ex.id].done);
      if (allDone && !workout.completed) {
        workout.completed = true;
        state.totalCompleted = countTotalWorkouts();
        state.streak = calculateStreak();
        saveState();
        renderWorkout();
        showCelebration();
        return;
      }
    }

    saveState();
    renderWorkout();
  };

  // Save weight
  window.saveWeight = function(id, val) {
    const workout = getTodayWorkout();
    if (!workout) return;
    if (!workout.exercises[id]) workout.exercises[id] = {};
    workout.exercises[id].weight = val;
    saveState();
  };

  // ── Timer ──
  window.startTimer = function(seconds, name) {
    timerRemaining = seconds;
    const overlay = document.createElement('div');
    overlay.className = 'timer-overlay';
    overlay.id = 'timer-overlay';
    overlay.innerHTML = `
      <div class="bg-white rounded-3xl p-8 w-80 text-center shadow-2xl">
        <h3 class="font-heading text-lg font-bold mb-1">${name}</h3>
        <p class="text-txt-sec text-sm mb-6">Mantenha a posicao!</p>
        <div class="timer-display mb-6" id="timer-num">${seconds}</div>
        <div class="flex justify-center gap-4">
          <button class="timer-btn grad-primary" onclick="pauseResumeTimer()">
            <span id="timer-icon">⏸</span>
          </button>
          <button class="timer-btn" style="background:#DFE6E9; color:#636E72;" onclick="stopTimer()">
            ⏹
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    let paused = false;
    overlay._paused = false;

    timerInterval = setInterval(() => {
      if (overlay._paused) return;
      timerRemaining--;
      const numEl = document.getElementById('timer-num');
      if (numEl) numEl.textContent = timerRemaining;
      if (timerRemaining <= 0) {
        clearInterval(timerInterval);
        if (numEl) numEl.textContent = '0';
        // Vibrate
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        setTimeout(() => {
          const ol = document.getElementById('timer-overlay');
          if (ol) ol.remove();
        }, 1500);
      }
    }, 1000);
  };

  window.pauseResumeTimer = function() {
    const overlay = document.getElementById('timer-overlay');
    if (!overlay) return;
    overlay._paused = !overlay._paused;
    const icon = document.getElementById('timer-icon');
    if (icon) icon.textContent = overlay._paused ? '▶' : '⏸';
  };

  window.stopTimer = function() {
    clearInterval(timerInterval);
    const ol = document.getElementById('timer-overlay');
    if (ol) ol.remove();
  };

  // ════════════════════════════════════
  // CELEBRATION OVERLAY
  // ════════════════════════════════════
  function showCelebration() {
    const overlay = document.getElementById('celebration-overlay');
    const card = document.getElementById('celebration-card');
    const confetti = document.getElementById('confetti-container');
    overlay.classList.remove('hidden');

    card.innerHTML = `
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="font-heading text-2xl font-extrabold mb-2">Parabens Simone!</h2>
      <p class="text-txt-sec mb-6">Treino completo! Voce e incrivel!</p>

      <div class="section-title text-left">Sentiu dor?</div>
      <div class="flex flex-wrap gap-2 mb-4" id="cele-body-parts">
        <button class="body-part-btn" onclick="this.classList.toggle('active')">🦴 Pescoco</button>
        <button class="body-part-btn" onclick="this.classList.toggle('active')">💪 Ombro</button>
        <button class="body-part-btn" onclick="this.classList.toggle('active')">🦵 Joelho Dir.</button>
        <button class="body-part-btn" onclick="this.classList.toggle('active')">🔙 Lombar</button>
        <button class="body-part-btn" onclick="this.classList.toggle('active')">📍 Outro</button>
      </div>

      <div class="section-title text-left">Nivel da dor</div>
      <div class="flex gap-2 mb-4" id="cele-pain-level">
        <button class="pain-btn" onclick="selectCelePain(this,1)">1</button>
        <button class="pain-btn" onclick="selectCelePain(this,2)">2</button>
        <button class="pain-btn" onclick="selectCelePain(this,3)">3</button>
        <button class="pain-btn" onclick="selectCelePain(this,4)">4</button>
        <button class="pain-btn" onclick="selectCelePain(this,5)">5</button>
      </div>

      <div class="section-title text-left">Como se sente?</div>
      <div class="flex gap-3 mb-4" id="cele-mood">
        <button class="mood-btn" onclick="selectCeleMood(this,'happy')">😊</button>
        <button class="mood-btn" onclick="selectCeleMood(this,'neutral')">😐</button>
        <button class="mood-btn" onclick="selectCeleMood(this,'tired')">😮‍💨</button>
        <button class="mood-btn" onclick="selectCeleMood(this,'sad')">😔</button>
      </div>

      <textarea class="input-field mb-4" id="cele-notes" placeholder="Observacoes..." rows="2"></textarea>

      <button class="w-full btn-gradient grad-success py-3 rounded-2xl mb-2" onclick="saveCelebration()">Salvar e Fechar</button>
      <button class="w-full btn-outline rounded-2xl" onclick="closeCelebration()">Pular</button>
    `;

    setTimeout(() => {
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    }, 50);

    // Confetti
    spawnConfetti(confetti);
  }

  let celePainLevel = 0;
  let celeMood = '';

  window.selectCelePain = function(btn, level) {
    celePainLevel = level;
    $$('#cele-pain-level .pain-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  window.selectCeleMood = function(btn, mood) {
    celeMood = mood;
    $$('#cele-mood .mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  window.saveCelebration = function() {
    const today = todayStr();
    const parts = $$('#cele-body-parts .body-part-btn.active').map(b => b.textContent.trim());
    const notes = document.getElementById('cele-notes')?.value || '';
    state.painDiary[today] = {
      parts: parts,
      level: celePainLevel,
      mood: celeMood,
      notes: notes
    };
    saveState();
    closeCelebration();
  };

  window.closeCelebration = function() {
    const overlay = document.getElementById('celebration-overlay');
    const card = document.getElementById('celebration-card');
    card.style.transform = 'scale(0.9)';
    card.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.getElementById('confetti-container').innerHTML = '';
    }, 300);
  };

  function spawnConfetti(container) {
    const colors = ['#667EEA','#764BA2','#F093FB','#F5576C','#11998E','#38EF7D','#F2994A','#F2C94C'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = Math.random() * 1 + 's';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
  }

  // ════════════════════════════════════
  // HEALTH TAB
  // ════════════════════════════════════
  function renderHealth() {
    const el = $('#health-content');
    const today = todayStr();
    const h = state.health[today] || {};

    // 7-day weight data for chart
    const weightData = [];
    const chartLabels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = dateStr(d);
      const hd = state.health[ds];
      chartLabels.push(DAY_NAMES_SHORT[d.getDay()]);
      weightData.push(hd && hd.weight ? parseFloat(hd.weight) : null);
    }

    // History
    let historyHTML = '';
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = dateStr(d);
      const hd = state.health[ds];
      if (hd) {
        const moodMap = { happy: '😊', neutral: '😐', tired: '😮‍💨', sad: '😔' };
        historyHTML += `
          <div class="history-item flex justify-between items-center">
            <div>
              <span class="font-semibold text-sm">${d.getDate()}/${d.getMonth()+1}</span>
              <span class="text-txt-sec text-xs ml-2">${DAY_NAMES_SHORT[d.getDay()]}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              ${hd.weight ? `<span>⚖️ ${hd.weight}kg</span>` : ''}
              ${hd.sleep ? `<span>😴 ${hd.sleep}h</span>` : ''}
              ${hd.mood ? `<span>${moodMap[hd.mood] || ''}</span>` : ''}
            </div>
          </div>
        `;
      }
    }

    el.innerHTML = `
      <h1 class="font-heading text-2xl font-bold mt-4 mb-5">Saude</h1>

      <!-- Today's Health -->
      <div class="card mb-5">
        <h3 class="font-heading text-base font-bold mb-4">Registro de Hoje</h3>

        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label class="text-xs font-semibold text-txt-sec block mb-1">😴 Sono (horas)</label>
            <input type="number" class="input-field" id="h-sleep" value="${h.sleep || ''}" placeholder="7" step="0.5" min="0" max="24" onchange="saveHealthField('sleep', this.value)">
          </div>
          <div>
            <label class="text-xs font-semibold text-txt-sec block mb-1">⚖️ Peso (kg)</label>
            <input type="number" class="input-field" id="h-weight" value="${h.weight || ''}" placeholder="65" step="0.1" onchange="saveHealthField('weight', this.value)">
          </div>
        </div>

        <div class="mb-4">
          <label class="text-xs font-semibold text-txt-sec block mb-1">👣 Passos</label>
          <input type="number" class="input-field" id="h-steps" value="${h.steps || ''}" placeholder="5000" onchange="saveHealthField('steps', this.value)">
        </div>

        <div class="mb-2">
          <label class="text-xs font-semibold text-txt-sec block mb-2">Humor</label>
          <div class="flex gap-3" id="health-mood">
            ${['happy','neutral','tired','sad'].map(m => {
              const emojis = { happy: '😊', neutral: '😐', tired: '😮‍💨', sad: '😔' };
              return `<button class="mood-btn ${h.mood === m ? 'active' : ''}" onclick="saveHealthMood('${m}')">${emojis[m]}</button>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Pain Log -->
      <div class="card mb-5">
        <h3 class="font-heading text-base font-bold mb-3">Registro de Dor</h3>

        <div class="flex flex-wrap gap-2 mb-3" id="health-body-parts">
          ${['🦴 Pescoco','💪 Ombro','🦵 Joelho Dir.','🔙 Lombar','📍 Outro'].map(p => {
            const pd = state.painDiary[today];
            const isActive = pd && pd.parts && pd.parts.includes(p);
            return `<button class="body-part-btn ${isActive ? 'active' : ''}" onclick="toggleHealthPart(this)">${p}</button>`;
          }).join('')}
        </div>

        <div class="flex gap-2 mb-3" id="health-pain-level">
          ${[1,2,3,4,5].map(l => {
            const pd = state.painDiary[today];
            const isActive = pd && pd.level === l;
            return `<button class="pain-btn ${isActive ? 'active' : ''}" onclick="saveHealthPainLevel(this, ${l})">${l}</button>`;
          }).join('')}
        </div>

        <textarea class="input-field" id="h-pain-notes" rows="2" placeholder="Observacoes sobre dor..." onchange="saveHealthPainNotes(this.value)">${(state.painDiary[today] && state.painDiary[today].notes) || ''}</textarea>
      </div>

      <!-- Weight Chart -->
      <div class="section-title">Peso - Ultimos 7 dias</div>
      <div class="card mb-5">
        ${renderWeightChart(weightData, chartLabels)}
      </div>

      <!-- History -->
      <div class="section-title">Historico Recente</div>
      ${historyHTML || '<p class="text-txt-sec text-sm mb-6">Nenhum registro ainda.</p>'}
      <div class="h-8"></div>
    `;
  }

  function renderWeightChart(data, labels) {
    const validData = data.filter(d => d !== null);
    if (validData.length < 2) return '<p class="text-txt-sec text-sm text-center py-4">Registre seu peso por alguns dias para ver o grafico.</p>';

    const w = 300, h = 120, pad = 30;
    const min = Math.min(...validData) - 1;
    const max = Math.max(...validData) + 1;
    const range = max - min || 1;

    const points = [];
    data.forEach((val, i) => {
      if (val !== null) {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((val - min) / range) * (h - pad * 2);
        points.push({ x, y, val });
      }
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaD = pathD + ` L${points[points.length-1].x},${h - pad} L${points[0].x},${h - pad} Z`;

    return `
      <svg viewBox="0 0 ${w} ${h}" class="w-full">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#667EEA"/>
            <stop offset="100%" stop-color="#764BA2"/>
          </linearGradient>
          <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#667EEA" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#667EEA" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" class="chart-area"/>
        <path d="${pathD}" class="chart-line"/>
        ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" class="chart-dot"/>`).join('')}
        ${labels.map((l, i) => `<text x="${pad + (i / (labels.length - 1)) * (w - pad * 2)}" y="${h - 5}" text-anchor="middle" fill="#B2BEC3" font-size="10" font-family="Nunito">${l}</text>`).join('')}
      </svg>
    `;
  }

  // Health save functions
  window.saveHealthField = function(field, val) {
    const today = todayStr();
    if (!state.health[today]) state.health[today] = {};
    state.health[today][field] = val;
    saveState();
  };

  window.saveHealthMood = function(mood) {
    const today = todayStr();
    if (!state.health[today]) state.health[today] = {};
    state.health[today].mood = mood;
    saveState();
    $$('#health-mood .mood-btn').forEach(b => b.classList.remove('active'));
    event.target.closest('.mood-btn').classList.add('active');
  };

  window.toggleHealthPart = function(btn) {
    btn.classList.toggle('active');
    const today = todayStr();
    if (!state.painDiary[today]) state.painDiary[today] = { parts: [], level: 0, notes: '' };
    state.painDiary[today].parts = $$('#health-body-parts .body-part-btn.active').map(b => b.textContent.trim());
    saveState();
  };

  window.saveHealthPainLevel = function(btn, level) {
    const today = todayStr();
    if (!state.painDiary[today]) state.painDiary[today] = { parts: [], level: 0, notes: '' };
    state.painDiary[today].level = level;
    $$('#health-pain-level .pain-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveState();
  };

  window.saveHealthPainNotes = function(val) {
    const today = todayStr();
    if (!state.painDiary[today]) state.painDiary[today] = { parts: [], level: 0, notes: '' };
    state.painDiary[today].notes = val;
    saveState();
  };

  // ════════════════════════════════════
  // PROGRESS TAB
  // ════════════════════════════════════
  function renderProgress() {
    const el = $('#progress-content');
    const streak = calculateStreak();
    const total = countTotalWorkouts();
    const avgPerWeek = total > 0 ? Math.min((total / Math.max(1, Math.ceil(total / 6))), 6).toFixed(1) : '0';

    // Calendar
    const year = state.calendarYear;
    const month = state.calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = todayStr();

    let calHTML = `
      <div class="flex justify-between items-center mb-3">
        <button class="p-2" onclick="changeMonth(-1)">
          <svg width="20" height="20" fill="none" stroke="#636E72" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h3 class="font-heading text-base font-bold">${MONTH_NAMES[month]} ${year}</h3>
        <button class="p-2" onclick="changeMonth(1)">
          <svg width="20" height="20" fill="none" stroke="#636E72" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-2">
        ${DAY_NAMES_SHORT.map(d => `<div class="text-center text-xs font-semibold text-txt-sec">${d.charAt(0)}</div>`).join('')}
      </div>
      <div class="grid grid-cols-7 gap-1">
    `;

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      calHTML += '<div class="cal-cell"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dow = new Date(year, month, d).getDay();
      const isToday = ds === today;
      const hasWorkout = state.workouts[ds] && state.workouts[ds].completed;
      const isRest = dow === 0;
      let cls = '';
      if (hasWorkout) cls = 'has-workout';
      else if (isToday) cls = 'today-cell';
      else if (isRest) cls = 'rest-cell';
      calHTML += `<div class="cal-cell ${cls}">${d}</div>`;
    }
    calHTML += '</div>';

    // Medals
    const medals = [
      { emoji: '🥉', label: '7 dias', target: 7, achieved: total >= 7 },
      { emoji: '🥈', label: '30 dias', target: 30, achieved: total >= 30 },
      { emoji: '🥇', label: '90 dias', target: 90, achieved: total >= 90 },
    ];

    // Muscle group breakdown
    const muscleCount = {};
    Object.values(state.workouts).forEach(w => {
      if (!w.completed || !w.day) return;
      const dayData = EXERCISE_DB[w.day];
      if (!dayData) return;
      dayData.exercises.forEach(ex => {
        const group = ex.muscleGroup.split('/')[0].trim();
        muscleCount[group] = (muscleCount[group] || 0) + 1;
      });
    });
    const maxMuscle = Math.max(...Object.values(muscleCount), 1);
    const muscleGroups = Object.entries(muscleCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const barColors = ['#667EEA','#F093FB','#11998E','#F2994A','#764BA2','#38EF7D'];

    el.innerHTML = `
      <h1 class="font-heading text-2xl font-bold mt-4 mb-5">Progresso</h1>

      <!-- Calendar -->
      <div class="card mb-5">${calHTML}</div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 mb-5">
        <div class="stat-card">
          <div class="font-heading text-2xl font-extrabold" style="background:linear-gradient(135deg,#667EEA,#764BA2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${total}</div>
          <div class="text-txt-sec text-xs font-semibold">Total Treinos</div>
        </div>
        <div class="stat-card">
          <div class="font-heading text-2xl font-extrabold" style="background:linear-gradient(135deg,#F2994A,#F2C94C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${streak}</div>
          <div class="text-txt-sec text-xs font-semibold">Sequencia</div>
        </div>
        <div class="stat-card">
          <div class="font-heading text-2xl font-extrabold" style="background:linear-gradient(135deg,#11998E,#38EF7D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${avgPerWeek}</div>
          <div class="text-txt-sec text-xs font-semibold">Media/Sem</div>
        </div>
      </div>

      <!-- Medals -->
      <div class="section-title">Medalhas</div>
      <div class="grid grid-cols-3 gap-3 mb-5">
        ${medals.map(m => `
          <div class="medal-card ${m.achieved ? 'achieved' : ''}">
            <div class="text-3xl mb-1 ${m.achieved ? '' : 'grayscale opacity-40'}" style="${m.achieved ? '' : 'filter:grayscale(1);opacity:0.4'}">${m.emoji}</div>
            <div class="font-heading text-sm font-bold ${m.achieved ? '' : 'text-txt-sec'}">${m.label}</div>
            <div class="text-xs text-txt-sec">${m.achieved ? 'Conquistada!' : `${total}/${m.target}`}</div>
          </div>
        `).join('')}
      </div>

      <!-- Muscle Groups -->
      ${muscleGroups.length > 0 ? `
        <div class="section-title">Grupos Musculares</div>
        <div class="card mb-8">
          ${muscleGroups.map((mg, i) => `
            <div class="flex items-center gap-3 ${i > 0 ? 'mt-3' : ''}">
              <div class="w-20 text-xs font-semibold text-txt-sec truncate">${mg[0]}</div>
              <div class="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div class="bar-chart-bar h-full" style="width:${(mg[1]/maxMuscle)*100}%; background:${barColors[i % barColors.length]}"></div>
              </div>
              <div class="text-xs font-bold w-6 text-right">${mg[1]}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      <div class="h-8"></div>
    `;
  }

  window.changeMonth = function(delta) {
    state.calendarMonth += delta;
    if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
    if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
    saveState();
    renderProgress();
  };

  // ════════════════════════════════════
  // SETTINGS TAB
  // ════════════════════════════════════
  function renderSettings() {
    const el = $('#settings-content');

    el.innerHTML = `
      <h1 class="font-heading text-2xl font-bold mt-4 mb-5">Configuracoes</h1>

      <!-- Profile Card -->
      <div class="card-gradient grad-primary mb-5" style="position:relative; overflow:hidden;">
        <div style="position:absolute; top:-10px; right:-10px; font-size:60px; opacity:0.12;">🏋️</div>
        <div class="flex items-center gap-4">
          <img src="profile.jpg" alt="Simone" class="w-16 h-16 rounded-full object-cover border-2 border-white/30">
          <div>
            <h2 class="font-heading text-xl font-bold">${state.name} Trombini</h2>
            <p class="text-white/70 text-sm">${state.age} anos</p>
            <p class="text-white/60 text-xs mt-1">${state.restrictions}</p>
          </div>
        </div>
      </div>

      <!-- Reminders -->
      <div class="card mb-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-heading text-base font-bold">Lembretes</h3>
            <p class="text-txt-sec text-xs">Receba notificacao para treinar</p>
          </div>
          <div class="toggle-switch ${state.remindersEnabled ? 'on' : ''}" onclick="toggleReminders()"></div>
        </div>
        ${state.remindersEnabled ? `
          <div>
            <label class="text-xs font-semibold text-txt-sec block mb-1">Horario</label>
            <input type="time" class="input-field" value="${state.reminderTime}" onchange="saveReminderTime(this.value)">
          </div>
        ` : ''}
      </div>

      <!-- About -->
      <div class="card mb-4">
        <h3 class="font-heading text-base font-bold mb-2">Sobre o App</h3>
        <p class="text-txt-sec text-sm leading-relaxed">
          App de treino personalizado para Simone Trombini.
          Exercicios adaptados para artrose no joelho direito e cervicalgia.
          6 dias de treino + 1 dia de descanso.
        </p>
        <p class="text-txt-sec text-xs mt-3">Versao 2.0 — PWA Premium</p>
      </div>

      <!-- Reset -->
      <button class="w-full btn-outline rounded-2xl text-red-400 border-red-200 mb-8" onclick="confirmReset()">
        Resetar Todos os Dados
      </button>
      <div class="h-8"></div>
    `;
  }

  window.toggleReminders = function() {
    state.remindersEnabled = !state.remindersEnabled;
    if (state.remindersEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
    saveState();
    renderSettings();
  };

  window.saveReminderTime = function(val) {
    state.reminderTime = val;
    saveState();
  };

  window.confirmReset = function() {
    if (confirm('Tem certeza que deseja apagar TODOS os dados? Esta acao nao pode ser desfeita.')) {
      localStorage.removeItem(LS_KEY);
      state = getDefaultState();
      saveState();
      renderCurrentTab();
    }
  };

  // ════════════════════════════════════
  // TAB NAVIGATION
  // ════════════════════════════════════
  function switchTab(tab) {
    activeTab = tab;
    expandedExercise = null;

    // Update panels
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');

    // Update tab bar
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    const btn = $(`.tab-btn[data-tab="${tab}"]`);
    if (btn) btn.classList.add('active');

    renderCurrentTab();

    // Scroll to top
    window.scrollTo(0, 0);
  }
  window.switchTab = switchTab;

  function renderCurrentTab() {
    switch(activeTab) {
      case 'home': renderHome(); break;
      case 'workout': renderWorkout(); break;
      case 'health': renderHealth(); break;
      case 'progress': renderProgress(); break;
      case 'settings': renderSettings(); break;
    }
  }

  // Tab bar clicks
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ════════════════════════════════════
  // SERVICE WORKER
  // ════════════════════════════════════
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
  }

  // ════════════════════════════════════
  // NOTIFICATION SCHEDULER
  // ════════════════════════════════════
  function checkReminder() {
    if (!state.remindersEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const [hh, mm] = state.reminderTime.split(':').map(Number);
    if (now.getHours() === hh && now.getMinutes() === mm && now.getDay() !== 0) {
      const tDay = DAY_MAP[now.getDay()];
      const dayData = EXERCISE_DB[tDay];
      if (dayData) {
        new Notification('Hora do Treino!', {
          body: `${dayData.dayName} te espera, Simone!`,
          icon: 'icons/icon-192.png'
        });
      }
    }
  }
  setInterval(checkReminder, 60000);

  // ════════════════════════════════════
  // INIT
  // ════════════════════════════════════
  renderHome();

})();
