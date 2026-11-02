// Animate presentation only. Content stays readable if JavaScript or motion is disabled.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const active = new Set<Animation>();
const seen = new WeakSet<Element>();
const entranceTargets = [
  '.hero-copy > *',
  '.hero-visual',
  '.page-intro .container > *',
  '.section-heading',
  '.feature',
  '.tech-strip .container',
  '.pipeline',
  '.showcase-preview',
  '.code-section > div',
  '.latest-update',
  '.final-cta',
  '.about-layout > *',
  '.system-row',
  '.architecture-diagram',
  '.technology-list > *',
  '.game-heading',
  '.game-overview > *',
  '.screenshot-gallery > figure',
  '.video-figure',
  '.timeline-entry',
  '.roadmap-grid > *',
  '.docs-start',
  '.doc-card',
  '.contact-info',
  '#contact-form',
].join(',');
function play(element: Element, frames: Keyframe[], duration: number, delay = 0) {
  if (reducedMotion.matches || typeof element.animate !== 'function') return;
  const animation = element.animate(frames, {
    duration,
    delay,
    easing: 'cubic-bezier(.16, 1, .3, 1)',
    fill: 'backwards',
  });
  active.add(animation);
  animation.onfinish = animation.oncancel = () => active.delete(animation);
}
function enter(element: Element, delay: number) {
  if (seen.has(element)) return;
  seen.add(element);
  play(
    element,
    [
      { opacity: 0, transform: 'translateY(26px)' },
      { opacity: 1, transform: 'none' },
    ],
    850,
    delay,
  );
  element.classList.add('motion-entered');
  if (element.matches('.pipeline')) {
    element.querySelectorAll('.pipeline-step').forEach((step, i) => {
      play(
        step,
        [
          { backgroundColor: 'transparent' },
          { backgroundColor: 'var(--surface-2)', offset: 0.3 },
          { backgroundColor: 'transparent' },
        ],
        1100,
        delay + i * 330,
      );
      const number = step.querySelector('.pipeline-number');
      if (number)
        play(
          number,
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(6px)', offset: 0.3 },
            { transform: 'translateX(0)' },
          ],
          1100,
          delay + i * 330,
        );
    });
  }
}
if ('IntersectionObserver' in window) {
  const observer = new window.IntersectionObserver(
    (entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        enter(entry.target, Math.min(order++ * 85, 340));
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
  );
  document.querySelectorAll(entranceTargets).forEach((element) => observer.observe(element));
}
// Finish entrances for keyboard focus only. Moving a pointer target between
// pointerdown and pointerup would prevent its native click (for example, summary).
let keyboardNavigation = false;
document.addEventListener(
  'keydown',
  () => {
    keyboardNavigation = true;
  },
  true,
);
document.addEventListener(
  'pointerdown',
  () => {
    keyboardNavigation = false;
  },
  true,
);
document.addEventListener('focusin', () => {
  if (!keyboardNavigation) return;
  active.forEach((animation) => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    if (target instanceof window.Element && target.contains(document.activeElement))
      animation.finish();
  });
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) active.forEach((animation) => animation.cancel());
});
export {};
