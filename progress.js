const STORAGE_KEY = 'cq:progress:v1';

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const listeners = new Set();

function emit() { listeners.forEach(fn => { try { fn(); } catch {} }); }

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s);
  } catch { return null; }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  emit();
}

function defaultState() {
  return {
    lastActiveDate: null,
    streakDays: 0,
    pointsByDate: {},
  };
}

let state = defaultState();

export function initProgress() {
  state = load() || defaultState();
  ensureStreak();
  save(state);
}

function ensureStreak() {
  const today = todayKey();
  if (!state.lastActiveDate) {
    state.lastActiveDate = today; state.streakDays = 0; return;
  }
  const last = state.lastActiveDate;
  if (last === today) return;
  if (last === yesterdayKey()) {
    state.streakDays = Math.max(1, state.streakDays);
  } else {
    state.streakDays = 0;
  }
}

export function addActivityPoints(kind, points) {
  const key = todayKey();
  state.pointsByDate[key] = (state.pointsByDate[key] || 0) + points;
  state.lastActiveDate = key;
  if (state.pointsByDate[key] >= 10) {
    state.streakDays = Math.max(1, state.streakDays);
  }
  save(state);
}

export function getProgressSnapshot() {
  const key = todayKey();
  const todayPoints = state.pointsByDate[key] || 0;
  const allDates = Object.keys(state.pointsByDate).sort();
  const bestDayPoints = allDates.reduce((max, k) => Math.max(max, state.pointsByDate[k] || 0), 0);
  const totalPoints = allDates.reduce((sum, k) => sum + (state.pointsByDate[k] || 0), 0);
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0');
    const dk = `${y}-${m}-${day}`;
    last7Days.push({ date: dk, points: state.pointsByDate[dk] || 0 });
  }
  return { streakDays: state.streakDays, todayPoints, bestDayPoints, totalPoints, last7Days };
}

export function onProgressChange(fn) { listeners.add(fn); }
export function offProgressChange(fn) { listeners.delete(fn); }