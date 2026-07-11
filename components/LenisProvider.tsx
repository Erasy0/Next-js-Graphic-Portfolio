"use client";

/**
 * LenisProvider with smart snap scrolling
 * 
 * Only snaps to sections that are full viewport height.
 * Allows scrolling within taller sections naturally.
 */

import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const isSnappingRef = useRef<boolean>(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const snapToSection = useCallback(
    (lenis: Lenis, targetSection: HTMLElement) => {
      if (isSnappingRef.current) return;

      isSnappingRef.current = true;

      const rect = targetSection.getBoundingClientRect();
      const wrapper = document.querySelector<HTMLElement>(".snap-container");

      const scrollTop = wrapper?.scrollTop || 0;
      const targetPosition = scrollTop + rect.top;

      lenis.scrollTo(targetPosition, {
        offset: 0,
        immediate: false,
        duration: 0.8,
        easing: (t: number) =>
          t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2,

        lock: true,

        onComplete: () => {
          if (snapTimeoutRef.current) {
            clearTimeout(snapTimeoutRef.current);
          }

          snapTimeoutRef.current = setTimeout(() => {
            isSnappingRef.current = false;
          }, 100);
        },
      });
    },
    []
  );

  useEffect(() => {
    const wrapper = document.querySelector<HTMLElement>(".snap-container");
    const content = wrapper?.querySelector<HTMLElement>("main") ?? undefined;

    if (!wrapper) {
      console.warn(
        "[LenisProvider] .snap-container not found — skipping Lenis init."
      );
      return;
    }

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      easing: (t: number) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.8,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      eventsTarget: wrapper,
    });

    lenisRef.current = lenis;

    let wheelTimeout: NodeJS.Timeout | null = null;
    let lastScrollTime = 0;

    const SNAP_DELAY = 150;
    const SNAP_THRESHOLD = 0.15;

    const handleScrollSnap = () => {
      if (isSnappingRef.current) return;

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;

      if (wheelTimeout) clearTimeout(wheelTimeout);

      wheelTimeout = setTimeout(() => {
        if (isSnappingRef.current) return;

        const scrollTop = wrapper.scrollTop;
        const viewportHeight = window.innerHeight;

        const sections = Array.from(
          document.querySelectorAll<HTMLElement>(".snap-section")
        );

        if (sections.length === 0) return;


        const lastSection = sections[sections.length - 1];

        const lastSectionRect =
          lastSection.getBoundingClientRect();

        const isInLastSection =
          scrollTop + viewportHeight > lastSectionRect.top;


        if (
          isInLastSection &&
          lastSectionRect.height > viewportHeight
        ) {
          return;
        }


       let closestSection: HTMLElement | null = null;
let closestDistance = Infinity;

for (const section of sections) {
  const sectionRect = section.getBoundingClientRect();
  const isTallSection = sectionRect.height > viewportHeight + 50;
  if (isTallSection) continue;

  const sectionTop = section.offsetTop;
  const distance = Math.abs(scrollTop - sectionTop);

  if (distance < closestDistance) {
    closestDistance = distance;
    closestSection = section;
  }
}

if (
  closestSection &&
  (closestDistance < viewportHeight * SNAP_THRESHOLD ||
    timeSinceLastScroll > SNAP_DELAY)
) {
  snapToSection(lenis, closestSection);
  sections.forEach((section) => {
    section.classList.remove("in-view");
  });
  closestSection.classList.add("in-view");
}
      }, 100);


      lastScrollTime = now;
    };


    wrapper.addEventListener(
      "scroll",
      handleScrollSnap
    );


    setTimeout(() => {
      const firstSection =
        document.querySelector<HTMLElement>(
          ".snap-section"
        );

      if (firstSection && wrapper.scrollTop === 0) {
        snapToSection(lenis, firstSection);
        firstSection.classList.add("in-view");
      }

    }, 100);


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

      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }

      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      wrapper.removeEventListener(
        "scroll",
        handleScrollSnap
      );

      lenisRef.current = null;
    };

  }, [snapToSection]);


  return <>{children}</>;
}