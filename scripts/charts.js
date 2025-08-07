export function drawSparkline(canvas, points = [], options = {}) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth * dpr;
  const height = canvas.clientHeight * dpr;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,width,height);

  if (!points.length) return;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const pad = 6 * dpr;
  const xStep = (width - pad*2) / Math.max(1, points.length - 1);
  const yScale = max === min ? 1 : (height - pad*2) / (max - min);

  ctx.lineWidth = 2 * dpr;
  ctx.strokeStyle = '#0b3d91';
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = pad + i * xStep;
    const y = height - pad - (p - min) * yScale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, 'rgba(11,61,145,0.15)');
  grad.addColorStop(1, 'rgba(11,61,145,0)');
  ctx.fillStyle = grad;
  ctx.lineTo(width - pad, height - pad);
  ctx.lineTo(pad, height - pad);
  ctx.closePath();
  ctx.fill();
}

export function drawRing(el, percent, color = '#0b3d91') {
  const size = 90;
  el.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  const r = 40;
  const cx = size/2, cy = size/2;
  const c = 2 * Math.PI * r;

  const bg = document.createElementNS(svg.namespaceURI, 'circle');
  bg.setAttribute('cx', cx); bg.setAttribute('cy', cy); bg.setAttribute('r', r);
  bg.setAttribute('stroke', '#e2e8f0');
  bg.setAttribute('stroke-width', '10');
  bg.setAttribute('fill', 'none');
  svg.appendChild(bg);

  const fg = document.createElementNS(svg.namespaceURI, 'circle');
  fg.setAttribute('cx', cx); fg.setAttribute('cy', cy); fg.setAttribute('r', r);
  fg.setAttribute('stroke', color);
  fg.setAttribute('stroke-width', '10');
  fg.setAttribute('fill', 'none');
  fg.setAttribute('stroke-dasharray', `${c}`);
  fg.setAttribute('stroke-dashoffset', `${c * (1 - Math.max(0, Math.min(1, percent)))}`);
  fg.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
  svg.appendChild(fg);

  const text = document.createElementNS(svg.namespaceURI, 'text');
  text.setAttribute('x', cx);
  text.setAttribute('y', cy + 4);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '14');
  text.setAttribute('fill', '#1f2937');
  text.textContent = `${Math.round(percent*100)}%`;
  svg.appendChild(text);

  el.appendChild(svg);
}