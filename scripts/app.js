import { loadPresidents } from './data.js';
import { Storage } from './storage.js';
import { showToast, qs, qsa } from './ui.js';
import { renderDashboard } from './progress.js';
import { renderFlashcards } from './flashcards.js';
import { renderQuiz } from './quiz.js';
import { renderGuessing } from './guessing.js';
import { renderMouseAndCheese } from './snake.js';

const AppState = {
  presidents: [],
  user: {
    achievements: [],
  },
  session: {
    currentRoute: '/dashboard',
  },
};

async function init() {
  try {
    await Promise.all([
      ensureServiceWorker(),
      hydrateData(),
    ]);
    bindNav();
    navigate(location.hash.replace('#', '') || '/dashboard');
  } catch (err) {
    console.error(err);
    showToast('Failed to initialize app. Some features may be unavailable.');
  }
}

async function hydrateData() {
  const cached = Storage.get('presidents');
  if (cached && Array.isArray(cached) && cached.length > 0) {
    AppState.presidents = cached;
  } else {
    const presidents = await loadPresidents();
    AppState.presidents = presidents;
    Storage.set('presidents', presidents);
  }
}

function bindNav() {
  const buttons = qsa('.main-nav .nav-link');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
  window.addEventListener('hashchange', () => {
    navigate(location.hash.replace('#', '') || '/dashboard');
  });
}

export function navigate(route) {
  if (!route.startsWith('/')) route = `/${route}`;
  AppState.session.currentRoute = route;
  history.replaceState({}, '', `#${route}`);
  qsa('.nav-link').forEach(el => el.setAttribute('aria-current', el.dataset.route === route ? 'page' : 'false'));
  renderRoute(route);
}

function renderRoute(route) {
  const app = qs('#app');
  app.innerHTML = '';
  switch (route) {
    case '/dashboard':
      renderDashboard(app, AppState);
      break;
    case '/flashcards':
      renderFlashcards(app, AppState);
      break;
    case '/quiz':
      renderQuiz(app, AppState);
      break;
    case '/guess':
      renderGuessing(app, AppState);
      break;
    case '/mouse-and-cheese':
      renderMouseAndCheese(app, AppState);
      break;
    case '/library':
      renderLibrary(app, AppState);
      break;
    case '/help':
      renderHelp(app);
      break;
    default:
      renderNotFound(app);
  }
}

function renderLibrary(container, state) {
  const wrapper = document.createElement('div');
  wrapper.className = 'library';
  wrapper.innerHTML = `
    <div class="card" style="padding:16px">
      <h2 class="section-title">Presidential Library</h2>
      <div style="display:flex; gap:8px; flex-wrap: wrap; margin-bottom: 8px;">
        <input id="libSearch" class="input" placeholder="Search by name, party, or year" style="max-width: 320px" aria-label="Search presidents" />
        <select id="libParty" aria-label="Filter by party">
          <option value="">All Parties</option>
          <option>Federalist</option>
          <option>Democratic-Republican</option>
          <option>Democrat</option>
          <option>Whig</option>
          <option>Republican</option>
          <option>National Union</option>
          <option>Independent</option>
          <option>Other</option>
        </select>
      </div>
      <div class="library-grid" id="libGrid"></div>
    </div>
  `;
  container.appendChild(wrapper);

  const grid = wrapper.querySelector('#libGrid');
  function renderItems(items) {
    grid.innerHTML = items.map(p => `
      <div class="card library-item" role="article">
        <img src="${p.image || ''}" alt="Portrait of ${p.name}" onerror="this.remove()" />
        <div style="padding:12px">
          <div style="font-weight:600">${p.order}. ${p.name}</div>
          <div class="subtle">${p.term}</div>
          <div class="subtle">${p.party}</div>
        </div>
      </div>
    `).join('');
  }
  renderItems(state.presidents);

  function applyFilters() {
    const term = wrapper.querySelector('#libSearch').value.toLowerCase();
    const party = wrapper.querySelector('#libParty').value;
    const items = state.presidents.filter(p => {
      const text = `${p.name} ${p.party} ${p.term}`.toLowerCase();
      const matchesText = !term || text.includes(term);
      const matchesParty = !party || p.party === party;
      return matchesText && matchesParty;
    });
    renderItems(items);
  }

  wrapper.querySelector('#libSearch').addEventListener('input', applyFilters);
  wrapper.querySelector('#libParty').addEventListener('change', applyFilters);
}

function renderHelp(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'help';
  wrapper.innerHTML = `
    <div class="card" style="padding:16px">
      <h2 class="section-title">How to Play & Learn</h2>
      <p>Cycle between different modes to engage multiple memory systems: recognition (quiz), recall (guessing), and spaced repetition (flashcards). Earn streaks by completing at least one session daily.</p>
      <ul>
        <li><strong>Flashcards</strong>: Flip and rate your recall. The schedule adapts to you.</li>
        <li><strong>Quiz</strong>: Multiple choice, true/false, and type-in challenges that scale in difficulty.</li>
        <li><strong>Guessing</strong>: Reveal clues progressively and type the president. Choose difficulty.</li>
        <li><strong>Mouse & Cheese</strong>: Collect cheese to hear names aloud while practicing quick recognition.</li>
      </ul>
      <p>Keyboard tips: <span class="kbd">Space</span> flip card, <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span> rate recall, <span class="kbd">Arrow Keys</span> move in game.</p>
    </div>
  `;
  container.appendChild(wrapper);
}

function renderNotFound(container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.padding = '24px';
  card.innerHTML = `<h2>Not Found</h2><p>That page does not exist.</p>`;
  container.appendChild(card);
}

async function ensureServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
    } catch (e) {
      // non-fatal
    }
  }
}

init();