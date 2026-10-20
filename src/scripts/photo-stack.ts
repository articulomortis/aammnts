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
const FAN_SHAPES = [
  { x: 0, y: 0, rotate: -3 },
  { x: 16, y: 14, rotate: 5 },
  { x: -14, y: 26, rotate: -7 },
  { x: 12, y: 38, rotate: 6 },
  { x: -10, y: 50, rotate: -5 },
  { x: 14, y: 62, rotate: 7 },
  { x: -12, y: 74, rotate: -6 },
] as const;

const BLUR_STEPS = [0, 3, 6, 8, 10] as const;
const OPACITY_STEPS = [1, 0.92, 0.84, 0.76, 0.68] as const;

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
    blur: Math.max(0, Math.min(18, extend(BLUR_STEPS, position))),
    opacity: Math.max(0.5, extend(OPACITY_STEPS, position)),
  };
}

function baseScaleFor(photo: HTMLElement) {
  return photo.dataset.orientation === 'landscape' ? LANDSCAPE_SCALE_BOOST : 1;
}

function setupStack(stage: HTMLElement) {
  const photos = Array.from(stage.querySelectorAll<HTMLElement>('[data-stack-index]'));
  if (photos.length < 2) return () => {};

  // `order[i]` = the photo element currently sitting at stack position i (0 = front).
  let order = [...photos];
  let animating = false;

  order.forEach((photo, position) => {
    const offset = offsetFor(position);
    gsap.set(photo, {
      x: offset.x,
      y: offset.y,
      rotate: offset.rotate,
      scale: offset.scale * baseScaleFor(photo),
      opacity: offset.opacity,
      filter: `blur(${offset.blur}px)`,
      zIndex: order.length - position,
    });
  });

  const SHUFFLE_DURATION = 0.6;

  function shuffle() {
    if (animating || order.length < 2) return;
    animating = true;

    const [front, ...rest] = order;
    const backOffset = offsetFor(order.length - 1);

    // Front photo sinks to the back of the pile, blurring out.
    gsap.to(front, {
      x: backOffset.x,
      y: backOffset.y + 18,
      rotate: backOffset.rotate * 1.6,
      scale: backOffset.scale * 0.96 * baseScaleFor(front),
      opacity: backOffset.opacity,
      filter: `blur(${backOffset.blur + 1}px)`,
      zIndex: 1,
      duration: SHUFFLE_DURATION,
      ease: 'power2.inOut',
    });

    // Everyone else steps forward one position and sharpens into focus.
    rest.forEach((photo, index) => {
      const offset = offsetFor(index);
      gsap.to(photo, {
        x: offset.x,
        y: offset.y,
        rotate: offset.rotate,
        scale: offset.scale * baseScaleFor(photo),
        opacity: offset.opacity,
        filter: `blur(${offset.blur}px)`,
        zIndex: order.length - index,
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
    gsap.killTweensOf(photos);
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
