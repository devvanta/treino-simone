// app.js — Treino da Simone - Main Application Logic
// All state persisted in localStorage

(function() {
  'use strict';

  // ── Constants ──
  const LS_KEY = 'treino_simone_data';
  const DAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  // ── State ──
  let state = loadState();

  function getDefaultState() {
    return {
      name: 'Simone',
      reminderTime: '07:00',
      remindersEnabled: false,
      workouts: {},      // { 'YYYY-MM-DD': { day: 1, exercises: { 'd1e1': { done: true, weight: '1L' }, ... }, completed: false } }
      health: {},         // { 'YYYY-MM-DD': { sleep: '', weight: '', steps: '', mood: '', notes: '' } }
      painDiary: {},      // { 'YYYY-MM-DD': { parts: [], level: 0, notes: '', mood: '' } }
      streak: 0,
      totalCompleted: 0,
      calendarMonth: new Date().getMonth(),
      calendarYear: new Date().getFullYear()
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...getDefaultState(), ...parsed };
      }
    } catch(e) { console.error('Load error', e); }
    return getDefaultState();
  }

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch(e) { console.error('Save error', e); }
  }

  // ── Utility ──
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function dayOfWeek() {
    return new Date().getDay(); // 0=Sun
  }

  function getTrainingDay() {
    const dow = dayOfWeek();
    return DAY_MAP[dow] || 0;
  }

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
    // Check from yesterday backwards (today might not be done yet)
    d.setDate(d.getDate() - 1);
    while(true) {
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dow = d.getDay();
      if (dow === 0) {
        // Sunday is rest — counts as streak continuation
        d.setDate(d.getDate() - 1);
        continue;
      }
      if (state.workouts[ds] && state.workouts[ds].completed) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    // Check if today is completed too
    const today = todayStr();
    if (state.workouts[today] && state.workouts[today].completed) {
      streak++;
    }
    return streak;
  }

  function countWeekCompleted() {
    const now = new Date();
    const dayIndex = now.getDay(); // 0=Sun
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - dayIndex + i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (state.workouts[ds] && state.workouts[ds].completed) count++;
    }
    return count;
  }

  function countTotalCompleted() {
    return Object.values(state.workouts).filter(w => w.completed).length;
  }

  // ── Tab Navigation ──
  function initTabs() {
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        $$('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        $(`#tab-${target}`).classList.add('active');
        // Refresh content when switching
        if (target === 'home') renderHome();
        if (target === 'workout') renderWorkout();
        if (target === 'health') renderHealth();
        if (target === 'progress') renderProgress();
        if (target === 'settings') renderSettings();
      });
    });
  }

  // ── HOME RENDER ──
  function renderHome() {
    const container = $('#home-content');
    const tDay = getTrainingDay();
    const quote = getDailyQuote();
    const streak = calculateStreak();
    const weekDone = countWeekCompleted();
    const today = todayStr();
    const todayWorkout = state.workouts[today];
    const todayCompleted = todayWorkout && todayWorkout.completed;

    // Build week dots
    const now = new Date();
    const dayIndex = now.getDay();
    let weekDotsHTML = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - dayIndex + i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dow = d.getDay();
      const isToday = ds === today;
      const isDone = state.workouts[ds] && state.workouts[ds].completed;
      const isRest = dow === 0;

      let dotClass = '';
      if (isToday && !isDone) dotClass = 'today';
      else if (isDone) dotClass = 'done';
      else if (isRest) dotClass = 'rest';

      const icon = isDone ? '✓' : (isRest ? '😴' : String(d.getDate()));

      weekDotsHTML += `
        <div class="week-dot">
          <div class="dot ${dotClass}">${icon}</div>
          <span class="day-abbr">${DAY_NAMES_SHORT[dow]}</span>
        </div>`;
    }

    // Today card
    let todayCardHTML;
    if (tDay === 0) {
      todayCardHTML = `
        <div class="rest-day-card">
          <div class="rest-icon">😴</div>
          <h2>Dia de Descanso!</h2>
          <p style="color:var(--text-light); margin-top:8px;">Seu corpo precisa recuperar. Aproveite para descansar, se alongar levemente e beber bastante água.</p>
        </div>`;
    } else {
      const dayData = EXERCISE_DB[tDay];
      todayCardHTML = `
        <div class="today-card" onclick="switchToWorkout()">
          <div class="day-icon">${dayData.icon}</div>
          <div class="day-name">${dayData.dayName}</div>
          <div class="day-label">${dayData.dayLabel} — ${dayData.exercises.length} exercícios</div>
          ${todayCompleted
            ? '<span class="badge badge-accent">✓ Completo!</span>'
            : '<button class="btn btn-primary" style="margin-top:12px">Iniciar Treino</button>'}
        </div>`;
    }

    container.innerHTML = `
      <div class="greeting">${getGreeting()}, ${state.name}! 👋</div>
      <p style="color:var(--text-light); margin-bottom:16px; font-size:0.9rem;">
        ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      <div class="quote-card">
        <div class="quote-text">"${quote.text}"</div>
        <div class="quote-author">— ${quote.author}</div>
      </div>

      ${todayCardHTML}

      <div class="weekly-progress card">
        <h3>📅 Semana</h3>
        <div class="week-dots">${weekDotsHTML}</div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar-fill" style="width: ${(weekDone/6)*100}%"></div>
        </div>
        <p style="text-align:center; margin-top:8px; font-size:0.85rem; color:var(--text-light);">${weekDone}/6 treinos esta semana</p>
      </div>

      <div class="card streak-card">
        <div class="streak-fire">${streak > 0 ? '🔥' : '💤'}</div>
        <div class="streak-info">
          <div class="streak-count">${streak}</div>
          <div class="streak-label">${streak === 1 ? 'dia seguido' : 'dias seguidos'}</div>
        </div>
      </div>
    `;
  }

  // Make switchToWorkout global
  window.switchToWorkout = function() {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-content').forEach(c => c.classList.remove('active'));
    $('[data-tab="workout"]').classList.add('active');
    $('#tab-workout').classList.add('active');
    renderWorkout();
  };

  // ── WORKOUT RENDER ──
  function renderWorkout() {
    const container = $('#workout-content');
    const tDay = getTrainingDay();
    const today = todayStr();

    if (tDay === 0) {
      container.innerHTML = `
        <div class="rest-day-card" style="margin-top:40px">
          <div class="rest-icon">🧘</div>
          <h2>Hoje é dia de descanso</h2>
          <p style="color:var(--text-light); margin-top:12px;">Aproveite para fazer um alongamento leve e relaxar. Você merece!</p>
        </div>`;
      return;
    }

    const dayData = EXERCISE_DB[tDay];
    if (!state.workouts[today]) {
      state.workouts[today] = {
        day: tDay,
        exercises: {},
        completed: false
      };
      saveState();
    }

    const workout = state.workouts[today];
    const exList = dayData.exercises;
    const doneCount = exList.filter(ex => workout.exercises[ex.id] && workout.exercises[ex.id].done).length;
    const allDone = doneCount === exList.length;

    let exercisesHTML = '';
    exList.forEach((ex, idx) => {
      const exState = workout.exercises[ex.id] || { done: false, weight: '' };
      const isDone = exState.done;
      const repsText = ex.isometric ? ex.reps : `${ex.sets}x${ex.reps}`;

      exercisesHTML += `
        <div class="exercise-card ${isDone ? 'done' : ''}" id="ex-${ex.id}">
          <div class="exercise-main">
            <div class="exercise-check ${isDone ? 'checked' : ''}" data-id="${ex.id}" onclick="toggleExercise('${ex.id}')">
              ${isDone ? '✓' : (idx + 1)}
            </div>
            <div class="exercise-info" onclick="toggleDetail('${ex.id}')">
              <div class="exercise-name">${ex.name}</div>
              <div class="exercise-meta">
                <span class="muscle-tag">${ex.muscleGroup}</span>
                ${repsText} · ${ex.equipment}
              </div>
            </div>
            <button class="exercise-expand-btn" id="expand-${ex.id}" onclick="toggleDetail('${ex.id}')">▼</button>
          </div>

          <div class="exercise-detail" id="detail-${ex.id}">
            <div class="detail-section">
              <h4>📍 Posição Inicial</h4>
              <p class="detail-text">${ex.startPosition}</p>
            </div>
            <div class="detail-section">
              <h4>▶️ Execução</h4>
              <p class="detail-text">${ex.execution}</p>
            </div>
            <div class="detail-section">
              <h4>🌬️ Respiração</h4>
              <p class="detail-text">${ex.breathing}</p>
            </div>
            <div class="caution-box">
              <p>${ex.caution}</p>
            </div>

            <div class="weight-row">
              <label>Peso usado:</label>
              <input type="text" placeholder="ex: 500ml, 1L, sem peso"
                     value="${exState.weight || ''}"
                     onchange="setWeight('${ex.id}', this.value)"
                     class="input-field" style="min-height:40px">
            </div>

            ${ex.isometric ? `
              <div class="timer-container">
                <div class="timer-display" id="timer-${ex.id}">${ex.duration || 30}</div>
                <div class="timer-btns">
                  <button class="btn btn-sm btn-primary" onclick="startTimer('${ex.id}', ${ex.duration || 30})">▶ Iniciar</button>
                  <button class="btn btn-sm btn-outline" onclick="resetTimer('${ex.id}', ${ex.duration || 30})">↺</button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>`;
    });

    container.innerHTML = `
      <div class="workout-header">
        <div class="workout-icon">${dayData.icon}</div>
        <h2>${dayData.dayName}</h2>
        <p style="color:var(--text-light)">${dayData.dayLabel}</p>
      </div>

      <div class="workout-progress">
        <div class="workout-progress-text">
          <span>${doneCount}/${exList.length} exercícios</span>
          <span>${allDone ? '🎉 Completo!' : 'Continue assim!'}</span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar-fill" style="width: ${(doneCount/exList.length)*100}%"></div>
        </div>
      </div>

      ${exercisesHTML}
    `;

    // Check if just completed
    if (allDone && !workout.completed) {
      workout.completed = true;
      state.totalCompleted = countTotalCompleted();
      state.streak = calculateStreak();
      saveState();
      showPostWorkout();
    }
  }

  // ── Exercise Interactions ──
  window.toggleExercise = function(id) {
    const today = todayStr();
    if (!state.workouts[today]) return;
    const workout = state.workouts[today];
    if (!workout.exercises[id]) {
      workout.exercises[id] = { done: false, weight: '' };
    }
    workout.exercises[id].done = !workout.exercises[id].done;

    // Check if all done
    const tDay = getTrainingDay();
    if (tDay > 0) {
      const allEx = EXERCISE_DB[tDay].exercises;
      const allDone = allEx.every(ex => workout.exercises[ex.id] && workout.exercises[ex.id].done);
      if (allDone && !workout.completed) {
        workout.completed = true;
        state.totalCompleted = countTotalCompleted();
        state.streak = calculateStreak();
      } else if (!allDone) {
        workout.completed = false;
      }
    }

    saveState();
    renderWorkout();

    // Show post-workout if just completed
    if (workout.completed) {
      setTimeout(() => showPostWorkout(), 300);
    }
  };

  window.toggleDetail = function(id) {
    const detail = $(`#detail-${id}`);
    const btn = $(`#expand-${id}`);
    detail.classList.toggle('open');
    btn.classList.toggle('open');
  };

  window.setWeight = function(id, value) {
    const today = todayStr();
    if (!state.workouts[today]) return;
    if (!state.workouts[today].exercises[id]) {
      state.workouts[today].exercises[id] = { done: false, weight: '' };
    }
    state.workouts[today].exercises[id].weight = value;
    saveState();
  };

  // ── Timer ──
  const timers = {};
  window.startTimer = function(id, duration) {
    if (timers[id]) return;
    const display = $(`#timer-${id}`);
    let remaining = parseInt(display.textContent) || duration;
    timers[id] = setInterval(() => {
      remaining--;
      display.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(timers[id]);
        timers[id] = null;
        display.textContent = '✓';
        display.style.color = 'var(--accent)';
        // Vibrate if available
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    }, 1000);
  };

  window.resetTimer = function(id, duration) {
    if (timers[id]) {
      clearInterval(timers[id]);
      timers[id] = null;
    }
    const display = $(`#timer-${id}`);
    display.textContent = duration;
    display.style.color = '';
  };

  // ── POST-WORKOUT ──
  function showPostWorkout() {
    const overlay = $('#post-workout-overlay');
    overlay.classList.add('visible');
    launchConfetti();
  }

  window.closePostWorkout = function() {
    $('#post-workout-overlay').classList.remove('visible');
  };

  window.selectBodyPart = function(btn) {
    btn.classList.toggle('selected');
  };

  window.selectPainLevel = function(btn, level) {
    $$('.pain-level-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    btn.dataset.selectedLevel = level;
  };

  window.selectPostMood = function(btn, mood) {
    $$('.post-mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };

  window.savePainDiary = function() {
    const today = todayStr();
    const parts = $$('.body-part-btn.selected').map(b => b.textContent.trim());
    const levelBtn = $('.pain-level-btn.selected');
    const level = levelBtn ? parseInt(levelBtn.textContent) : 0;
    const moodBtn = $('.post-mood-btn.selected');
    const mood = moodBtn ? moodBtn.textContent.trim() : '';
    const notes = $('#pain-notes').value || '';

    state.painDiary[today] = { parts, level, notes, mood };
    saveState();
    closePostWorkout();
    renderHome();
  };

  // ── Confetti ──
  function launchConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#E88D67', '#5B8C5A', '#F5E6CC', '#D4726A', '#E8B84D', '#7DB87C', '#F2A98B'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 1.5 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 5000);
  }

  // ── HEALTH RENDER ──
  function renderHealth() {
    const container = $('#health-content');
    const today = todayStr();
    const h = state.health[today] || { sleep: '', weight: '', steps: '', mood: '', notes: '' };

    // Build weight chart (last 7 days)
    let chartHTML = '';
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const hData = state.health[ds];
      const w = hData && hData.weight ? parseFloat(hData.weight) : 0;
      days.push({ label: DAY_NAMES_SHORT[d.getDay()], value: w, date: ds });
    }

    const weights = days.map(d => d.value).filter(v => v > 0);
    const minW = weights.length ? Math.min(...weights) - 1 : 55;
    const maxW = weights.length ? Math.max(...weights) + 1 : 65;
    const range = maxW - minW || 1;

    let barsHTML = '';
    days.forEach(d => {
      const pct = d.value > 0 ? ((d.value - minW) / range) * 100 : 0;
      barsHTML += `
        <div class="chart-bar-col">
          ${d.value > 0 ? `<div class="chart-bar-value">${d.value}</div>` : ''}
          <div class="chart-bar" style="height: ${pct > 0 ? Math.max(pct, 5) : 0}%"></div>
          <div class="chart-bar-label">${d.label}</div>
        </div>`;
    });

    // Mood history (last 7 days)
    let moodHTML = '';
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const hData = state.health[ds];
      const mood = hData && hData.mood ? hData.mood : '·';
      moodHTML += `<div class="mood-day">${mood}</div>`;
    }

    container.innerHTML = `
      <div class="health-date">
        <h3>📋 Diário de Saúde</h3>
        <p style="color:var(--text-light)">${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div class="health-grid">
        <div class="health-metric">
          <div class="metric-icon">😴</div>
          <div class="metric-label">Horas de Sono</div>
          <input type="number" class="metric-input" id="h-sleep" value="${h.sleep}" placeholder="8"
                 step="0.5" min="0" max="24" onchange="saveHealth()">
          <div class="metric-unit">horas</div>
        </div>
        <div class="health-metric">
          <div class="metric-icon">⚖️</div>
          <div class="metric-label">Peso</div>
          <input type="number" class="metric-input" id="h-weight" value="${h.weight}" placeholder="61.0"
                 step="0.1" min="30" max="200" onchange="saveHealth()">
          <div class="metric-unit">kg</div>
        </div>
        <div class="health-metric">
          <div class="metric-icon">🚶</div>
          <div class="metric-label">Passos</div>
          <input type="number" class="metric-input" id="h-steps" value="${h.steps}" placeholder="5000"
                 step="100" min="0" onchange="saveHealth()">
          <div class="metric-unit">passos (Apple Watch)</div>
        </div>
        <div class="health-metric">
          <div class="metric-icon">💭</div>
          <div class="metric-label">Humor</div>
          <div class="mood-selector" style="margin:8px 0 0">
            <button class="mood-btn health-mood-btn ${h.mood === '😊' ? 'selected' : ''}" onclick="setHealthMood(this, '😊')">😊</button>
            <button class="mood-btn health-mood-btn ${h.mood === '😐' ? 'selected' : ''}" onclick="setHealthMood(this, '😐')">😐</button>
            <button class="mood-btn health-mood-btn ${h.mood === '😔' ? 'selected' : ''}" onclick="setHealthMood(this, '😔')">😔</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="input-group">
          <label>📝 Anotações do dia</label>
          <textarea class="input-field" id="h-notes" placeholder="Como você se sentiu hoje? Alguma observação?"
                    onchange="saveHealth()">${h.notes || ''}</textarea>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-title">⚖️ Peso — Últimos 7 dias</div>
        <div class="chart-bars">${barsHTML}</div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:8px">💭 Humor — Últimos 7 dias</h3>
        <div class="mood-history">${moodHTML}</div>
      </div>
    `;
  }

  window.saveHealth = function() {
    const today = todayStr();
    state.health[today] = {
      sleep: $('#h-sleep').value,
      weight: $('#h-weight').value,
      steps: $('#h-steps').value,
      mood: state.health[today]?.mood || '',
      notes: $('#h-notes').value
    };
    saveState();
  };

  window.setHealthMood = function(btn, mood) {
    $$('.health-mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const today = todayStr();
    if (!state.health[today]) state.health[today] = {};
    state.health[today].mood = mood;
    saveState();
  };

  // ── PROGRESS RENDER ──
  function renderProgress() {
    const container = $('#progress-content');
    const streak = calculateStreak();
    const totalDone = countTotalCompleted();

    // Calendar
    const year = state.calendarYear;
    const month = state.calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = todayStr();

    let calendarHTML = '';
    // Header row
    DAY_NAMES_SHORT.forEach(d => {
      calendarHTML += `<div class="calendar-header">${d}</div>`;
    });
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const date = new Date(year, month, d);
      const dow = date.getDay();
      const isToday = ds === today;
      const isFuture = date > new Date();
      const isDone = state.workouts[ds] && state.workouts[ds].completed;
      const isRest = dow === 0;
      const isPast = !isFuture && !isToday;
      const isMissed = isPast && !isRest && !isDone && dow !== 0;

      let cls = '';
      if (isDone) cls = 'done';
      else if (isRest) cls = 'rest';
      else if (isMissed) cls = 'missed';
      else if (isFuture) cls = 'future';
      if (isToday) cls += ' today';

      calendarHTML += `<div class="calendar-day ${cls}">${d}</div>`;
    }

    // Medals
    const medals = [
      { icon: '🥉', name: 'Primeira Semana', desc: 'Complete 6 treinos em uma semana', unlocked: totalDone >= 6 },
      { icon: '🥈', name: 'Primeiro Mês', desc: 'Complete 24 treinos', unlocked: totalDone >= 24 },
      { icon: '🥇', name: 'Três Meses', desc: 'Complete 72 treinos', unlocked: totalDone >= 72 },
      { icon: '⭐', name: 'Consistência', desc: '10 dias seguidos de treino', unlocked: streak >= 10 },
      { icon: '🏆', name: 'Dedicação', desc: '30 dias seguidos de treino', unlocked: streak >= 30 },
    ];

    let medalsHTML = '';
    medals.forEach(m => {
      medalsHTML += `
        <div class="medal-card ${m.unlocked ? '' : 'locked'}">
          <div class="medal-icon">${m.icon}</div>
          <div>
            <div class="medal-name">${m.name}</div>
            <div class="medal-desc">${m.desc}</div>
          </div>
        </div>`;
    });

    container.innerHTML = `
      <h2 style="text-align:center; margin-bottom:16px">📊 Seu Progresso</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${streak}</div>
          <div class="stat-label">dias seguidos</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">${totalDone}</div>
          <div class="stat-label">treinos completos</div>
        </div>
      </div>

      <div class="card">
        <div class="calendar-nav">
          <button onclick="changeMonth(-1)">◀</button>
          <span class="month-label">${MONTH_NAMES[month]} ${year}</span>
          <button onclick="changeMonth(1)">▶</button>
        </div>
        <div class="calendar-grid">${calendarHTML}</div>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; font-size:0.75rem; color:var(--text-light)">
          <span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--accent);vertical-align:middle"></span> Feito</span>
          <span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--danger-light);vertical-align:middle"></span> Perdido</span>
          <span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--secondary);vertical-align:middle"></span> Descanso</span>
        </div>
      </div>

      <div class="medals-section">
        <h3 style="margin-bottom:12px">🏅 Medalhas</h3>
        ${medalsHTML}
      </div>
    `;
  }

  window.changeMonth = function(delta) {
    state.calendarMonth += delta;
    if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
    if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
    saveState();
    renderProgress();
  };

  // ── SETTINGS RENDER ──
  function renderSettings() {
    const container = $('#settings-content');
    container.innerHTML = `
      <h2 style="text-align:center; margin-bottom:20px">⚙️ Configurações</h2>

      <div class="settings-section">
        <h3>Perfil</h3>
        <div class="card">
          <div class="input-group" style="margin-bottom:0">
            <label>Seu nome</label>
            <input type="text" class="input-field" id="s-name" value="${state.name}" onchange="saveName()">
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3>Lembretes</h3>
        <div class="setting-row">
          <div>
            <div class="setting-label">Lembrete diário</div>
            <div class="setting-desc">Receba uma notificação para treinar</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="s-reminders" ${state.remindersEnabled ? 'checked' : ''} onchange="toggleReminders()">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="card" id="reminder-time-card" ${state.remindersEnabled ? '' : 'style="display:none"'}>
          <div class="input-group" style="margin-bottom:0">
            <label>Horário do lembrete</label>
            <input type="time" class="input-field" id="s-reminder-time" value="${state.reminderTime}" onchange="saveReminderTime()">
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3>Dados</h3>
        <button class="btn btn-danger btn-block" onclick="resetData()">
          🗑️ Apagar todos os dados
        </button>
        <p style="text-align:center; margin-top:8px; font-size:0.8rem; color:var(--text-lighter)">
          Esta ação não pode ser desfeita
        </p>
      </div>

      <div style="text-align:center; margin-top:40px; color:var(--text-lighter); font-size:0.75rem">
        <p>Treino da Simone v1.0</p>
        <p>Feito com ❤️ para Simone Trombini</p>
      </div>
    `;
  }

  window.saveName = function() {
    state.name = $('#s-name').value || 'Simone';
    saveState();
  };

  window.toggleReminders = function() {
    const checked = $('#s-reminders').checked;
    if (checked) {
      if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            state.remindersEnabled = true;
            saveState();
            scheduleReminder();
            $('#reminder-time-card').style.display = '';
          } else {
            $('#s-reminders').checked = false;
            alert('Permita as notificações nas configurações do iPhone para receber lembretes.');
          }
        });
      } else {
        alert('Seu navegador não suporta notificações.');
        $('#s-reminders').checked = false;
      }
    } else {
      state.remindersEnabled = false;
      saveState();
      $('#reminder-time-card').style.display = 'none';
    }
  };

  window.saveReminderTime = function() {
    state.reminderTime = $('#s-reminder-time').value;
    saveState();
    if (state.remindersEnabled) scheduleReminder();
  };

  function scheduleReminder() {
    // Simple approach: check every minute if it's time
    // In a real PWA, this would use the Push API
    if (!state.remindersEnabled) return;
    // We'll use a simpler "show notification when app opens at the right time" approach
  }

  // Check on load if we should show a reminder
  function checkReminder() {
    if (!state.remindersEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const [h, m] = state.reminderTime.split(':').map(Number);
    const reminderKey = `reminder_shown_${todayStr()}`;
    if (now.getHours() >= h && now.getMinutes() >= m && !localStorage.getItem(reminderKey)) {
      const tDay = getTrainingDay();
      if (tDay > 0) {
        const dayData = EXERCISE_DB[tDay];
        new Notification('Hora do treino! 💪', {
          body: `${state.name}, hoje é dia de ${dayData.dayName}. Vamos lá!`,
          icon: 'icons/icon-192.png'
        });
        localStorage.setItem(reminderKey, '1');
      }
    }
  }

  window.resetData = function() {
    if (confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.')) {
      if (confirm('Confirmar: apagar todos os treinos, diário de saúde e progresso?')) {
        localStorage.removeItem(LS_KEY);
        state = getDefaultState();
        renderHome();
        // Switch to home tab
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        $$('.tab-content').forEach(c => c.classList.remove('active'));
        $('[data-tab="home"]').classList.add('active');
        $('#tab-home').classList.add('active');
      }
    }
  };

  // ── Service Worker Registration ──
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('SW registered'))
        .catch(err => console.error('SW error', err));
    }
  }

  // ── Install Prompt ──
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = $('#install-banner');
    if (banner) banner.classList.add('visible');
  });

  window.installApp = function() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        const banner = $('#install-banner');
        if (banner) banner.classList.remove('visible');
      });
    }
  };

  // ── Init ──
  function init() {
    registerSW();
    initTabs();
    renderHome();
    checkReminder();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
