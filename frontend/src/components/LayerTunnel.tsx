'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

interface LayerTunnelProps {
    spacing: number;
    mode: string;
    rgbExplosion: boolean;
    onLayerClick: (id: number) => void;
    architecture: string;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
}

export default function LayerTunnel({ spacing, liveFeatureMaps, onLayerClick }: LayerTunnelProps) {
    const ref = useRef<THREE.Group>(null);

    // Define layer configuration based on what backend returns
    const layers = useMemo(() => {
        if (!liveFeatureMaps) return [];

        return Object.keys(liveFeatureMaps).map((layerId, index) => ({
            id: layerId,
            maps: liveFeatureMaps[layerId]?.maps || [],
            position: index * spacing
        }));
    }, [liveFeatureMaps, spacing]);

    if (!liveFeatureMaps || layers.length === 0) {
        // Show placeholder when no feature maps
        return (
            <group ref={ref}>
                {[0, 1, 2, 3].map((i) => (
                    <mesh key={i} position={[0, 0, i * spacing]}>
                        <boxGeometry args={[2, 2, 0.1]} />
                        <meshBasicMaterial color="cyan" transparent opacity={0.3} />
                    </mesh>
                ))}
            </group>
        );
    }

    return (
        <group ref={ref}>
            {layers.map((layer, layerIdx) => (
                <group key={layer.id} position={[0, 0, layer.position]}>
                    {layer.maps.map((mapUrl, idx) => (
                        <FeatureMapPlane
                            key={idx}
                            imageUrl={mapUrl}
                            position={[0, 0, idx * 0.08]}
                            onClick={() => onLayerClick(layerIdx)}
                        />
                    ))}
                </group>
            ))}
        </group>
    );
}

function FeatureMapPlane({ imageUrl, position, onClick }: { imageUrl: string; position: [number, number, number]; onClick: () => void }) {
    const texture = useMemo(() => {
        const loader = new THREE.TextureLoader();
        return loader.load(imageUrl);
    }, [imageUrl]);

    return (
        <mesh position={position} onClick={onClick}>
            <planeGeometry args={[1.5, 1.5]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
