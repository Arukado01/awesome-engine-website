import { ui } from '../i18n/client';

const preview = document.querySelector<HTMLImageElement>('#runner-preview');
const toggle = document.querySelector<HTMLButtonElement>('.hero-motion-toggle');
const animated = preview?.dataset.animatedSrc;
const poster = preview?.dataset.posterSrc;

if (preview && toggle && animated && poster) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !reducedMotion.matches;
  let inView = !('IntersectionObserver' in window);

  function update() {
    if (!preview || !toggle || !animated || !poster) return;
    const playing = enabled && inView && !document.hidden;
    const source = playing ? animated : poster;
    if (preview.getAttribute('src') !== source) preview.src = source;
    toggle.dataset.playing = String(enabled);
    toggle.setAttribute('aria-label', ui(enabled ? 'pauseRunner' : 'playRunner'));
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    update();
  });
  reducedMotion.addEventListener('change', () => {
    enabled = !reducedMotion.matches;
    update();
  });
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(preview);
  }
  preview.addEventListener('error', () => {
    if (preview.getAttribute('src') !== animated) return;
    enabled = false;
    update();
    toggle.hidden = true;
  });
  update();
}
