import { useState } from 'react';
import { presidents } from '../data/presidents';
import { useProgressStore, todayStr } from '../store/progress';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Question = {
  prompt: string;
  choices: string[];
  answer: string;
};

function generateQuestion(): Question {
  const pres = presidents[Math.floor(Math.random() * presidents.length)];
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    const choices = shuffle(presidents).slice(0, 3).map((p) => p.name);
    if (!choices.includes(pres.name)) choices[Math.floor(Math.random() * choices.length)] = pres.name;
    return { prompt: `Who served during ${pres.term}?`, choices: shuffle(choices), answer: pres.name };
  }
  if (type === 1) {
    const choices = shuffle(presidents).slice(0, 3).map((p) => p.party);
    choices.push(pres.party);
    return { prompt: `What was ${pres.name}'s party?`, choices: shuffle(Array.from(new Set(choices))), answer: pres.party };
  }
  const choices = shuffle(presidents).slice(0, 3).map((p) => String(p.number));
  if (!choices.includes(String(pres.number))) choices[Math.floor(Math.random() * choices.length)] = String(pres.number);
  return { prompt: `What number president was ${pres.name}?`, choices: shuffle(choices), answer: String(pres.number) };
}

export default function Quiz() {
  const [q, setQ] = useState<Question>(() => generateQuestion());
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const inc = useProgressStore((s) => s.increment);
  const date = todayStr();

  function submit(choice: string) {
    setSelected(choice);
    setReveal(true);
    inc(date, 'quizTotal', 1);
    if (choice === q.answer) inc(date, 'quizCorrect', 1);
  }

  function next() {
    setQ(generateQuestion());
    setSelected(null);
    setReveal(false);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Quiz</h1>
      <div className="card bg-base-200 max-w-2xl">
        <div className="card-body">
          <p className="text-xl">{q.prompt}</p>
          <div className="grid sm:grid-cols-2 gap-2 mt-4">
            {q.choices.map((c) => {
              const isCorrect = reveal && c === q.answer;
              const isWrong = reveal && selected === c && c !== q.answer;
              return (
                <button
                  key={c}
                  className={`btn ${reveal ? (isCorrect ? 'btn-success' : isWrong ? 'btn-error' : '') : 'btn-outline'}`}
                  onClick={() => !reveal && submit(c)}
                  disabled={reveal}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}