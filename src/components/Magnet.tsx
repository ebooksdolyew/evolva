import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type MagnetProps = {
  children: ReactNode;
  /** How far outside the element edges the magnet starts pulling, in px. */
  padding?: number;
  /** Higher strength = softer pull (the offset is divided by it). */
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  style?: CSSProperties;
};

export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = Math.abs(centerX - event.clientX);
      const distY = Math.abs(centerY - event.clientY);

      const inRange =
        distX < rect.width / 2 + padding && distY < rect.height / 2 + padding;

      if (inRange) {
        setActive(true);
        setOffset({
          x: (event.clientX - centerX) / strength,
          y: (event.clientY - centerY) / strength,
        });
      } else {
        setActive(false);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [padding, strength]);

  return (
    <div ref={ref} className={className} style={style}>
      <div
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: active ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
