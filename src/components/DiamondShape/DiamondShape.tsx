"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";

interface DiamondShapeProps {
  size?: number;
  color?: string;
  gap?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function DiamondShape({
  size = 1,
  color = "#5CDCDC", // Light cyan color matching the image
  gap = 0.05, // Gap between the two triangles
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: DiamondShapeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftTriangleRef = useRef<THREE.Mesh>(null);
  const rightTriangleRef = useRef<THREE.Mesh>(null);

  // Create triangle shape
  const triangleShape = useMemo(() => {
    const shape = new THREE.Shape();

    // Create a triangle pointing right
    shape.moveTo(0, 0);
    shape.lineTo(size, size);
    shape.lineTo(0, size * 2);
    shape.lineTo(0, 0);

    return shape;
  }, [size]);

  // Create material
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      side: THREE.DoubleSide,
    });
  }, [color]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation as unknown as THREE.Euler}
    >
      {/* Left triangle */}
      <mesh ref={leftTriangleRef} position={[(gap / 1) * 0.5, -1, 0]}>
        <shapeGeometry args={[triangleShape]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Right triangle (mirrored) */}
      <mesh
        ref={rightTriangleRef}
        position={[(-gap / 1) * 0.5, -1, 0]}
        scale={[-1, 1, 1]} // Mirror horizontally
      >
        <shapeGeometry args={[triangleShape]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

export { DiamondShape };
