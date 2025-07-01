"use client";
import { useEffect, useRef } from "react";

export default function BinaryMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // For splatter effect
    interface Splatter {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      decay: number;
    }
    let splatters: Splatter[] = [];

    let frame = 0;
    const frameSkip = 2; // Increase to slow down more

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(24,24,27,0.15)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontSize + "px monospace";
      ctx.fillStyle = "#00ffcc";
      if (frame % frameSkip === 0) {
        for (let i = 0; i < drops.length; i++) {
          const text = Math.random() > 0.5 ? "0" : "1";
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          ctx.fillText(text, x, y);
          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
            // Add a splatter at the bottom
            splatters.push({
              x,
              y: height - 2,
              radius: 6 + Math.random() * 8,
              alpha: 0.7,
              decay: 0.03 + Math.random() * 0.02
            });
          }
          drops[i]++;
        }
      } else {
        for (let i = 0; i < drops.length; i++) {
          const text = Math.random() > 0.5 ? "0" : "1";
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }
      }
      // Draw and update splatters
      for (let i = splatters.length - 1; i >= 0; i--) {
        const s = splatters[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = "#00ffcc";
        for (let j = 0; j < 8; j++) {
          const angle = (Math.PI * 2 * j) / 8;
          const r = s.radius * (0.7 + Math.random() * 0.3);
          ctx.beginPath();
          ctx.arc(s.x + Math.cos(angle) * r, s.y + Math.sin(angle) * r, 2 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        s.alpha -= s.decay;
        if (s.alpha <= 0) {
          splatters.splice(i, 1);
        }
      }
      frame++;
    }

    function animate() {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
