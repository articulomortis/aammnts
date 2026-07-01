import gsap from 'gsap';

const CARD_LAYOUTS = [
  { rotate: 7, x: 32, y: 24, scale: 0.92, z: 1 },
  { rotate: -9, x: -24, y: 12, scale: 0.96, z: 2 },
  { rotate: -2, x: 0, y: 0, scale: 1, z: 3 },
] as const;

function parseInitialOrder(root: HTMLElement, cardCount: number) {
  const raw = root.dataset.showcaseOrder;
  if (!raw) return Array.from({ length: cardCount }, (_, index) => index);

  const order = raw.split(',').map((value) => Number(value.trim()));
  if (order.length !== cardCount || new Set(order).size !== cardCount) {
    return Array.from({ length: cardCount }, (_, index) => index);
  }

  return order;
}

function bringToFront(stackOrder: number[], cardId: number) {
  return [...stackOrder.filter((id) => id !== cardId), cardId];
}

function sendToBack(stackOrder: number[], cardId: number) {
  return [cardId, ...stackOrder.slice(0, -1)];
}

export function initShowcases() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanups: (() => void)[] = [];

  document.querySelectorAll<HTMLElement>('[data-showcase]').forEach((root) => {
    const cards = [...root.querySelectorAll<HTMLElement>('[data-showcase-card]')];
    if (!cards.length) return;

    let stackOrder = parseInitialOrder(root, cards.length);
    let animating = false;

    const applyLayout = (animate: boolean) => {
      cards.forEach((card) => {
        const cardId = Number(card.dataset.showcaseCard);
        const depth = stackOrder.indexOf(cardId);
        const layout = CARD_LAYOUTS[depth] ?? CARD_LAYOUTS[0];

        card.style.zIndex = String(layout.z);

        const props = {
          x: layout.x,
          y: layout.y,
          rotation: layout.rotate,
          scale: layout.scale,
        };

        if (animate && !reducedMotion) {
          gsap.to(card, {
            ...props,
            duration: 0.65,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          return;
        }

        gsap.set(card, props);
      });
    };

    applyLayout(false);

    const onClick = (event: Event) => {
      const target = (event.currentTarget as HTMLElement).dataset.showcaseCard;
      if (!target || animating) return;

      const cardId = Number(target);
      const frontId = stackOrder[stackOrder.length - 1];

      stackOrder = cardId === frontId ? sendToBack(stackOrder, cardId) : bringToFront(stackOrder, cardId);

      if (reducedMotion) {
        applyLayout(false);
        return;
      }

      animating = true;
      applyLayout(true);
      window.setTimeout(() => {
        animating = false;
      }, 650);
    };

    cards.forEach((card) => {
      card.addEventListener('click', onClick);
      cleanups.push(() => card.removeEventListener('click', onClick));
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
