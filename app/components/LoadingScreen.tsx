"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Preparing the kingdom\u2026",
  "Summoning your royal avatar\u2026",
  "Almost ready\u2026",
];

export default function LoadingScreen() {
  // 1. Start as TRUE so it covers the screen immediately
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  
  // 2. Hydration safeguard
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // If they already loaded it, immediately hide it
    if (sessionStorage.getItem("zellers_loaded")) {
      setIsVisible(false);
      return;
    }

    const DURATION = 2800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / DURATION, 1);
      // Ease-in-out quad so it accelerates then decelerates (dramatic effect)
      const eased =
        raw < 0.5
          ? 2 * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const p = Math.round(eased * 100);

      setProgress(p);
      if (p >= 68) setMsgIndex(1);
      if (p >= 94) setMsgIndex(2);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          sessionStorage.setItem("zellers_loaded", "1");
          setIsVisible(false);
        }, 520);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Prevent hydration mismatch errors by waiting for client mount
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: "easeInOut" as const }}
          // 3. FIXED: z-[9999] ensures it stays above everything in layout.tsx
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* ── Background Image ── */}
          <div className="absolute inset-0 bg-[#0A0515]">
            <Image
              src="/loading.jpeg"
              alt=""
              fill
              className="object-cover opacity-80"
              priority
              aria-hidden
            />
          </div>

          {/* ── Subtle dark veil for overlay contrast ── */}
          <div className="absolute inset-0 bg-black/40" aria-hidden />

          {/* ── Hero-matching cinematic glow blobs ── */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-900/35 blur-[110px]"
              animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.75, 0.4] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-yellow-400/20 blur-[90px]"
              animate={{ scale: [1.1, 0.88, 1.1], opacity: [0.25, 0.55, 0.25] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay: 0.6,
              }}
            />
          </div>

          {/* ── Diagonal shimmer sweep ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <motion.div
              className="absolute inset-y-0 w-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,220,100,0.08), transparent)",
              }}
              animate={{ x: ["-50vw", "160vw"] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 1.8,
                ease: "easeInOut" as const,
              }}
            />
          </div>

          {/* ── Floating gold & white sparkle particles ── */}
          {[...Array(30)].map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                backgroundColor:
                  i % 6 === 0
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(253,224,71,0.85)",
                top: `${8 + ((i * 71) % 84)}%`,
                left: `${5 + ((i * 53) % 90)}%`,
                boxShadow: `0 0 ${4 + (i % 4) * 2}px rgba(253,224,71,0.8)`,
              }}
              animate={{
                y: [0, -(18 + (i % 3) * 9), 0],
                opacity: [0, 0.95, 0],
                scale: [0.4, 1.5, 0.4],
              }}
              transition={{
                duration: 2.0 + (i % 5) * 0.35,
                repeat: Infinity,
                delay: (i * 0.13) % 2.8,
                ease: "easeInOut" as const,
              }}
            />
          ))}

          {/* ── Decorative gold orbital rings centered on logo area ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ paddingTop: "70px" }}
          >
            {[310, 228, 152].map((size, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  border: `1px ${i === 1 ? "dashed" : "solid"} rgba(234,179,8,${
                    0.07 + i * 0.07
                  })`,
                }}
                animate={{
                  rotate: i % 2 === 0 ? 360 : -360,
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  rotate: {
                    duration: 32 - i * 7,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                  },
                }}
              />
            ))}

            {/* Subtle pulsing inner glow dot at logo center */}
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-yellow-300/60"
              style={{
                boxShadow:
                  "0 0 16px rgba(253,224,71,0.9), 0 0 32px rgba(253,224,71,0.4)",
              }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
            />
          </div>

          {/* ── Top badge pill ── */}
          <motion.div
            className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 rounded-full border border-yellow-400/35 bg-yellow-400/10 backdrop-blur-md"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" as const }}
          >
            <span className="text-yellow-400 text-[10px]">✦</span>
            <span className="text-[10px] font-black tracking-[0.38em] uppercase text-yellow-300">
              Avurudu 2026
            </span>
            <span className="text-yellow-400 text-[10px]">✦</span>
          </motion.div>

          {/* ── Bottom progress section ── */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-60"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35, ease: "easeOut" as const }}
          >
            {/* Rotating message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/70 text-center drop-shadow-md"
              >
                {MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress track (outer wrapper for glow dot overflow) */}
            <div className="relative w-full py-1.5">
              {/* Track */}
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #b45309, #f59e0b, #fde68a)",
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.08 }}
                />
              </div>

              {/* Glowing tip dot — outside overflow-hidden track */}
              {progress > 1 && progress < 100 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-300"
                  style={{
                    left: `calc(${progress}% - 6px)`,
                    boxShadow:
                      "0 0 10px rgba(253,224,71,1), 0 0 22px rgba(253,224,71,0.6)",
                    transition: "left 0.08s linear",
                  }}
                />
              )}

              {/* Burst flash at 100% */}
              {progress === 100 && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-300"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                />
              )}
            </div>

            {/* Percentage counter */}
            <p className="text-[9px] font-black tracking-widest text-white/50 tabular-nums">
              {String(progress).padStart(3, "\u2007")}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}