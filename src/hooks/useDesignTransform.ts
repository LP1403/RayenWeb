import { useRef, useCallback, useState, useLayoutEffect, RefObject } from 'react';
import { useDrag, usePinch, useWheel } from '@use-gesture/react';

export interface TransformState {
  x: number;        // 0–100 (% of container width)
  y: number;        // 0–100 (% of container height)
  scale: number;    // 1.0 = base size
  rotation: number; // degrees
}

export interface SnapGuideState {
  showH: boolean; // near horizontal center (x ≈ 50)
  showV: boolean; // near vertical center (y ≈ 50)
}

export interface DesignTransformActions {
  reset: () => void;
  center: () => void;
  addRotation: (deg: number) => void;
  setScale: (s: number) => void;
  syncTransform: (t: TransformState) => void;
}

interface PrintableInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface Options {
  containerRef: RefObject<HTMLDivElement>;
  elementRef: RefObject<HTMLDivElement>;
  initial?: TransformState;
  printableInset?: PrintableInset;
  snapThreshold?: number;
  minScale?: number;
  maxScale?: number;
  onCommit?: (t: TransformState) => void;
}

const INSET: PrintableInset = { top: 0.15, bottom: 0.20, left: 0.16, right: 0.16 };
export const DEFAULT_TRANSFORM: TransformState = { x: 50, y: 34, scale: 1, rotation: 0 };

export function useDesignTransform({
  containerRef,
  elementRef,
  initial = DEFAULT_TRANSFORM,
  printableInset = INSET,
  snapThreshold = 10,
  minScale = 0.2,
  maxScale = 4.0,
  onCommit,
}: Options) {
  const live = useRef<TransformState>({ ...initial });
  const [committed, setCommitted] = useState<TransformState>({ ...initial });
  const [snapGuides, setSnapGuides] = useState<SnapGuideState>({ showH: false, showV: false });
  const [isDragging, setIsDragging] = useState(false);

  // Write transform values directly to DOM — bypasses React render cycle
  const applyToDOM = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    const { x, y, scale, rotation } = live.current;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
  }, [elementRef]);

  // Position element correctly before first paint (no flash)
  useLayoutEffect(() => {
    applyToDOM();
  }, [applyToDOM]);

  const clamp = useCallback(
    (x: number, y: number) => ({
      x: Math.max(printableInset.left * 100, Math.min((1 - printableInset.right) * 100, x)),
      y: Math.max(printableInset.top * 100, Math.min((1 - printableInset.bottom) * 100, y)),
    }),
    [printableInset],
  );

  const commit = useCallback(() => {
    const t = { ...live.current };
    setCommitted(t);
    setSnapGuides({ showH: false, showV: false });
    onCommit?.(t);
  }, [onCommit]);

  // ── Drag (mouse + single-finger touch) ──────────────────────────────────
  useDrag(
    ({ movement: [mx, my], first, last, memo }) => {
      const el = containerRef.current;
      if (!el) return;
      if (first) setIsDragging(true);

      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const origin = first
        ? { x: live.current.x, y: live.current.y }
        : (memo as { x: number; y: number });

      const { x: cx, y: cy } = clamp(
        origin.x + (mx / W) * 100,
        origin.y + (my / H) * 100,
      );

      // Snap to horizontal/vertical center
      const txPct = (snapThreshold / W) * 100;
      const tyPct = (snapThreshold / H) * 100;
      const snapH = Math.abs(cx - 50) < txPct;
      const snapV = Math.abs(cy - 50) < tyPct;

      live.current.x = snapH ? 50 : cx;
      live.current.y = snapV ? 50 : cy;
      applyToDOM();
      setSnapGuides({ showH: snapH, showV: snapV });

      if (last) {
        setIsDragging(false);
        commit();
      }

      return first ? origin : memo;
    },
    {
      target: elementRef,
      filterTaps: true,
      pointer: { touch: true },
      threshold: 3,
    },
  );

  // ── Pinch (2-finger scale + rotate on mobile) ────────────────────────────
  usePinch(
    ({ movement: [ms, mr], first, last, memo }) => {
      const origin = first
        ? { scale: live.current.scale, rotation: live.current.rotation }
        : (memo as { scale: number; rotation: number });

      live.current.scale = Math.max(minScale, Math.min(maxScale, origin.scale * ms));
      live.current.rotation = origin.rotation + mr;
      applyToDOM();

      if (last) commit();
      return first ? origin : memo;
    },
    {
      target: elementRef,
      scaleBounds: { min: minScale, max: maxScale },
    },
  );

  // ── Wheel (scroll to scale on desktop, attached to whole canvas) ─────────
  useWheel(
    ({ delta: [, dy], last, event }) => {
      event.preventDefault();
      const factor = dy < 0 ? 1.05 : 0.95;
      live.current.scale = Math.max(minScale, Math.min(maxScale, live.current.scale * factor));
      applyToDOM();
      if (last) commit();
    },
    { target: containerRef, eventOptions: { passive: false } },
  );

  // ── Actions ──────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    live.current = { x: 50, y: 34, scale: 1, rotation: 0 };
    applyToDOM();
    commit();
  }, [applyToDOM, commit]);

  const center = useCallback(() => {
    live.current.x = 50;
    live.current.y = 34;
    applyToDOM();
    commit();
  }, [applyToDOM, commit]);

  const addRotation = useCallback(
    (deg: number) => {
      live.current.rotation = ((live.current.rotation + deg) % 360 + 360) % 360;
      applyToDOM();
      commit();
    },
    [applyToDOM, commit],
  );

  const setScale = useCallback(
    (s: number) => {
      live.current.scale = Math.max(minScale, Math.min(maxScale, s));
      applyToDOM();
      commit();
    },
    [applyToDOM, commit, minScale, maxScale],
  );

  const syncTransform = useCallback(
    (t: TransformState) => {
      live.current = { ...t };
      applyToDOM();
      setCommitted({ ...t });
    },
    [applyToDOM],
  );

  return {
    transform: committed,
    live,
    snapGuides,
    isDragging,
    actions: { reset, center, addRotation, setScale, syncTransform } as DesignTransformActions & {
      syncTransform: (t: TransformState) => void;
    },
  };
}
