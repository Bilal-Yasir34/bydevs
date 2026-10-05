"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ConstellationField = dynamic(
  () => import("@/src/shaders/constellation-field/ConstellationField").then(m => m.ConstellationField),
  { ssr: false }
);

export function SiteBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer mount slightly after initial paint to guarantee instant FCP & LCP
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number })
        .requestIdleCallback(() => setMounted(true), { timeout: 250 });
      return () => {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
      };
    } else {
      const t = setTimeout(() => setMounted(true), 40);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div
      className="site-background-frame"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
    >
      {mounted && (
        <ConstellationField
          variant="particle-drift"
          mode="light"
          speed={1.00}
          size={1.00}
          length={1.00}
          density={1.00}
          opacity={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
        />
      )}
    </div>
  );
}

export default SiteBackground;
