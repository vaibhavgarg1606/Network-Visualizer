"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface LatentMorphVisualProps {
    morphProgress: number;
}

export function LatentMorphVisual({ morphProgress }: LatentMorphVisualProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 2000;

    // Generate random points in a sphere
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            const r = 4 + Math.random() * 2; // Radius between 4 and 6

            pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(theta);
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            // Rotate the galaxy
            pointsRef.current.rotation.y += 0.002;
            pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

            // Pulse effect based on morph progress
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 * morphProgress;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}
