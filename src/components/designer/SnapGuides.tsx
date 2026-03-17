import React from 'react';
import type { SnapGuideState } from '../../hooks/useDesignTransform';

interface Props {
  snapGuides: SnapGuideState;
}

const lineBase: React.CSSProperties = {
  position: 'absolute',
  background: 'rgba(99,102,241,0.75)',
  pointerEvents: 'none',
  zIndex: 10,
};

const SnapGuides: React.FC<Props> = ({ snapGuides }) => (
  <>
    {snapGuides.showH && (
      <div
        aria-hidden
        style={{
          ...lineBase,
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1,
          transform: 'translateX(-50%)',
        }}
      />
    )}
    {snapGuides.showV && (
      <div
        aria-hidden
        style={{
          ...lineBase,
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          transform: 'translateY(-50%)',
        }}
      />
    )}
  </>
);

export default SnapGuides;
