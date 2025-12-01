'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface OutputNodesProps {
    probabilities?: { label: string; score: number }[];
    position?: [number, number, number];
}

export default function OutputNodes({ probabilities, position = [0, 0, 10] }: OutputNodesProps) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    // Default probabilities if none provided
    const probs = probabilities || Array.from({ length: 10 }, (_, i) => ({
        label: i.toString(),
        score: 0.1
    }));

    // Arrange nodes in a 2x5 grid
    const cols = 5;
    const rows = 2;
    const spacing = 0.8;

    return (
        <group ref={groupRef} position={position}>
            {probs.map((prob, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                const x = (col - (cols - 1) / 2) * spacing;
                const y = ((rows - 1) / 2 - row) * spacing;

                const brightness = prob.score;
                const color = new THREE.Color(0x22d3ee); // Cyan
                const emissiveIntensity = brightness * 3;

                return (
                    <group key={prob.label} position={[x, y, 0]}>
                        {/* Main node sphere */}
                        <mesh>
                            <sphereGeometry args={[0.3, 32, 32]} />
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={emissiveIntensity}
                                transparent
                                opacity={0.4 + brightness * 0.6}
                                roughness={0.2}
                                metalness={0.8}
                            />
                        </mesh>

                        {/* Outer glow effect */}
                        <mesh>
                            <sphereGeometry args={[0.35, 32, 32]} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={brightness * 0.2}
                            />
                        </mesh>

                        {/* Inner bright core for high probability nodes */}
                        {brightness > 0.5 && (
                            <mesh>
                                <sphereGeometry args={[0.15, 16, 16]} />
                                <meshBasicMaterial
                                    color="#ffffff"
                                    transparent
                                    opacity={brightness * 0.8}
                                />
                            </mesh>
                        )}

                        {/* Digit label */}
                        <Text
                            position={[0, 0, 0.31]}
                            fontSize={0.25}
                            color={brightness > 0.5 ? "#000000" : "#ffffff"}
                            anchorX="center"
                            anchorY="middle"
                        >
                            {prob.label}
                        </Text>
                    </group>
                );
            })}
        </group>
    );
}
