"use client";

import { useEffect, useRef } from "react";
import Navbar from "./navbar";

export default function NavbarShell() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const setVar = () => {
      const bottom = el.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty("--navbar-bottom", `${bottom}px`);
    };

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <Navbar />
      </div>
    </div>
  );
}