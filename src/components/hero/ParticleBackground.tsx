"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewportWidth * pixelRatio);
      canvas.height = Math.floor(viewportHeight * pixelRatio);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((viewportWidth * viewportHeight) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * viewportWidth,
          y: Math.random() * viewportHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.7 + 0.2,
          hue: Math.random() * 50 + 25, // warm gold/orange hues
        });
      }
    };

    const draw = (moveParticles: boolean) => {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      particles.forEach((p) => {
        if (moveParticles) {
          p.x += p.speedX;
          p.y += p.speedY;
        }

        // Wrap around edges
        if (p.x < 0) p.x = viewportWidth;
        if (p.x > viewportWidth) p.x = 0;
        if (p.y < 0) p.y = viewportHeight;
        if (p.y > viewportHeight) p.y = 0;

        // Draw particle with enhanced glow
        const glowRadius = p.size * 5;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.opacity})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 85%, 55%, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      draw(true);
      animationId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationId);
      if (prefersReducedMotion.matches) {
        draw(false);
        return;
      }
      animate();
    };

    const handleResize = () => {
      resize();
      createParticles();
      startAnimation();
    };

    resize();
    createParticles();
    startAnimation();

    window.addEventListener("resize", handleResize);
    prefersReducedMotion.addEventListener("change", startAnimation);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      prefersReducedMotion.removeEventListener("change", startAnimation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
