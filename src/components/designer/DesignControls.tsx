import React from 'react';
import { RotateCcw, RotateCw, Maximize2, AlignCenter, RefreshCw, FlipHorizontal2, Eye, EyeOff } from 'lucide-react';
import type { TransformState, DesignTransformActions } from '../../hooks/useDesignTransform';

interface Props {
  transform: TransformState;
  actions: DesignTransformActions;
  onFitToGarment: () => void;
  flipped: boolean;
  onFlipChange: (f: boolean) => void;
  showBack: boolean;
  onToggleSide: () => void;
  hasBackView: boolean;
}

const ROTATE_STEPS = [-90, -45, -5, 5, 45, 90];

const DesignControls: React.FC<Props> = ({
  transform,
  actions,
  onFitToGarment,
  flipped,
  onFlipChange,
  showBack,
  onToggleSide,
  hasBackView,
}) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4 mt-3">
    {/* Row: Front / Back toggle */}
    {hasBackView && (
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">Vista de la prenda</span>
        <button
          onClick={onToggleSide}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
            showBack
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
          }`}
        >
          {showBack ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showBack ? 'Espalda' : 'Frente'}
        </button>
      </div>
    )}

    {/* Row: Rotation */}
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-medium text-gray-600 shrink-0">
        Rotar: {Math.round(transform.rotation)}°
      </span>
      <div className="flex items-center gap-1 flex-wrap justify-end">
        {ROTATE_STEPS.map((step) => (
          <button
            key={step}
            onClick={() => actions.addRotation(step)}
            className="px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md hover:bg-indigo-50 hover:border-indigo-300 text-gray-700 font-mono transition-colors"
            title={`Rotar ${step > 0 ? '+' : ''}${step}°`}
          >
            {step > 0 ? (
              <span className="flex items-center gap-0.5">
                <RotateCw className="h-2.5 w-2.5" />
                {step}°
              </span>
            ) : (
              <span className="flex items-center gap-0.5">
                <RotateCcw className="h-2.5 w-2.5" />
                {Math.abs(step)}°
              </span>
            )}
          </button>
        ))}

        {/* Flip */}
        <button
          onClick={() => onFlipChange(!flipped)}
          className={`p-1.5 border rounded-md transition-colors ${
            flipped
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          title="Espejar horizontalmente"
        >
          <FlipHorizontal2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    {/* Row: Scale slider */}
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-600 shrink-0 w-24">
        Escala: {transform.scale.toFixed(2)}×
      </span>
      <input
        type="range"
        min={0.2}
        max={4}
        step={0.05}
        value={transform.scale}
        onChange={(e) => actions.setScale(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none bg-gray-200 accent-indigo-600 cursor-pointer"
      />
    </div>

    {/* Row: Action buttons */}
    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
      <button
        onClick={actions.reset}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-gray-600 transition-colors"
        title="Restablecer posición, escala y rotación"
      >
        <RefreshCw className="h-3 w-3" />
        Reiniciar
      </button>
      <button
        onClick={actions.center}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-gray-600 transition-colors"
        title="Centrar el diseño"
      >
        <AlignCenter className="h-3 w-3" />
        Centrar
      </button>
      <button
        onClick={onFitToGarment}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-gray-600 transition-colors"
        title="Ajustar el diseño al área imprimible"
      >
        <Maximize2 className="h-3 w-3" />
        Ajustar a prenda
      </button>
    </div>
  </div>
);

export default DesignControls;
