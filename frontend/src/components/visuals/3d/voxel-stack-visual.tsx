"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";

interface VoxelStackVisualProps {
    selectedLayer: number;
}

export function VoxelStackVisual({ selectedLayer }: VoxelStackVisualProps) {
    const groupRef = useRef<THREE.Group>(null);
    const numLayers = 12;

    // Create data for instances
    const instancesData = useMemo(() => {
        return Array.from({ length: numLayers }).map((_, i) => ({
            position: [0, 0, i * 2 - numLayers],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        }));
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
            groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Using Instances for performance optimization */}
            <Instances range={numLayers}>
                <boxGeometry args={[3, 4, 0.2]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.1}
                    roughness={0.2}
                    metalness={0.8}
                    side={THREE.DoubleSide}
                />

                {instancesData.map((data, i) => (
                    <Instance
                        key={i}
                        position={data.position as [number, number, number]}
                        color={i === selectedLayer ? "#ffffff" : "#444444"}
                    />
                ))}
            </Instances>

            {/* Highlight the selected layer with a separate mesh for glow effect */}
            <mesh position={[0, 0, selectedLayer * 2 - numLayers]}>
                <boxGeometry args={[3.05, 4.05, 0.25]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.3} wireframe />
            </mesh>
        </group>
    );
}
