import { productMapBranches, productMapRoot, type ProductMapNode } from '../content/productMap';

const NS = 'http://www.w3.org/2000/svg';

const ROW_HEIGHT = 22;
const BRANCH_GAP = 16;
const BRANCH_OFFSET = 150; // distance from center to the branch column
const LEAF_OFFSET = 150; // distance from the branch column to the leaf column
const PADDING_Y = 40;
const INFLUENCE_RADIUS = 110;
const MAX_WOBBLE = 14;
const LERP = 0.1;

// Fleet sits in the center; branches are split left/right, matching the reference diagram.
const LEFT_LABELS = ['Home', 'Drivers', 'Vehicles', 'Map'];
const RIGHT_LABELS = ['Reports', 'Products and services', 'Information', 'Settings'];

interface LaidOutEdge {
  path: SVGPathElement;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset1: number;
  offset2: number;
  targetOffset1: number;
  targetOffset2: number;
}

function createSvgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
}

function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const cx = x1 + (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

function curvePathWithOffset(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset1: number,
  offset2: number,
): string {
  const cx = x1 + (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${cx} ${y1 + offset1}, ${cx} ${y2 + offset2}, ${x2} ${y2}`;
}

/** Adds a background rect behind a text element so lines never visually cross a label. */
function addLabelBackdrop(group: SVGGElement, text: SVGTextElement) {
  // getBBox needs the element to be laid out; text is already appended to `group` by the caller.
  const bbox = text.getBBox();
  const rect = createSvgEl('rect');
  rect.setAttribute('class', 'product-map__label-bg');
  rect.setAttribute('x', `${bbox.x - 3}`);
  rect.setAttribute('y', `${bbox.y - 1}`);
  rect.setAttribute('width', `${bbox.width + 6}`);
  rect.setAttribute('height', `${bbox.height + 2}`);
  group.insertBefore(rect, text);
}

export function mountProductMap(container: HTMLElement) {
  container.innerHTML = '';

  const leftBranches = productMapBranches.filter((b) => LEFT_LABELS.includes(b.label));
  const rightBranches = productMapBranches.filter((b) => RIGHT_LABELS.includes(b.label));

  const rowsOf = (b: ProductMapNode) => Math.max(b.children?.length ?? 0, 1);
  const leftRows = leftBranches.map(rowsOf);
  const rightRows = rightBranches.map(rowsOf);

  const sideHeight = (rows: number[]) =>
    rows.reduce((a, b) => a + b, 0) * ROW_HEIGHT + Math.max(rows.length - 1, 0) * BRANCH_GAP;

  const leftHeight = sideHeight(leftRows);
  const rightHeight = sideHeight(rightRows);
  const height = Math.max(leftHeight, rightHeight) + PADDING_Y * 2;
  const centerY = height / 2;
  const centerX = BRANCH_OFFSET + LEAF_OFFSET + 40;
  const width = centerX + BRANCH_OFFSET + LEAF_OFFSET + 40;

  const svg = createSvgEl('svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('class', 'product-map__svg');
  container.appendChild(svg);

  const edgesGroup = createSvgEl('g');
  edgesGroup.setAttribute('class', 'product-map__edges');
  svg.appendChild(edgesGroup);

  const nodesGroup = createSvgEl('g');
  nodesGroup.setAttribute('class', 'product-map__nodes');
  svg.appendChild(nodesGroup);

  // --- root ---
  const rootPill = createSvgEl('rect');
  rootPill.setAttribute('class', 'product-map__pill');
  rootPill.setAttribute('x', `${centerX - 34}`);
  rootPill.setAttribute('y', `${centerY - 16}`);
  rootPill.setAttribute('width', '68');
  rootPill.setAttribute('height', '32');
  rootPill.setAttribute('rx', '16');
  nodesGroup.appendChild(rootPill);

  const rootLabel = createSvgEl('text');
  rootLabel.textContent = productMapRoot;
  rootLabel.setAttribute('class', 'product-map__label product-map__label--root');
  rootLabel.setAttribute('x', `${centerX}`);
  rootLabel.setAttribute('y', `${centerY}`);
  rootLabel.setAttribute('text-anchor', 'middle');
  rootLabel.setAttribute('dominant-baseline', 'middle');
  nodesGroup.appendChild(rootLabel);

  const allEdges: LaidOutEdge[] = [];

  function buildSide(branches: ProductMapNode[], rows: number[], direction: 1 | -1) {
    const sideHeightValue = sideHeight(rows);
    let cursorY = centerY - sideHeightValue / 2;

    const branchX = centerX + direction * BRANCH_OFFSET;
    const leafX = centerX + direction * (BRANCH_OFFSET + LEAF_OFFSET);
    const anchor = direction === 1 ? 'start' : 'end';
    const rootEdgeStartX = centerX + direction * 34;
    const branchEdgeStartX = branchX + direction * 10;

    branches.forEach((branch, branchIndex) => {
      const rowCount = rows[branchIndex];
      const bandTop = cursorY;
      const bandHeight = rowCount * ROW_HEIGHT;
      const branchY = bandTop + bandHeight / 2;

      // branch node label (+ backdrop)
      const g1 = createSvgEl('g');
      g1.setAttribute('class', 'product-map__node product-map__node--branch');
      const label1 = createSvgEl('text');
      label1.textContent = branch.label;
      label1.setAttribute('class', 'product-map__label');
      label1.setAttribute('x', `${branchX + direction * 4}`);
      label1.setAttribute('y', `${branchY}`);
      label1.setAttribute('text-anchor', anchor);
      label1.setAttribute('dominant-baseline', 'middle');
      g1.appendChild(label1);
      nodesGroup.appendChild(g1);
      addLabelBackdrop(g1, label1);

      // edge root -> branch
      const edgePath1 = createSvgEl('path');
      edgePath1.setAttribute('class', 'product-map__edge');
      edgePath1.setAttribute('d', curvePath(rootEdgeStartX, centerY, branchX - direction * 8, branchY));
      edgesGroup.appendChild(edgePath1);
      allEdges.push({
        path: edgePath1,
        x1: rootEdgeStartX,
        y1: centerY,
        x2: branchX - direction * 8,
        y2: branchY,
        offset1: 0,
        offset2: 0,
        targetOffset1: 0,
        targetOffset2: 0,
      });

      const children = branch.children ?? [];
      children.forEach((childLabel, childIndex) => {
        const leafY = bandTop + ROW_HEIGHT * childIndex + ROW_HEIGHT / 2;

        const g2 = createSvgEl('g');
        g2.setAttribute('class', 'product-map__node product-map__node--leaf');
        const label2 = createSvgEl('text');
        label2.textContent = childLabel;
        label2.setAttribute('class', 'product-map__label product-map__label--leaf');
        label2.setAttribute('x', `${leafX + direction * 4}`);
        label2.setAttribute('y', `${leafY}`);
        label2.setAttribute('text-anchor', anchor);
        label2.setAttribute('dominant-baseline', 'middle');
        g2.appendChild(label2);
        nodesGroup.appendChild(g2);
        addLabelBackdrop(g2, label2);

        const edgePath2 = createSvgEl('path');
        edgePath2.setAttribute('class', 'product-map__edge product-map__edge--leaf');
        edgePath2.setAttribute(
          'd',
          curvePath(branchEdgeStartX, branchY, leafX - direction * 8, leafY),
        );
        edgesGroup.appendChild(edgePath2);
        allEdges.push({
          path: edgePath2,
          x1: branchEdgeStartX,
          y1: branchY,
          x2: leafX - direction * 8,
          y2: leafY,
          offset1: 0,
          offset2: 0,
          targetOffset1: 0,
          targetOffset2: 0,
        });
      });

      cursorY += bandHeight + BRANCH_GAP;
    });
  }

  buildSide(leftBranches, leftRows, -1);
  buildSide(rightBranches, rightRows, 1);

  // edges must render behind the node backdrops/labels (z-order), already handled since
  // edgesGroup is appended before nodesGroup.

  // --- cursor-reactive wiggle ---
  let pointer = { x: -9999, y: -9999 };
  let rafId = 0;

  function toLocalPoint(clientX: number, clientY: number) {
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return {
      x: ((clientX - rect.left) / rect.width) * vb.width,
      y: ((clientY - rect.top) / rect.height) * vb.height,
    };
  }

  function handlePointerMove(event: PointerEvent) {
    pointer = toLocalPoint(event.clientX, event.clientY);
  }

  function handlePointerLeave() {
    pointer = { x: -9999, y: -9999 };
  }

  function distance(ax: number, ay: number, bx: number, by: number) {
    return Math.hypot(ax - bx, ay - by);
  }

  function tick() {
    allEdges.forEach((edge) => {
      const cx1 = edge.x1 + (edge.x2 - edge.x1) * 0.5;
      const cx2 = cx1;

      const d1 = distance(pointer.x, pointer.y, cx1, edge.y1);
      const d2 = distance(pointer.x, pointer.y, cx2, edge.y2);

      const push1 = d1 < INFLUENCE_RADIUS ? (1 - d1 / INFLUENCE_RADIUS) * MAX_WOBBLE : 0;
      const push2 = d2 < INFLUENCE_RADIUS ? (1 - d2 / INFLUENCE_RADIUS) * MAX_WOBBLE : 0;

      const dir1 = pointer.y > edge.y1 ? 1 : -1;
      const dir2 = pointer.y > edge.y2 ? 1 : -1;

      edge.targetOffset1 = push1 * dir1;
      edge.targetOffset2 = push2 * dir2;

      edge.offset1 += (edge.targetOffset1 - edge.offset1) * LERP;
      edge.offset2 += (edge.targetOffset2 - edge.offset2) * LERP;

      if (Math.abs(edge.offset1) > 0.05 || Math.abs(edge.offset2) > 0.05) {
        edge.path.setAttribute(
          'd',
          curvePathWithOffset(edge.x1, edge.y1, edge.x2, edge.y2, edge.offset1, edge.offset2),
        );
      }
    });

    rafId = requestAnimationFrame(tick);
  }

  svg.addEventListener('pointermove', handlePointerMove);
  svg.addEventListener('pointerleave', handlePointerLeave);
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    svg.removeEventListener('pointermove', handlePointerMove);
    svg.removeEventListener('pointerleave', handlePointerLeave);
  };
}
