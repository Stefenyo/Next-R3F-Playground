"use client";
import { useThree } from "@react-three/fiber";
import { Circle, useTexture } from "@react-three/drei";
import * as THREE from "three";
import React from "react";

interface TexturedCircleProps {
  texturePath: string;
  sizeMultiplier?: number;
}

const TexturedCircle = React.forwardRef<THREE.Mesh, TexturedCircleProps>(
  ({ texturePath, sizeMultiplier = 1 }, ref) => {
    const { viewport } = useThree();
    const baseRadius = Math.max(viewport.width, viewport.height) / 3.05;
    const radius = baseRadius * sizeMultiplier;

    const texture = useTexture(texturePath);

    return (
      <Circle ref={ref} args={[radius, 64]}>
        <meshBasicMaterial
          map={texture}
          opacity={1}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </Circle>
    );
  }
);

TexturedCircle.displayName = "TexturedCircle";

export { TexturedCircle };
