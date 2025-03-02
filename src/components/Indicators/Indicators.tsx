"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { type ShapeProps } from "@react-three/drei";

interface Props extends ShapeProps<typeof THREE.Object3D> {
  color?: string;
  gap?: number;
}

function Indicators({
  color = "#5CDCDC", // Light cyan color matching the image
  gap = 0.125, // Gap between the two triangles
  ...props
}: Props) {
  const triangleShape = useMemo(() => {
    const shape = new THREE.Shape();

    const x = 0;
    const y = 0;

    shape.moveTo(x - 1, y - 1);
    shape.lineTo(x + 1, y - 1);
    shape.lineTo(x, y + 0.75);

    return shape;
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      side: THREE.DoubleSide,
    });
  }, [color]);

  return (
    <group {...props}>
      {/* Left triangle */}
      <mesh position={[-1 - gap / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <shapeGeometry args={[triangleShape]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Right triangle */}
      <mesh position={[1 + gap / 2, 0, 0]} rotation={[0, 0, -(Math.PI / 2)]}>
        <shapeGeometry args={[triangleShape]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

export { Indicators };
