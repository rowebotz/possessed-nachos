export function qs(sel, root = document) { return root.querySelector(sel); }
export function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === 'className') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== undefined && v !== null) node.setAttribute(k, v);
  });
  for (const child of children) {
    if (typeof child === 'string') node.insertAdjacentHTML('beforeend', child);
    else if (child) node.appendChild(child);
  }
  return node;
}

export function showToast(message) {
  const toaster = qs('#toaster');
  const t = el('div', { class: 'toast', role: 'status' }, [message]);
  toaster.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

export function formatPercent(n) {
  if (!isFinite(n)) return '0%';
  return `${Math.round(n*100)}%`;
}