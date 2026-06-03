/**
 * LenisContext
 *
 * A simple React context that holds the active Lenis instance.
 * LenisProvider sets the value; any component can read it with useLenis().
 * Keeping this in a separate file avoids circular imports.
 */

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

/**
 * useLenis — returns the Lenis instance or null before it is initialised.
 * Only works inside a LenisProvider subtree.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
