import { initProgress, addActivityPoints, getProgressSnapshot, onProgressChange } from './progress.js';
import { PREAMBLE_TEXT, ARTICLE_SUMMARIES, CONCEPTS, QUIZ_BANK } from './data/concepts.js';
import { mountFlashcards } from './activities/flashcards.js';
import { mountQuiz } from './activities/quiz.js';
import { mountMouseCheeseGame } from './activities/snake.js';
import { isVoiceEnabled, toggleVoiceEnabled, speakText, initVoice } from './utils/tts.js';

const views = ['view-dashboard', 'view-reader', 'view-flashcards', 'view-quiz', 'view-game'];

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

function setActiveView(viewId) {
  views.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('active', id === viewId);
  });
  $all('.tab').forEach(btn => {
    const target = btn.getAttribute('data-target');
    if (!target) return;
    btn.classList.toggle('active', target === viewId);
  });
}

function wireNav() {
  $all('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (!target) return;
      setActiveView(target);
    });
  });
  $all('[data-link-target]').forEach(link => {
    link.addEventListener('click', () => setActiveView(link.getAttribute('data-link-target')));
  });
}

function renderReader() {
  $('#preamble-text').textContent = PREAMBLE_TEXT;
  const container = $('#article-summaries');
  container.innerHTML = '';
  ARTICLE_SUMMARIES.forEach(a => {
    const card = document.createElement('div');
    card.className = 'article';
    card.innerHTML = `<h4>${a.title}</h4><p>${a.summary}</p>`;
    container.appendChild(card);
  });
}

function renderDashboard() {
  const { streakDays, todayPoints, bestDayPoints, totalPoints, last7Days } = getProgressSnapshot();
  $('#streak-count').textContent = String(streakDays);
  $('#today-points').textContent = String(todayPoints);
  $('#stat-streak').textContent = String(streakDays);
  $('#stat-today').textContent = `${todayPoints} pts`;
  $('#stat-best').textContent = `${bestDayPoints} pts`;
  $('#stat-total').textContent = `${totalPoints} pts`;
  drawProgressChart(last7Days);
}

function drawProgressChart(pointsByDay) {
  const canvas = document.getElementById('progress-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth || 600;
  const h = canvas.height = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const padding = 16;
  const cellW = (w - padding * 2) / pointsByDay.length;
  const maxV = Math.max(10, ...pointsByDay.map(p => p.points));
  ctx.strokeStyle = '#2a357a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  pointsByDay.forEach((d, i) => {
    const x = padding + i * cellW + cellW / 2;
    const y = h - padding - (d.points / maxV) * (h - padding * 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  pointsByDay.forEach((d, i) => {
    const x = padding + i * cellW + cellW / 2;
    const y = h - padding - (d.points / maxV) * (h - padding * 2);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
}

function wireThemeToggle() {
  const btn = document.getElementById('toggle-theme');
  const prefers = localStorage.getItem('cq:theme') || 'dark';
  if (prefers === 'light') document.body.classList.add('light');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const mode = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('cq:theme', mode);
  });
}

function wireVoiceToggle() {
  const btn = document.getElementById('toggle-voice');
  updateVoiceIcon();
  btn.addEventListener('click', () => {
    toggleVoiceEnabled();
    updateVoiceIcon();
  });
  function updateVoiceIcon() {
    btn.textContent = isVoiceEnabled() ? '🔊' : '🔈';
  }
}

function initTips() {
  const tips = [
    'Short, daily practice beats cramming. Aim for 10–15 minutes.',
    'Say answers out loud to improve recall.',
    'Mix activities: read, quiz, then play to reinforce concepts.',
    'Explain a clause to someone else to deepen understanding.',
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const el = document.getElementById('daily-tip'); if (el) el.textContent = tip;
}

async function main() {
  wireNav();
  wireThemeToggle();
  wireVoiceToggle();
  initTips();
  initProgress();
  initVoice();
  renderReader();
  renderDashboard();
  mountFlashcards({ rootId: 'view-flashcards', concepts: CONCEPTS, onEarn: (pts) => { addActivityPoints('flashcards', pts); } });
  mountQuiz({ rootId: 'view-quiz', bank: QUIZ_BANK, onEarn: (pts) => { addActivityPoints('quiz', pts); } });
  mountMouseCheeseGame({
    canvasId: 'game-canvas',
    scoreId: 'game-score',
    bestId: 'game-best',
    startBtnId: 'game-start',
    pauseBtnId: 'game-pause',
    speedSliderId: 'game-speed',
    onEat: (eatIndex) => {
      const concept = CONCEPTS[eatIndex % CONCEPTS.length];
      speakText(`${concept.title}. ${concept.explain}`);
      addActivityPoints('game', 2);
    }
  });

  onProgressChange(() => renderDashboard());
}

main();