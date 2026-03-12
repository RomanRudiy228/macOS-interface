export interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const GAP = 10;
const MAX_ITERS = 50;

const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export const checkCollision = (
  dragged: Rect,
  others: Rect[]
): { x: number; y: number } => {
  let x = dragged.x;
  let y = dragged.y;

  for (let iter = 0; iter < MAX_ITERS; iter++) {
    const probe: Rect = { ...dragged, x, y };

    const collisions = others.filter(
      (o) => o.id !== dragged.id && overlaps(probe, o)
    );

    if (collisions.length === 0) break;

    const other = collisions[0];

    const candidates = [
      { x: other.x - dragged.width - GAP, y },
      { x: other.x + other.width + GAP, y },
      { x, y: other.y - dragged.height - GAP },
      { x, y: other.y + other.height + GAP },
    ];

    let best = candidates[0];
    let bestDist = Infinity;

    for (const c of candidates) {
      const dist = Math.abs(c.x - x) + Math.abs(c.y - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = c;
      }
    }

    x = best.x;
    y = best.y;
  }

  return { x, y };
};
