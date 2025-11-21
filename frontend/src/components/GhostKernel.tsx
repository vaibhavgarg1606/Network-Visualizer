'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GhostKernelProps {
    layerId: number;
    mode: 'normal' | 'adversarial' | 'gradcam';
}

export default function GhostKernel({ layerId, mode }: GhostKernelProps) {
    const kernelRef = useRef<THREE.Group>(null);
    const color = mode === 'adversarial' ? '#ff0000' : '#ffff00';

    useFrame((state) => {
        if (kernelRef.current) {
            // Scanning animation
            const t = state.clock.elapsedTime;

            // Scan across the 2x2 face (from -1 to 1)
            const scanX = Math.sin(t * 2) * 0.8;
            const scanY = Math.cos(t * 1.5) * 0.8;

            // Position slightly in front of the layer (x=0.1)
            kernelRef.current.position.set(0.15, scanY, scanX);
        }
    });

    return (
        <group ref={kernelRef}>
            {/* The Kernel Box */}
            <mesh>
                <boxGeometry args={[0.1, 0.3, 0.3]} />
                <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.8} />
            </mesh>

            {/* Inner Glow */}
            <mesh>
                <boxGeometry args={[0.05, 0.25, 0.25]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>

            {/* Connection Line to next layer (simulated) */}
            <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                <meshBasicMaterial color={mode === 'adversarial' ? "red" : "cyan"} transparent opacity={0.5} />
            </mesh>
        </group>
    );
}
