'use client';

import { useEffect, useRef, useState } from 'react';

const PETAL_COLORS = [
  'rgba(255, 183, 197, 0.75)',
  'rgba(255, 192, 203, 0.80)',
  'rgba(255, 218, 224, 0.70)',
  'rgba(255, 160, 180, 0.65)',
  'rgba(255, 240, 245, 0.85)',
];

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  swayAngle: number;
  swaySpeed: number;
  color: string;
}

export default function SakuraPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sakura_enabled');
      if (stored !== null) setEnabled(stored === 'true');
    } catch {}

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled?: boolean }>;
      setEnabled(prev => {
        const next = customEvent.detail?.enabled !== undefined ? customEvent.detail.enabled : !prev;
        try {
          localStorage.setItem('sakura_enabled', String(next));
        } catch {}
        return next;
      });
    };

    window.addEventListener('sakura:toggle', handleToggle);
    return () => window.removeEventListener('sakura:toggle', handleToggle);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const petalCount = width < 768 ? 14 : 24;
    const createPetal = (initialY?: number): Petal => ({
      x: Math.random() * width,
      y: initialY === undefined ? Math.random() * -100 : initialY,
      size: Math.random() * 8 + 7,
      speedX: Math.random() * 1.5 + 0.6,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.015,
      opacity: Math.random() * 0.35 + 0.5,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    });

    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal(Math.random() * height));
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.flip), 1);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const s = p.size;
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.8, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.8, s * 0.5, -s * 0.7, -s * 0.6, 0, -s);
      ctx.fill();

      // Delicate center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.lineTo(0, s * 0.7);
      ctx.stroke();
      ctx.restore();
    };

    let animationId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.swayAngle += p.swaySpeed * delta;
        p.rotation += p.rotationSpeed * delta;
        p.flip += p.flipSpeed * delta;

        const sway = Math.sin(p.swayAngle) * 0.8;
        p.x += (p.speedX + sway) * delta;
        p.y += p.speedY * delta;

        // Interactive mouse avoidance
        if (mActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3 * delta;
            p.y += (dy / dist) * force * 3 * delta;
            p.rotation += 0.05 * force;
          }
        }

        drawPetal(p);

        if (p.y > height + 20 || p.x > width + 30) {
          petals[i] = createPetal();
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 5,
        opacity: 0.9,
      }}
    />
  );
}
