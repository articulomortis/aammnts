import { initMotion, destroyMotion } from '../scripts/motion';
import { initShowcases } from '../scripts/showcase';

let cleanup: (() => void) | undefined;

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
  resetHeaderLayout();
  const motionCleanup = initMotion();
  const showcaseCleanup = initShowcases();
  cleanup = () => {
    motionCleanup?.();
    showcaseCleanup();
  };
}

boot();

document.addEventListener('astro:page-load', boot);

document.addEventListener('astro:before-swap', () => {
  cleanup?.();
  cleanup = undefined;
});
