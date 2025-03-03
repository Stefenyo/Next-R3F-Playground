"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Indicators } from "@/components";
import { useEffect, useState, useMemo, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";

// Component to generate the radial grid
function RadialGrid({
  rings = 8,
  elementsPerRing = 8,
  maxSize = 5,
  colorVariation = true,
  mouseTracking = true,
  trackingIntensity = 0.15,
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const elementGroupsRef = useRef<(THREE.Group | null)[]>([]);

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
      originalPosition: new THREE.Vector3(0, 0, 0),
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
          originalPosition: new THREE.Vector3(x, y, 0),
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

  // Initialize element groups array
  useEffect(() => {
    // Initialize the array with the correct length
    elementGroupsRef.current = Array(gridElements.length).fill(null);
  }, [gridElements.length]);

  // Handle mouse tracking animation
  useFrame((state) => {
    if (!mouseTracking || !groupRef.current) return;

    // Calculate mouse influence
    const mouseX = state.pointer.x * viewport.width * 0.5;
    const mouseY = state.pointer.y * viewport.height * 0.5;
    const mousePosition = new THREE.Vector3(mouseX, mouseY, 0);

    // Update each element
    gridElements.forEach((element, index) => {
      const elementGroup = elementGroupsRef.current[index];
      if (!elementGroup) return;

      const originalPos = element.originalPosition;
      const distanceToMouse = mousePosition.distanceTo(originalPos);

      // Calculate influence based on distance (closer elements are affected more)
      // Inverse square law for natural-feeling falloff
      const maxDistance = Math.max(viewport.width, viewport.height) * 2.5;
      const influence =
        Math.max(0, 1 - distanceToMouse / maxDistance) * trackingIntensity;

      // Calculate direction vector from original position to mouse
      const direction = new THREE.Vector3()
        .subVectors(mousePosition, originalPos)
        .normalize();

      // Calculate new target position
      // Closer elements move more toward the mouse
      const targetPos = originalPos
        .clone()
        .addScaledVector(direction, influence * 15);

      // Animate to the target position with GSAP
      gsap.to(elementGroup.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.5, // Adjust for desired responsiveness
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  });

  return (
    <group ref={groupRef}>
      {gridElements.map((element, index) => (
        <group
          key={`indicator-group-${index}`}
          ref={(el) => {
            // Store the ref directly in the array without using setState
            if (el) elementGroupsRef.current[index] = el;
          }}
          position={element.position}
        >
          <Indicators
            rotation={element.rotation}
            scale={element.scale}
            color={element.color}
            gap={0.125 * (1 + element.scale / maxSize)} // Scale gap with element size
          />
        </group>
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
    maxSize: 1.5,
    colorVariation: true,
    mouseTracking: true,
    trackingIntensity: 0.15,
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
        colorVariation={gridConfig.colorVariation}
        mouseTracking={gridConfig.mouseTracking}
        trackingIntensity={gridConfig.trackingIntensity}
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
