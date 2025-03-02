"use client";

import dynamic from "next/dynamic";

// Use dynamic import with no SSR for the Three.js component
// const CirclesScene = dynamic(() => import("@/components/scenes/CirclesScene"), {
//   ssr: false,
// });

const IndicatorsScene = dynamic(
  () => import("@/components/scenes/IndicatorsScene"),
  {
    ssr: false,
  }
);

export default function ClientWrapper() {
  return <IndicatorsScene />;
}
