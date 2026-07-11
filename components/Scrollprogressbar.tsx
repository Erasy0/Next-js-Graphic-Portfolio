"use client";

import { useEffect, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  useMotionValueEvent,
} from "framer-motion";

interface ScrollProgressBarProps {
  height?: number;
  zIndex?: number;
}

export default function ScrollProgressBar({
  height = 2,
  zIndex = 9999,
}: ScrollProgressBarProps) {
  const [mounted, setMounted] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);

  const rawProgress = useMotionValue(0);
  const springProgress = useSpring(rawProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = useTransform(springProgress, [0, 1], [0, 1]);

  useMotionValueEvent(springProgress, "change", (latest) => {
    setDisplayPct(Math.round(latest * 100));
  });

  useEffect(() => {
    setMounted(true);
    const container = document.querySelector<HTMLElement>(".snap-container");
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const max = scrollHeight - clientHeight;
      const progress = max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0;
      rawProgress.set(progress);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [rawProgress]);

  if (!mounted) return null;

  const pillVisible = displayPct > 0;

  return (
    <>
      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height,
          zIndex,
          isolation: "isolate",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <motion.div
          style={{
            height: "100%",
            width: "100%",
            transformOrigin: "left center",
            scaleX,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.9) 100%)",
            willChange: "transform",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: height + 4,
            transformOrigin: "left center",
            scaleX,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.18) 100%)",
            filter: "blur(3px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Percentage pill */}
      <motion.div
        aria-live="polite"
        aria-label={`Page scroll progress: ${displayPct}%`}
        initial={{ opacity: 0, y: -6 }}
        animate={{
          opacity: pillVisible ? 1 : 0,
          y: pillVisible ? 0 : -6,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: `calc(var(--navbar-bottom, ${height + 10}px) + 10px)`,
          right: "1.25rem",
          zIndex,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.3rem 0.75rem",
          // ↑ More opaque background
          border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: "999px",
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Dot — slightly larger & brighter */}
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.75)",
            flexShrink: 0,
          }}
        />
        {/* Number — larger & near-white */}
        <span
          style={{
            fontFamily: "var(--CalSans, sans-serif)",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.92)",
            fontVariantNumeric: "tabular-nums",
            minWidth: "2.1ch",
            textAlign: "right",
          }}
        >
          {displayPct}
        </span>
        {/* % symbol — more visible */}
        <span
          style={{
            fontFamily: "var(--JuliusSansOne, sans-serif)",
            fontSize: "0.52rem",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          %
        </span>
      </motion.div>
    </>
  );
}