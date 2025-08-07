import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyProgress, ProgressState } from '../types';

function createBlankProgress(date: string): DailyProgress {
  return {
    date,
    studiedFlashcards: 0,
    quizCorrect: 0,
    quizTotal: 0,
    clueCorrect: 0,
    clueTotal: 0,
    cheesesEaten: 0,
    presidentsHeard: 0,
  };
}

function todayStr(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      byDate: {},
      increment: (date, field, amount = 1) =>
        set((state) => {
          const existing = state.byDate[date] ?? createBlankProgress(date);
          return {
            byDate: {
              ...state.byDate,
              [date]: { ...existing, [field]: (existing[field] as number) + amount } as DailyProgress,
            },
          };
        }),
      getToday: () => {
        const d = todayStr();
        const current = get().byDate[d] ?? createBlankProgress(d);
        if (!get().byDate[d]) {
          set((state) => ({ byDate: { ...state.byDate, [d]: current } }));
        }
        return current;
      },
    }),
    { name: 'presidents-trainer-progress' }
  )
);

export { todayStr };