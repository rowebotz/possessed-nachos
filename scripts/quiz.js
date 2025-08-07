import { el, qs } from './ui.js';
import { logSession } from './progress.js';

export function renderQuiz(container, state) {
  const shell = el('div', { class: 'quiz' });
  const header = el('div', { class: 'card', style: 'padding:12px' }, [`
    <div style="display:flex; align-items:center; justify-content: space-between;">
      <div>
        <h2 class="section-title">Quiz</h2>
        <div class="subtle">Multiple-choice, True/False, and Type-in</div>
      </div>
      <div>
        <label>Difficulty
          <select id="quizDiff">
            <option value="easy">Easy</option>
            <option value="normal" selected>Normal</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>
    </div>
  `]);

  const card = el('div', { class: 'card', style: 'padding:16px' });
  const footer = el('div', { class: 'card', style: 'padding:12px' });

  shell.append(header, card, footer);
  container.appendChild(shell);

  let index = 0;
  const total = 10;
  let correct = 0;

  const questions = makeQuestions(state.presidents, total, qs('#quizDiff').value);

  function renderQ() {
    const q = questions[index];
    if (!q) return done();
    card.innerHTML = '';
    card.appendChild(el('div', {}, [`<div class="subtle">Question ${index+1} of ${total}</div>`]));
    card.appendChild(el('h3', {}, [q.prompt]));

    if (q.type === 'mc') {
      const list = el('div', { class: 'quiz-options' });
      q.options.forEach(opt => {
        const btn = el('button', { class: 'button quiz-option' }, [opt]);
        btn.addEventListener('click', () => submit(opt === q.answer));
        list.appendChild(btn);
      });
      card.appendChild(list);
    } else if (q.type === 'tf') {
      const yes = el('button', { class: 'button quiz-option' }, ['True']);
      const no = el('button', { class: 'button quiz-option' }, ['False']);
      yes.addEventListener('click', () => submit(q.answer === true));
      no.addEventListener('click', () => submit(q.answer === false));
      card.append(yes, no);
    } else if (q.type === 'text') {
      const input = el('input', { class: 'input', placeholder: 'Type full name', 'aria-label': 'Type your answer' });
      const btn = el('button', { class: 'button primary' }, ['Submit']);
      btn.addEventListener('click', () => submit(normalize(input.value) === normalize(q.answer)));
      card.append(input, el('div', { style:'height:8px' }), btn);
    }
  }

  function submit(isCorrect) {
    if (isCorrect) correct += 1;
    index += 1;
    renderQ();
  }

  function done() {
    card.innerHTML = `<h3>Score: ${correct}/${total} (${Math.round(correct/total*100)}%)</h3>`;
    footer.innerHTML = '';
    footer.appendChild(el('button', { class: 'button primary' }, ['Retry']));
    footer.firstChild.addEventListener('click', () => {
      navigate('/quiz');
    });
    logSession({ mode: 'quiz', score: correct/total, completion: 1, correct, total });
  }

  qs('#quizDiff').addEventListener('change', (e) => {
    index = 0; correct = 0;
    questions.splice(0, questions.length, ...makeQuestions(state.presidents, total, e.target.value));
    renderQ();
  });

  renderQ();
}

function makeQuestions(presidents, n, difficulty) {
  const qs = [];
  const sample = [...presidents].sort(()=>Math.random()-0.5).slice(0, n);
  for (const p of sample) {
    const type = pickType(difficulty);
    if (type === 'mc') {
      const opts = [p.name];
      while (opts.length < (difficulty==='hard'?5:(difficulty==='easy'?3:4))) {
        const other = presidents[Math.floor(Math.random()*presidents.length)].name;
        if (!opts.includes(other)) opts.push(other);
      }
      qs.push({ type: 'mc', prompt: `Who served during ${p.term}?`, options: shuffle(opts), answer: p.name });
    } else if (type === 'tf') {
      const coin = Math.random()<0.5;
      if (coin) {
        qs.push({ type: 'tf', prompt: `${p.name} was a member of the ${p.party} party.`, answer: true });
      } else {
        const wrongParty = randomDifferent(presidents.map(x=>x.party), p.party);
        qs.push({ type: 'tf', prompt: `${p.name} was a member of the ${wrongParty} party.`, answer: false });
      }
    } else {
      qs.push({ type: 'text', prompt: `Name the ${ordinal(p.order)} president.`, answer: p.name });
    }
  }
  return qs;
}

function pickType(diff) {
  const pool = diff==='easy' ? ['mc','tf'] : diff==='hard' ? ['mc','text','tf','text'] : ['mc','tf','text'];
  return pool[Math.floor(Math.random()*pool.length)];
}

function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
function randomDifferent(list, not) { const uniq = [...new Set(list.filter(x=>x!==not))]; return uniq[Math.floor(Math.random()*uniq.length)] || list[0]; }
function ordinal(n){ const s=["th","st","nd","rd"],v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }
function normalize(s){ return (s||'').toLowerCase().replace(/[^a-z]/g,''); }