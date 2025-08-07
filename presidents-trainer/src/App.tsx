import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import ClueGame from './pages/ClueGame';
import MouseAndCheese from './pages/MouseAndCheese';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/clues" element={<ClueGame />} />
        <Route path="/mouse" element={<MouseAndCheese />} />
      </Routes>
    </div>
  );
}

export default App;
