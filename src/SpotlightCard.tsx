import { useRef, type MouseEvent, type ReactNode } from 'react';

/**
 * SpotlightCard — React Bits component by David Haz.
 * Source: https://github.com/DavidHDev/react-bits
 * Integrated with GRACEON's existing card styles.
 */
type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(230, 190, 143, 0.13)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = divRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--x', `${e.clientX - rect.left}px`);
    element.style.setProperty('--y', `${e.clientY - rect.top}px`);
    element.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
    >
      {children}
    </div>
  );
}
