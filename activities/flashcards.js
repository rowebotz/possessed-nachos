function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function mountFlashcards({ rootId, concepts, onEarn }) {
  const root = document.getElementById(rootId);
  const card = document.getElementById('flashcard');
  const front = document.getElementById('flashcard-front');
  const back = document.getElementById('flashcard-back');
  const remainingEl = document.getElementById('flashcard-remaining');
  const btnRight = document.getElementById('flashcard-right');
  const btnWrong = document.getElementById('flashcard-wrong');

  let queue = shuffle(concepts.slice());
  let current = null;

  function nextCard() {
    if (queue.length === 0) {
      queue = shuffle(concepts.slice());
    }
    current = queue.shift();
    front.textContent = current.title;
    back.textContent = current.explain;
    remainingEl.textContent = String(queue.length);
    card.classList.remove('flip');
  }

  card.addEventListener('click', () => {
    card.classList.toggle('flip');
  });

  btnRight.addEventListener('click', () => {
    onEarn?.(2);
    nextCard();
  });
  btnWrong.addEventListener('click', () => {
    onEarn?.(1);
    // Requeue the current one later
    if (current) queue.splice(Math.min(3, queue.length), 0, current);
    nextCard();
  });

  nextCard();
}