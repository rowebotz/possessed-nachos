import { useEffect, useRef, useState } from 'react';
import { presidents } from '../data/presidents';
import { useProgressStore, todayStr } from '../store/progress';
import { speak, preloadVoices } from '../utils/tts';

const CELL = 20;
const COLS = 24;
const ROWS = 24;

function randCell() {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
}

function same(a: { x: number; y: number }, b: { x: number; y: number }) {
  return a.x === b.x && a.y === b.y;
}

function usePresidentsQueue() {
  const [queue, setQueue] = useState<string[]>([]);
  useEffect(() => {
    const names = presidents.map((p) => p.name);
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
  }, []);
  function next() {
    if (queue.length === 0) return null;
    const [head, ...rest] = queue;
    setQueue(rest.length ? rest : [...presidents.map(p => p.name)].sort(() => Math.random() - 0.5));
    return head;
  }
  return { next };
}

export default function MouseAndCheese() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 5, y: 5 }]);
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 1, y: 0 });
  const [cheese, setCheese] = useState(randCell());
  const [speed, setSpeed] = useState(130);
  const [gameOver, setGameOver] = useState(false);
  const inc = useProgressStore((s) => s.increment);
  const date = todayStr();
  const { next } = usePresidentsQueue();

  useEffect(() => { preloadVoices(); }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowUp' && dir.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x !== -1) setDir({ x: 1, y: 0 });
      if (e.key === ' ') setRunning((r) => !r);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    function draw(context: CanvasRenderingContext2D) {
      context.clearRect(0, 0, COLS * CELL, ROWS * CELL);
      // board
      context.fillStyle = '#0b1220';
      context.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      // grid
      context.strokeStyle = 'rgba(255,255,255,0.05)';
      for (let x = 0; x <= COLS; x++) {
        context.beginPath(); context.moveTo(x * CELL, 0); context.lineTo(x * CELL, ROWS * CELL); context.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        context.beginPath(); context.moveTo(0, y * CELL); context.lineTo(COLS * CELL, y * CELL); context.stroke();
      }
      // cheese
      context.fillStyle = '#f59e0b';
      context.fillRect(cheese.x * CELL + 4, cheese.y * CELL + 4, CELL - 8, CELL - 8);
      // mouse (snake)
      snake.forEach((seg, i) => {
        context.fillStyle = i === 0 ? '#93c5fd' : '#1f3a8a';
        context.beginPath();
        context.arc(seg.x * CELL + CELL / 2, seg.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
        context.fill();
      });
    }

    draw(ctx);
  }, [snake, cheese]);

  useEffect(() => {
    if (!running || gameOver) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        // wall collision
        if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        // self collision
        if (prev.some((p) => same(p, head))) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        const ate = same(head, cheese);
        const nextSnake = [head, ...prev];
        if (!ate) nextSnake.pop();
        else {
          // new cheese
          let c = randCell();
          while (nextSnake.some((s) => same(s, c))) c = randCell();
          setCheese(c);
          inc(date, 'cheesesEaten', 1);
          const name = next();
          if (name) {
            speak(name, { rate: 1 });
            inc(date, 'presidentsHeard', 1);
          }
          setSpeed((s) => Math.max(70, s - 2));
        }
        return nextSnake;
      });
    }, speed);
    return () => clearInterval(id);
  }, [running, dir, speed, cheese, gameOver]);

  function reset() {
    setSnake([{ x: 5, y: 5 }]);
    setDir({ x: 1, y: 0 });
    setCheese(randCell());
    setSpeed(130);
    setGameOver(false);
    setRunning(true);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Mouse & Cheese</h1>
        <div className="join">
          <button className="btn join-item" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</button>
          <button className="btn join-item" onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="grid md:grid-cols-[auto,1fr] gap-4">
        <div>
          <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="rounded-lg border border-base-300 shadow" />
        </div>
        <div className="space-y-2">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">How to Play</h2>
              <p>Use arrow keys to move the mouse. Eat cheese to grow. Avoid walls and yourself. Each cheese teaches a president's name.</p>
              <p className="text-sm opacity-80">Press Space to start/pause.</p>
            </div>
          </div>
          {gameOver && (
            <div className="alert alert-error">
              <span>Game Over! Press Reset to try again.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}