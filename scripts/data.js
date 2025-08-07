export async function loadPresidents() {
  const res = await fetch('/data/presidents.json');
  const list = await res.json();
  return list.map(p => ({
    ...p,
    order: p.order,
    name: p.name,
    term: p.term,
    party: p.party || 'Other',
    image: p.image || '',
  }));
}

export function buildClues(president, difficulty = 'normal') {
  const clues = [];
  const firstName = president.name.split(' ')[0];
  if (difficulty === 'easy') {
    clues.push(`He was the ${ordinal(president.order)} president.`);
    clues.push(`Served: ${president.term}.`);
    clues.push(`Party: ${president.party}.`);
    clues.push(`Initial: ${firstName.charAt(0)}.`);
  } else if (difficulty === 'hard') {
    clues.push(`Era: ${eraFromYears(president.term)}.`);
    clues.push(`Last letter of last name: ${president.name.split(' ').slice(-1)[0].slice(-1)}.`);
    clues.push(`Order is between ${Math.max(1, president.order-2)} and ${president.order+2}.`);
  } else {
    clues.push(`Order: ${president.order}.`);
    clues.push(`Party: ${president.party}.`);
    clues.push(`Years include ${president.term.split('-')[0].slice(0,3)}?.`);
  }
  return clues;
}

export function eraFromYears(term) {
  const start = parseInt((term||'').split('-')[0], 10);
  if (!Number.isFinite(start)) return 'Unknown';
  if (start < 1820) return 'Early Republic';
  if (start < 1861) return 'Antebellum';
  if (start < 1865) return 'Civil War';
  if (start < 1900) return 'Gilded Age';
  if (start < 1933) return 'Progressive / Interwar';
  if (start < 1945) return 'Great Depression / WWII';
  if (start < 1968) return 'Postwar';
  if (start < 1991) return 'Cold War';
  if (start < 2008) return 'Post–Cold War';
  if (start < 2020) return '21st Century';
  return 'Contemporary';
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}