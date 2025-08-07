import { isVoiceEnabled } from '../utils/tts.js';

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

export function mountMouseCheeseGame({ canvasId, scoreId, bestId, startBtnId, pauseBtnId, speedSliderId, onEat }) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById(scoreId);
  const bestEl = document.getElementById(bestId);
  const startBtn = document.getElementById(startBtnId);
  const pauseBtn = document.getElementById(pauseBtnId);
  const speedSlider = document.getElementById(speedSliderId);

  const gridSize = 20;
  const cell = Math.floor(canvas.width / gridSize);

  let mouse = [{ x: 10, y: 10 }];
  let dir = { x: 1, y: 0 };
  let cheese = randomEmptyCell();
  let score = 0;
  let best = Number(localStorage.getItem('cq:best-score') || 0);
  let running = false;
  let eatCount = 0;
  let tickMs = Number(speedSlider.value);
  let rafId = null;
  let lastTick = 0;

  bestEl.textContent = String(best);

  function reset() {
    mouse = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    cheese = randomEmptyCell();
    score = 0; eatCount = 0; scoreEl.textContent = '0';
  }

  function randomEmptyCell() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
    } while (mouse.some(p => p.x === pos.x && p.y === pos.y));
    return pos;
  }

  function update() {
    const head = { x: mouse[0].x + dir.x, y: mouse[0].y + dir.y };
    if (head.x < 0) head.x = gridSize - 1;
    if (head.x >= gridSize) head.x = 0;
    if (head.y < 0) head.y = gridSize - 1;
    if (head.y >= gridSize) head.y = 0;

    if (mouse.some(p => p.x === head.x && p.y === head.y)) {
      reset();
      return;
    }

    mouse.unshift(head);

    if (head.x === cheese.x && head.y === cheese.y) {
      score += 1; eatCount += 1; scoreEl.textContent = String(score);
      if (score > best) { best = score; bestEl.textContent = String(best); localStorage.setItem('cq:best-score', String(best)); }
      cheese = randomEmptyCell();
      if (typeof onEat === 'function') onEat(eatCount - 1);
    } else {
      mouse.pop();
    }
  }

  function draw() {
    ctx.fillStyle = '#0c122b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid glow
    ctx.strokeStyle = '#162058'; ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
    }

    // Cheese
    ctx.save();
    ctx.translate(cheese.x * cell + cell / 2, cheese.y * cell + cell / 2);
    ctx.font = `${Math.floor(cell * 0.8)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.rotate(Math.sin(Date.now() / 300) * 0.1);
    ctx.fillText('🧀', 0, 0);
    ctx.restore();

    // Mouse
    mouse.forEach((seg, i) => {
      ctx.save();
      ctx.translate(seg.x * cell + cell / 2, seg.y * cell + cell / 2);
      ctx.font = `${Math.floor(cell * 0.8)}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = clamp(1 - i * 0.04, 0.4, 1);
      ctx.fillText(i === 0 ? '🐭' : '•', 0, 0);
      ctx.restore();
    });
  }

  function loop(ts) {
    if (!running) return;
    if (!lastTick) lastTick = ts;
    const elapsed = ts - lastTick;
    if (elapsed >= tickMs) {
      update();
      draw();
      lastTick = ts;
    }
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true; lastTick = 0; rafId = requestAnimationFrame(loop);
  }
  function pause() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  // Controls
  startBtn.addEventListener('click', () => { if (!running) start(); });
  pauseBtn.addEventListener('click', () => { pause(); });
  speedSlider.addEventListener('input', () => { tickMs = Number(speedSlider.value); });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') { if (dir.y !== 1) dir = { x: 0, y: -1 }; }
    if (e.key === 'ArrowDown' || e.key === 's') { if (dir.y !== -1) dir = { x: 0, y: 1 }; }
    if (e.key === 'ArrowLeft' || e.key === 'a') { if (dir.x !== 1) dir = { x: -1, y: 0 }; }
    if (e.key === 'ArrowRight' || e.key === 'd') { if (dir.x !== -1) dir = { x: 1, y: 0 }; }
  });

  // Touch controls
  let touchStart = null;
  canvas.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; touchStart = { x: t.clientX, y: t.clientY }; });
  canvas.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dir.x !== -1) dir = { x: 1, y: 0 }; else if (dx < 0 && dir.x !== 1) dir = { x: -1, y: 0 };
    } else {
      if (dy > 0 && dir.y !== -1) dir = { x: 0, y: 1 }; else if (dy < 0 && dir.y !== 1) dir = { x: 0, y: -1 };
    }
    touchStart = null;
  });

  // Initial draw
  draw();
}