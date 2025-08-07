import { ProgressStore } from './storage.js';
import { drawSparkline, drawRing } from './charts.js';
import { el, showToast } from './ui.js';

export function renderDashboard(container, state) {
  const progress = ProgressStore.getAll();
  const sessions = progress.sessions.slice(-14); // last two weeks
  const scores = sessions.map(s => s.score ?? 0);
  const completion = sessions.length ? average(sessions.map(s => s.completion ?? 0)) : 0;

  const wrapper = el('div', { class: 'dashboard grid cols-2' });

  // Stats
  const statsCard = el('div', { class: 'card stat-card' });
  statsCard.innerHTML = `
    <h2 class="section-title">Your Progress</h2>
    <div class="grid cols-3" style="align-items: center;">
      <div>
        <div class="subtle">Current Streak</div>
        <div class="stat-value">${progress.streak}🔥</div>
      </div>
      <div>
        <div class="subtle">Sessions (14d)</div>
        <div class="stat-value">${sessions.length}</div>
      </div>
      <div>
        <div class="subtle">Avg Completion</div>
        <div class="stat-value">${Math.round(completion*100)}%</div>
      </div>
    </div>
    <canvas id="progressChart" height="180"></canvas>
  `;
  wrapper.appendChild(statsCard);

  // Rings
  const ringsCard = el('div', { class: 'card stat-card' });
  ringsCard.innerHTML = `
    <h2 class="section-title">Mastery Overview</h2>
    <div class="grid cols-3">
      <div>
        <div id="ring-known"></div>
        <div class="subtle" style="text-align:center; margin-top: 6px;">Known</div>
      </div>
      <div>
        <div id="ring-review"></div>
        <div class="subtle" style="text-align:center; margin-top: 6px;">Due</div>
      </div>
      <div>
        <div id="ring-new"></div>
        <div class="subtle" style="text-align:center; margin-top: 6px;">New</div>
      </div>
    </div>
  `;
  wrapper.appendChild(ringsCard);

  // Achievements
  const achieveCard = el('div', { class: 'card stat-card' });
  achieveCard.innerHTML = `
    <h2 class="section-title">Achievements</h2>
    <div id="achievements" style="display:flex; gap:8px; flex-wrap: wrap;"></div>
  `;
  wrapper.appendChild(achieveCard);

  container.appendChild(wrapper);

  // Draw sparkline
  const canvas = document.getElementById('progressChart');
  drawSparkline(canvas, scores);

  // Compute simplistic mastery metrics
  const total = state.presidents.length || 1;
  const learnedIds = new Set((ProgressStore.getAll().sessions || [])
    .filter(s => s.mode === 'flashcards' && (s.correct ?? 0) > 0)
    .flatMap(s => s.items || []));
  const known = Math.min(total, learnedIds.size);
  const due = Math.max(0, Math.round(total * 0.2));
  const newly = Math.max(0, total - known - due);
  drawRing(document.getElementById('ring-known'), known / total, '#0b3d91');
  drawRing(document.getElementById('ring-review'), due / total, '#b22234');
  drawRing(document.getElementById('ring-new'), newly / total, '#16a34a');

  // Render achievements
  const achRoot = document.getElementById('achievements');
  const defs = achievementDefinitions();
  const owned = new Set(progress.achievements || []);
  defs.forEach(a => {
    const pill = el('div', { class: 'badge', title: a.description }, [`${owned.has(a.id) ? '🏅' : '🔒'} ${a.title}`]);
    achRoot.appendChild(pill);
  });

  // CTA to encourage a session today
  const today = new Date().toISOString().slice(0,10);
  const todaySessions = progress.sessions.filter(s => (s.date || '').startsWith(today));
  if (todaySessions.length === 0) {
    showToast('Keep your streak alive! Complete any activity today.');
  }
}

export function logSession({ mode, score = 0, completion = 0, correct = 0, total = 0, items = [] }) {
  const session = {
    date: new Date().toISOString(),
    mode, score, completion, correct, total, items,
  };
  const updated = ProgressStore.upsertSession(session);
  maybeAward(updated);
}

function maybeAward(progress) {
  const defs = achievementDefinitions();
  for (const a of defs) {
    if (!progress.achievements.includes(a.id) && a.criteria(progress)) {
      ProgressStore.award(a.id);
    }
  }
}

function achievementDefinitions() {
  return [
    { id: 'streak-3', title: '3-Day Streak', description: 'Study three days in a row', criteria: p => p.streak >= 3 },
    { id: 'streak-7', title: '7-Day Streak', description: 'A full week of learning', criteria: p => p.streak >= 7 },
    { id: 'fc-100', title: 'Flashcard Novice', description: '100 flashcards reviewed', criteria: p => (sum(p.sessions.filter(s => s.mode==='flashcards').map(s=>s.total)) >= 100) },
    { id: 'quiz-10', title: 'Quiz Whiz', description: 'Score 10 perfect quizzes', criteria: p => (p.sessions.filter(s => s.mode==='quiz' && s.score===1).length >= 10) },
  ];
}

function average(arr) { return arr.length ? (arr.reduce((a,b)=>a+b,0) / arr.length) : 0; }
function sum(arr) { return arr.reduce((a,b)=>a+b,0); }