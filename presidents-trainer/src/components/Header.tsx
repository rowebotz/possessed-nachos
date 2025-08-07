import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur sticky top-0 z-50 border-b border-base-200">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          🇺🇸 Presidents Trainer
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/flashcards">Flashcards</NavLink></li>
          <li><NavLink to="/quiz">Quiz</NavLink></li>
          <li><NavLink to="/clues">Guess by Clues</NavLink></li>
          <li><NavLink to="/mouse">Mouse & Cheese</NavLink></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-primary" href="https://www.whitehouse.gov/about-the-white-house/presidents/" target="_blank" rel="noreferrer">Learn More</a>
      </div>
    </div>
  );
}