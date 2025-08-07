import { useEffect, useMemo, useState } from 'react';
import { presidents } from '../data/presidents';
import { useProgressStore, todayStr } from '../store/progress';

function makeClues(name: string) {
  const p = presidents.find((x) => x.name === name)!;
  const clues: string[] = [];
  clues.push(`#${p.number}`);
  clues.push(p.term);
  clues.push(p.party);
  if (p.famousFor) clues.push(p.famousFor);
  if (p.era) clues.push(p.era);
  if (p.quote) clues.push(`"${p.quote}"`);
  return clues.slice(0, 5);
}

export default function ClueGame() {
  const [target, setTarget] = useState(() => presidents[Math.floor(Math.random() * presidents.length)].name);
  const [clues, setClues] = useState<string[]>(() => makeClues(presidents[Math.floor(Math.random() * presidents.length)].name));
  const [guess, setGuess] = useState('');
  const [reveal, setReveal] = useState(false);
  const inc = useProgressStore((s) => s.increment);
  const date = todayStr();

  useEffect(() => {
    setClues(makeClues(target));
  }, [target]);

  function submit() {
    inc(date, 'clueTotal', 1);
    if (guess.trim().toLowerCase() === target.toLowerCase()) {
      inc(date, 'clueCorrect', 1);
    }
    setReveal(true);
  }

  function next() {
    const nextP = presidents[Math.floor(Math.random() * presidents.length)].name;
    setTarget(nextP);
    setGuess('');
    setReveal(false);
  }

  const suggestions = useMemo(() => presidents.map((p) => p.name), []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Guess by Clues</h1>
      <div className="card bg-base-200 max-w-2xl">
        <div className="card-body">
          <ul className="list-disc pl-6 space-y-1">
            {clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <div className="form-control mt-4">
            <input list="presidents" className="input input-bordered" placeholder="Type the president's name" value={guess} onChange={(e) => setGuess(e.target.value)} />
            <datalist id="presidents">
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary" onClick={submit} disabled={reveal}>Submit</button>
            <button className="btn" onClick={next}>Next</button>
            {reveal && (
              <div className="badge badge-info">Answer: {target}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}