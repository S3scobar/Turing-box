// Turing Box · interacciones mínimas: intro, nodo activo del escenario e interruptor de nodos.
const root = document.documentElement;

// Intro: se retira al terminar, al pulsar "Saltar", con un clic o con Escape.
const intro = document.querySelector('.intro');
if (root.classList.contains('intro-on') && intro) {
  const end = () => {
    root.classList.remove('intro-on');
    try { sessionStorage.setItem('tb-intro', '1'); } catch (e) {}
  };
  const skip = () => {
    intro.classList.add('is-skipping');
    setTimeout(end, 300);
  };
  intro.addEventListener('animationend', (e) => { if (e.target === intro) end(); });
  intro.addEventListener('click', skip);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') skip(); }, { once: true });
}

// Escenario de nodos: el paso que cruza el centro de la pantalla define el nodo visible.
const modes = document.querySelector('.modes');
if (modes) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) modes.dataset.active = entry.target.dataset.mode;
    }
  }, { rootMargin: '-50% 0px -50% 0px' });
  modes.querySelectorAll('.step').forEach((step) => io.observe(step));
}

// Nodos: la URL (#horizons…, #ia…) decide la vista, así funcionan atrás, adelante y los enlaces directos.
const NODES = {
  horizons: { title: 'Turing Box Horizons · Nodo de software', theme: '#071230' },
  ia: { title: 'Turing Box IA · Modo de inteligencia artificial', theme: '#120A33' },
};
const themeColor = document.querySelector('meta[name="theme-color"]');
const generalTitle = document.title;
const modeOf = (hash) => Object.keys(NODES).find((m) => hash === `#${m}` || hash.startsWith(`#${m}-`)) ?? null;
let origin; // centro del botón o enlace pulsado: de ahí nacen el círculo y la difusión

const setMode = (mode) => {
  if (mode) root.dataset.mode = mode; else delete root.dataset.mode;
  document.querySelectorAll('.mode-switch__btn').forEach((b) => b.setAttribute('aria-checked', b.dataset.mode === mode));
  themeColor.content = mode ? NODES[mode].theme : '#16112E';
  document.title = mode ? NODES[mode].title : generalTitle;
};

// Efecto IA: la vista nueva se "genera" desde ruido, como un modelo de difusión.
// El ruido cubre la pantalla, se cambia la vista y los píxeles se resuelven desde el punto pulsado.
const NOISE = ['#120A33', '#22145C', '#2A1870', '#4E31A3', '#7C4DFF', '#AA8BFF'];
const diffuse = (update, { x, y }) => new Promise((resolve) => {
  const S = innerWidth < 600 ? 18 : 24; // píxel del ruido
  const cols = Math.ceil(innerWidth / S), rows = Math.ceil(innerHeight / S);
  const canvas = Object.assign(document.createElement('canvas'), { width: cols * S, height: rows * S, className: 'diffusion' });
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const cells = [];
  for (let i = 0; i < cols * rows; i++) {
    const cx = (i % cols) * S, cy = Math.floor(i / cols) * S;
    const r = Math.random();
    cells.push({
      cx, cy, on: Math.random(),
      off: 0.55 * Math.hypot(cx - x, cy - y) / far + 0.45 * Math.random(), // se resuelve desde el clic, con ruido
      color: r < 0.03 ? '#3FE0C5' : r < 0.05 ? '#FF8FB8' : NOISE[Math.floor(Math.random() * NOISE.length)],
    });
  }
  const IN = 360, OUT = 760, STEPS = 20;
  const t0 = performance.now();
  let swapped = false;
  const frame = (now) => {
    const t = now - t0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (t < IN) {
      const k = t / IN;
      for (const c of cells) if (c.on < k) { ctx.fillStyle = c.color; ctx.fillRect(c.cx, c.cy, S, S); }
    } else {
      if (!swapped) { update(); swapped = true; }
      const k = Math.min(1, (t - IN) / OUT);
      for (const c of cells) {
        const left = (c.off - k) * 5; // los píxeles se encogen antes de desaparecer
        if (left <= 0) continue;
        const size = Math.min(1, left) * S;
        ctx.fillStyle = c.color;
        ctx.fillRect(c.cx + (S - size) / 2, c.cy + (S - size) / 2, size, size);
      }
      ctx.fillStyle = '#3FE0C5';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText(`difusión · paso ${Math.min(STEPS, Math.ceil(k * STEPS))}/${STEPS}`, 16, canvas.height - 16);
    }
    if (t < IN + OUT) requestAnimationFrame(frame); else { canvas.remove(); resolve(); }
  };
  requestAnimationFrame(frame);
});

const render = () => {
  const next = modeOf(location.hash);
  if (next === (root.dataset.mode ?? null)) return; // mismo nodo: el navegador hace el scroll al ancla
  const update = () => {
    setMode(next);
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.id !== next && target.id !== 'inicio') target.scrollIntoView(); else scrollTo(0, 0);
  };
  // Foco al inicio de la vista nueva para que teclado y lector de pantalla no se pierdan.
  const focus = () => document.getElementById(next ?? 'contenido').focus({ preventScroll: true });
  const { x, y } = origin ?? { x: innerWidth / 2, y: 0 };
  origin = null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (next === 'ia' && !reduce) { diffuse(update, { x, y }).then(focus); return; }
  if (!document.startViewTransition) { update(); focus(); return; }
  const vt = document.startViewTransition(update);
  vt.finished.finally(focus);
  if (reduce) return; // fundido corto definido en CSS
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  vt.ready.then(() => root.animate(
    { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 600, easing: 'cubic-bezier(.2, .8, .2, 1)', pseudoElement: '::view-transition-new(root)' },
  ));
};

addEventListener('click', (e) => {
  const el = e.target.closest('a, button');
  if (!el) return;
  const r = el.getBoundingClientRect();
  origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, true);
addEventListener('hashchange', render);
document.querySelectorAll('.mode-switch__btn').forEach((btn) => {
  if (NODES[btn.dataset.mode]) btn.addEventListener('click', () => { location.hash = btn.dataset.mode; });
});
setMode(modeOf(location.hash));

// Teclado del interruptor (role="radiogroup"): flechas izquierda y derecha mueven el foco.
const keys = [...document.querySelectorAll('.mode-switch__btn')];
document.querySelector('.mode-switch').addEventListener('keydown', (e) => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  const i = keys.indexOf(document.activeElement);
  if (!step || i < 0) return;
  e.preventDefault();
  keys[(i + step + keys.length) % keys.length].focus();
});

// Videojuegos: visible pero aún no funcional.
const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('.mode-switch__btn[aria-disabled="true"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.textContent.trim();
    toast.textContent = `El nodo ${name} llega pronto.`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  });
});
