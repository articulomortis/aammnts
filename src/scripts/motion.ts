import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  IMAGE_REVEAL_DURATION,
  IMAGE_REVEAL_EASE,
  IMAGE_REVEAL_FROM,
  IMAGE_REVEAL_TO,
  IMAGE_SCROLL_END,
  IMAGE_SCROLL_START,
  LAYER_STACK_BASE_WIDTH,
  LAYER_STACK_FOLDED,
  LAYER_STACK_SCROLL_END,
  LAYER_STACK_SCROLL_START,
  LAYER_STACK_UNFOLDED_Y,
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

function revealSideImages() {
  const images = gsap.utils.toArray<HTMLElement>('[data-reveal-image]');
  if (!images.length) return;

  images.forEach((image) => {
    gsap.fromTo(image, IMAGE_REVEAL_FROM, {
      ...IMAGE_REVEAL_TO,
      duration: IMAGE_REVEAL_DURATION,
      ease: IMAGE_REVEAL_EASE,
      scrollTrigger: {
        trigger: image,
        start: IMAGE_SCROLL_START,
        end: IMAGE_SCROLL_END,
        toggleActions: 'play reverse play reverse',
      },
    });
  });
}

function layerStackLayers(stack: Element) {
  return Array.from(stack.querySelectorAll<HTMLElement>('[data-layer-index]')).sort(
    (a, b) => Number(a.dataset.layerIndex) - Number(b.dataset.layerIndex)
  );
}

// Offsets are tuned for a 700px-wide diamond; scale them (and reserve the
// matching extra space below, so the fan-out never overlaps the caption or
// the next paragraph) to whatever width the stack actually renders at.
function layoutLayerStack(stack: HTMLElement, reserve: boolean) {
  const inner = stack.querySelector<HTMLElement>('.layer-stack__inner');
  if (!inner) return LAYER_STACK_UNFOLDED_Y.map(() => 0);

  const width = inner.getBoundingClientRect().width || LAYER_STACK_BASE_WIDTH;
  const scale = width / LAYER_STACK_BASE_WIDTH;
  const offsets = LAYER_STACK_UNFOLDED_Y.map((value) => value * scale);

  inner.style.marginBottom = reserve ? `${Math.max(...offsets)}px` : '0px';

  return offsets;
}

function setLayerStacksFolded() {
  document.querySelectorAll<HTMLElement>('[data-reveal-layer-stack]').forEach((stack) => {
    layoutLayerStack(stack, false);
    gsap.set(layerStackLayers(stack), LAYER_STACK_FOLDED);
  });
}

function animateLayerStacks() {
  document.querySelectorAll<HTMLElement>('[data-reveal-layer-stack]').forEach((stack) => {
    const layers = layerStackLayers(stack);
    if (!layers.length) return;

    const offsets = layoutLayerStack(stack, true);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stack,
        start: LAYER_STACK_SCROLL_START,
        end: LAYER_STACK_SCROLL_END,
        scrub: true,
      },
    });

    // Phase 1: folded -> unfolded (fans out into a vertical card stack)
    timeline.to(layers, {
      y: (index: number) => offsets[index % offsets.length],
      ease: 'power1.inOut',
      duration: 1,
    });

    // Phase 2: unfolded -> folded again
    timeline.to(layers, {
      y: 0,
      ease: 'power1.inOut',
      duration: 1,
    });
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
  const imageItems = gsap.utils.toArray<HTMLElement>('[data-reveal-image]');

  if (reducedMotion) {
    gsap.set(revealItems, REVEAL_TO);
    gsap.set(imageItems, IMAGE_REVEAL_TO);
    setLayerStacksFolded();
    return () => {
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
    };
  }

  gsap.set(revealItems, REVEAL_FROM);
  gsap.set(imageItems, IMAGE_REVEAL_FROM);
  setLayerStacksFolded();

  document.querySelectorAll('[data-reveal-container="load"]').forEach(revealOnLoad);
  document.querySelectorAll('[data-reveal-container="scroll"]').forEach(revealOnScroll);
  revealSideImages();
  animateLayerStacks();

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
