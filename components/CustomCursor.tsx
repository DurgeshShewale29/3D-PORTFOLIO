'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop / non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      // Hardware-accelerated translate3d with zero input latency
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursorContainer} ${isClicking ? styles.clicking : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <svg
        className={styles.crosshairSvg}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal crosshair arm */}
        <line
          className={styles.crosshairLine}
          x1="2"
          y1="14"
          x2="26"
          y2="14"
        />

        {/* Vertical crosshair arm */}
        <line
          className={styles.crosshairLine}
          x1="14"
          y1="2"
          x2="14"
          y2="26"
        />

        {/* Central precision dot */}
        <circle
          className={styles.centerDot}
          cx="14"
          cy="14"
          r="3.2"
        />
      </svg>
    </div>
  );
}
