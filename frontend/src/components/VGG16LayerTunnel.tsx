'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface VGG16LayerTunnelProps {
    layerSpacing: number;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
    onLayerClick: (id: number) => void;
}

function FeatureMap({ url, position, size }: { url: string, position: [number, number, number], size: [number, number] }) {
    const texture = useTexture(url);
    return (
        <mesh position={position}>
            <planeGeometry args={[size[0], size[1]]} />
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} opacity={0.9} />
        </mesh>
    );
}

function PlaceholderLayer({ size, color, opacity = 0.3 }: { size: [number, number], color: string, opacity?: number }) {
    return (
        <mesh>
            <boxGeometry args={[size[0], size[1], 0.05]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} wireframe={false} />
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], 0.05)]} />
                <lineBasicMaterial color="white" transparent opacity={0.2} />
            </lineSegments>
        </mesh>
    );
}

export default function VGG16LayerTunnel({ layerSpacing, liveFeatureMaps, onLayerClick }: VGG16LayerTunnelProps) {
    // VGG16 Configuration
    // 13 Conv layers + 3 FC layers
    // Sizes are approximated for visualization
    const layers = [
        // Block 1 (224x224)
        { id: 'conv_1', name: 'Conv1_1', size: 2.5, channels: 64, color: '#65a30d' },
        { id: 'conv_2', name: 'Conv1_2', size: 2.5, channels: 64, color: '#65a30d' },
        // Pool

        // Block 2 (112x112)
        { id: 'conv_3', name: 'Conv2_1', size: 2.0, channels: 128, color: '#65a30d' },
        { id: 'conv_4', name: 'Conv2_2', size: 2.0, channels: 128, color: '#65a30d' },
        // Pool

        // Block 3 (56x56)
        { id: 'conv_5', name: 'Conv3_1', size: 1.5, channels: 256, color: '#65a30d' },
        { id: 'conv_6', name: 'Conv3_2', size: 1.5, channels: 256, color: '#65a30d' },
        { id: 'conv_7', name: 'Conv3_3', size: 1.5, channels: 256, color: '#65a30d' },
        // Pool

        // Block 4 (28x28)
        { id: 'conv_8', name: 'Conv4_1', size: 1.0, channels: 512, color: '#65a30d' },
        { id: 'conv_9', name: 'Conv4_2', size: 1.0, channels: 512, color: '#65a30d' },
        { id: 'conv_10', name: 'Conv4_3', size: 1.0, channels: 512, color: '#65a30d' },
        // Pool

        // Block 5 (14x14)
        { id: 'conv_11', name: 'Conv5_1', size: 0.7, channels: 512, color: '#65a30d' },
        { id: 'conv_12', name: 'Conv5_2', size: 0.7, channels: 512, color: '#65a30d' },
        { id: 'conv_13', name: 'Conv5_3', size: 0.7, channels: 512, color: '#65a30d' },
        // Pool

        // FC Layers (1x1x4096) - Visualized as small dense blocks
        { id: 'fc_1', name: 'FC1', size: 0.4, channels: 4096, color: '#16a34a' },
        { id: 'fc_2', name: 'FC2', size: 0.4, channels: 4096, color: '#16a34a' },
        { id: 'fc_3', name: 'FC3', size: 0.2, channels: 1000, color: '#dc2626' }, // Output
    ];

    const mapGap = 0.05;

    return (
        <group>
            {layers.map((layer, index) => {
                const maps = liveFeatureMaps?.[layer.id]?.maps || [];
                // If we have live maps, show them. Otherwise show a placeholder block representing the layer volume.

                return (
                    <group
                        key={layer.id}
                        position={[0, 0, index * layerSpacing]}
                        onClick={(e) => {
                            e.stopPropagation();
                            onLayerClick(index);
                        }}
                    >
                        {/* Layer Label */}
                        {/* <Text position={[0, layer.size / 2 + 0.3, 0]} fontSize={0.2} color="white">
                            {layer.name}
                        </Text> */}

                        {maps.length > 0 ? (
                            <group>
                                {maps.map((url, mapIdx) => (
                                    <FeatureMap
                                        key={mapIdx}
                                        url={url}
                                        position={[0, 0, mapIdx * mapGap]}
                                        size={[layer.size, layer.size]}
                                    />
                                ))}
                            </group>
                        ) : (
                            // Placeholder block
                            // We stack a few "sheets" to represent depth/channels
                            <group>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <mesh key={i} position={[0, 0, i * 0.1]}>
                                        <boxGeometry args={[layer.size, layer.size, 0.02]} />
                                        <meshBasicMaterial color={layer.color} transparent opacity={0.3} />
                                        <lineSegments>
                                            <edgesGeometry args={[new THREE.BoxGeometry(layer.size, layer.size, 0.02)]} />
                                            <lineBasicMaterial color={layer.color} transparent opacity={0.5} />
                                        </lineSegments>
                                    </mesh>
                                ))}
                            </group>
                        )}
                    </group>
                );
            })}
        </group>
    );
}
