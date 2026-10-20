import { initMotion, destroyMotion } from '../scripts/motion';
import { initLightbox } from '../scripts/lightbox';
import { initPhotoStacks } from '../scripts/photo-stack';

let cleanup: (() => void) | undefined;
let photoStackCleanup: (() => void) | undefined;

initLightbox();

function resetHeaderLayout() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  header.style.removeProperty('transform');
  header.style.removeProperty('filter');
  header.style.removeProperty('opacity');

  header.querySelectorAll<HTMLElement>('.site-header__inner *').forEach((element) => {
      element.style.removeProperty('transform');
      element.style.removeProperty('filter');
      element.style.removeProperty('opacity');
      element.style.removeProperty('width');
    });
}

function boot() {
  cleanup?.();
  photoStackCleanup?.();
  resetHeaderLayout();
  cleanup = initMotion();
  photoStackCleanup = initPhotoStacks();
}

boot();

document.addEventListener('astro:page-load', boot);

document.addEventListener('astro:before-swap', () => {
  cleanup?.();
  cleanup = undefined;
  photoStackCleanup?.();
  photoStackCleanup = undefined;
});
