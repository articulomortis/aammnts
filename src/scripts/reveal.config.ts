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
