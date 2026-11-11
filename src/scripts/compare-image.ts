/**
 * A click on the stage shows the next frame and its caption.
 * The outgoing frame remains fully visible
 * underneath while the incoming frame softly dissolves over it. This avoids
 * exposing the grey stage between dark screenshots, which reads as a flash.
 * Frames and captions share their boxes to avoid layout shifts.
 */

// Must match the image opacity transition in global.css.
const DISSOLVE_MS = 520;
const CAPTION_SWAP_MS = 260;

function setupCompare(stage: HTMLElement) {
  const frames = Array.from(stage.querySelectorAll<HTMLElement>('[data-compare-frame]'));
  const comparison = stage.closest('.compare-image');
  const captions = Array.from(comparison?.querySelectorAll<HTMLElement>('[data-compare-caption]') ?? []);
  const previews = Array.from(comparison?.querySelectorAll<HTMLButtonElement>('[data-compare-preview]') ?? []);
  if (frames.length < 2) return () => {};

  let activeIndex = Math.max(0, frames.findIndex((frame) => frame.classList.contains('is-active')));
  let pendingIndex: number | undefined;
  let frameTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let captionTimeoutId: ReturnType<typeof setTimeout> | undefined;

  function finishTransition() {
    if (pendingIndex === undefined) return;

    const nextIndex = pendingIndex;
    frames[activeIndex].classList.remove('is-active');
    frames[nextIndex].classList.replace('is-entering', 'is-active');
    captions[nextIndex]?.classList.remove('is-entering');
    captions[nextIndex]?.classList.add('is-active');
    previews.forEach((preview, index) => {
      preview.setAttribute('aria-pressed', String(index === nextIndex));
    });
    activeIndex = nextIndex;
    pendingIndex = undefined;
  }

  function selectFrame(nextIndex: number) {
    const nextFrame = frames[nextIndex];
    if (!nextFrame || pendingIndex !== undefined || nextIndex === activeIndex) return;

    pendingIndex = nextIndex;
    nextFrame.classList.add('is-entering');
    // Captions must never overlap: fade the current caption out during
    // the first half, then fade the next one in during the second half.
    captions[activeIndex]?.classList.remove('is-active');
    captionTimeoutId = setTimeout(() => {
      captions[nextIndex]?.classList.add('is-entering');
    }, CAPTION_SWAP_MS);

    frameTimeoutId = setTimeout(finishTransition, DISSOLVE_MS);
  }

  function showNextFrame() {
    selectFrame((activeIndex + 1) % frames.length);
  }

  function onPreviewClick(event: Event) {
    const preview = event.currentTarget as HTMLButtonElement;
    selectFrame(previews.indexOf(preview));
  }

  stage.addEventListener('click', showNextFrame);
  previews.forEach((preview) => preview.addEventListener('click', onPreviewClick));

  return () => {
    stage.removeEventListener('click', showNextFrame);
    previews.forEach((preview) => preview.removeEventListener('click', onPreviewClick));
    if (frameTimeoutId) clearTimeout(frameTimeoutId);
    if (captionTimeoutId) clearTimeout(captionTimeoutId);
    finishTransition();
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
