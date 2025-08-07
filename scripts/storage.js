const NAMESPACE = 'presidents-quest:v1';

function k(key) { return `${NAMESPACE}:${key}`; }

export const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(k(key));
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(k(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(k(key)); } catch {}
  },
};

export const ProgressStore = {
  getAll() { return Storage.get('progress', { sessions: [], streak: 0, lastDate: null, achievements: [] }); },
  upsertSession(session) {
    const all = this.getAll();
    all.sessions.push(session);
    const today = new Date().toISOString().slice(0,10);
    if (all.lastDate !== today) {
      if (all.lastDate && daysBetween(all.lastDate, today) === 1) {
        all.streak += 1;
      } else {
        all.streak = 1;
      }
      all.lastDate = today;
    }
    Storage.set('progress', all);
    return all;
  },
  award(achievementId) {
    const all = this.getAll();
    if (!all.achievements.includes(achievementId)) {
      all.achievements.push(achievementId);
      Storage.set('progress', all);
    }
    return all;
  }
};

function daysBetween(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return Math.round((b - a) / (1000*60*60*24));
}