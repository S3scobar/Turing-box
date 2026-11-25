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

// Nodo Horizons: la URL (#horizons…) decide la vista, así funcionan atrás, adelante y los enlaces directos.
const hzBtn = document.querySelector('.mode-switch__btn[data-mode="horizons"]');
const themeColor = document.querySelector('meta[name="theme-color"]');
const generalTitle = document.title;
const isHz = () => location.hash.startsWith('#horizons');
let origin; // centro del botón o enlace pulsado: de ahí nace el círculo

const setMode = (hz) => {
  if (hz) root.dataset.mode = 'horizons'; else delete root.dataset.mode;
  hzBtn.setAttribute('aria-checked', hz);
  themeColor.content = hz ? '#071230' : '#16112E';
  document.title = hz ? 'Turing Box Horizons · Nodo de software' : generalTitle;
};

const render = () => {
  const hz = isHz();
  if (hz === (root.dataset.mode === 'horizons')) return; // mismo nodo: el navegador hace el scroll al ancla
  const update = () => {
    setMode(hz);
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.id !== 'horizons' && target.id !== 'inicio') target.scrollIntoView(); else scrollTo(0, 0);
  };
  // Foco al inicio de la vista nueva para que teclado y lector de pantalla no se pierdan.
  const focus = () => (hz ? document.getElementById('horizons') : document.getElementById('contenido')).focus({ preventScroll: true });
  if (!document.startViewTransition) { update(); focus(); return; }
  const { x, y } = origin ?? { x: innerWidth / 2, y: 0 };
  origin = null;
  const vt = document.startViewTransition(update);
  vt.finished.finally(focus);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // fundido corto definido en CSS
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
hzBtn.addEventListener('click', () => { if (!isHz()) location.hash = 'horizons'; });
setMode(isHz());

// Teclado del interruptor (role="radiogroup"): flechas izquierda y derecha mueven el foco.
const keys = [...document.querySelectorAll('.mode-switch__btn')];
document.querySelector('.mode-switch').addEventListener('keydown', (e) => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  const i = keys.indexOf(document.activeElement);
  if (!step || i < 0) return;
  e.preventDefault();
  keys[(i + step + keys.length) % keys.length].focus();
});

// IA y Videojuegos: visibles pero aún no funcionales.
const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('.mode-switch__btn:not([data-mode="horizons"])').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.textContent.trim();
    toast.textContent = `El nodo ${name} llega pronto.`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  });
});
