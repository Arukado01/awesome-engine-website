const picker = document.querySelector<HTMLDetailsElement>('#language-picker');
const trigger = picker?.querySelector<HTMLElement>('summary');
const input = document.querySelector<HTMLInputElement>('#language-search');
const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-locale-link]')];
const empty = document.querySelector<HTMLElement>('#language-empty');
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
function updateDestinations() {
  for (const link of links) {
    const url = new URL(link.href);
    url.search = window.location.search;
    let hash = window.location.hash;
    try {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      const container = target?.matches('h2,h3,h4') ? target.previousElementSibling : null;
      const alias = container?.matches('span[id][aria-hidden="true"]')
        ? container
        : container?.querySelector('span[id][aria-hidden="true"]');
      if (alias?.matches('span[id][aria-hidden="true"]')) hash = '#' + alias.id;
    } catch {
      /* Keep the original fragment if it is not URI-encoded correctly. */
    }
    url.hash = hash;
    link.href = url.pathname + url.search + url.hash;
  }
}
function filterLanguages() {
  let count = 0;
  for (const link of links) {
    link.hidden = !normalize(link.dataset.languageSearch || '').includes(
      normalize(input?.value || ''),
    );
    if (!link.hidden) count++;
  }
  if (empty) empty.hidden = count > 0;
}
function close(restoreFocus = false) {
  if (!picker) return;
  picker.open = false;
  if (restoreFocus) trigger?.focus();
}
picker?.addEventListener('toggle', () => {
  if (picker.open) {
    if (input) input.value = '';
    filterLanguages();
    updateDestinations();
    input?.focus({ preventScroll: true });
  }
});
input?.addEventListener('input', filterLanguages);
picker?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    close(true);
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  const visible = links.filter((link) => !link.hidden);
  if (!visible.length) return;
  event.preventDefault();
  const current = visible.indexOf(document.activeElement as HTMLAnchorElement);
  const next =
    event.key === 'ArrowDown' ? current + 1 : current < 0 ? visible.length - 1 : current - 1;
  visible[(next + visible.length) % visible.length].focus();
});
document.addEventListener('pointerdown', (event) => {
  if (event.target instanceof window.Node && !picker?.contains(event.target)) close();
});
picker?.addEventListener('focusout', (event) => {
  if (event.relatedTarget instanceof window.Node && !picker?.contains(event.relatedTarget)) close();
});
window.addEventListener('hashchange', updateDestinations);
updateDestinations();
export {};
