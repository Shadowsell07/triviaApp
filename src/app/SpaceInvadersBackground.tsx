"use client";
import { useEffect, useRef, useState } from "react";

const UFO = (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="12" rx="14" ry="6" fill="#aaf" stroke="#fff" strokeWidth="2"/>
    <ellipse cx="16" cy="10" rx="8" ry="4" fill="#fff" stroke="#00f" strokeWidth="1"/>
    <ellipse cx="16" cy="8" rx="4" ry="2" fill="#0ff" stroke="#0ff" strokeWidth="1"/>
  </svg>
);

const CANNON = (
  <svg width="60" height="36" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="12" width="12" height="12" fill="#fff" stroke="#0ff" strokeWidth="3"/>
    <rect x="15" y="24" width="30" height="9" fill="#0ff" stroke="#fff" strokeWidth="3"/>
  </svg>
);

export default function SpaceInvadersBackground() {
  const [ufos, setUfos] = useState<{x: number, y: number, alive: boolean}[]>([]);
  const [lasers, setLasers] = useState<{x: number, y: number}[]>([]);
  const [cannonX, setCannonX] = useState(200);
  const [stars, setStars] = useState<{x: number, y: number, size: number, speed: number, opacity: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawn UFOs
  useEffect(() => {
    const interval = setInterval(() => {
      setUfos(prev => [
        ...prev,
        { x: Math.random() * (window.innerWidth - 32), y: -20, alive: true }
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Move UFOs and lasers
  useEffect(() => {
    const move = () => {
      setUfos(prev => prev.map(ufo => ({ ...ufo, y: ufo.y + 2 })));
      setLasers(prev => prev.map(l => ({ ...l, y: l.y - 8 })).filter(l => l.y > -24));
    };
    const id = setInterval(move, 30);
    return () => clearInterval(id);
  }, []);

  // Collision detection
  useEffect(() => {
    setUfos(prevUfos => prevUfos.map(ufo => {
      if (!ufo.alive) return ufo;
      for (const laser of lasers) {
        if (
          laser.x > ufo.x && laser.x < ufo.x + 32 &&
          laser.y > ufo.y && laser.y < ufo.y + 20
        ) {
          ufo.alive = false;
        }
      }
      return ufo;
    }));
  }, [lasers]);

  // Remove dead UFOs
  useEffect(() => {
    setUfos(prev => prev.filter(ufo => ufo.alive && ufo.y < window.innerHeight + 40));
  }, [ufos]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCannonX(x => Math.max(0, x - 36));
      if (e.key === "ArrowRight") setCannonX(x => Math.min(window.innerWidth - 60, x + 36));
      if (e.key === " " || e.key === "ArrowUp") {
        setLasers(prev => [...prev, { x: cannonX + 30, y: window.innerHeight - 48 }]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cannonX]);

  // Resize cannon on window resize
  useEffect(() => {
    const handleResize = () => {
      setCannonX(Math.min(cannonX, window.innerWidth - 60));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cannonX]);

  // Initialize stars
  useEffect(() => {
    setStars(Array.from({length: 80}).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.15 + 0.05, // slower speeds
      opacity: Math.random() * 0.7 + 0.3
    })));
  }, []);

  // Animate stars (slow drift downward)
  useEffect(() => {
    const id = setInterval(() => {
      setStars(prev => prev.map(star => {
        let newY = star.y + star.speed;
        if (newY > window.innerHeight) newY = 0;
        return { ...star, y: newY };
      }));
    }, 40); // slower update
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
      background: "radial-gradient(ellipse at 60% 20%, #222 60%, #000 100%)",
      backgroundColor: "#000"
    }}>
      {/* Animated star field */}
      {stars.map((star, i) => (
        <div key={i} style={{
          position: "absolute",
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          background: "#fff",
          opacity: star.opacity,
          borderRadius: "50%",
          filter: "blur(0.5px)"
        }} />
      ))}
      {/* Galaxies */}
      <div style={{
        position: "absolute",
        left: window.innerWidth * 0.15,
        top: window.innerHeight * 0.18,
        width: 120,
        height: 60,
        background: "radial-gradient(ellipse at 60% 40%, #fff8 0%, #aaf4 40%, #00f2 80%, #0000 100%)",
        filter: "blur(8px)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        left: window.innerWidth * 0.7,
        top: window.innerHeight * 0.3,
        width: 90,
        height: 40,
        background: "radial-gradient(ellipse at 40% 60%, #fff6 0%, #f0f4 40%, #f0f2 80%, #0000 100%)",
        filter: "blur(10px)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      {/* Nebulae */}
      <div style={{
        position: "absolute",
        left: window.innerWidth * 0.4,
        top: window.innerHeight * 0.6,
        width: 180,
        height: 90,
        background: "radial-gradient(ellipse at 60% 40%, #0ff4 0%, #0ff2 60%, #0000 100%)",
        filter: "blur(18px)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        left: window.innerWidth * 0.8,
        top: window.innerHeight * 0.8,
        width: 120,
        height: 60,
        background: "radial-gradient(ellipse at 40% 60%, #f0f4 0%, #aaf2 60%, #0000 100%)",
        filter: "blur(16px)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      {ufos.map((ufo, i) => ufo.alive && (
        <div key={i} style={{position: "absolute", left: ufo.x, top: ufo.y, width: 32, height: 20}}>
          {UFO}
        </div>
      ))}
      {lasers.map((laser, i) => (
        <div key={i} style={{position: "absolute", left: laser.x - 2, top: laser.y, width: 4, height: 16, background: "#fff", borderRadius: 2, boxShadow: "0 0 8px #0ff"}} />
      ))}
      <div style={{position: "absolute", left: cannonX, top: window.innerHeight - 48, width: 60, height: 36}}>
        {CANNON}
      </div>
    </div>
  );
}
