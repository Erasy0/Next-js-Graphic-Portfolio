"use client";

/**
 * LenisProvider
 *
 * Attaches Lenis smooth-scrolling to the .snap-container element and
 * drives its RAF loop.  All children are rendered normally — this component
 * is purely a side-effect wrapper.
 *
 * Why target `.snap-container` and not `<html>`?
 *   The layout uses a fixed-height inner div (`.snap-container`) as the
 *   scrollable root, not the window.  Lenis must receive that element as
 *   both `wrapper` (the element with overflow) and `content` (its first
 *   scrollable child, i.e. the `<main>`).
 *
 * Lenis + CSS snap scroll:
 *   We keep `smoothTouch: false` and `syncTouch: true` so mobile native
 *   momentum isn't broken.  We also pass `lerp: 0.1` for a subtle desktop
 *   easing that doesn't fight the snap points too aggressively.
 *
 * ScrollProgressBar compatibility:
 *   Lenis overrides the native scroll position via transform/translate on
 *   the content element.  The ScrollProgressBar reads `scrollTop` from the
 *   container element — Lenis keeps that in sync, so no special bridge is
 *   needed.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Grab the snap-container element that acts as the scroll root.
    const wrapper = document.querySelector<HTMLElement>(".snap-container");
    const content = wrapper?.querySelector<HTMLElement>("main") ?? undefined;

    if (!wrapper) {
      // Graceful fallback: if element not found yet, do nothing.
      // This shouldn't happen in production but guards against race conditions
      // during development HMR.
      console.warn("[LenisProvider] .snap-container not found — skipping Lenis init.");
      return;
    }

    const lenis = new Lenis({
      wrapper,
      content,
      // Gentle easing — low enough not to fight CSS snap points.
      lerp: 0.1,
      // Keep native touch momentum on mobile; Lenis handles desktop.
      syncTouch: true,
      smoothTouch: false,
      // Respect the snap-container's overflow axis.
      orientation: "vertical",
      gestureOrientation: "vertical",
      // Allow Lenis to work inside an overflowed element.
      eventsTarget: wrapper,
    });

    lenisRef.current = lenis;

    // Drive Lenis with requestAnimationFrame.
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisRef.current = null;
    };
  }, []);

  // This component only manages a side-effect — render children as-is.
  return <>{children}</>;
}
