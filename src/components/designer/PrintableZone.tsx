import React from 'react';

interface Props {
  inset?: { top: number; bottom: number; left: number; right: number };
}

const PrintableZone: React.FC<Props> = ({
  inset = { top: 0.15, bottom: 0.20, left: 0.16, right: 0.16 },
}) => (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: `${inset.top * 100}%`,
        left: `${inset.left * 100}%`,
        right: `${inset.right * 100}%`,
        bottom: `${inset.bottom * 100}%`,
        border: '1px dashed rgba(99,102,241,0.28)',
        borderRadius: 4,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
);

export default PrintableZone;
