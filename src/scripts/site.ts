type Theme = 'system' | 'dark' | 'light';
const media = window.matchMedia('(prefers-color-scheme: dark)');
const selector = document.querySelector<HTMLSelectElement>('#theme-select');
let theme: Theme = 'system';
try {
  const saved = localStorage.getItem('ae-theme');
  if (saved === 'light' || saved === 'dark') theme = saved;
} catch {
  /* private browsing */
}
function applyTheme() {
  document.documentElement.dataset.theme =
    theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
}
if (selector) {
  selector.value = theme;
  selector.addEventListener('change', () => {
    theme = selector.value as Theme;
    try {
      localStorage.setItem('ae-theme', theme);
    } catch {
      /* theme still works in memory */
    }
    applyTheme();
  });
}
media.addEventListener('change', () => {
  if (theme === 'system') applyTheme();
});
const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-nav');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Abrir navegación');
  nav?.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
  nav?.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) =>
  button.addEventListener('click', async () => {
    const text = button.closest('.code-wrap')?.querySelector('code')?.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copiado ✓';
    } catch {
      button.textContent = 'Selecciona y copia el código';
    }
    setTimeout(() => {
      button.textContent = 'Copiar';
    }, 2500);
  }),
);
export {};
