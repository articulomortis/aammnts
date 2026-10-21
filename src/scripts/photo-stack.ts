import gsap from 'gsap';

/**
 * Wabi-style photo pile: a few photos stacked with a slight fan of
 * rotation/offset, like a handful of prints tossed on a table. Click
 * shuffles the front photo to the back, promoting the rest forward —
 * with a soft blur/fade on the back of the pile, like the out-of-focus
 * screens on wabi.ai.
 */

// The x/y/rotate "shape" of the fan can safely repeat for extra photos —
// it's just cosmetic variety. Blur/opacity/scale must NOT repeat: with a
// previous fixed 5-slot table and a `% length` wrap, the 6th/7th photo in
// the pile wrapped back onto the sharp, zero-blur "front" slot, producing
// a crisp card buried deep in the stack. Depth values below are computed
// from the absolute position instead, so they always keep increasing.
// Offsets are kept small so the back-of-pile photos stay mostly tucked
// behind the front card instead of poking out past its edges — a blurred
// sliver sticking out reads as a stray smudge/blob rather than a clean
// stack, especially once its baked-in card edge/shadow gets smeared by
// the blur.
const FAN_SHAPES = [
  { x: 0, y: 0, rotate: -3 },
  { x: 8, y: 7, rotate: 4 },
  { x: -7, y: 13, rotate: -5 },
  { x: 6, y: 19, rotate: 5 },
  { x: -5, y: 25, rotate: -4 },
  { x: 7, y: 31, rotate: 5 },
  { x: -6, y: 37, rotate: -4 },
] as const;

const BLUR_STEPS = [0, 2, 3, 4, 5] as const;
const OPACITY_STEPS = [1, 0.94, 0.88, 0.82, 0.76] as const;

// Extends a hand-tuned step table past its last entry by continuing the
// trend of its final two steps, so depths beyond the table never wrap.
function extend(steps: readonly number[], depth: number) {
  if (depth < steps.length) return steps[depth];
  const delta = steps[steps.length - 1] - steps[steps.length - 2];
  return steps[steps.length - 1] + delta * (depth - steps.length + 1);
}

// Landscape polaroids read smaller once letterboxed inside the portrait
// stage, so bump them up to feel like a matching physical size.
const LANDSCAPE_SCALE_BOOST = 1.13 * 1.15;

function offsetFor(position: number) {
  const shape = FAN_SHAPES[position % FAN_SHAPES.length];
  return {
    x: shape.x,
    y: shape.y,
    rotate: shape.rotate,
    scale: Math.max(0.74, 1 - position * 0.04),
    blur: Math.max(0, Math.min(8, extend(BLUR_STEPS, position))),
    opacity: Math.max(0.6, extend(OPACITY_STEPS, position)),
  };
}

function baseScaleFor(item: HTMLElement) {
  return item.dataset.orientation === 'landscape' ? LANDSCAPE_SCALE_BOOST : 1;
}

function setupStack(stage: HTMLElement) {
  const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-stack-index]'));
  if (items.length < 2) return () => {};

  // Mobile WebKit can render an animated blurred layer as a solid black
  // rectangle when it sits inside a transformed, clipped stack item.
  // Keep the physical shuffle animation there, but use opacity instead of
  // blur so Safari never creates that problematic compositor layer.
  const isAppleMobileWebKit =
    /WebKit/i.test(navigator.userAgent) &&
    (/iP(?:hone|ad|od)/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    window.matchMedia('(max-width: 720px)').matches;
  stage.classList.toggle('is-mobile-webkit', isAppleMobileWebKit);
  const filterFor = (blur: number) => (isAppleMobileWebKit ? 'none' : `blur(${blur}px)`);

  // Transform (position/rotation/scale) animates on the wrapper `item`;
  // filter/opacity animate on the inner `photo` <img>. Keeping them on
  // separate elements avoids a WebKit/mobile bug where animating
  // `filter: blur()` together with `transform` on the same element can
  // produce a dark/black compositing artifact at the edges.
  const photoFor = (item: HTMLElement) => item.querySelector<HTMLElement>('.photo-stack__photo')!;

  // `order[i]` = the item currently sitting at stack position i (0 = front).
  let order = [...items];
  let animating = false;

  order.forEach((item, position) => {
    const offset = offsetFor(position);
    const photo = photoFor(item);
    gsap.set(item, {
      x: offset.x,
      y: offset.y,
      rotate: offset.rotate,
      scale: offset.scale * baseScaleFor(item),
      zIndex: order.length - position,
    });
    gsap.set(photo, {
      opacity: offset.opacity,
      filter: filterFor(offset.blur),
    });
  });

  const SHUFFLE_DURATION = 0.6;

  function shuffle() {
    if (animating || order.length < 2) return;
    animating = true;

    const [front, ...rest] = order;
    const frontPhoto = photoFor(front);
    const backOffset = offsetFor(order.length - 1);

    // Front item sinks to the back of the pile, blurring out.
    gsap.to(front, {
      x: backOffset.x,
      y: backOffset.y + 18,
      rotate: backOffset.rotate * 1.6,
      scale: backOffset.scale * 0.96 * baseScaleFor(front),
      zIndex: 1,
      duration: SHUFFLE_DURATION,
      ease: 'power2.inOut',
    });
    gsap.to(frontPhoto, {
      opacity: backOffset.opacity,
      filter: filterFor(backOffset.blur + 1),
      duration: SHUFFLE_DURATION,
      ease: 'power2.inOut',
    });

    // Everyone else steps forward one position and sharpens into focus.
    rest.forEach((item, index) => {
      const offset = offsetFor(index);
      const photo = photoFor(item);
      gsap.to(item, {
        x: offset.x,
        y: offset.y,
        rotate: offset.rotate,
        scale: offset.scale * baseScaleFor(item),
        zIndex: order.length - index,
        duration: SHUFFLE_DURATION,
        ease: 'power2.inOut',
      });
      gsap.to(photo, {
        opacity: offset.opacity,
        filter: filterFor(offset.blur),
        duration: SHUFFLE_DURATION,
        ease: 'power2.inOut',
      });
    });

    order = [...rest, front];

    gsap.delayedCall(SHUFFLE_DURATION, () => {
      animating = false;
    });
  }

  stage.addEventListener('click', shuffle);

  return () => {
    stage.removeEventListener('click', shuffle);
    gsap.killTweensOf(items);
    gsap.killTweensOf(items.map(photoFor));
    stage.classList.remove('is-mobile-webkit');
  };
}

export function initPhotoStacks() {
  const cleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-photo-stack]')).map(
    setupStack
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
