/**
 * Keeps the viewport-edge fades from washing dark product screenshots into
 * grey. Each fade remains active over text, but softly disappears while a
 * screenshot intersects its zone.
 */
export function initMediaAwarePageFades() {
  const topFade = document.querySelector<HTMLElement>('.page-fade--top');
  const bottomFade = document.querySelector<HTMLElement>('.page-fade--bottom');
  const media = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.compare-image__stage, .inline-image--compare .inline-image__img'
    )
  );

  if ((!topFade && !bottomFade) || media.length === 0) return () => {};

  let frameId = 0;

  function update() {
    frameId = 0;
    const viewportBottom = window.innerHeight;
    const mediaRects = media.map((element) => element.getBoundingClientRect());

    if (topFade) {
      const topFadeBottom = topFade.getBoundingClientRect().height;
      const overlapsTop = mediaRects.some(
        (rect) => rect.bottom > 0 && rect.top < topFadeBottom
      );
      topFade.classList.toggle('is-over-media', overlapsTop);
    }

    if (bottomFade) {
      const fadeTop = viewportBottom - bottomFade.getBoundingClientRect().height;
      const overlapsBottom = mediaRects.some(
        (rect) => rect.bottom > fadeTop && rect.top < viewportBottom
      );
      bottomFade.classList.toggle('is-over-media', overlapsBottom);
    }
  }

  function scheduleUpdate() {
    if (frameId) return;
    frameId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  scheduleUpdate();

  return () => {
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', scheduleUpdate);
    if (frameId) cancelAnimationFrame(frameId);
    topFade?.classList.remove('is-over-media');
    bottomFade?.classList.remove('is-over-media');
  };
}
