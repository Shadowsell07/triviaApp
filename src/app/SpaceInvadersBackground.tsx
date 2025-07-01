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

// Explosion type
const EXPLOSION_DURATION = 500; // ms
interface Explosion {
  x: number;
  y: number;
  start: number;
}

export default function SpaceInvadersBackground() {
  const [ufos, setUfos] = useState<{x: number, y: number, alive: boolean}[]>([]);
  const [lasers, setLasers] = useState<{x: number, y: number}[]>([]);
  const [cannonX, setCannonX] = useState(200);
  const [stars, setStars] = useState<{x: number, y: number, size: number, speed: number, opacity: number}[]>([]);
  const [twinklePhase, setTwinklePhase] = useState(0);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [showTitle, setShowTitle] = useState(true);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const [titleScale, setTitleScale] = useState(0.6);
  const [invaderScore, setInvaderScore] = useState(0);
  const [showGameInstructions, setShowGameInstructions] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Set window size on mount and resize
  useEffect(() => {
    function updateSize() {
      setWindowSize({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
      });
    }
    updateSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Update cannon position if window shrinks
  useEffect(() => {
    setCannonX(x => Math.min(x, windowSize.width - 60));
  }, [windowSize.width]);

  // Spawn UFOs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => {
      setUfos(prev => [
        ...prev,
        { x: Math.random() * (windowSize.width - 32), y: -20, alive: true }
      ]);
    }, 1200);
    return () => clearInterval(interval);
  }, [windowSize.width]);

  // Move UFOs and lasers
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const move = () => {
      setUfos(prev => prev.map((ufo, idx) => {
        const t = Date.now() / 900 + idx * 0.7;
        const floatX = Math.sin(t) * 24;
        let newX = ufo.x + floatX * 0.04;
        newX = Math.max(0, Math.min(windowSize.width - 32, newX));
        let newY = ufo.y + 2;
        if (Math.random() < 0.01) newY -= 6 * Math.random();
        return { ...ufo, x: newX, y: newY };
      }));
      setLasers(prev => prev.map(l => ({ ...l, y: l.y - 8 })).filter(l => l.y > -24));
    };
    const id = setInterval(move, 30);
    return () => clearInterval(id);
  }, [windowSize.width]);

  // Collision detection (add explosion)
  useEffect(() => {
    setUfos(prevUfos => prevUfos.map(ufo => {
      if (!ufo.alive) return ufo;
      for (const laser of lasers) {
        if (
          laser.x > ufo.x && laser.x < ufo.x + 32 &&
          laser.y > ufo.y && laser.y < ufo.y + 20
        ) {
          // Add explosion at UFO position
          setExplosions(explosions => [
            ...explosions,
            { x: ufo.x + 16, y: ufo.y + 10, start: Date.now() }
          ]);
          setInvaderScore(score => score + 10);
          ufo.alive = false;
        }
      }
      return ufo;
    }));
  }, [lasers]);

  // Remove old explosions
  useEffect(() => {
    if (explosions.length === 0) return;
    const id = setInterval(() => {
      setExplosions(explosions => explosions.filter(e => Date.now() - e.start < EXPLOSION_DURATION));
    }, 60);
    return () => clearInterval(id);
  }, [explosions]);

  // Remove dead UFOs
  useEffect(() => {
    setUfos(prev => prev.filter(ufo => ufo.alive && ufo.y < windowSize.height + 40));
  }, [ufos, windowSize.height]);

  // Keyboard controls
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCannonX(x => Math.max(0, x - 36));
      if (e.key === 'ArrowRight') setCannonX(x => Math.min(windowSize.width - 60, x + 36));
      if (e.key === ' ' || e.key === 'ArrowUp') {
        setLasers(prev => [...prev, { x: cannonX + 30, y: windowSize.height - 48 }]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cannonX, windowSize]);

  // Initialize stars
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setStars(Array.from({length: 80}).map(() => ({
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.15 + 0.05,
      opacity: Math.random() * 0.7 + 0.3
    })));
  }, [windowSize]);

  // Animate stars
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = setInterval(() => {
      setStars(prev => prev.map(star => {
        let newY = star.y + star.speed;
        if (newY > windowSize.height) newY = 0;
        return { ...star, y: newY };
      }));
    }, 40);
    return () => clearInterval(id);
  }, [windowSize.height]);

  // Twinkling stars: add a twinkle phase
  useEffect(() => {
    const id = setInterval(() => setTwinklePhase(p => (p + 1) % 1000), 80);
    return () => clearInterval(id);
  }, []);

  // Add Star Wars font import to the head if not already present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = 'starwars-font-link';
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  // Fade out and hide title after 15 seconds
  useEffect(() => {
    if (!showTitle) return;
    const fadeStart = setTimeout(() => {
      let fade = 1;
      const fadeInterval = setInterval(() => {
        fade -= 0.04;
        setTitleOpacity(Math.max(0, fade));
        if (fade <= 0) {
          setShowTitle(false);
          clearInterval(fadeInterval);
        }
      }, 50);
    }, 15000);
    return () => clearTimeout(fadeStart);
  }, [showTitle]);

  // Animate title fade-in and pop-up
  useEffect(() => {
    if (!showTitle) return;
    let scale = 0.6;
    let opacity = 0;
    setTitleScale(scale);
    setTitleOpacity(opacity);
    // Pop-in animation: scale and fade in
    const popDuration = 1200; // ms
    const start = Date.now();
    const popAnim = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / popDuration);
      // Ease out back for pop effect
      const ease = t < 1 ? (1 + 1.7 * Math.pow(t-1, 3) + 0.7 * Math.pow(t-1, 2)) : 1;
      setTitleScale(0.6 + 0.5 * ease);
      setTitleOpacity(t);
      if (t >= 1) clearInterval(popAnim);
    }, 16);
    return () => clearInterval(popAnim);
  }, [showTitle]);

  // Listen for arrow/spacebar to hide instructions
  useEffect(() => {
    if (!showGameInstructions) return;
    const hideInstructions = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
        setShowGameInstructions(false);
      }
    };
    window.addEventListener("keydown", hideInstructions);
    return () => window.removeEventListener("keydown", hideInstructions);
  }, [showGameInstructions]);

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
      {/* Animated star field with twinkle */}
      {stars.map((star, i) => {
        // Twinkle effect: modulate opacity with a sine wave
        const twinkle = 0.5 + 0.5 * Math.sin((twinklePhase + i * 37) * 0.07 + star.x * 0.01);
        return (
          <div key={i} style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            background: "#fff",
            opacity: Math.max(0, Math.min(1, star.opacity * (0.7 + 0.6 * twinkle))),
            borderRadius: "50%",
            filter: "blur(0.5px)"
          }} />
        );
      })}
      {/* Animated galaxies (rotating) */}
      <svg style={{
        position: "absolute",
        left: windowSize.width * 0.15,
        top: windowSize.height * 0.18,
        width: 120,
        height: 60,
        pointerEvents: "none",
        transform: `rotate(${twinklePhase * 0.03}deg)`
      }} viewBox="0 0 120 60">
        <ellipse cx="60" cy="30" rx="55" ry="22" fill="url(#galaxy1)" filter="url(#blur1)" />
        <defs>
          <radialGradient id="galaxy1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#aaf" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#00f" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="blur1"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>
      </svg>
      <svg style={{
        position: "absolute",
        left: windowSize.width * 0.7,
        top: windowSize.height * 0.3,
        width: 90,
        height: 40,
        pointerEvents: "none",
        transform: `rotate(${-twinklePhase * 0.025}deg)`
      }} viewBox="0 0 90 40">
        <ellipse cx="45" cy="20" rx="40" ry="15" fill="url(#galaxy2)" filter="url(#blur2)" />
        <defs>
          <radialGradient id="galaxy2">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#f0f" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="blur2"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>
      </svg>
      {/* Animated nebulae (pulsating) */}
      <svg style={{
        position: "absolute",
        left: windowSize.width * 0.4,
        top: windowSize.height * 0.6,
        width: 180,
        height: 90,
        pointerEvents: "none",
        opacity: 0.7 + 0.2 * Math.sin(twinklePhase * 0.02)
      }} viewBox="0 0 180 90">
        <ellipse cx="90" cy="45" rx="80" ry="35" fill="url(#nebula1)" filter="url(#blur3)" />
        <defs>
          <radialGradient id="nebula1">
            <stop offset="0%" stopColor="#0ff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="blur3"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
      </svg>
      <svg style={{
        position: "absolute",
        left: windowSize.width * 0.8,
        top: windowSize.height * 0.8,
        width: 120,
        height: 60,
        pointerEvents: "none",
        opacity: 0.6 + 0.3 * Math.cos(twinklePhase * 0.018)
      }} viewBox="0 0 120 60">
        <ellipse cx="60" cy="30" rx="55" ry="22" fill="url(#nebula2)" filter="url(#blur4)" />
        <defs>
          <radialGradient id="nebula2">
            <stop offset="0%" stopColor="#f0f" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#aaf" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="blur4"><feGaussianBlur stdDeviation="16" /></filter>
        </defs>
      </svg>
      {ufos.map((ufo, i) => ufo.alive && (
        <div key={i} style={{position: "absolute", left: ufo.x, top: ufo.y, width: 32, height: 20}}>
          {UFO}
        </div>
      ))}
      {lasers.map((laser, i) => (
        <div key={i} style={{position: "absolute", left: laser.x - 2, top: laser.y, width: 4, height: 16, background: "#fff", borderRadius: 2, boxShadow: "0 0 8px #0ff"}} />
      ))}
      <div style={{position: "absolute", left: cannonX, top: windowSize.height - 48, width: 60, height: 36}}>
        {CANNON}
      </div>
      {/* Explosions */}
      {explosions.map((e, i) => {
        const t = Math.min(1, (Date.now() - e.start) / EXPLOSION_DURATION);
        const scale = 1 + t * 2.2;
        const opacity = 1 - t;
        // Flicker for fire effect
        const flicker = 0.9 + 0.2 * Math.sin(Date.now() * 0.04 + i * 7);
        return (
          <svg key={i} style={{
            position: "absolute",
            left: e.x - 22 * scale,
            top: e.y - 22 * scale,
            width: 44 * scale,
            height: 44 * scale,
            pointerEvents: "none",
            opacity: opacity * flicker,
            zIndex: 2
          }} viewBox="0 0 44 44">
            {/* Outer glow */}
            <circle cx="22" cy="22" r={16 + 8 * t} fill="#fff" fillOpacity={0.18 * (1-t)} />
            {/* Fire: animated orange/yellow flicker */}
            <radialGradient id={`fire${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#ff0" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#fa0" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#f00" stopOpacity="0.3" />
            </radialGradient>
            <circle cx="22" cy="22" r={10 + 7 * t * flicker} fill={`url(#fire${i})`} />
            {/* Red core */}
            <circle cx="22" cy="22" r={5 + 3 * t * flicker} fill="#f00" fillOpacity={0.7 * (1-t)} />
            {/* White flash core */}
            <circle cx="22" cy="22" r={3 + 2 * (1-t)} fill="#fff" fillOpacity={0.7 * (1-t)} />
            {/* Fire sparks */}
            {[...Array(7)].map((_, j) => {
              const angle = (j / 7) * 2 * Math.PI + t * 2 + i;
              const r = 13 + 10 * t * Math.random();
              return <circle key={j} cx={22 + Math.cos(angle) * r} cy={22 + Math.sin(angle) * r} r={1.2 + Math.random()} fill="#ff0" fillOpacity={0.7 * (1-t)} />;
            })}
            {/* Smoke */}
            <ellipse cx="22" cy="22" rx={10 + 12 * t} ry={6 + 10 * t} fill="#888" fillOpacity={0.13 * (1-t)} />
          </svg>
        );
      })}
      {/* Space Invader Score */}
      <div style={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 20,
        fontFamily: 'Orbitron, "Arial Black", Arial, sans-serif',
        fontWeight: 900,
        fontSize: 28,
        color: "#0ff",
        textShadow: "0 0 8px #fff, 0 0 16px #0ff",
        background: "rgba(0,0,0,0.4)",
        borderRadius: 8,
        padding: "6px 18px"
      }}>
        Score: {invaderScore}
      </div>
      {/* Game Instructions */}
      {showGameInstructions && (
        <div style={{
          position: "absolute",
          left: 24,
          bottom: 32,
          zIndex: 20,
          fontFamily: 'Orbitron, "Arial Black", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 20,
          color: "#fff",
          background: "rgba(0,0,0,0.7)",
          borderRadius: 8,
          padding: "10px 18px",
          maxWidth: 340,
          boxShadow: "0 0 12px #0ff4"
        }}>
          Use the arrows to move left and right, and the space bar to shoot.
        </div>
      )}
      {/* Star Wars style title */}
      {showTitle && (
        <div style={{
          position: "absolute",
          top: 32,
          left: "50%",
          transform: `translateX(-50%) scale(${titleScale})`,
          zIndex: 10,
          fontFamily: 'Orbitron, "Arial Black", Arial, sans-serif',
          fontWeight: 900,
          fontSize: 48,
          letterSpacing: 4,
          color: "#ffe81f",
          textShadow: "0 0 16px #fff, 0 0 32px #ffe81f, 0 0 8px #000",
          opacity: titleOpacity,
          transition: "opacity 0.5s linear, transform 0.5s cubic-bezier(.23,1.5,.32,1)",
          willChange: "opacity, transform"
        }}>
          BUY-IONIC TRIVIA
        </div>
      )}
    </div>
  );
}
