"use client";

/**
 * Providers
 *
 * Single client-side provider tree.  layout.tsx imports this so it can keep
 * its own `"use server"` (or no directive) boundary intact while still
 * nesting client components.
 *
 * Add future providers (theme, analytics, etc.) here.
 */

import LenisProvider from "./LenisProvider";
import ScrollProgressBar from "./Scrollprogressbar";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <LenisProvider>
      {/* Progress bar is fixed-positioned so it renders above all content */}
      <ScrollProgressBar height={2} zIndex={9999} />
      {children}
    </LenisProvider>
  );
}