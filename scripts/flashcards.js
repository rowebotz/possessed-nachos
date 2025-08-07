import { el, qs } from './ui.js';
import { logSession } from './progress.js';
import { Storage } from './storage.js';

const FC_KEY = 'flashcards:v1';

function getDeck(presidents) {
  const saved = Storage.get(FC_KEY);
  const boxes = saved?.boxes || {};
  // Initialize unseen items to box 1
  const deck = presidents.map(p => ({ id: p.order, name: p.name, image: p.image, term: p.term, party: p.party, box: boxes[p.order] || 1 }));
  return deck.sort((a,b) => (a.box - b.box) || (a.id - b.id));
}

function saveDeck(deck) {
  const boxes = Object.fromEntries(deck.map(c => [c.id, c.box]));
  Storage.set(FC_KEY, { boxes });
}

function pickDue(deck, count = 10) {
  // Items in lower boxes are more due
  const due = deck
    .sort((a,b) => a.box - b.box)
    .slice(0, count);
  return due;
}

export function renderFlashcards(container, state) {
  const deck = getDeck(state.presidents);
  const sessionItems = pickDue(deck, 12);
  let index = 0;
  let correct = 0;

  const shell = el('div', { class: 'flashcards' });
  const controls = el('div', { class: 'card', style: 'padding:12px' }, [`
    <div style="display:flex; gap:8px; align-items:center; justify-content: space-between;">
      <div>
        <h2 class="section-title">Flashcards</h2>
        <div class="subtle">Spaced repetition with adaptive difficulty</div>
      </div>
      <div>
        <button class="button" id="btnShuffle">Shuffle</button>
      </div>
    </div>
  `]);

  const stage = el('div', { class: 'flashcard-stage grid cols-2' });
  const viewport = el('div', { class: 'card card-viewport' });
  const flip = el('div', { class: 'flip-card', id: 'flip' });

  const front = el('div', { class: 'flip-face flashcard-front' });
  const back = el('div', { class: 'flip-face back flashcard-back' });
  flip.appendChild(front);
  flip.appendChild(back);
  viewport.appendChild(flip);

  const sidebar = el('div', { class: 'card', style: 'padding:12px' });
  sidebar.innerHTML = `
    <div><strong>Cards This Session</strong>: ${sessionItems.length}</div>
    <div style="margin-top:6px">Use <span class="kbd">Space</span> to flip, then rate: <span class="kbd">1</span> Forgot, <span class="kbd">2</span> Partial, <span class="kbd">3</span> Easy</div>
  `;

  const actions = el('div', { class: 'flashcard-actions' });
  const btnFlip = el('button', { class: 'button primary', id: 'btnFlip' }, ['Flip (Space)']);
  const btn1 = el('button', { class: 'button', id: 'rate1' }, ['1 Forgot']);
  const btn2 = el('button', { class: 'button', id: 'rate2' }, ['2 Partial']);
  const btn3 = el('button', { class: 'button', id: 'rate3' }, ['3 Easy']);
  actions.append(btnFlip, btn1, btn2, btn3);

  viewport.appendChild(actions);
  stage.append(viewport, sidebar);
  shell.append(controls, stage);
  container.appendChild(shell);

  function renderCard() {
    const c = sessionItems[index];
    if (!c) return renderDone();
    front.innerHTML = `
      <img src="${c.image}" alt="Portrait of ${c.name}" onerror="this.remove()" />
      <div class="flashcard-content">
        <div class="subtle">Who is this president?</div>
        <div style="font-size:24px; font-weight:700; letter-spacing: .2px;">${maskName(c.name)}</div>
      </div>
    `;
    back.innerHTML = `
      <div class="flashcard-content">
        <div style="font-size:24px; font-weight:700;">${c.name}</div>
        <div class="subtle">${c.term} • ${c.party}</div>
        <div style="margin-top: 6px;">Tap a rating below to schedule the card.</div>
      </div>
    `;
    flip.classList.remove('flipped');
  }

  function maskName(name) {
    const parts = name.split(' ');
    return parts.map((p,i) => i===parts.length-1 ? p[0] + '—'.repeat(Math.max(0, p.length-1)) : p).join(' ');
  }

  function rateCard(score) {
    const c = sessionItems[index];
    if (!c) return;
    if (score === 1) c.box = Math.max(1, c.box - 1);
    if (score === 2) c.box = Math.max(1, c.box);
    if (score === 3) { c.box = Math.min(5, c.box + 1); correct += 1; }
    const deckIndex = deck.findIndex(d => d.id === c.id);
    if (deckIndex >= 0) deck[deckIndex].box = c.box;
    saveDeck(deck);
    index += 1;
    renderCard();
  }

  function renderDone() {
    viewport.innerHTML = '';
    viewport.appendChild(el('div', { style: 'padding:16px' }, [`
      <h3>Great job!</h3>
      <p>You reviewed ${sessionItems.length} cards. Correct: ${correct}.</p>
      <button class="button primary" id="fcRestart">Review Again</button>
    `]));
    logSession({ mode: 'flashcards', score: correct / Math.max(1, sessionItems.length), completion: 1, correct, total: sessionItems.length, items: sessionItems.map(i=>i.id) });
    qs('#fcRestart').addEventListener('click', () => {
      navigate('/flashcards');
    });
  }

  btnFlip.addEventListener('click', () => flip.classList.toggle('flipped'));
  btn1.addEventListener('click', () => rateCard(1));
  btn2.addEventListener('click', () => rateCard(2));
  btn3.addEventListener('click', () => rateCard(3));
  qs('#btnShuffle').addEventListener('click', () => {
    sessionItems.sort(()=>Math.random()-0.5);
    index = 0;
    renderCard();
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); flip.classList.toggle('flipped'); }
    if (e.key === '1') rateCard(1);
    if (e.key === '2') rateCard(2);
    if (e.key === '3') rateCard(3);
  }, { once: false });

  renderCard();
}