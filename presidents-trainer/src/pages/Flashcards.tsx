import { useMemo, useState } from 'react';
import { presidents } from '../data/presidents';
import { useProgressStore, todayStr } from '../store/progress';

export default function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const inc = useProgressStore((s) => s.increment);
  const date = todayStr();

  const deck = useMemo(() => presidents, []);
  const current = deck[index % deck.length];

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
    inc(date, 'studiedFlashcards', 1);
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <div className="join">
          <button className="btn join-item" onClick={prev}>Prev</button>
          <button className="btn join-item" onClick={() => setFlipped((f) => !f)}>{flipped ? 'Hide' : 'Flip'}</button>
          <button className="btn join-item btn-primary" onClick={next}>Next</button>
        </div>
      </div>

      <div className="grid place-items-center min-h-[50vh]">
        <div className="card w-full max-w-xl bg-base-200 cursor-pointer card-animated" onClick={() => setFlipped((f) => !f)}>
          <div className="card-body">
            {!flipped ? (
              <div>
                <h2 className="card-title">#{current.number} {current.name}</h2>
                <p className="opacity-80">{current.term} • {current.party}</p>
              </div>
            ) : (
              <div>
                <p><span className="font-semibold">Era:</span> {current.era ?? '—'}</p>
                <p><span className="font-semibold">Famous for:</span> {current.famousFor ?? '—'}</p>
                <p className="italic opacity-80">{current.quote ?? ''}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}