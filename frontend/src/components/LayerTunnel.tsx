'use client';

import { useTexture } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GhostKernel from './GhostKernel';

interface LayerTunnelProps {
    spacing: number;
    mode: 'normal' | 'adversarial' | 'gradcam';
    noiseLevel: number;
    showTerrain: boolean;
    rgbExplosion: boolean;
    onLayerClick: (id: number) => void;
}

// Mock data for layers based on VGG16 structure
const LAYERS = [
    { id: 0, name: 'Conv1_1', channels: 64, type: 'conv' },
    { id: 2, name: 'Conv1_2', channels: 64, type: 'conv' },
    { id: 4, name: 'Pool1', channels: 64, type: 'pool' },
    { id: 5, name: 'Conv2_1', channels: 128, type: 'conv' },
    { id: 7, name: 'Conv2_2', channels: 128, type: 'conv' },
    { id: 9, name: 'Pool2', channels: 128, type: 'pool' },
    { id: 10, name: 'Conv3_1', channels: 256, type: 'conv' },
];

export default function LayerTunnel({ spacing, mode, noiseLevel, showTerrain, rgbExplosion, onLayerClick }: LayerTunnelProps) {
    return (
        <group>
            {LAYERS.map((layer, index) => (
                <group key={index} position={[index * spacing * (layer.type === 'pool' ? 0.5 : 1), 0, 0]}>
                    <LayerSheet
                        layer={layer}
                        mode={mode}
                        showTerrain={showTerrain}
                        rgbExplosion={rgbExplosion}
                        onClick={() => onLayerClick(layer.id)}
                    />
                    {index < LAYERS.length - 1 && (
                        <DataPackets
                            start={[0, 0, 0]}
                            end={[spacing * (LAYERS[index + 1].type === 'pool' ? 0.5 : 1), 0, 0]}
                            mode={mode}
                        />
                    )}
                </group>
            ))}
        </group>
    );
}

interface LayerSheetProps {
    layer: any;
    mode: 'normal' | 'adversarial' | 'gradcam';
    showTerrain: boolean;
    rgbExplosion: boolean;
    onClick: () => void;
}

function LayerSheet({ layer, mode, showTerrain, rgbExplosion, onClick }: LayerSheetProps) {
    // Load first channel as representative
    const url = `/api/images?path=featuremaps/layer_${layer.id}_channel_0.png`;
    const texture = useTexture(url);
    const [hovered, setHover] = useState(false);

    // Visual properties based on layer type and mode
    const size = layer.type === 'pool' ? 1.5 : 2;
    const baseColor = layer.type === 'pool' ? '#ff0055' : '#00ffff';

    let color = baseColor;
    if (mode === 'gradcam') color = '#00ffff';

    const opacity = layer.type === 'pool' ? 0.6 : 0.8;
    const displacementScale = (showTerrain && mode === 'gradcam') ? 0.5 : 0;

    // RGB Explosion Offsets
    const rOffset = rgbExplosion ? 0.2 : 0;
    const bOffset = rgbExplosion ? -0.2 : 0;

    return (
        <group
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            {/* Main Sheet / Green Channel */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.05, size, size, 1, 32, 32]} />
                <meshPhysicalMaterial
                    map={texture}
                    displacementMap={texture}
                    displacementScale={displacementScale}
                    color={rgbExplosion ? '#00ff00' : (hovered ? 'white' : '#ffffff')}
                    emissive={rgbExplosion ? '#00ff00' : color}
                    emissiveIntensity={mode === 'adversarial' ? 0.5 : (hovered ? 0.5 : 0.1)}
                    transparent
                    opacity={opacity}
                    roughness={0.4}
                    metalness={0.1}
                    transmission={0.6}
                    thickness={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Red Channel (Explosion) */}
            {rgbExplosion && (
                <mesh position={[rOffset, 0, 0]}>
                    <boxGeometry args={[0.05, size, size]} />
                    <meshPhysicalMaterial
                        map={texture}
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.5}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Blue Channel (Explosion) */}
            {rgbExplosion && (
                <mesh position={[bOffset, 0, 0]}>
                    <boxGeometry args={[0.05, size, size]} />
                    <meshPhysicalMaterial
                        map={texture}
                        color="#0000ff"
                        emissive="#0000ff"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.5}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Edge Glow (Only show if not exploding for cleaner look) */}
            {!rgbExplosion && (
                <mesh>
                    <boxGeometry args={[0.06, size + 0.02, size + 0.02]} />
                    <meshBasicMaterial color={color} wireframe transparent opacity={mode === 'adversarial' ? 0.6 : 0.3} />
                </mesh>
            )}

            {/* Ghost Kernel Animation */}
            {hovered && layer.type === 'conv' && !rgbExplosion && (
                <GhostKernel layerId={layer.id} mode={mode} />
            )}
        </group>
    );
}

function DataPackets({ start, end, mode }: { start: [number, number, number], end: [number, number, number], mode: 'normal' | 'adversarial' | 'gradcam' }) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.children.forEach((child, i) => {
                // Jittery motion in adversarial mode
                const jitter = mode === 'adversarial' ? (Math.random() - 0.5) * 0.1 : 0;
                const t = (state.clock.elapsedTime + i * 0.5) % 1;

                const startVec = new THREE.Vector3(...start);
                const endVec = new THREE.Vector3(...end);

                child.position.lerpVectors(startVec, endVec, t);
                child.position.y += jitter;

                const mesh = child as THREE.Mesh;
                if (mesh.material instanceof THREE.Material) {
                    mesh.material.opacity = 1 - Math.abs(t - 0.5) * 2;
                }
            });
        }
    });

    return (
        <group ref={ref}>
            {[0, 1, 2].map((i) => (
                <mesh key={i} position={new THREE.Vector3(...start)}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color={mode === 'adversarial' ? "red" : "cyan"} transparent />
                </mesh>
            ))}
        </group>
    )
}
