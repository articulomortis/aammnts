/**
 * Locked-in blur reveal (Wabi-style).
 * Do not tweak casually — validated on landing and longread.
 */
export const REVEAL_FROM = {
  autoAlpha: 0,
  y: 16,
  filter: 'blur(8px)',
} as const;

export const REVEAL_TO = {
  autoAlpha: 1,
  y: 0,
  filter: 'blur(0px)',
} as const;

export const REVEAL_DURATION = 1.2;
export const REVEAL_EASE = 'power2.out';
export const REVEAL_LOAD_DELAY = 0.1;
export const REVEAL_LOAD_STAGGER = 0.1;
export const REVEAL_SCROLL_STAGGER = 0.08;
export const REVEAL_SCROLL_START = 'top 86%';

/**
 * Side images on /details — same blur language as text reveal,
 * but they fade back out (blur) once scrolled past, unlike text.
 */
export const IMAGE_REVEAL_FROM = {
  autoAlpha: 0,
  y: 24,
  filter: 'blur(14px)',
} as const;

export const IMAGE_REVEAL_TO = {
  autoAlpha: 1,
  y: 0,
  filter: 'blur(0px)',
} as const;

export const IMAGE_REVEAL_DURATION = 1.1;
export const IMAGE_REVEAL_EASE = 'power2.out';
export const IMAGE_SCROLL_START = 'top 80%';
export const IMAGE_SCROLL_END = 'bottom 15%';

/**
 * Layer stack on /details — starts folded into one flat layer, fans out
 * into a vertical card stack as the user scrolls past, then folds back
 * into one. Order is back-to-front (z-index 0..n); only Y moves, matching
 * the isometric "deck of cards" reference.
 */
export const LAYER_STACK_FOLDED = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
} as const;

/** Base offsets tuned for a 700px-wide diamond; scaled to actual rendered width. */
export const LAYER_STACK_BASE_WIDTH = 700;
export const LAYER_STACK_UNFOLDED_Y = [240, 160, 80, 0] as const;

/**
 * Symmetric full-viewport pass: progress 0 when the stack's top just enters
 * at the bottom of the viewport, progress 1 when its bottom just leaves at
 * the top. This makes progress 0.5 (fully unfolded) land exactly when the
 * stack's own center crosses the viewport's center.
 */
export const LAYER_STACK_SCROLL_START = 'top bottom';
export const LAYER_STACK_SCROLL_END = 'bottom top';
