// Railway geometry clipper — Liang–Barsky line-segment clipping to cell bounds.
// Pure function: no WFC, no socket masks, no tile references.
// Used by the railway index to determine which cells a segment traverses
// and the exact entry/exit coordinates within each cell.

const TOL = 0.001;
const POSITIVE_LENGTH_THRESHOLD = 2 * TOL; // 0.002 m

/**
 * Clip a line segment (x1,y1)->(x2,y2) to an axis-aligned rectangle using
 * Liang–Barsky. Returns [t0, t1] param interval where the segment is inside
 * the rectangle, or null if there is no positive-length overlap.
 *
 * @param {number} x1 - segment start x (UTM easting)
 * @param {number} y1 - segment start y (UTM northing)
 * @param {number} x2 - segment end x
 * @param {number} y2 - segment end y
 * @param {Object} rect - {minE, maxE, minN, maxN}
 * @returns {number[]|null} [t0, t1] in [0,1], or null
 */
function liangBarskyClip(x1, y1, x2, y2, rect) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  let t0 = 0;
  let t1 = 1;

  const check = (p, q) => {
    if (Math.abs(p) < 1e-15) {
      // Segment is parallel to this boundary. Inside if q >= -TOL.
      return q >= -TOL;
    }
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };

  if (!check(-dx, x1 - rect.minE)) return null;
  if (!check(dx, rect.maxE - x1)) return null;
  if (!check(-dy, y1 - rect.minN)) return null;
  if (!check(dy, rect.maxN - y1)) return null;

  // Reject zero-length or sub-threshold overlaps
  const len = (t1 - t0) * Math.hypot(dx, dy);
  if (len <= POSITIVE_LENGTH_THRESHOLD) return null;

  return [t0, t1];
}

/**
 * Determine which sides of a cell a point lies on (within TOL).
 * @returns {string[]} e.g. ['N', 'E']
 */
function pointSides(e, n, rect) {
  const sides = [];
  if (Math.abs(e - rect.minE) <= TOL) sides.push('W');
  if (Math.abs(e - rect.maxE) <= TOL) sides.push('E');
  if (Math.abs(n - rect.minN) <= TOL) sides.push('S');
  if (Math.abs(n - rect.maxN) <= TOL) sides.push('N');
  return sides;
}

/**
 * Clip a segment to a cell and return the clipped result.
 * @returns {Object|null} { entryE, entryN, exitE, exitN, lengthInsideCell, entrySides, exitSides, t0, t1 } or null
 */
function clipSegmentToCell(x1, y1, x2, y2, rect) {
  const interval = liangBarskyClip(x1, y1, x2, y2, rect);
  if (!interval) return null;

  const [t0, t1] = interval;
  const dx = x2 - x1;
  const dy = y2 - y1;

  const entryE = x1 + dx * t0;
  const entryN = y1 + dy * t0;
  const exitE = x1 + dx * t1;
  const exitN = y1 + dy * t1;
  const lengthInsideCell = Math.hypot(exitE - entryE, exitN - entryN);

  if (lengthInsideCell <= POSITIVE_LENGTH_THRESHOLD) return null;

  return {
    entryE,
    entryN,
    exitE,
    exitN,
    lengthInsideCell,
    entrySides: pointSides(entryE, entryN, rect),
    exitSides: pointSides(exitE, exitN, rect),
    t0,
    t1,
  };
}

export {
  TOL,
  POSITIVE_LENGTH_THRESHOLD,
  liangBarskyClip,
  pointSides,
  clipSegmentToCell,
};
