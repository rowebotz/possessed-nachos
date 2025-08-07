import { Link } from 'react-router-dom';
import { useProgressStore, todayStr } from '../store/progress';

export default function Home() {
  const today = todayStr();
  const progress = useProgressStore((s) => s.byDate[today] ?? s.getToday());

  return (
    <div className="container mx-auto p-4">
      <div className="hero min-h-[30vh] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold">Learn U.S. Presidents, Your Way</h1>
            <p className="py-4 opacity-90">Practice daily with flashcards, quizzes, clues, and a fun mouse-and-cheese game that speaks presidents' names while you play.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link className="btn btn-primary" to="/flashcards">Start Flashcards</Link>
              <Link className="btn btn-secondary" to="/quiz">Take a Quiz</Link>
              <Link className="btn btn-accent" to="/clues">Guess by Clues</Link>
              <Link className="btn" to="/mouse">Play Mouse & Cheese</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard title="Flashcards Studied" value={progress.studiedFlashcards} />
        <StatCard title="Quiz Score" value={`${progress.quizCorrect}/${progress.quizTotal}`} />
        <StatCard title="Clue Success" value={`${progress.clueCorrect}/${progress.clueTotal}`} />
        <StatCard title="Cheeses Eaten" value={progress.cheesesEaten} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="card bg-base-200 card-animated">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-3xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}