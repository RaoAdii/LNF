import React, { useMemo } from 'react';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function ColorBends({
  color = '#40a3ff',
  speed = 0.2,
  frequency = 1.0,
  noise = 0.15,
  bandWidth = 0.14,
  rotation = 90,
  fadeTop = 0.75,
  iterations = 1,
  intensity = 1.3,
  className = '',
}) {
  const layerCount = clamp(Math.round(iterations), 1, 3);

  const vars = useMemo(() => {
    const sanitizedSpeed = clamp(Number(speed) || 0.2, 0.05, 1.6);
    const duration = `${Math.round(90 / sanitizedSpeed)}s`;
    return {
      '--cb-color': color,
      '--cb-duration': duration,
      '--cb-frequency': `${clamp(Number(frequency) || 1, 0.5, 2.5)}`,
      '--cb-noise': `${clamp(Number(noise) || 0.15, 0, 0.4)}`,
      '--cb-band-width': `${clamp(Number(bandWidth) || 0.14, 0.08, 0.28)}`,
      '--cb-rotation': `${Number(rotation) || 90}deg`,
      '--cb-fade-top': `${clamp(Number(fadeTop) || 0.75, 0.2, 1)}`,
      '--cb-intensity': `${clamp(Number(intensity) || 1.3, 0.7, 1.8)}`,
    };
  }, [bandWidth, color, fadeTop, frequency, intensity, noise, rotation, speed]);

  return (
    <div className={`color-bends ${className}`.trim()} style={vars} aria-hidden="true">
      {Array.from({ length: layerCount }).map((_, index) => (
        <div key={`cb-layer-${index}`} className="color-bends__layer" style={{ opacity: 1 - index * 0.18 }} />
      ))}
      <div className="color-bends__noise" />
    </div>
  );
}

export default ColorBends;
