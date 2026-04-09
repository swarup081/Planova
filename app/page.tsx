"use client";

import { useState, useEffect } from "react";
import AppMaster from "./component/calander/page";
import AppMasterDesktop from "./component/calander/desktop/page";

/**
 * Responsive dispatcher:
 *  - Desktop / Tablet Landscape  (width >= 1024px) → AppMasterDesktop
 *  - Mobile / Tablet Portrait    (width <  1024px) → AppMaster
 *
 * Nothing is rendered until the first measurement so we avoid a
 * flash of the wrong layout on hydration.
 */
export default function Page() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Desktop / Tablet-Landscape  → AppMasterDesktop
    // Mobile / Tablet-Portrait    → AppMaster
    const mq = window.matchMedia(
      "(min-width: 1024px), (min-width: 768px) and (orientation: landscape)"
    );

    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches);
    };

    // Initial read
    update(mq);

    // Listen for changes (resize / rotate)
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Avoid layout flash by rendering nothing until we know the viewport
  if (isDesktop === null) return null;

  return isDesktop ? <AppMasterDesktop /> : <AppMaster />;
}
