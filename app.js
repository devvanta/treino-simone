// app.js — Treino da Simone v2.0 — perpetio/fitness style PWA
// All state persisted in localStorage

const App = (function() {
  'use strict';

  // ── Constants ──
  const LS_KEY = 'treino_simone_v2';
  const MONTH_NAMES = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const DAY_NAMES_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];

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

  // ── State management ──
  function getDefaultState() {
    return {
      completedExercises: {},   // { 'd1e1': { date, weight } }
      completedDays: {},        // { '2026-04-15': [1,3] } — day IDs done that date
      healthLog: {},            // { '2026-04-15': { sleep, quality, weight, steps, pain, mood } }
      settings: { reminder: false, reminderTime: '08:00' },
      totalMinutes: 0,
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

  function getTotalCompleted() {
    const doneDays = new Set();
    Object.entries(state.completedDays).forEach(([date, dayIds]) => {
      dayIds.forEach(id => doneDays.add(`${date}-${id}`));
    });
    return doneDays.size;
  }

  function getInProgressCount() {
    const todayDate = today();
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
    return Math.round(mins + 2); // +2 for rest
  }

  function getRandomQuote() {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
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
    if (tab === 'home') renderHome();
    else if (tab === 'workouts') renderWorkoutsTab();
    else if (tab === 'health') renderHealth();
    else if (tab === 'progress') renderProgress();
    else if (tab === 'settings') renderSettings();
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

    // Workout scroll cards
    renderWorkoutScroll();

    // Motivation
    renderMotivation();
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
    const quote = getRandomQuote();
    const banner = document.getElementById('motivation-banner');
    banner.innerHTML = `
      <div class="mb-emoji">🎉</div>
      <div class="mb-text">
        <strong>${quote.text}</strong>
        <span>${quote.author}</span>
      </div>
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

    // Show Sunday rest card if it's Sunday
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

    // Hide all screens, show workout detail
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-workout-detail').classList.add('active');
    document.querySelector('.bottom-nav').style.display = 'none';
    window.scrollTo(0, 0);

    const colorClass = CARD_COLORS[dayId - 1];
    const bgColor = CARD_BG_COLORS[dayId - 1];
    const image = CARD_IMAGES[dayId - 1];
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

    // Show/hide start button
    document.getElementById('btn-start-workout').style.display = '';
  }

  function startFirstExercise() {
    const day = EXERCISE_DB[currentDayId];
    if (!day || !day.exercises.length) return;
    // Find first incomplete exercise
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

    state.completedExercises[exId] = {
      date: today(),
      weight: weight
    };

    // Track estimated minutes
    if (!wasAlreadyDone && currentExercise) {
      let addedMins = 2; // rough estimate per exercise
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

        saveState();
        fireConfetti();
        showToast('Treino completo! Parabens, Simone! 🎉');

        setTimeout(() => {
          backToWorkout();
        }, 1500);
        return;
      }
    }

    saveState();

    // Update button
    const btn = document.getElementById('btn-complete-exercise');
    if (btn) {
      btn.classList.add('completed');
      btn.textContent = '✓ Concluido';
    }

    showToast('Exercicio concluido! ✓');

    // Auto-advance to next exercise after a moment
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
          // Vibrate if available
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
  //  HEALTH SCREEN
  // ══════════════════════════════════════
  function renderHealth() {
    const todayData = state.healthLog[today()] || {};

    // Pre-fill values
    if (todayData.sleep) document.getElementById('health-sleep').value = todayData.sleep;
    if (todayData.quality) document.getElementById('health-sleep-quality').value = todayData.quality;
    if (todayData.weight) document.getElementById('health-weight').value = todayData.weight;
    if (todayData.steps) document.getElementById('health-steps').value = todayData.steps;
    if (todayData.pain) document.getElementById('health-pain').value = todayData.pain;
    if (todayData.mood) selectMood(todayData.mood);

    renderWeightChart();
  }

  function selectMood(mood) {
    selectedMood = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mood === mood);
    });
  }

  function saveHealth() {
    const d = today();
    state.healthLog[d] = {
      sleep: parseFloat(document.getElementById('health-sleep').value) || null,
      quality: document.getElementById('health-sleep-quality').value || null,
      weight: parseFloat(document.getElementById('health-weight').value) || null,
      steps: parseInt(document.getElementById('health-steps').value) || null,
      pain: document.getElementById('health-pain').value || null,
      mood: selectedMood || null,
    };
    saveState();
    showToast('Registro salvo! ❤️');
    renderWeightChart();
  }

  function renderWeightChart() {
    const ctx = document.getElementById('weight-chart');
    if (!ctx) return;

    // Gather weight data (last 14 entries)
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
      // Empty state
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
    // Day names
    DAY_NAMES_SHORT.forEach(d => {
      html += `<div class="cal-day-name">${d}</div>`;
    });

    // Empty cells before first day
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
    // Check if today has a workout (if not Sunday)
    while (true) {
      const dateStr = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay();

      if (dayOfWeek === 0) {
        // Sunday counts as rest day in a streak
        d.setDate(d.getDate() - 1);
        if (streak > 0) continue; // keep counting back
        else break;
      }

      if (state.completedDays[dateStr] && state.completedDays[dateStr].length > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        // If it's today and no workout yet, check yesterday
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

    if (state.settings.reminder && 'Notification' in window) {
      Notification.requestPermission();
    }
    showToast(state.settings.reminder ? 'Lembrete ativado! 🔔' : 'Lembrete desativado');
  }

  function saveReminderTime() {
    state.settings.reminderTime = document.getElementById('setting-reminder-time').value;
    saveState();
  }

  function showAbout() {
    showToast('Feito com ❤️ para Simone Trombini');
  }

  function resetData() {
    if (confirm('Tem certeza que deseja apagar todos os dados? Essa acao nao pode ser desfeita.')) {
      localStorage.removeItem(LS_KEY);
      state = getDefaultState();
      saveState();
      switchTab('home');
      showToast('Dados resetados');
    }
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
  };

})();
