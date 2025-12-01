'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import WASDControls from './WASDControls';
import VoxelStack from './VoxelStack';

interface SceneProps {
    mode: 'normal' | 'adversarial' | 'gradcam';
    noiseLevel: number;
    showTerrain: boolean;
    rgbExplosion: boolean;
    layerSpacing: number;
    onLayerClick: (id: number) => void;
    architecture: string;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
    probabilities?: { label: string; score: number }[];
}

function GridHelper({ mode }: { mode: 'normal' | 'adversarial' | 'gradcam' }) {
    let color = '#22d3ee'; // cyan default
    if (mode === 'adversarial') color = '#ef4444'; // visible red
    if (mode === 'gradcam') color = '#22d3ee'; // cyan

    return (
        <gridHelper args={[100, 40, color, color]} position={[0, -2, 0]}>
            <lineBasicMaterial attach="material" color={color} transparent opacity={0.1} />
        </gridHelper>
    );
}

export default function Scene({ mode, noiseLevel, showTerrain, rgbExplosion, layerSpacing, onLayerClick, architecture, liveFeatureMaps, probabilities }: SceneProps) {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[8, 5, 12]} fov={60} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <WASDControls />
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <VoxelStack
                    mode={mode}
                    noiseLevel={noiseLevel}
                    showTerrain={showTerrain}
                    rgbExplosion={rgbExplosion}
                    layerSpacing={layerSpacing}
                    onLayerClick={onLayerClick}
                    architecture={architecture}
                    liveFeatureMaps={liveFeatureMaps}
                    probabilities={probabilities}
                />
                <GridHelper mode={mode} />
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    );
}
