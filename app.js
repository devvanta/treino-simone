// app.js — Treino da Simone v3.0 — perpetio/fitness style PWA
// All state persisted in localStorage

const App = (function() {
  'use strict';

  // ── Constants ──
  const LS_KEY = 'treino_simone_v2';
  const LS_ONBOARDING = 'treino_simone_onboarding';
  const LS_WALKS = 'treino_simone_walks';
  const MONTH_NAMES = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const DAY_NAMES_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
  const SP_TZ = 'America/Sao_Paulo';

  // Workout card colors cycle
  const CARD_COLORS = ['orange','teal','purple','green','orange','teal'];
  const CARD_BG_COLORS = ['#FCB74F','#5C9BA4','#6358E1','#66BB6A','#FCB74F','#5C9BA4'];
  const CARD_IMAGES = [
    'assets/cardio.png',
    'assets/arms.png',
    'assets/cardio.png',
    'assets/arms.png',
    'assets/cardio.png',
    'assets/arms.png'
  ];

  // Medals
  const MEDALS = [
    { id: 'first', emoji: '🥇', name: 'Primeiro Treino', desc: 'Complete 1 treino', threshold: 1 },
    { id: 'five', emoji: '⭐', name: '5 Treinos', desc: 'Complete 5 treinos', threshold: 5 },
    { id: 'ten', emoji: '🏆', name: '10 Treinos', desc: 'Complete 10 treinos', threshold: 10 },
    { id: 'streak3', emoji: '🔥', name: '3 Dias Seguidos', desc: '3 dias consecutivos', threshold: 'streak3' },
    { id: 'streak7', emoji: '💎', name: '7 Dias Seguidos', desc: '7 dias consecutivos', threshold: 'streak7' },
    { id: 'alldays', emoji: '👑', name: 'Semana Completa', desc: 'Todos os 6 treinos', threshold: 'alldays' },
  ];

  // ── State ──
  let state = loadState();
  let currentTab = 'home';
  let currentDayId = null;
  let currentExercise = null;
  let timerInterval = null;
  let timerRemaining = 0;
  let calendarMonth = new Date().getMonth();
  let calendarYear = new Date().getFullYear();
  let weightChart = null;
  let selectedMood = '';
  let selectedPainRegions = [];

  // Real time tracking
  let workoutStartTime = null;

  // Walking state
  let walkActive = false;
  let walkPaused = false;
  let walkStartTime = null;
  let walkPausedDuration = 0;
  let walkPauseStart = null;
  let walkWatchId = null;
  let walkPoints = [];
  let walkTotalDistance = 0;
  let walkTotalElevationGain = 0;
  let walkLastAltitude = null;
  let walkCurrentSpeed = 0;
  let walkTimerInterval = null;
  let walkMap = null;

  // ── State management ──
  function getDefaultState() {
    return {
      completedExercises: {},   // { 'd1e1': { date, weight, endTime } }
      completedDays: {},        // { '2026-04-15': [1,3] } — day IDs done that date
      healthLog: {},            // { '2026-04-15': { sleep, quality, weight, steps, pain, painRegions, mood } }
      settings: { reminder: false, reminderTime: '08:00' },
      totalMinutes: 0,
      workoutSessions: {},      // { '2026-04-15-d1': { startTime, endTime, durationMin } }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...getDefaultState(), ...parsed };
      }
    } catch(e) {}
    return getDefaultState();
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  // ── Helpers ──
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatTimeSP(ts) {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit',
      timeZone: SP_TZ
    }).format(new Date(ts));
  }

  function getTotalCompleted() {
    const doneDays = new Set();
    Object.entries(state.completedDays).forEach(([date, dayIds]) => {
      dayIds.forEach(id => doneDays.add(`${date}-${id}`));
    });
    return doneDays.size;
  }

  function getInProgressCount() {
    let count = 0;
    for (let dayId = 1; dayId <= 6; dayId++) {
      const dayData = EXERCISE_DB[dayId];
      if (!dayData) continue;
      const someCompleted = dayData.exercises.some(ex => state.completedExercises[ex.id]);
      const allCompleted = dayData.exercises.every(ex => state.completedExercises[ex.id]);
      if (someCompleted && !allCompleted) count++;
    }
    return count;
  }

  function isDayFullyCompleted(dayId) {
    const dayData = EXERCISE_DB[dayId];
    if (!dayData) return false;
    return dayData.exercises.every(ex => state.completedExercises[ex.id]);
  }

  function getEstimatedMinutes(dayId) {
    const dayData = EXERCISE_DB[dayId];
    if (!dayData) return 0;
    let mins = 0;
    dayData.exercises.forEach(ex => {
      if (ex.isometric && ex.duration) {
        mins += (ex.duration * (typeof ex.sets === 'number' ? ex.sets : 3)) / 60;
      } else {
        mins += (typeof ex.sets === 'number' ? ex.sets : 3) * 0.75;
      }
    });
    return Math.round(mins + 2);
  }

  function getDailyQuote() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }

  // ── Toast ──
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  // ── Confetti ──
  function fireConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const pieces = [];
    const colors = ['#6358E1','#FCB74F','#5C9BA4','#F25252','#66BB6A','#FF9800'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 4,
        vx: -1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: -0.1 + Math.random() * 0.2,
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.05;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 120) requestAnimationFrame(animate);
      else canvas.remove();
    }
    animate();
  }

  // ══════════════════════════════════════
  //  ONBOARDING
  // ══════════════════════════════════════
  function checkOnboarding() {
    const done = localStorage.getItem(LS_ONBOARDING);
    if (!done) {
      // Show onboarding
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screen-onboarding').classList.add('active');
      document.querySelector('.bottom-nav').style.display = 'none';
      return true;
    }
    return false;
  }

  function playOnboardingAudio(who) {
    playFromLibrary('welcome', who);
  }

  function finishOnboarding() {
    localStorage.setItem(LS_ONBOARDING, 'true');
    document.querySelector('.bottom-nav').style.display = '';
    switchTab('home');
  }

  // ══════════════════════════════════════
  //  VOICE PLAYER (com shuffle + anti-repeticao)
  // ══════════════════════════════════════
  const LS_LAST_AUDIO = 'treino_simone_last_audio';

  function getLastPlayedMap() {
    try { return JSON.parse(localStorage.getItem(LS_LAST_AUDIO) || '{}'); } catch(e) { return {}; }
  }

  function setLastPlayed(key, src) {
    const map = getLastPlayedMap();
    map[key] = src;
    localStorage.setItem(LS_LAST_AUDIO, JSON.stringify(map));
  }

  function pickAudioSrc(type, who) {
    const list = (AUDIO_LIBRARY[type] && AUDIO_LIBRARY[type][who]) || [];
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    const key = `${type}_${who}`;
    const last = getLastPlayedMap()[key];
    let pool = list.filter(s => s !== last);
    if (pool.length === 0) pool = list;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setLastPlayed(key, pick);
    return pick;
  }

  function pickDailyWho(type) {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000*60*60*24));
    return dayOfYear % 2 === 0 ? 'dan' : 'davi';
  }

  function playFromLibrary(type, who) {
    const src = pickAudioSrc(type, who);
    if (!src) return;
    const el = new Audio(src);
    el.play().catch(() => {});
  }

  function playMotivationalAudio() {
    playFromLibrary('frase', pickDailyWho('frase'));
  }

  function playPostWorkoutAudio() {
    playFromLibrary('postreino', pickDailyWho('postreino'));
  }

  // Auto-play diario: toca 1x por dia quando Simone abre a Home
  function maybeAutoPlayDaily() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.settings.lastDailyAudioDate === today) return;
    state.settings.lastDailyAudioDate = today;
    saveState();
    setTimeout(() => playMotivationalAudio(), 800);
  }

  // ══════════════════════════════════════
  //  TAB SWITCHING
  // ══════════════════════════════════════
  function switchTab(tab) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Show the bottom nav
    document.querySelector('.bottom-nav').style.display = '';

    currentTab = tab;

    const screenId = `screen-${tab}`;
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      window.scrollTo(0, 0);
    }

    // Activate nav button
    const navBtn = document.querySelector(`.nav-item[data-tab="${tab}"]`);
    if (navBtn) navBtn.classList.add('active');

    // Render tab content
    if (tab === 'home') { renderHome(); maybeAutoPlayDaily(); }
    else if (tab === 'workouts') renderWorkoutsTab();
    else if (tab === 'health') renderHealth();
    else if (tab === 'progress') renderProgress();
    else if (tab === 'settings') renderSettings();
    else if (tab === 'walking') renderWalking();
  }

  // ══════════════════════════════════════
  //  HOME SCREEN
  // ══════════════════════════════════════
  function renderHome() {
    // Stats
    const totalCompleted = getTotalCompleted();
    const inProgress = getInProgressCount();
    document.getElementById('stat-completed').textContent = totalCompleted;
    document.getElementById('stat-progress').textContent = inProgress;
    document.getElementById('stat-minutes').textContent = state.totalMinutes || 0;

    // Treino de hoje
    renderTodayWorkoutCard();

    // Card de dor (se tem registro recente)
    renderHomePainTip();

    // Workout scroll cards
    renderWorkoutScroll();

    // Motivation
    renderMotivation();
  }

  function renderTodayWorkoutCard() {
    const host = document.getElementById('today-workout-card');
    if (!host) return;
    const dow = new Date().getDay(); // 0=dom, 1=seg, ... 6=sab
    if (dow === 0) {
      host.innerHTML = `
        <div class="today-card today-rest">
          <div class="tc-icon">😴</div>
          <div class="tc-body">
            <div class="tc-kicker">Hoje · Domingo</div>
            <div class="tc-title">Dia de Descanso</div>
            <div class="tc-desc">Descanse, alongue-se, se hidrate. Voce merece.</div>
          </div>
        </div>`;
      return;
    }
    const day = EXERCISE_DB[dow];
    if (!day) { host.innerHTML = ''; return; }
    const exCount = day.exercises.length;
    const mins = getEstimatedMinutes(dow);
    const done = isDayFullyCompleted(dow);
    const completedCount = day.exercises.filter(ex => state.completedExercises[ex.id]).length;
    const pct = Math.round((completedCount / exCount) * 100);
    const ctaText = done ? '✓ Treino completo' : (completedCount > 0 ? 'Continuar' : 'Comecar agora');

    host.innerHTML = `
      <button class="today-card" onclick="App.openWorkout(${dow})">
        <div class="tc-icon">${day.icon}</div>
        <div class="tc-body">
          <div class="tc-kicker">Hoje · ${day.dayLabel}</div>
          <div class="tc-title">${day.dayName}</div>
          <div class="tc-desc">${exCount} exercicios · ${mins} min</div>
          <div class="tc-progress">
            <div class="tc-progress-bar"><div class="tc-progress-fill" style="width:${pct}%"></div></div>
            <span class="tc-progress-label">${completedCount}/${exCount}</span>
          </div>
          <div class="tc-cta">${ctaText} &#8250;</div>
        </div>
      </button>`;
  }

  function renderHomePainTip() {
    const host = document.getElementById('home-pain-tip');
    if (!host) return;

    // Encontra ultimo registro de dor nos ultimos 7 dias com pain >= 1
    const entries = Object.entries(state.healthLog)
      .filter(([d, v]) => v && v.pain >= 1 && v.painRegions && v.painRegions.length > 0)
      .sort((a, b) => b[0].localeCompare(a[0]));

    if (entries.length === 0) { host.innerHTML = ''; return; }

    const todayMs = Date.now();
    const [lastDate, lastEntry] = entries[0];
    const ageDays = Math.floor((todayMs - new Date(lastDate).getTime()) / 86400000);
    if (ageDays > 7) { host.innerHTML = ''; return; }

    const region = lastEntry.painRegions[0];
    const tips = (typeof PAIN_TIPS !== 'undefined' && PAIN_TIPS[region]) || [];
    if (tips.length === 0) { host.innerHTML = ''; return; }

    const tip = tips[Math.floor(Math.random() * tips.length)];
    const regionLabels = {
      cervical: 'Cervical',
      joelho_direito: 'Joelho direito',
      lombar: 'Lombar',
      ombro: 'Ombro',
      geral: 'Geral'
    };
    const regionName = regionLabels[region] || region;

    host.innerHTML = `
      <button class="pain-home-card" onclick="App.switchTab('health')">
        <div class="phc-icon">💡</div>
        <div class="phc-body">
          <div class="phc-kicker">Dica pra sua ${regionName.toLowerCase()}</div>
          <div class="phc-tip">${tip}</div>
          <div class="phc-cta">Ver mais dicas &#8250;</div>
        </div>
      </button>`;
  }

  function renderWorkoutScroll() {
    const container = document.getElementById('workout-scroll');
    let html = '';
    for (let dayId = 1; dayId <= 6; dayId++) {
      const day = EXERCISE_DB[dayId];
      if (!day) continue;
      const colorClass = CARD_COLORS[dayId - 1];
      const image = CARD_IMAGES[dayId - 1];
      const exCount = day.exercises.length;
      const mins = getEstimatedMinutes(dayId);
      const done = isDayFullyCompleted(dayId);

      html += `
        <div class="workout-card ${colorClass}" onclick="App.openWorkout(${dayId})">
          <div class="wc-check ${done ? 'done' : ''}">${done ? '✓' : ''}</div>
          <img src="${image}" alt="" class="wc-image">
          <div class="wc-title">${day.dayName}</div>
          <div class="wc-meta">${exCount} Exercicios · ${mins} Minutos</div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  function renderMotivation() {
    const quote = getDailyQuote();
    const banner = document.getElementById('motivation-banner');
    const playBtn = document.getElementById('mb-play-btn');
    banner.querySelector('.mb-emoji').textContent = '🎉';
    banner.querySelector('.mb-text').innerHTML = `
      <strong>${quote.text}</strong>
      <span>${quote.author}</span>
    `;
  }

  // ══════════════════════════════════════
  //  WORKOUTS TAB
  // ══════════════════════════════════════
  function renderWorkoutsTab() {
    const container = document.getElementById('workouts-tab-grid');
    const restContainer = document.getElementById('rest-day-container');
    let html = '';
    restContainer.innerHTML = '';

    for (let dayId = 1; dayId <= 6; dayId++) {
      const day = EXERCISE_DB[dayId];
      if (!day) continue;
      const exCount = day.exercises.length;
      const mins = getEstimatedMinutes(dayId);
      const done = isDayFullyCompleted(dayId);
      const completedCount = day.exercises.filter(ex => state.completedExercises[ex.id]).length;
      const bgColor = CARD_BG_COLORS[dayId - 1];

      html += `
        <div class="workout-list-card" onclick="App.openWorkout(${dayId})">
          <div class="wlc-icon" style="background:${bgColor}20">
            <span>${day.icon}</span>
          </div>
          <div class="wlc-info">
            <div class="wlc-name">${day.dayName}</div>
            <div class="wlc-day">${day.dayLabel}</div>
            <div class="wlc-meta">${exCount} exercicios · ${mins} min · ${done ? '✓ Completo' : `${completedCount}/${exCount}`}</div>
          </div>
          <span class="wlc-chevron">&#8250;</span>
        </div>
      `;
    }

    container.innerHTML = html;

    if (new Date().getDay() === 0) {
      restContainer.innerHTML = `
        <div class="rest-day-card">
          <div class="rdc-emoji">😴</div>
          <h2>Dia de Descanso</h2>
          <p>Hoje e domingo! Descanse, alongue-se e hidrate-se.<br>Voce merece!</p>
        </div>
      `;
    }
  }

  // ══════════════════════════════════════
  //  WORKOUT DETAIL SCREEN
  // ══════════════════════════════════════
  function openWorkout(dayId) {
    currentDayId = dayId;
    const day = EXERCISE_DB[dayId];
    if (!day) return;

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-workout-detail').classList.add('active');
    document.querySelector('.bottom-nav').style.display = 'none';
    window.scrollTo(0, 0);

    const bgColor = CARD_BG_COLORS[dayId - 1];
    const exCount = day.exercises.length;
    const mins = getEstimatedMinutes(dayId);

    let exerciseListHtml = '';
    day.exercises.forEach((ex, idx) => {
      const done = !!state.completedExercises[ex.id];
      const repsText = ex.isometric ? ex.reps : `${ex.sets}x${ex.reps}`;
      exerciseListHtml += `
        <div class="exercise-row" onclick="App.openExercise(${dayId}, '${ex.id}')">
          <div class="er-icon ${done ? 'done' : ''}">
            ${done ? '✓' : ex.muscleEmoji}
          </div>
          <div class="er-info">
            <div class="er-name">${ex.name}</div>
            <div class="er-sub">${repsText} · ${ex.muscleGroup}</div>
          </div>
          <span class="er-chevron">&#8250;</span>
        </div>
      `;
    });

    const content = document.getElementById('workout-detail-content');
    content.innerHTML = `
      <div class="workout-hero-container" style="background:${bgColor}">
        <div class="workout-hero-placeholder">${day.icon}</div>
        <div class="workout-hero-gradient">
          <button class="btn-back" onclick="App.backToTab()">&#8249;</button>
        </div>
      </div>
      <div class="workout-detail-header">
        <h1>${day.dayName}</h1>
        <div class="workout-tags">
          <span class="workout-tag">⏱️ ${mins} min</span>
          <span class="workout-tag">🏋️ ${exCount} exercicios</span>
          <span class="workout-tag">📅 ${day.dayLabel}</span>
        </div>
      </div>
      <div class="exercise-list">
        ${exerciseListHtml}
      </div>
    `;

    document.getElementById('btn-start-workout').style.display = '';
  }

  function startFirstExercise() {
    const day = EXERCISE_DB[currentDayId];
    if (!day || !day.exercises.length) return;

    // Record workout start time
    workoutStartTime = Date.now();

    const next = day.exercises.find(ex => !state.completedExercises[ex.id]) || day.exercises[0];
    openExercise(currentDayId, next.id);
  }

  function backToTab() {
    document.getElementById('btn-start-workout').style.display = 'none';
    stopTimer();
    switchTab(currentTab);
  }

  // ══════════════════════════════════════
  //  EXERCISE DETAIL SCREEN
  // ══════════════════════════════════════
  function openExercise(dayId, exId) {
    currentDayId = dayId;
    const day = EXERCISE_DB[dayId];
    if (!day) return;
    const ex = day.exercises.find(e => e.id === exId);
    if (!ex) return;
    currentExercise = ex;

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-exercise-detail').classList.add('active');
    document.getElementById('btn-start-workout').style.display = 'none';
    document.querySelector('.bottom-nav').style.display = 'none';
    window.scrollTo(0, 0);

    const done = !!state.completedExercises[ex.id];
    const savedWeight = state.completedExercises[ex.id]?.weight || '';
    const repsText = ex.isometric ? ex.reps : `${ex.sets} series x ${ex.reps} reps`;

    let timerHtml = '';
    if (ex.isometric && ex.duration) {
      timerHtml = `
        <div class="timer-section">
          <label>Cronometro Isometrico</label>
          <div class="timer-display" id="timer-display">${ex.duration}</div>
          <div class="timer-controls">
            <button class="timer-btn primary" id="timer-start-btn" onclick="App.toggleTimer(${ex.duration})">Iniciar</button>
            <button class="timer-btn secondary" onclick="App.resetTimer(${ex.duration})">Resetar</button>
          </div>
        </div>
      `;
    }

    const content = document.getElementById('exercise-detail-content');
    content.innerHTML = `
      <div class="video-container">
        <div class="video-back-btn">
          <button class="btn-back" onclick="App.backToWorkout()">&#8249;</button>
        </div>
        <iframe
          src="https://www.youtube.com/embed/${ex.youtubeId}?rel=0&modestbranding=1"
          title="${ex.name}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="exercise-detail-content">
        <h1>${ex.name}</h1>
        <p class="ed-muscle">${ex.muscleEmoji} ${ex.muscleGroup} · ${ex.equipment}</p>
        <div class="ed-sets-reps">
          <span class="ed-tag">📋 ${repsText}</span>
          ${ex.equipment ? `<span class="ed-tag">🎒 ${ex.equipment}</span>` : ''}
        </div>

        <div class="info-section">
          <div class="info-card">
            <div class="info-title">🎯 Posicao Inicial</div>
            <div class="info-body">${ex.startPosition}</div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-card">
            <div class="info-title">▶️ Execucao</div>
            <div class="info-body">${ex.execution}</div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-card">
            <div class="info-title">🌬️ Respiracao</div>
            <div class="info-body">${ex.breathing}</div>
          </div>
        </div>

        <div class="caution-box">
          <div class="caution-title">⚠️ Cuidados (Artrose)</div>
          <div class="caution-body">${ex.caution}</div>
        </div>

        ${timerHtml}

        <div class="weight-section">
          <label>Peso utilizado</label>
          <div class="weight-input-row">
            <input type="number" id="exercise-weight" min="0" max="50" step="0.5" placeholder="0" value="${savedWeight}">
            <span>kg</span>
          </div>
        </div>

        <button class="btn-complete ${done ? 'completed' : ''}" id="btn-complete-exercise" onclick="App.completeExercise('${ex.id}')">
          ${done ? '✓ Concluido' : 'Concluir ✓'}
        </button>
      </div>
    `;
  }

  function backToWorkout() {
    stopTimer();
    if (currentDayId) {
      openWorkout(currentDayId);
    } else {
      switchTab('home');
    }
  }

  function completeExercise(exId) {
    const weightInput = document.getElementById('exercise-weight');
    const weight = weightInput ? parseFloat(weightInput.value) || 0 : 0;
    const wasAlreadyDone = !!state.completedExercises[exId];
    const exerciseEndTime = Date.now();

    state.completedExercises[exId] = {
      date: today(),
      weight: weight,
      endTime: exerciseEndTime
    };

    // Track estimated minutes
    if (!wasAlreadyDone && currentExercise) {
      let addedMins = 2;
      if (currentExercise.isometric && currentExercise.duration) {
        addedMins = Math.ceil((currentExercise.duration * (currentExercise.sets || 3)) / 60) + 1;
      }
      state.totalMinutes = (state.totalMinutes || 0) + addedMins;
    }

    // Check if day is fully complete
    if (currentDayId) {
      const day = EXERCISE_DB[currentDayId];
      if (day && day.exercises.every(ex => state.completedExercises[ex.id])) {
        // Record completed day
        const d = today();
        if (!state.completedDays[d]) state.completedDays[d] = [];
        if (!state.completedDays[d].includes(currentDayId)) {
          state.completedDays[d].push(currentDayId);
        }

        // Save workout session time
        const sessionKey = `${d}-d${currentDayId}`;
        const startT = workoutStartTime || exerciseEndTime;
        const durationMin = Math.round((exerciseEndTime - startT) / 60000);
        state.workoutSessions = state.workoutSessions || {};
        state.workoutSessions[sessionKey] = {
          startTime: startT,
          endTime: exerciseEndTime,
          durationMin: durationMin
        };

        saveState();
        fireConfetti();
        playPostWorkoutAudio();

        // Build time summary
        const startStr = formatTimeSP(startT);
        const endStr = formatTimeSP(exerciseEndTime);
        const realMins = durationMin > 0 ? durationMin : 1;
        showToast(`Treino completo! ${realMins} min (${startStr} — ${endStr}) 🎉`);

        workoutStartTime = null;

        setTimeout(() => {
          backToWorkout();
        }, 2500);
        return;
      }
    }

    saveState();

    const btn = document.getElementById('btn-complete-exercise');
    if (btn) {
      btn.classList.add('completed');
      btn.textContent = '✓ Concluido';
    }

    showToast('Exercicio concluido! ✓');

    // Auto-advance to next exercise
    if (currentDayId) {
      const day = EXERCISE_DB[currentDayId];
      if (day) {
        const nextEx = day.exercises.find(ex => !state.completedExercises[ex.id]);
        if (nextEx) {
          setTimeout(() => {
            openExercise(currentDayId, nextEx.id);
          }, 1200);
        }
      }
    }
  }

  // ── Timer ──
  function toggleTimer(duration) {
    const btn = document.getElementById('timer-start-btn');
    if (timerInterval) {
      stopTimer();
      btn.textContent = 'Continuar';
    } else {
      if (timerRemaining <= 0) timerRemaining = duration;
      btn.textContent = 'Pausar';
      timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();
        if (timerRemaining <= 0) {
          stopTimer();
          btn.textContent = 'Iniciar';
          showToast('Tempo esgotado! ⏱️');
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      }, 1000);
    }
  }

  function resetTimer(duration) {
    stopTimer();
    timerRemaining = duration;
    updateTimerDisplay();
    const btn = document.getElementById('timer-start-btn');
    if (btn) btn.textContent = 'Iniciar';
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = timerRemaining;
  }

  // ══════════════════════════════════════
  //  HEALTH SCREEN + PAIN TIPS
  // ══════════════════════════════════════
  function renderHealth() {
    const todayData = state.healthLog[today()] || {};

    if (todayData.sleep) document.getElementById('health-sleep').value = todayData.sleep;
    if (todayData.quality) document.getElementById('health-sleep-quality').value = todayData.quality;
    if (todayData.weight) document.getElementById('health-weight').value = todayData.weight;
    if (todayData.steps) document.getElementById('health-steps').value = todayData.steps;
    if (todayData.pain) document.getElementById('health-pain').value = todayData.pain;
    if (todayData.mood) selectMood(todayData.mood);

    // Restore pain regions
    selectedPainRegions = todayData.painRegions || [];
    updatePainRegionButtons();

    renderWeightChart();
  }

  function selectMood(mood) {
    selectedMood = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mood === mood);
    });
  }

  function togglePainRegion(region) {
    const idx = selectedPainRegions.indexOf(region);
    if (idx >= 0) {
      selectedPainRegions.splice(idx, 1);
    } else {
      selectedPainRegions.push(region);
    }
    updatePainRegionButtons();
    showPainTips();
  }

  function updatePainRegionButtons() {
    document.querySelectorAll('.pain-region-btn').forEach(btn => {
      btn.classList.toggle('active', selectedPainRegions.includes(btn.dataset.region));
    });
  }

  function showPainTips() {
    const container = document.getElementById('pain-tips-container');
    if (!container) return;

    if (selectedPainRegions.length === 0) {
      container.innerHTML = '';
      return;
    }

    let tips = [];
    selectedPainRegions.forEach(region => {
      const regionTips = PAIN_TIPS[region] || [];
      // Pick 2-3 random tips from this region
      const shuffled = regionTips.sort(() => 0.5 - Math.random());
      tips.push(...shuffled.slice(0, region === 'geral' ? 2 : 3));
    });

    // Add 1 from geral if geral not already selected
    if (!selectedPainRegions.includes('geral') && PAIN_TIPS.geral) {
      const geralTips = PAIN_TIPS.geral.sort(() => 0.5 - Math.random());
      tips.push(geralTips[0]);
    }

    let html = '<div class="pain-tips-card"><h4>💡 Dicas para aliviar a dor</h4><ul>';
    tips.forEach(tip => {
      html += `<li>${tip}</li>`;
    });
    html += '</ul></div>';
    container.innerHTML = html;
  }

  function saveHealth() {
    const d = today();
    state.healthLog[d] = {
      sleep: parseFloat(document.getElementById('health-sleep').value) || null,
      quality: document.getElementById('health-sleep-quality').value || null,
      weight: parseFloat(document.getElementById('health-weight').value) || null,
      steps: parseInt(document.getElementById('health-steps').value) || null,
      pain: document.getElementById('health-pain').value || null,
      painRegions: selectedPainRegions.length > 0 ? [...selectedPainRegions] : null,
      mood: selectedMood || null,
    };
    saveState();
    showToast('Registro salvo! ❤️');
    renderWeightChart();

    // Show pain tips if pain regions selected
    if (selectedPainRegions.length > 0) {
      showPainTips();
    }
  }

  function renderWeightChart() {
    const ctx = document.getElementById('weight-chart');
    if (!ctx) return;

    const entries = Object.entries(state.healthLog)
      .filter(([_, v]) => v.weight)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);

    const labels = entries.map(([d]) => {
      const parts = d.split('-');
      return `${parts[2]}/${parts[1]}`;
    });
    const data = entries.map(([_, v]) => v.weight);

    if (weightChart) weightChart.destroy();

    if (data.length === 0) {
      ctx.style.display = 'none';
      return;
    }
    ctx.style.display = '';

    weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Peso (kg)',
          data,
          borderColor: '#6358E1',
          backgroundColor: 'rgba(99,88,225,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6358E1',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { grid: { color: '#F2F2F5' }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  // ══════════════════════════════════════
  //  PROGRESS SCREEN
  // ══════════════════════════════════════
  function renderProgress() {
    renderCalendar();
    renderProgressStats();
    renderMedals();
  }

  function changeMonth(delta) {
    calendarMonth += delta;
    if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
    renderCalendar();
  }

  function renderCalendar() {
    document.getElementById('calendar-month-label').textContent =
      `${MONTH_NAMES[calendarMonth]} ${calendarYear}`;

    const grid = document.getElementById('calendar-grid');
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const todayDate = today();

    let html = '';
    DAY_NAMES_SHORT.forEach(d => {
      html += `<div class="cal-day-name">${d}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayDate;
      const dayComps = state.completedDays[dateStr] || [];

      let cls = 'cal-day';
      if (isToday) cls += ' today';
      if (dayComps.length >= 1) cls += ' done';

      html += `<div class="${cls}">${d}</div>`;
    }

    grid.innerHTML = html;
  }

  function renderProgressStats() {
    const totalWorkouts = getTotalCompleted();
    const totalExercises = Object.keys(state.completedExercises).length;
    const streak = calculateStreak();
    const totalMins = state.totalMinutes || 0;

    document.getElementById('progress-stats').innerHTML = `
      <div class="progress-stat-card">
        <div class="psc-number">${totalWorkouts}</div>
        <div class="psc-label">Treinos Completos</div>
      </div>
      <div class="progress-stat-card">
        <div class="psc-number">${totalExercises}</div>
        <div class="psc-label">Exercicios Feitos</div>
      </div>
      <div class="progress-stat-card">
        <div class="psc-number">${streak}</div>
        <div class="psc-label">Dias Seguidos</div>
      </div>
      <div class="progress-stat-card">
        <div class="psc-number">${totalMins}</div>
        <div class="psc-label">Minutos Totais</div>
      </div>
    `;
  }

  function calculateStreak() {
    let streak = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay();

      if (dayOfWeek === 0) {
        d.setDate(d.getDate() - 1);
        if (streak > 0) continue;
        else break;
      }

      if (state.completedDays[dateStr] && state.completedDays[dateStr].length > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        if (streak === 0 && dateStr === today()) {
          d.setDate(d.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  }

  function renderMedals() {
    const totalWorkouts = getTotalCompleted();
    const streak = calculateStreak();
    const allSixDone = [1,2,3,4,5,6].every(id => isDayFullyCompleted(id));

    const grid = document.getElementById('medals-grid');
    let html = '';

    MEDALS.forEach(m => {
      let unlocked = false;
      if (typeof m.threshold === 'number') {
        unlocked = totalWorkouts >= m.threshold;
      } else if (m.threshold === 'streak3') {
        unlocked = streak >= 3;
      } else if (m.threshold === 'streak7') {
        unlocked = streak >= 7;
      } else if (m.threshold === 'alldays') {
        unlocked = allSixDone;
      }

      html += `
        <div class="medal-card ${unlocked ? '' : 'locked'}">
          <div class="medal-emoji">${m.emoji}</div>
          <div class="medal-name">${m.name}</div>
          <div class="medal-desc">${m.desc}</div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  // ══════════════════════════════════════
  //  WALKING / GPS TRACKER
  // ══════════════════════════════════════
  function loadWalks() {
    try {
      const raw = localStorage.getItem(LS_WALKS);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function saveWalks(walks) {
    localStorage.setItem(LS_WALKS, JSON.stringify(walks));
  }

  function renderWalking() {
    renderWalkHistory();
    if (!walkActive) {
      document.getElementById('walking-live-stats').style.display = 'none';
      document.getElementById('walk-running-btns').style.display = 'none';
      document.getElementById('btn-walk-start').style.display = '';
      document.getElementById('walk-map').style.display = 'none';
      document.getElementById('walk-summary').style.display = 'none';
    }
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function startWalk() {
    if (!navigator.geolocation) {
      showToast('GPS nao disponivel neste dispositivo');
      return;
    }

    walkActive = true;
    walkPaused = false;
    walkStartTime = Date.now();
    walkPausedDuration = 0;
    walkPoints = [];
    walkTotalDistance = 0;
    walkTotalElevationGain = 0;
    walkLastAltitude = null;
    walkCurrentSpeed = 0;

    document.getElementById('btn-walk-start').style.display = 'none';
    document.getElementById('walk-running-btns').style.display = 'flex';
    document.getElementById('walking-live-stats').style.display = '';
    document.getElementById('walk-summary').style.display = 'none';
    document.getElementById('walk-map').style.display = 'none';

    const pauseBtn = document.getElementById('btn-walk-pause');
    pauseBtn.textContent = 'Pausar';

    // Start GPS tracking
    walkWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (walkPaused) return;
        const pt = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          alt: pos.coords.altitude,
          timestamp: Date.now()
        };
        if (walkPoints.length > 0) {
          const last = walkPoints[walkPoints.length - 1];
          const dist = haversineDistance(last.lat, last.lng, pt.lat, pt.lng);
          // Filter out GPS noise (< 2m jumps are noise)
          if (dist > 0.002) {
            walkTotalDistance += dist;
            walkPoints.push(pt);
          }
        } else {
          walkPoints.push(pt);
        }

        // Elevation gain (only positive climbs, filter noise < 1m)
        if (pos.coords.altitude != null) {
          if (walkLastAltitude != null) {
            const diff = pos.coords.altitude - walkLastAltitude;
            if (diff > 1) walkTotalElevationGain += diff;
          }
          walkLastAltitude = pos.coords.altitude;
        }

        // Speed: prefer native speed (m/s → km/h), else derive from last 10s of points
        if (pos.coords.speed != null && pos.coords.speed >= 0) {
          walkCurrentSpeed = pos.coords.speed * 3.6;
        } else if (walkPoints.length >= 2) {
          const recent = walkPoints.slice(-5);
          const dt = (recent[recent.length - 1].timestamp - recent[0].timestamp) / 1000;
          let dd = 0;
          for (let i = 1; i < recent.length; i++) {
            dd += haversineDistance(recent[i-1].lat, recent[i-1].lng, recent[i].lat, recent[i].lng);
          }
          walkCurrentSpeed = dt > 0 ? (dd / (dt / 3600)) : 0;
        }

        updateWalkStats();
      },
      (err) => {
        showToast('Erro no GPS: ' + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    // Timer update
    walkTimerInterval = setInterval(updateWalkStats, 1000);
  }

  function updateWalkStats() {
    if (!walkActive) return;

    const elapsed = walkPaused
      ? (walkPauseStart - walkStartTime - walkPausedDuration)
      : (Date.now() - walkStartTime - walkPausedDuration);
    const totalSec = Math.floor(elapsed / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;

    document.getElementById('walk-time').textContent =
      `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

    document.getElementById('walk-distance').textContent = walkTotalDistance.toFixed(2);

    // Pace (min/km)
    if (walkTotalDistance > 0.01 && totalSec > 0) {
      const paceMinPerKm = (totalSec / 60) / walkTotalDistance;
      const pm = Math.floor(paceMinPerKm);
      const ps = Math.round((paceMinPerKm - pm) * 60);
      document.getElementById('walk-pace').textContent = `${pm}:${String(ps).padStart(2,'0')}`;
    } else {
      document.getElementById('walk-pace').textContent = '--';
    }

    const speedEl = document.getElementById('walk-speed');
    if (speedEl) speedEl.textContent = walkCurrentSpeed.toFixed(1);
    const elevEl = document.getElementById('walk-elevation');
    if (elevEl) elevEl.textContent = Math.round(walkTotalElevationGain);
  }

  function pauseWalk() {
    if (!walkActive) return;
    const pauseBtn = document.getElementById('btn-walk-pause');

    if (walkPaused) {
      // Resume
      walkPausedDuration += Date.now() - walkPauseStart;
      walkPaused = false;
      walkPauseStart = null;
      pauseBtn.textContent = 'Pausar';
    } else {
      // Pause
      walkPaused = true;
      walkPauseStart = Date.now();
      pauseBtn.textContent = 'Continuar';
    }
  }

  function stopWalk() {
    if (!walkActive) return;

    walkActive = false;
    if (walkPaused) {
      walkPausedDuration += Date.now() - walkPauseStart;
    }
    walkPaused = false;

    // Stop GPS
    if (walkWatchId !== null) {
      navigator.geolocation.clearWatch(walkWatchId);
      walkWatchId = null;
    }
    if (walkTimerInterval) {
      clearInterval(walkTimerInterval);
      walkTimerInterval = null;
    }

    const elapsed = Date.now() - walkStartTime - walkPausedDuration;
    const totalSec = Math.floor(elapsed / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;

    // Hide running controls
    document.getElementById('walk-running-btns').style.display = 'none';
    document.getElementById('btn-walk-start').style.display = '';

    // Avg speed (km/h) over total time
    const avgSpeedKmh = totalSec > 0 ? (walkTotalDistance / (totalSec / 3600)) : 0;

    // Save walk
    const walkData = {
      date: today(),
      startTime: walkStartTime,
      endTime: Date.now(),
      durationSec: totalSec,
      distanceKm: walkTotalDistance,
      avgSpeedKmh: avgSpeedKmh,
      elevationGainM: Math.round(walkTotalElevationGain),
      points: walkPoints.length > 500 ? walkPoints.filter((_, i) => i % Math.ceil(walkPoints.length / 500) === 0) : walkPoints,
    };

    const walks = loadWalks();
    walks.unshift(walkData);
    if (walks.length > 10) walks.length = 10;
    saveWalks(walks);

    // Show summary
    const paceStr = walkTotalDistance > 0.01
      ? (() => {
          const p = (totalSec / 60) / walkTotalDistance;
          return `${Math.floor(p)}:${String(Math.round((p - Math.floor(p)) * 60)).padStart(2,'0')} min/km`;
        })()
      : '--';

    document.getElementById('walk-summary').style.display = '';
    document.getElementById('walk-summary').innerHTML = `
      <div class="walk-summary-card">
        <h3>Caminhada concluida!</h3>
        <div class="ws-row">
          <div class="ws-stat"><span class="ws-num">${walkTotalDistance.toFixed(2)}</span><span class="ws-unit">km</span></div>
          <div class="ws-stat"><span class="ws-num">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</span><span class="ws-unit">tempo</span></div>
          <div class="ws-stat"><span class="ws-num">${paceStr}</span><span class="ws-unit">ritmo</span></div>
        </div>
        <div class="ws-row" style="margin-top:12px">
          <div class="ws-stat"><span class="ws-num">${avgSpeedKmh.toFixed(1)}</span><span class="ws-unit">km/h medio</span></div>
          <div class="ws-stat"><span class="ws-num">${Math.round(walkTotalElevationGain)}</span><span class="ws-unit">m ganho</span></div>
        </div>
      </div>
    `;

    // Show map if we have points
    if (walkPoints.length >= 2) {
      showWalkMap(walkPoints);
    }

    showToast('Caminhada salva! 🚶‍♀️');
    renderWalkHistory();
  }

  function showWalkMap(points) {
    const mapEl = document.getElementById('walk-map');
    mapEl.style.display = '';

    if (walkMap) {
      walkMap.remove();
      walkMap = null;
    }

    walkMap = L.map('walk-map').setView([points[0].lat, points[0].lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(walkMap);

    const latlngs = points.map(p => [p.lat, p.lng]);
    const polyline = L.polyline(latlngs, { color: '#6358E1', weight: 4 }).addTo(walkMap);
    walkMap.fitBounds(polyline.getBounds(), { padding: [20, 20] });

    // Start/end markers
    L.circleMarker(latlngs[0], { radius: 8, color: '#66BB6A', fillColor: '#66BB6A', fillOpacity: 1 }).addTo(walkMap);
    L.circleMarker(latlngs[latlngs.length - 1], { radius: 8, color: '#F25252', fillColor: '#F25252', fillOpacity: 1 }).addTo(walkMap);

    // Force map to re-render
    setTimeout(() => walkMap.invalidateSize(), 100);
  }

  function renderWalkHistory() {
    const listEl = document.getElementById('walk-history-list');
    if (!listEl) return;
    const walks = loadWalks();

    if (walks.length === 0) {
      listEl.innerHTML = '<p class="walk-empty">Nenhuma caminhada registrada ainda.</p>';
      return;
    }

    let html = '';
    walks.forEach((w, idx) => {
      const mins = Math.floor(w.durationSec / 60);
      const secs = w.durationSec % 60;
      const dateParts = w.date.split('-');
      const dateStr = `${dateParts[2]}/${dateParts[1]}`;

      const speedPart = w.avgSpeedKmh ? ` · ${w.avgSpeedKmh.toFixed(1)} km/h` : '';
      const elevPart = w.elevationGainM ? ` · ↑${w.elevationGainM}m` : '';
      html += `
        <div class="walk-history-item" onclick="App.showWalkOnMap(${idx})">
          <div class="whi-icon">🚶‍♀️</div>
          <div class="whi-info">
            <div class="whi-date">${dateStr}</div>
            <div class="whi-meta">${w.distanceKm.toFixed(2)} km · ${mins}min${secs > 0 ? secs + 's' : ''}${speedPart}${elevPart}</div>
          </div>
          <span class="whi-chevron">&#8250;</span>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  function showWalkOnMap(idx) {
    const walks = loadWalks();
    const w = walks[idx];
    if (!w || !w.points || w.points.length < 2) {
      showToast('Sem dados de rota para esta caminhada');
      return;
    }
    showWalkMap(w.points);
    // Scroll to map
    document.getElementById('walk-map').scrollIntoView({ behavior: 'smooth' });
  }

  // ══════════════════════════════════════
  //  SETTINGS SCREEN
  // ══════════════════════════════════════
  function renderSettings() {
    const reminderCheckbox = document.getElementById('setting-reminder');
    const reminderTimeItem = document.getElementById('reminder-time-item');
    const reminderTimeInput = document.getElementById('setting-reminder-time');

    if (state.settings.reminder) {
      reminderCheckbox.checked = true;
      reminderTimeItem.style.display = '';
    } else {
      reminderCheckbox.checked = false;
      reminderTimeItem.style.display = 'none';
    }
    reminderTimeInput.value = state.settings.reminderTime || '08:00';
  }

  function toggleReminder() {
    state.settings.reminder = document.getElementById('setting-reminder').checked;
    saveState();
    renderSettings();

    if (state.settings.reminder) {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm !== 'granted') {
            showToast('Ative as notificacoes nas configuracoes do navegador');
          }
        });
      } else {
        showToast('Este navegador nao suporta notificacoes');
      }
    }
    showToast(state.settings.reminder ? 'Lembrete ativado! 🔔' : 'Lembrete desativado');
  }

  function saveReminderTime() {
    state.settings.reminderTime = document.getElementById('setting-reminder-time').value;
    state.settings.lastReminderDate = null; // reset pra permitir disparar no novo horario hoje
    saveState();
  }

  // Reminder scheduler: checa a cada 30s se eh hora de disparar
  function checkReminderDue() {
    if (!state.settings.reminder) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const [h, m] = (state.settings.reminderTime || '08:00').split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);

    // Janela de 2min para tolerar intervalo de check
    const diffMin = (now - target) / 60000;
    if (diffMin < 0 || diffMin > 2) return;

    const todayStr = now.toISOString().slice(0, 10);
    if (state.settings.lastReminderDate === todayStr) return;

    state.settings.lastReminderDate = todayStr;
    saveState();
    fireReminderNotification();
  }

  function fireReminderNotification() {
    const title = 'Treino da Simone 💜';
    const options = {
      body: 'Hora de se cuidar, Mamusca! Seu treino ta esperando.',
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'treino-reminder',
      renotify: true
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, options)).catch(() => {
        try { new Notification(title, options); } catch(e) {}
      });
    } else {
      try { new Notification(title, options); } catch(e) {}
    }
  }

  function showAbout() {
    showToast('Feito com ❤️ para Simone Trombini');
  }

  function resetData() {
    if (confirm('Tem certeza que deseja apagar todos os dados? Essa acao nao pode ser desfeita.')) {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(LS_WALKS);
      localStorage.removeItem(LS_ONBOARDING);
      state = getDefaultState();
      saveState();
      switchTab('home');
      showToast('Dados resetados');
    }
  }

  // ══════════════════════════════════════
  //  EXPORT / IMPORT
  // ══════════════════════════════════════
  function exportData() {
    const allData = {
      treino: state,
      walks: loadWalks(),
      onboarding: localStorage.getItem(LS_ONBOARDING),
      exportDate: new Date().toISOString(),
      version: '3.0'
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const filename = `treino-simone-backup-${today()}.json`;

    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'application/json' });
      const shareData = { files: [file], title: 'Backup Treino Simone' };
      if (navigator.canShare(shareData)) {
        navigator.share(shareData).catch(() => downloadBlob(blob, filename));
        return;
      }
    }

    downloadBlob(blob, filename);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado! 📤');
  }

  function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);

        if (data.treino) {
          state = { ...getDefaultState(), ...data.treino };
          saveState();
        }
        if (data.walks) {
          saveWalks(data.walks);
        }
        if (data.onboarding) {
          localStorage.setItem(LS_ONBOARDING, data.onboarding);
        }

        showToast('Dados importados com sucesso! 📥');
        switchTab('home');
      } catch(err) {
        showToast('Erro ao importar: arquivo invalido');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  }

  // ══════════════════════════════════════
  //  SERVICE WORKER
  // ══════════════════════════════════════
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  // ══════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════
  function init() {
    registerSW();

    // Reminder scheduler: checa a cada 30s + uma vez imediato
    checkReminderDue();
    setInterval(checkReminderDue, 30000);
    // Quando a PWA volta pro foreground, checa de novo
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkReminderDue();
    });

    // Check onboarding first
    if (checkOnboarding()) return;

    switchTab('home');
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    switchTab,
    openWorkout,
    openExercise,
    startFirstExercise,
    backToTab,
    backToWorkout,
    completeExercise,
    toggleTimer,
    resetTimer,
    selectMood,
    saveHealth,
    changeMonth,
    toggleReminder,
    saveReminderTime,
    showAbout,
    resetData,
    playOnboardingAudio,
    finishOnboarding,
    playMotivationalAudio,
    togglePainRegion,
    startWalk,
    pauseWalk,
    stopWalk,
    showWalkOnMap,
    exportData,
    importData,
  };

})();
