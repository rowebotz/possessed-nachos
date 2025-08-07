# Presidents Quest

A beautiful, interactive single-page web app to master all U.S. presidents through spaced repetition flashcards, adaptive quizzes, a progressive-clue guessing game, and a fun Mouse & Cheese arcade game (snake variant) with voice-overs.

## Features
- Daily progress tracking with streaks, sessions, charts, and achievements
- Thematic patriotic design, responsive across devices
- Multiple activities:
  - Flashcards with flip animations and Leitner-style spaced repetition
  - Quiz (multiple choice, true/false, type-in) with adaptive difficulty
  - Guessing with progressive clues and difficulty levels
  - Mouse & Cheese arcade: collect cheese to hear a president name
- Local persistence via `localStorage`
- Offline capable (PWA service worker)
- Accessibility: keyboard shortcuts, ARIA roles, reduced motion support

## Quick Start

No build step required.

1. Serve the directory (to enable module imports and service worker):

```bash
python3 -m http.server 5173
```

2. Open the app at:

- `http://localhost:5173`

3. Add to Home Screen (mobile) for an app-like experience.

## Development Notes
- Data lives in `data/presidents.json`. You can enrich entries with `facts`, `quotes`, or `policies` arrays as needed. The UI will pick them up in future enhancements.
- Voice-overs use the Web Speech API. If unsupported, a simple beep plays instead.
- The service worker caches core assets on first load. To update, bump the cache name in `service-worker.js`.

## Keyboard Shortcuts
- Flashcards: Space to flip, 1/2/3 to rate
- Game: Arrow keys or WASD to move

## Privacy
All data is stored locally on your device via `localStorage`. No tracking or analytics.