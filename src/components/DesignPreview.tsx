import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GarmentType, Design, DesignSize } from '../types/Design';
import { getGarmentTemplate, hasBackView as checkHasBackView } from '../data/garmentImages';
import {
  useDesignTransform,
  DEFAULT_TRANSFORM,
  TransformState,
} from '../hooks/useDesignTransform';
import PrintableZone from './designer/PrintableZone';
import DesignLayer from './designer/DesignLayer';
import SnapGuides from './designer/SnapGuides';
import DesignControls from './designer/DesignControls';

const PRINTABLE_INSET = { top: 0.15, bottom: 0.20, left: 0.16, right: 0.16 };

// ─── Public prop contract (kept backward-compatible with DesignWizard) ───────

export interface DesignPreviewProps {
  garmentType: GarmentType | null;
  garmentColor: string;
  selectedDesign: Design | null;
  designSize: DesignSize;
  // Lifted state from DesignWizard
  designPosition: { x: number; y: number };
  designRotation: number;
  designScale: number;
  designFlipped: boolean;
  onPositionChange: (pos: { x: number; y: number }) => void;
  onRotationChange: (rot: number) => void;
  onScaleChange: (s: number) => void;
  onFlipChange: (f: boolean) => void;
}

// ─── Empty state placeholder ──────────────────────────────────────────────────

const EmptyState: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-gray-400 font-light">{text}</p>
  </div>
);

// ─── Outer wrapper — guards against missing garment / design ─────────────────

const DesignPreview: React.FC<DesignPreviewProps> = (props) => {
  if (!props.garmentType)
    return <EmptyState icon="👕" text="Selecciona una prenda para comenzar" />;
  if (!props.selectedDesign)
    return <EmptyState icon="🎨" text="Selecciona un diseño para ver la previsualización" />;

  return (
    <DesignEditor
      {...props}
      garmentType={props.garmentType}
      selectedDesign={props.selectedDesign}
    />
  );
};

// ─── Inner editor — all hooks live here ──────────────────────────────────────

type EditorProps = DesignPreviewProps & {
  garmentType: GarmentType;
  selectedDesign: Design;
};

const DesignEditor: React.FC<EditorProps> = ({
  garmentType,
  garmentColor,
  selectedDesign,
  designSize,
  designPosition,
  designRotation,
  designScale,
  designFlipped,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onFlipChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const designElementRef = useRef<HTMLDivElement>(null);

  // Front and back transforms stored in refs so switching sides is instant
  const frontRef = useRef<TransformState>({
    x: designPosition.x,
    y: designPosition.y,
    scale: designScale,
    rotation: designRotation,
  });
  const backRef = useRef<TransformState>({ ...DEFAULT_TRANSFORM });

  const [showBack, setShowBack] = useState(false);

  // When the user finishes a gesture, push committed values to parent
  const handleCommit = useCallback(
    (t: TransformState) => {
      if (showBack) {
        backRef.current = { ...t };
      } else {
        frontRef.current = { ...t };
        onPositionChange({ x: t.x, y: t.y });
        onRotationChange(t.rotation);
        onScaleChange(t.scale);
      }
    },
    [showBack, onPositionChange, onRotationChange, onScaleChange],
  );

  const { transform, live, snapGuides, isDragging, actions } = useDesignTransform({
    containerRef,
    elementRef: designElementRef,
    initial: frontRef.current,
    printableInset: PRINTABLE_INSET,
    onCommit: handleCommit,
  });

  // When the selected design changes, reset both sides to defaults
  useEffect(() => {
    const initial: TransformState = { x: 50, y: 34, scale: 1, rotation: 0 };
    frontRef.current = { ...initial };
    backRef.current = { ...DEFAULT_TRANSFORM };
    setShowBack(false);
    actions.syncTransform(initial);
    onPositionChange({ x: initial.x, y: initial.y });
    onRotationChange(initial.rotation);
    onScaleChange(initial.scale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDesign.id]);

  // Toggle between front and back view
  const handleToggleSide = useCallback(() => {
    if (showBack) {
      backRef.current = { ...live.current };
      actions.syncTransform(frontRef.current);
    } else {
      frontRef.current = { ...live.current };
      actions.syncTransform(backRef.current);
    }
    setShowBack((prev) => !prev);
  }, [showBack, live, actions]);

  // "Fit to garment" computes the right scale for the current designSize
  const handleFitToGarment = useCallback(() => {
    const printableWidthPct =
      (1 - PRINTABLE_INSET.left - PRINTABLE_INSET.right) * 100;
    // DesignLayer natural width = 28% * designSize.scale of container
    const naturalWidthPct = 28 * designSize.scale;
    const newScale = Math.max(0.2, Math.min(4.0, (printableWidthPct * 0.85) / naturalWidthPct));
    actions.syncTransform({ x: 50, y: 40, scale: newScale, rotation: 0 });
    onPositionChange({ x: 50, y: 40 });
    onRotationChange(0);
    onScaleChange(newScale);
  }, [designSize.scale, actions, onPositionChange, onRotationChange, onScaleChange]);

  const colorName =
    garmentColor === '#FFFFFF' ? 'blanco' :
    garmentColor === '#000000' ? 'negro' :
    garmentColor === '#6B7280' ? 'gris' : 'blanco';

  const garmentImageUrl = getGarmentTemplate(
    garmentType.id,
    colorName,
    showBack ? 'back' : 'front',
  );

  const hasBack = checkHasBackView(garmentType.id);

  return (
    <div>
      {/* ── Canvas area ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3/4',
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Garment image */}
          <img
            src={garmentImageUrl}
            alt={garmentType.name}
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              userSelect: 'none',
              transition: 'opacity 0.25s ease',
            }}
          />

          {/* Printable safe zone */}
          <PrintableZone inset={PRINTABLE_INSET} />

          {/* Interactive design */}
          <DesignLayer
            ref={designElementRef}
            imageUrl={selectedDesign.image}
            designSize={designSize}
            flipped={designFlipped}
            isDragging={isDragging}
            liveRef={live}
            onScaleCommit={actions.setScale}
          />

          {/* Snap alignment guides */}
          <SnapGuides snapGuides={snapGuides} />
        </div>

        {/* Hint bar */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-center select-none">
          Arrastra el diseño · Scroll para escalar · Pellizca en mobile
        </div>
      </div>

      {/* ── Controls panel ──────────────────────────────────── */}
      <DesignControls
        transform={transform}
        actions={actions}
        onFitToGarment={handleFitToGarment}
        flipped={designFlipped}
        onFlipChange={onFlipChange}
        showBack={showBack}
        onToggleSide={handleToggleSide}
        hasBackView={hasBack}
      />

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
        • Previsualización ilustrativa. Los colores, texturas y proporciones del producto final pueden variar.
      </p>
    </div>
  );
};

export default DesignPreview;
