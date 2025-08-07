import { buildClues } from './data.js';
import { el } from './ui.js';
import { logSession } from './progress.js';

export function renderGuessing(container, state) {
  const shell = el('div', { class: 'guess' });
  const header = el('div', { class: 'card', style: 'padding:12px' }, [`
    <div style="display:flex; align-items:center; justify-content: space-between;">
      <div>
        <h2 class="section-title">Guess the President</h2>
        <div class="subtle">Reveal clues step by step</div>
      </div>
      <div>
        <label>Difficulty
          <select id="guessDiff">
            <option value="easy">Easy</option>
            <option value="normal" selected>Normal</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>
    </div>
  `]);

  const card = el('div', { class: 'card', style: 'padding:16px' });
  const controls = el('div', { class: 'guess-controls card', style: 'padding: 12px' });
  controls.innerHTML = `
    <input id="guessInput" class="input" placeholder="Type full name" aria-label="Your guess" />
    <button class="button primary" id="guessSubmit">Submit</button>
    <button class="button" id="nextClue">Next clue</button>
  `;

  shell.append(header, card, controls);
  container.appendChild(shell);

  let score = 0, total = 8;
  let index = 0;
  const pool = [...state.presidents].sort(()=>Math.random()-0.5).slice(0, total);
  let clues = [];
  let clueIndex = 0;

  function render() {
    const p = pool[index];
    if (!p) return done();
    clues = buildClues(p, document.getElementById('guessDiff').value);
    clueIndex = 1;
    card.innerHTML = `
      <div class="subtle">Round ${index+1} of ${total}</div>
      <div style="display:grid; gap:8px; margin-top:8px" class="guess-clues">
        ${clues.slice(0, clueIndex).map(c=>`<div>• ${c}</div>`).join('')}
      </div>
    `;
  }

  function submit() {
    const p = pool[index];
    const val = (document.getElementById('guessInput').value||'').trim();
    if (!val) return;
    if (normalize(val) === normalize(p.name)) score += 1;
    index += 1;
    document.getElementById('guessInput').value = '';
    render();
  }

  document.getElementById('guessSubmit').addEventListener('click', submit);
  document.getElementById('nextClue').addEventListener('click', () => {
    const p = pool[index];
    if (!p) return;
    if (clueIndex < clues.length) {
      clueIndex += 1;
      const list = card.querySelector('.guess-clues');
      list.insertAdjacentHTML('beforeend', `<div>• ${clues[clueIndex-1]}</div>`);
    }
  });

  document.getElementById('guessDiff').addEventListener('change', () => render());

  function done() {
    card.innerHTML = `<h3>Score: ${score}/${total}</h3>`;
    logSession({ mode: 'guess', score: score/total, completion: 1, correct: score, total });
  }

  function normalize(s){ return (s||'').toLowerCase().replace(/[^a-z]/g,''); }

  render();
}