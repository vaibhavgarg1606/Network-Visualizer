'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface MnistLayerTunnelProps {
    layerSpacing: number;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
    onLayerClick: (id: number) => void;
}

function FeatureMap({ url, position, size }: { url: string, position: [number, number, number], size: [number, number] }) {
    const texture = useTexture(url);
    return (
        <mesh position={position}>
            <planeGeometry args={[size[0], size[1]]} />
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
    );
}

export default function MnistLayerTunnel({ layerSpacing, liveFeatureMaps, onLayerClick }: MnistLayerTunnelProps) {
    // Layer configuration: conv1(16), pool1, conv2(32), pool2
    const layerConfig = [
        { id: 0, name: 'conv1', channels: 16, size: 2.0 },  // 28x28
        { id: 1, name: 'pool1', channels: 16, size: 1.5 },  // 14x14
        { id: 2, name: 'conv2', channels: 32, size: 1.5 },  // 14x14
        { id: 3, name: 'pool2', channels: 32, size: 1.0 },  // 7x7
    ];

    const mapGap = 0.08; // Tiny gap between individual feature maps in a stack

    return (
        <group>
            {layerConfig.map((layer) => {
                const maps = liveFeatureMaps?.[layer.id.toString()]?.maps || [];
                const numMaps = maps.length > 0 ? maps.length : layer.channels;

                return (
                    <group
                        key={layer.id}
                        position={[0, 0, layer.id * layerSpacing]}
                        onClick={(e) => {
                            e.stopPropagation();
                            onLayerClick(layer.id);
                        }}
                    >
                        {maps.length > 0 ? (
                            // Render actual feature maps stacked in depth
                            maps.map((url, index) => (
                                <FeatureMap
                                    key={index}
                                    url={url}
                                    position={[0, 0, index * mapGap]}
                                    size={[layer.size, layer.size]}
                                />
                            ))
                        ) : (
                            // Placeholder stack if no live data
                            Array.from({ length: numMaps }).map((_, index) => (
                                <mesh key={index} position={[0, 0, index * mapGap]}>
                                    <planeGeometry args={[layer.size, layer.size]} />
                                    <meshBasicMaterial color="cyan" wireframe transparent opacity={0.1} />
                                </mesh>
                            ))
                        )}
                    </group>
                );
            })}
        </group>
    );
}
