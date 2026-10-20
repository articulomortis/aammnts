const ACTIVE_CLASS = 'lightbox--active';

function openLightbox(src: string, alt: string) {
  const lightbox = document.querySelector<HTMLElement>('[data-lightbox]');
  const img = lightbox?.querySelector<HTMLImageElement>('[data-lightbox-img]');
  if (!lightbox || !img) return;

  img.src = src;
  img.alt = alt;
  lightbox.classList.add(ACTIVE_CLASS);
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.querySelector<HTMLElement>('[data-lightbox]');
  if (!lightbox) return;

  lightbox.classList.remove(ACTIVE_CLASS);
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function handleTriggerClick(event: Event) {
  const trigger = (event.target as HTMLElement)?.closest<HTMLElement>('[data-lightbox-trigger]');
  if (!trigger) return;

  const src = trigger.getAttribute('data-lightbox-src');
  const alt = trigger.getAttribute('data-lightbox-alt') ?? '';
  if (src) openLightbox(src, alt);
}

function handleCloseClick(event: Event) {
  const target = event.target as HTMLElement;
  const isCloseButton = target.closest('[data-lightbox-close]');
  const isBackdrop = target.matches('[data-lightbox]');
  if (isCloseButton || isBackdrop) closeLightbox();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeLightbox();
}

let initialized = false;

export function initLightbox() {
  if (initialized) return () => {};
  initialized = true;

  document.addEventListener('click', handleTriggerClick);
  document.addEventListener('click', handleCloseClick);
  document.addEventListener('keydown', handleKeydown);

  return () => {
    document.removeEventListener('click', handleTriggerClick);
    document.removeEventListener('click', handleCloseClick);
    document.removeEventListener('keydown', handleKeydown);
    initialized = false;
  };
}
