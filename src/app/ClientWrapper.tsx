"use client";

import dynamic from "next/dynamic";

// Use dynamic import with no SSR for the Three.js component
const DiamondScene = dynamic(() => import("@/components/scenes/DiamondScene"), {
  ssr: false,
});

export default function ClientWrapper() {
  return <DiamondScene />;
}
