"use client";

import { Canvas } from "@react-three/fiber";
import { DiamondShape } from "@/components";
import { useEffect, useState } from "react";

function DiamondScene() {
  // Fixes issue related to window not being defined during SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      eventPrefix="client"
      eventSource={window?.document?.body ?? undefined}
    >
      <ambientLight intensity={0.5} />

      {/* Single diamond in the center */}
      <DiamondShape size={1.5} position={[0, 0, 0]} />
    </Canvas>
  ) : null;
}

export default DiamondScene;
