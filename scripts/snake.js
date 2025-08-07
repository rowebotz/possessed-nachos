import { el } from './ui.js';
import { speak } from './audio.js';
import { logSession } from './progress.js';

export function renderMouseAndCheese(container, state) {
  const shell = el('div', { class: 'game-shell' });
  const hud = el('div', { class: 'game-hud card', style: 'padding:8px' });
  hud.innerHTML = `
    <span class="badge" id="score">Score: 0</span>
    <span class="badge" id="speed">Speed: 1x</span>
    <button class="button" id="startBtn">Start</button>
    <button class="button" id="pauseBtn">Pause</button>
    <span class="subtle">Use arrow keys or WASD to move</span>
  `;
  const canvasCard = el('div', { class: 'card', style: 'padding:8px; display:flex; justify-content:center;' });
  const canvas = el('canvas', { id: 'gameCanvas', width: 640, height: 640 });
  canvasCard.appendChild(canvas);

  shell.append(hud, canvasCard);
  container.appendChild(shell);

  const ctx = canvas.getContext('2d');
  const gridSize = 20; // 32x32 grid
  const tile = canvas.width / gridSize;

  let mouse = [{ x: 10, y: 10 }];
  let dir = { x: 1, y: 0 };
  let cheese = spawnCheese();
  let running = false;
  let loopId = 0;
  let score = 0;
  let speed = 6; // frames per second baseline

  const randomPresident = () => state.presidents[Math.floor(Math.random()*state.presidents.length)];
  let currentPresident = randomPresident();

  function draw() {
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // grid subtle
    ctx.strokeStyle = '#eef2f7';
    ctx.lineWidth = 1;
    for (let i=0;i<gridSize;i++) {
      ctx.beginPath(); ctx.moveTo(i*tile,0); ctx.lineTo(i*tile,canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i*tile); ctx.lineTo(canvas.width,i*tile); ctx.stroke();
    }

    // Cheese
    drawCheese(cheese.x, cheese.y);

    // Mouse
    ctx.fillStyle = '#0b3d91';
    for (const [i, seg] of mouse.entries()) {
      const r = 6;
      const x = seg.x*tile, y = seg.y*tile;
      roundRect(ctx, x+2, y+2, tile-4, tile-4, r);
      ctx.fill();
      if (i===0) { // eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x+tile/2+4*dir.x, y+tile/2+4*dir.y, 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#0b3d91';
      }
    }

    // HUD overlay
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0,0,canvas.width, 24);
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(`Cheese: ${score}`, 8, 16);
  }

  function update() {
    if (!running) return;

    const head = { x: mouse[0].x + dir.x, y: mouse[0].y + dir.y };

    // wrap around
    head.x = (head.x + gridSize) % gridSize;
    head.y = (head.y + gridSize) % gridSize;

    // collision with self
    if (mouse.some(seg => seg.x === head.x && seg.y === head.y)) {
      gameOver();
      return;
    }

    mouse.unshift(head);

    // cheese eaten
    if (head.x === cheese.x && head.y === cheese.y) {
      score += 1;
      document.getElementById('score').textContent = `Score: ${score}`;
      currentPresident = randomPresident();
      speak(currentPresident.name);
      cheese = spawnCheese();
      if (score % 5 === 0) {
        speed = Math.min(16, speed + 1);
        document.getElementById('speed').textContent = `Speed: ${Math.round(speed/6)}x`;
      }
    } else {
      mouse.pop();
    }

    draw();
  }

  function spawnCheese() {
    let x, y;
    do {
      x = Math.floor(Math.random()*gridSize);
      y = Math.floor(Math.random()*gridSize);
    } while (mouse.some(seg => seg.x===x && seg.y===y));
    return { x, y };
  }

  function drawCheese(x, y) {
    const px = x*tile, py = y*tile;
    ctx.fillStyle = '#facc15';
    roundRect(ctx, px+4, py+4, tile-8, tile-8, 6);
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.beginPath(); ctx.arc(px+tile/2-4, py+tile/2-4, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(px+tile/2+4, py+tile/2+2, 2, 0, Math.PI*2); ctx.fill();
  }

  function gameLoop() {
    update();
    const interval = 1000 / speed;
    loopId = setTimeout(gameLoop, interval);
  }

  function start() {
    if (running) return;
    running = true;
    loopId && clearTimeout(loopId);
    gameLoop();
  }

  function pause() {
    running = false;
    loopId && clearTimeout(loopId);
  }

  function gameOver() {
    pause();
    logSession({ mode: 'mouse', score: score/20, completion: 1, correct: score, total: 20 });
    score = 0; document.getElementById('score').textContent = `Score: 0`;
    speed = 6; document.getElementById('speed').textContent = `Speed: 1x`;
    mouse = [{ x: 10, y: 10 }]; dir = { x: 1, y: 0 }; cheese = spawnCheese();
    draw();
  }

  document.getElementById('startBtn').addEventListener('click', start);
  document.getElementById('pauseBtn').addEventListener('click', pause);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') if (dir.y !== 1) dir = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' || e.key === 's') if (dir.y !== -1) dir = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' || e.key === 'a') if (dir.x !== 1) dir = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' || e.key === 'd') if (dir.x !== -1) dir = { x: 1, y: 0 };
  });

  draw();
}

function roundRect(ctx, x, y, w, h, r) {
  const min = Math.min(w, h) / 2; r = Math.min(r, min);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}