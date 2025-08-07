function createEl(html) {
  const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild;
}

export function mountQuiz({ rootId, bank, onEarn }) {
  const root = document.getElementById(rootId);
  const container = root.querySelector('#quiz-container');

  let score = 0;
  let idx = 0;
  const total = 8;
  const questions = shuffle(bank).slice(0, total);

  function render() {
    if (idx >= total) return renderSummary();
    const q = questions[idx];
    container.innerHTML = '';
    const qEl = createEl(`<div class="question"><div class="prompt"><strong>Q${idx + 1}.</strong> ${q.prompt}</div><div class="choices"></div><div class="footer"><div>Score: ${score}/${total}</div><button class="btn secondary" id="skip">Skip</button></div></div>`);
    container.appendChild(qEl);
    const choicesEl = qEl.querySelector('.choices');
    q.choices.forEach((c, i) => {
      const btn = createEl(`<button class="choice">${c}</button>`);
      btn.addEventListener('click', () => select(i));
      choicesEl.appendChild(btn);
    });
    qEl.querySelector('#skip').addEventListener('click', () => { idx++; render(); });
  }

  function select(choiceIndex) {
    const q = questions[idx];
    const choiceEls = Array.from(container.querySelectorAll('.choice'));
    choiceEls.forEach((el, i) => {
      el.disabled = true;
      if (i === q.correctIndex) el.classList.add('correct');
      if (i === choiceIndex && i !== q.correctIndex) el.classList.add('wrong');
    });
    if (choiceIndex === q.correctIndex) { score++; onEarn?.(3); }
    setTimeout(() => { idx++; render(); }, 700);
  }

  function renderSummary() {
    container.innerHTML = '';
    const pct = Math.round((score / total) * 100);
    const el = createEl(`<div class="question"><div class="prompt"><strong>Nice!</strong> You scored ${score}/${total} (${pct}%).</div><div class="choices"></div><div class="footer"><button class="btn" id="restart">Try another quiz</button></div></div>`);
    container.appendChild(el);
    el.querySelector('#restart').addEventListener('click', () => {
      score = 0; idx = 0; questions.splice(0, questions.length, ...shuffle(bank).slice(0, total)); render();
    });
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  render();
}