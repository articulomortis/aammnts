/**
 * Click-to-flip before/after comparison. A single click swaps which frame
 * (and which caption) is active. The outgoing frame remains fully visible
 * underneath while the incoming frame softly dissolves over it. This avoids
 * exposing the grey stage between dark screenshots, which reads as a flash.
 * No layout shift, since both frames/captions share the same box.
 */

// Must match the image opacity transition in global.css.
const DISSOLVE_MS = 520;
const CAPTION_SWAP_MS = 260;

function setupCompare(stage: HTMLElement) {
  const frames = Array.from(stage.querySelectorAll<HTMLElement>('[data-compare-frame]'));
  const figure = stage.closest('.compare-image');
  const captions = figure
    ? Array.from(figure.querySelectorAll<HTMLElement>('[data-compare-caption]'))
    : [];
  if (frames.length < 2) return () => {};

  let activeIndex = 0;
  let pending = false;
  let frameTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let captionTimeoutId: ReturnType<typeof setTimeout> | undefined;

  function toggle() {
    if (pending) return;
    pending = true;

    const nextIndex = activeIndex === 0 ? 1 : 0;
    const currentFrame = frames[activeIndex];
    const nextFrame = frames[nextIndex];
    const currentCaption = captions[activeIndex];
    const nextCaption = captions[nextIndex];

    nextFrame.classList.add('is-entering');
    // Captions must never overlap: fade the current caption out during
    // the first half, then fade the next one in during the second half.
    currentCaption?.classList.remove('is-active');
    captionTimeoutId = setTimeout(() => {
      nextCaption?.classList.add('is-entering');
    }, CAPTION_SWAP_MS);

    frameTimeoutId = setTimeout(() => {
      currentFrame.classList.remove('is-active');
      nextFrame.classList.replace('is-entering', 'is-active');
      nextCaption?.classList.replace('is-entering', 'is-active');
      activeIndex = nextIndex;
      pending = false;
    }, DISSOLVE_MS);
  }

  stage.addEventListener('click', toggle);

  return () => {
    stage.removeEventListener('click', toggle);
    if (frameTimeoutId) clearTimeout(frameTimeoutId);
    if (captionTimeoutId) clearTimeout(captionTimeoutId);
  };
}

export function initCompareImages() {
  const cleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-compare-image]')).map(
    setupCompare
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
