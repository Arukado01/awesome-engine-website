import { ui } from '../i18n/client';
const dialog = document.querySelector<HTMLDialogElement>('#gallery-dialog');
const title = document.querySelector('#gallery-title');
const image = document.querySelector<HTMLImageElement>('#gallery-image');
const count = document.querySelector('#gallery-count');
const caption = document.querySelector('#gallery-caption');
let selected: HTMLButtonElement[] = [];
let index = 0;
let opener: HTMLButtonElement | null = null;
function showImage() {
  const item = selected[index];
  if (!item || !image) return;
  image.src = item.dataset.src || '';
  image.alt = item.dataset.alt || '';
  if (title) title.textContent = item.dataset.title || ui('screenshot');
  if (caption) caption.textContent = item.dataset.alt || '';
  if (count) count.textContent = `${index + 1} / ${selected.length}`;
}
document.querySelectorAll<HTMLButtonElement>('[data-gallery]').forEach((button) =>
  button.addEventListener('click', () => {
    opener = button;
    selected = [
      ...document.querySelectorAll<HTMLButtonElement>(`[data-gallery="${button.dataset.gallery}"]`),
    ];
    index = selected.indexOf(button);
    showImage();
    dialog?.showModal();
  }),
);
function close() {
  dialog?.close();
  opener?.focus();
}
document.querySelector('#gallery-close')?.addEventListener('click', close);
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      close();
  }
});
function change(delta: number) {
  index = (index + delta + selected.length) % selected.length;
  showImage();
}
document.querySelector('#gallery-prev')?.addEventListener('click', () => change(-1));
document.querySelector('#gallery-next')?.addEventListener('click', () => change(1));
dialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    change(-1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    change(1);
  }
});
dialog?.addEventListener('close', () => opener?.focus());
document.querySelectorAll('video').forEach((video) => {
  const loading = video.parentElement?.querySelector<HTMLElement>('.video-loading');
  const error = video.parentElement?.querySelector<HTMLElement>('.video-error');
  const ready = () => {
    if (loading) loading.hidden = true;
    video.removeAttribute('aria-busy');
  };
  video.addEventListener('waiting', () => {
    if (loading) loading.hidden = false;
    video.setAttribute('aria-busy', 'true');
  });
  video.addEventListener('loadstart', () => {
    if (loading) loading.hidden = false;
    video.setAttribute('aria-busy', 'true');
  });
  video.addEventListener('playing', ready);
  video.addEventListener('loadeddata', ready);
  video.addEventListener('pause', ready);
  video.addEventListener('error', () => {
    ready();
    if (error) error.hidden = false;
  });
  video.querySelector('source')?.addEventListener('error', () => {
    ready();
    if (error) error.hidden = false;
  });
  video.addEventListener('play', () =>
    document.querySelectorAll('video').forEach((other) => {
      if (other !== video) other.pause();
    }),
  );
});
export {};
