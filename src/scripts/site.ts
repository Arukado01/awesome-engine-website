import { ui } from '../i18n/client';
type Theme = 'system' | 'dark' | 'light';
const media = window.matchMedia('(prefers-color-scheme: dark)');
const picker = document.querySelector<HTMLElement>('#theme-picker');
const trigger = document.querySelector<HTMLButtonElement>('#theme-trigger');
const panel = document.querySelector<HTMLElement>('#theme-panel');
const themeOptions = [...document.querySelectorAll<HTMLInputElement>('input[name="theme"]')];
const themeLabels = { system: ui('system'), dark: ui('dark'), light: ui('light') };
let theme: Theme = 'system';
try {
  const saved = localStorage.getItem('ae-theme');
  if (saved === 'light' || saved === 'dark') theme = saved;
} catch {
  /* Private browsing still gets an in-memory choice. */
}
function applyTheme() {
  document.documentElement.dataset.theme =
    theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
  themeOptions.forEach((option) => {
    option.checked = option.value === theme;
  });
  const label = trigger?.querySelector('.theme-current');
  if (label) label.textContent = themeLabels[theme];
  trigger?.querySelectorAll<SVGElement>('[data-theme-icon]').forEach((icon) => {
    icon.dataset.active = String(icon.dataset.themeIcon === theme);
  });
}
function closeTheme(restoreFocus = false) {
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  trigger?.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger?.focus();
}
applyTheme();
if (picker && trigger && panel) {
  picker.hidden = false;
  trigger.addEventListener('click', () => {
    if (!panel.hidden) {
      closeTheme(true);
      return;
    }
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    themeOptions.find((option) => option.checked)?.focus({ preventScroll: true });
  });
  themeOptions.forEach((option) =>
    option.addEventListener('change', () => {
      if (!option.checked) return;
      theme = option.value as Theme;
      try {
        localStorage.setItem('ae-theme', theme);
      } catch {
        /* Keep choice in memory. */
      }
      applyTheme();
    }),
  );
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof window.Node && !picker.contains(event.target)) closeTheme();
  });
  picker.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof window.Node && !picker.contains(event.relatedTarget))
      closeTheme();
  });
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.stopPropagation();
      closeTheme(true);
    }
  });
}
media.addEventListener('change', () => {
  if (theme === 'system') applyTheme();
});
const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-nav');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', ui('menuOpen'));
  nav?.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? ui('menuClose') : ui('menuOpen'));
  nav?.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 1101px)').addEventListener('change', closeMenu);
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) =>
  button.addEventListener('click', async () => {
    const text = button.closest('.code-wrap')?.querySelector('code')?.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = ui('copied');
    } catch {
      button.textContent = ui('copyError');
    }
    setTimeout(() => {
      button.textContent = ui('copy');
    }, 2500);
  }),
);
export {};
