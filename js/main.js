// Turing Box · interacciones mínimas: intro, modo activo del escenario y aviso del interruptor.
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

// Escenario de modos: el paso que cruza el centro de la pantalla define el modo visible.
const modes = document.querySelector('.modes');
if (modes) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) modes.dataset.active = entry.target.dataset.mode;
    }
  }, { rootMargin: '-50% 0px -50% 0px' });
  modes.querySelectorAll('.step').forEach((step) => io.observe(step));
}

// Interruptor de modos: visible pero aún no funcional.
const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('.mode-switch__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.textContent.trim();
    toast.textContent = `El modo ${name} llega pronto. Por ahora estás en la vista general.`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  });
});
