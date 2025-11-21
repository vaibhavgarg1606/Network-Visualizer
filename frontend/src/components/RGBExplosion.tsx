'use client';

import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RGBExplosionProps {
    explodeFactor: number;
}

export default function RGBExplosion({ explodeFactor }: RGBExplosionProps) {
    const rUrl = '/api/images?path=rgb_R.png';
    const gUrl = '/api/images?path=rgb_G.png';
    const bUrl = '/api/images?path=rgb_B.png';

    const [rMap, gMap, bMap] = useTexture([rUrl, gUrl, bUrl]);

    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.rotation.y = Math.sin(Date.now() / 2000) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <TextLabel position={[0, 1.5, 0]} text="Input Image" />

            {/* Red Channel */}
            <mesh position={[0, 0, explodeFactor * 0.5]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial map={rMap} transparent opacity={0.8} color="red" blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Green Channel */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial map={gMap} transparent opacity={0.8} color="green" blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Blue Channel */}
            <mesh position={[0, 0, -explodeFactor * 0.5]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial map={bMap} transparent opacity={0.8} color="blue" blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

function TextLabel({ position, text }: { position: [number, number, number], text: string }) {
    // Simple text placeholder, ideally use @react-three/drei Text
    return (
        <mesh position={position}>
            {/* Placeholder for text, actual Text component needs font loading or default */}
        </mesh>
    )
}
