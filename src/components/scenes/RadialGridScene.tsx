"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Indicators } from "@/components";
import { useEffect, useState, useMemo, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Component to generate the radial grid
function RadialGrid({
  rings = 8,
  elementsPerRing = 8,
  maxSize = 5,
  rotationSpeed = 0.02,
  colorVariation = true,
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Calculate the maximum radius to cover the viewport
  const maxRadius = useMemo(() => {
    // Use the larger dimension to ensure coverage
    const maxDimension = Math.max(viewport.width, viewport.height);
    // Add extra to ensure we cover corners
    return maxDimension * 1.2;
  }, [viewport]);

  // Generate positions for indicators in a radial grid
  const gridElements = useMemo(() => {
    const elements = [];

    // Calculate aspect ratio for proper spacing
    const aspectRatio = viewport.width / viewport.height;

    // Start with one in the center
    elements.push({
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: 0.5, // Smaller size for center
      color: "#5CDCDC",
      ring: 0,
    });

    // Create rings of elements
    for (let ring = 1; ring <= rings; ring++) {
      // Calculate number of elements in this ring - more elements in outer rings
      // Adjust for aspect ratio to maintain even spacing
      const baseElements = Math.floor(elementsPerRing * ring);
      const ringElements = Math.max(6, baseElements);

      // Calculate radius for this ring with slight non-linear growth
      const radiusFactor = Math.pow(ring / rings, 0.9); // Slightly non-linear growth
      const radius = radiusFactor * maxRadius;

      // Calculate scale factor - elements grow as they move outward
      // Use a curve that grows faster at first, then slows down
      const scaleFactor = 0.5 + Math.pow(ring / rings, 0.8) * maxSize;

      // Create elements around the ring
      for (let i = 0; i < ringElements; i++) {
        const angle = (i / ringElements) * Math.PI * 2;

        // Adjust x position for aspect ratio
        const x =
          Math.cos(angle) * radius * (aspectRatio < 1 ? aspectRatio : 1);
        const y =
          Math.sin(angle) * radius * (aspectRatio > 1 ? 1 / aspectRatio : 1);

        // Calculate rotation to create a pleasing pattern
        // Alternate between pointing inward and outward for visual interest
        const baseRotation = angle + Math.PI / 2;
        const rotationOffset = ring % 2 === 0 ? Math.PI : 0;
        const rotation: [number, number, number] = [
          0,
          0,
          baseRotation + rotationOffset,
        ];

        // Create color variations based on position
        let color = "#5CDCDC";
        if (colorVariation) {
          // Vary hue based on angle and distance from center
          const hue = 180 + Math.sin(angle * 3) * 10 + ((ring * 2) % 20);
          // Vary saturation slightly based on ring
          const saturation = 75 + Math.sin(ring * 0.5) * 10;
          // Vary lightness based on distance from center
          const lightness = 60 + Math.cos(ring * 0.7) * 5;
          color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }

        elements.push({
          position: [x, y, 0] as [number, number, number],
          rotation,
          scale: scaleFactor,
          color,
          ring, // Store ring number for animation
        });
      }
    }

    return elements;
  }, [
    rings,
    elementsPerRing,
    maxRadius,
    viewport.width,
    viewport.height,
    colorVariation,
    maxSize,
  ]);

  // More sophisticated animation
  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation of the entire grid
      groupRef.current.rotation.z =
        state.clock.getElapsedTime() * rotationSpeed;

      // Animate individual elements
      groupRef.current.children.forEach((child, index) => {
        if (index > 0) {
          // Skip the center element
          const element = gridElements[index];
          if (element && typeof element.ring === "number") {
            // Add subtle oscillation based on ring number
            const ringFactor = element.ring / rings;
            const oscillation =
              Math.sin(
                state.clock.getElapsedTime() * (1 + ringFactor) + index
              ) * 0.05;

            // Apply subtle scale oscillation
            child.scale.x = element.scale * (1 + oscillation * 0.1);
            child.scale.y = element.scale * (1 + oscillation * 0.1);
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {gridElements.map((element, index) => (
        <Indicators
          key={`indicator-${index}`}
          position={element.position}
          rotation={element.rotation}
          scale={element.scale}
          color={element.color}
          gap={0.125 * (1 + element.scale / maxSize)} // Scale gap with element size
        />
      ))}
    </group>
  );
}

function RadialGridScene() {
  // Fixes issue related to window not being defined during SSR
  const [isMounted, setIsMounted] = useState(false);

  // Configuration for the grid
  const gridConfig = {
    rings: 12,
    elementsPerRing: 5,
    maxSize: 2.5,
    rotationSpeed: 0.02,
    colorVariation: true,
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <Canvas
      style={{ width: "100%", height: "100%", background: "#000" }}
      eventPrefix="client"
      eventSource={window?.document?.body ?? undefined}
      camera={{ position: [0, 0, 50], fov: 50 }}
    >
      <ambientLight intensity={1} />

      <RadialGrid
        rings={gridConfig.rings}
        elementsPerRing={gridConfig.elementsPerRing}
        maxSize={gridConfig.maxSize}
        rotationSpeed={gridConfig.rotationSpeed}
        colorVariation={gridConfig.colorVariation}
      />

      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0}
          luminanceSmoothing={0.4}
          mipmapBlur={true}
        />
      </EffectComposer>
    </Canvas>
  ) : null;
}

export default RadialGridScene;
