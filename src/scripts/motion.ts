import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  REVEAL_DURATION,
  REVEAL_EASE,
  REVEAL_FROM,
  REVEAL_LOAD_DELAY,
  REVEAL_LOAD_STAGGER,
  REVEAL_SCROLL_START,
  REVEAL_SCROLL_STAGGER,
  REVEAL_TO,
} from './reveal.config';

gsap.registerPlugin(ScrollTrigger);

function revealOnLoad(container: Element) {
  const items = container.querySelectorAll<HTMLElement>('[data-reveal-item]');
  if (!items.length) return;

  gsap.fromTo(items, REVEAL_FROM, {
    ...REVEAL_TO,
    duration: REVEAL_DURATION,
    ease: REVEAL_EASE,
    delay: REVEAL_LOAD_DELAY,
    stagger: REVEAL_LOAD_STAGGER,
  });
}

function revealOnScroll(container: Element) {
  const items = container.querySelectorAll<HTMLElement>('[data-reveal-item]');
  if (!items.length) return;

  gsap.fromTo(items, REVEAL_FROM, {
    ...REVEAL_TO,
    duration: REVEAL_DURATION,
    ease: REVEAL_EASE,
    stagger: REVEAL_SCROLL_STAGGER,
    scrollTrigger: {
      trigger: container,
      start: REVEAL_SCROLL_START,
      toggleActions: 'play none none none',
    },
  });
}

export function initMotion() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis: Lenis | undefined;
  let lenisTicker: ((time: number) => void) | undefined;

  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    lenisTicker = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);
  }

  const revealItems = gsap.utils.toArray<HTMLElement>('[data-reveal-item]');

  if (reducedMotion) {
    gsap.set(revealItems, REVEAL_TO);
    return () => {
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
    };
  }

  gsap.set(revealItems, REVEAL_FROM);

  document.querySelectorAll('[data-reveal-container="load"]').forEach(revealOnLoad);
  document.querySelectorAll('[data-reveal-container="scroll"]').forEach(revealOnScroll);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    if (lenisTicker) gsap.ticker.remove(lenisTicker);
    lenis?.destroy();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.clear();
  };
}

export function destroyMotion() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
