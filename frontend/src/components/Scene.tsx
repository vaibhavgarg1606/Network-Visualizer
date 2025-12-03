'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import WASDControls from './WASDControls';
import VoxelStack from './VoxelStack';

interface SceneProps {
    mode: 'normal' | 'gradcam';
    rgbExplosion: boolean;
    layerSpacing: number;
    onLayerClick: (id: number) => void;
    architecture: string;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
    probabilities?: { label: string; score: number }[];
    gradcamData?: any;
    gradcamLayerIndex?: number | null;
}

function GridHelper({ mode }: { mode: 'normal' | 'gradcam' }) {
    let color = '#22d3ee'; // cyan default
    if (mode === 'gradcam') color = '#22d3ee'; // cyan

    return (
        <gridHelper args={[100, 40, color, color]} position={[0, -2, 0]}>
            <lineBasicMaterial attach="material" color={color} transparent opacity={0.1} />
        </gridHelper>
    );
}

export default function Scene({ mode, rgbExplosion, layerSpacing, onLayerClick, architecture, liveFeatureMaps, probabilities, gradcamData, gradcamLayerIndex }: SceneProps) {
    return (
        <Canvas>
            <PerspectiveCamera 
                makeDefault 
                position={mode === 'gradcam' ? [6, 4, 8] : [8, 5, 12]} 
                fov={mode === 'gradcam' ? 50 : 60} 
            />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <WASDControls />
            <Suspense fallback={null}>
                <ambientLight intensity={mode === 'gradcam' ? 0.6 : 0.5} />
                <pointLight position={[10, 10, 10]} intensity={mode === 'gradcam' ? 1.0 : 1} />
                {mode === 'gradcam' && (
                    <>
                        <pointLight position={[-10, 10, 10]} intensity={0.6} color="#22d3ee" />
                        <directionalLight position={[5, 10, 5]} intensity={0.5} />
                    </>
                )}
                <VoxelStack
                    mode={mode}
                    rgbExplosion={rgbExplosion}
                    layerSpacing={layerSpacing}
                    onLayerClick={onLayerClick}
                    architecture={architecture}
                    liveFeatureMaps={liveFeatureMaps}
                    probabilities={probabilities}
                    gradcamData={gradcamData}
                    gradcamLayerIndex={gradcamLayerIndex}
                />
                <GridHelper mode={mode} />
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    );
}
