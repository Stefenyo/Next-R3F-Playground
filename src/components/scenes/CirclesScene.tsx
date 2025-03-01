"use client";

import { Canvas } from "@react-three/fiber";
import { TrackingCircle } from "@/components";
import { useEffect, useState } from "react";

function CircleScene() {
  // Fixes issue related to window not being defined during SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      eventPrefix="client"
      eventSource={window?.document?.body ?? undefined}
    >
      <TrackingCircle
        args={[2.6, 75]}
        rotation={[0, 0, 0]}
        circleColor="red"
        edgeBlur={0.15}
        mouseTracking
      />
      <TrackingCircle
        args={[2.68, 75]}
        rotation={[0, 0, 0]}
        circleColor="black"
        edgeBlur={0.15}
        mouseTracking
        trackingIntensity={1.8}
      />
    </Canvas>
  ) : null;
}

export default CircleScene;
