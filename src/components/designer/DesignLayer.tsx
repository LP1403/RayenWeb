import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import type { DesignSize } from '../../types/Design';
import type { TransformState } from '../../hooks/useDesignTransform';

interface Props {
  imageUrl: string;
  designSize: DesignSize;
  flipped: boolean;
  isDragging: boolean;
  /** Live transform ref from useDesignTransform — written directly for 0-rerender corner drag */
  liveRef: React.MutableRefObject<TransformState>;
  /** Called when a corner drag gesture completes, so the hook can commit to state */
  onScaleCommit: (scale: number) => void;
}

// Outward direction vector for each corner (used to project drag movement)
const CORNERS: Array<{ dirX: number; dirY: number; cursor: string; style: React.CSSProperties }> = [
  { dirX: -1, dirY: -1, cursor: 'nw-resize', style: { top: -5,    left:  -5  } },
  { dirX:  1, dirY: -1, cursor: 'ne-resize', style: { top: -5,    right: -5  } },
  { dirX: -1, dirY:  1, cursor: 'sw-resize', style: { bottom: -5, left:  -5  } },
  { dirX:  1, dirY:  1, cursor: 'se-resize', style: { bottom: -5, right: -5  } },
];

/**
 * The interactive design layer.
 *
 * Positioning is controlled entirely by useDesignTransform via direct DOM style
 * mutations on the forwarded ref div (style.left, style.top, style.transform).
 *
 * Width = calc(28% × sizeScale) of the container — works because this div is
 * `position:absolute` and its containing block is the container div.
 *
 * Corner handles use native pointer events (stopPropagation) so they don't
 * conflict with @use-gesture's drag on this element.
 */
const DesignLayer = forwardRef<HTMLDivElement, Props>(
  ({ imageUrl, designSize, flipped, isDragging, liveRef, onScaleCommit }, externalRef) => {
    // We need an internal ref for measurements (corner drag needs offsetWidth)
    const innerRef = useRef<HTMLDivElement>(null);

    // Merge external (hook) ref and internal measurement ref
    const mergedRef = useCallback(
      (el: HTMLDivElement | null) => {
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof externalRef === 'function') {
          externalRef(el);
        } else if (externalRef) {
          (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      },
      [externalRef],
    );

    // Apply transform directly to DOM (mirrors useDesignTransform.applyToDOM)
    const applyTransform = useCallback((scale: number) => {
      const el = innerRef.current;
      if (!el) return;
      const { x, y, rotation } = liveRef.current;
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
    }, [liveRef]);

    // Attach native pointerdown listeners on corners via useEffect.
    // Using native events (not React synthetic) ensures stopPropagation() fires
    // before @use-gesture's native drag listener on the parent div.
    useEffect(() => {
      const container = innerRef.current;
      if (!container) return;

      const cornerEls = container.querySelectorAll<HTMLElement>('[data-corner]');
      const cleanups: Array<() => void> = [];

      cornerEls.forEach((cornerEl) => {
        const dirX = Number(cornerEl.dataset.dirx ?? 1);
        const dirY = Number(cornerEl.dataset.diry ?? 1);

        const onPointerDown = (e: PointerEvent) => {
          // Prevent the event from bubbling to the design element where
          // @use-gesture's drag listener is registered
          e.stopPropagation();
          e.preventDefault();

          const startX = e.clientX;
          const startY = e.clientY;
          const startScale = liveRef.current.scale;
          // Reference size for normalising the drag delta
          const refSize = container.offsetWidth || 100;

          let latestScale = startScale;

          const onMove = (me: PointerEvent) => {
            const dx = me.clientX - startX;
            const dy = me.clientY - startY;
            // Project movement onto the corner's outward direction
            const proj = dx * dirX + dy * dirY;
            const delta = proj / (refSize * 1.5);
            const newScale = Math.max(0.2, Math.min(4.0, startScale * (1 + delta)));
            latestScale = newScale;

            // Directly write to liveRef and DOM — no React re-render during drag
            liveRef.current.scale = newScale;
            applyTransform(newScale);
          };

          const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            // Commit the final scale to React state via the hook
            onScaleCommit(latestScale);
          };

          document.addEventListener('pointermove', onMove);
          document.addEventListener('pointerup', onUp);
          cornerEl.setPointerCapture(e.pointerId);
        };

        cornerEl.addEventListener('pointerdown', onPointerDown);
        cleanups.push(() => cornerEl.removeEventListener('pointerdown', onPointerDown));
      });

      return () => cleanups.forEach((fn) => fn());
    }, [liveRef, applyTransform, onScaleCommit]);

    const widthPct = `${28 * designSize.scale}%`;

    return (
      <div
        ref={mergedRef}
        style={{
          position: 'absolute',
          width: widthPct,
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 5,
          transformOrigin: 'center center',
          willChange: 'transform, left, top',
        }}
      >
        {/* Design image */}
        <img
          src={imageUrl}
          alt="design"
          draggable={false}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
            transform: flipped ? 'scaleX(-1)' : undefined,
            filter: isDragging
              ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.30))'
              : 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
            transition: isDragging ? 'none' : 'filter 0.15s ease',
          }}
        />

        {/* Bounding box + corner handles */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -8,
            border: `2px ${isDragging ? 'solid' : 'dashed'} rgba(99,102,241,0.80)`,
            borderRadius: 3,
            pointerEvents: 'none',
          }}
        >
          {CORNERS.map(({ dirX, dirY, cursor, style }, i) => (
            <div
              key={i}
              // data-* attrs read by the native listener above
              data-corner
              data-dirx={dirX}
              data-diry={dirY}
              title="Arrastra para escalar"
              style={{
                position: 'absolute',
                width: 12,
                height: 12,
                background: 'white',
                border: '2px solid rgba(99,102,241,0.85)',
                borderRadius: 2,
                cursor,
                pointerEvents: 'auto', // re-enable on corners only
                zIndex: 10,
                touchAction: 'none',
                ...style,
              }}
            />
          ))}

          {/* Rotation indicator dot — purely decorative */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              background: 'rgba(99,102,241,0.75)',
              borderRadius: '50%',
              top: -14,
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    );
  },
);

DesignLayer.displayName = 'DesignLayer';
export default DesignLayer;
