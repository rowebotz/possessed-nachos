export type President = {
  number: number;
  name: string;
  term: string; // e.g., "1789–1797"
  party: string;
  era?: string;
  quote?: string;
  famousFor?: string;
};

export type DailyProgress = {
  date: string; // YYYY-MM-DD
  studiedFlashcards: number;
  quizCorrect: number;
  quizTotal: number;
  clueCorrect: number;
  clueTotal: number;
  cheesesEaten: number; // for mouse-and-cheese game
  presidentsHeard: number; // number of TTS names played
};

export type ProgressState = {
  byDate: Record<string, DailyProgress>;
  increment: (date: string, field: keyof DailyProgress, amount?: number) => void;
  getToday: () => DailyProgress;
};