import { ui, plural } from '../i18n/client';
const picker = document.querySelector<HTMLElement>('#category-picker');
const select = document.querySelector<HTMLSelectElement>('#update-category');
const trigger = document.querySelector<HTMLButtonElement>('#category-trigger');
const panel = document.querySelector<HTMLElement>('#category-panel');
const input = document.querySelector<HTMLInputElement>('#category-search');
const selectedLabel = document.querySelector<HTMLElement>('#category-selected');
const options = [...document.querySelectorAll<HTMLElement>('[data-category-value]')];
const empty = document.querySelector<HTMLElement>('#category-empty');
const count = document.querySelector<HTMLElement>('#category-result-count');
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

if (picker && select && trigger && panel && input && selectedLabel && empty && count) {
  let active: HTMLElement | undefined;
  const visibleOptions = () => options.filter((option) => !option.hidden);
  function setActive(option?: HTMLElement, scroll = false) {
    active = option;
    options.forEach((item) => item.classList.toggle('is-active', item === option));
    if (option) {
      input!.setAttribute('aria-activedescendant', option.id);
      if (scroll) option.scrollIntoView({ block: 'nearest' });
    } else input!.removeAttribute('aria-activedescendant');
  }
  function filterOptions() {
    const query = normalize(input!.value.trim());
    options.forEach((option) => {
      option.hidden = !normalize(option.textContent || '').includes(query);
    });
    const visible = visibleOptions();
    empty!.hidden = visible.length > 0;
    count!.textContent = plural('optionsOne', 'optionsOther', visible.length);
    setActive(
      visible.find((option) => option.dataset.categoryValue === select!.value) || visible[0],
    );
  }
  function syncSelection() {
    const label = select!.selectedOptions[0]?.textContent || ui('allCategories');
    selectedLabel!.textContent = label;
    trigger!.setAttribute('aria-label', ui('categoryLabel', { label }));
    trigger!.title = label;
    options.forEach((option) =>
      option.setAttribute('aria-selected', String(option.dataset.categoryValue === select!.value)),
    );
    if (!panel!.hidden) filterOptions();
  }
  function positionPanel() {
    if (panel!.hidden) return;
    const rect = trigger!.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const below = viewportBottom - rect.bottom - 12;
    const above = rect.top - (viewport?.offsetTop || 0) - 12;
    const upward = below < 280 && above > below;
    panel!.dataset.placement = upward ? 'top' : 'bottom';
    panel!.style.maxHeight = Math.max(160, Math.min(390, upward ? above : below)) + 'px';
  }
  function close(restoreFocus = false) {
    if (panel!.hidden) return;
    panel!.hidden = true;
    trigger!.setAttribute('aria-expanded', 'false');
    input!.setAttribute('aria-expanded', 'false');
    input!.removeAttribute('aria-activedescendant');
    if (restoreFocus) trigger!.focus({ preventScroll: true });
  }
  function open() {
    panel!.hidden = false;
    trigger!.setAttribute('aria-expanded', 'true');
    input!.setAttribute('aria-expanded', 'true');
    input!.value = '';
    filterOptions();
    positionPanel();
    input!.focus({ preventScroll: true });
    setActive(active, true);
  }
  function choose(option: HTMLElement) {
    select!.value = option.dataset.categoryValue || 'all';
    select!.dispatchEvent(new window.Event('change', { bubbles: true }));
    close(true);
  }
  trigger.addEventListener('click', () => (panel.hidden ? open() : close(true)));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
      if (event.key === 'ArrowUp') setActive(visibleOptions().at(-1));
    }
  });
  input.addEventListener('input', filterOptions);
  input.addEventListener('keydown', (event) => {
    const visible = visibleOptions();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const current = active ? visible.indexOf(active) : -1;
      const next = event.key === 'ArrowDown' ? current + 1 : current - 1;
      setActive(
        visible.length ? visible[(next + visible.length) % visible.length] : undefined,
        true,
      );
    } else if (event.key === 'Enter' && active) {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Tab') {
      // Put the focus origin back on the trigger, then let native Tab navigation continue.
      close(true);
    }
  });
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  });
  options.forEach((option) => {
    option.addEventListener('pointerdown', (event) => event.preventDefault());
    option.addEventListener('click', () => choose(option));
    option.addEventListener('pointermove', () => setActive(option));
  });
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof window.Node && !picker.contains(event.target)) close();
  });
  picker.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof window.Node && !picker.contains(event.relatedTarget))
      close();
  });
  select.addEventListener('change', syncSelection);
  window.addEventListener('pageshow', syncSelection);
  window.addEventListener('resize', positionPanel);
  window.visualViewport?.addEventListener('resize', positionPanel);
  syncSelection();
  select.hidden = true;
  trigger.hidden = false;
}
export {};
