"use client";

import { useState, useEffect } from "react";

/** True when viewport width is at or below breakpoint (default: mobile / small tablet). */
export function useIsNarrowScreen(breakpointPx = 640) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpointPx]);

  return narrow;
}
