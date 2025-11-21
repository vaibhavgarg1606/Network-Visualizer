'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import RGBExplosion from './RGBExplosion';
import LayerTunnel from './LayerTunnel';

interface VoxelStackProps {
    mode: 'normal' | 'adversarial' | 'gradcam';
    noiseLevel: number;
    showTerrain: boolean;
    rgbExplosion: boolean;
    layerSpacing: number;
    onLayerClick: (id: number) => void;
}

export default function VoxelStack({ mode, noiseLevel, showTerrain, rgbExplosion, layerSpacing, onLayerClick }: VoxelStackProps) {
    return (
        <group rotation={[0, -Math.PI / 4, 0]}>
            {/* Input Stage */}
            <group position={[-5, 0, 0]}>
                <RGBExplosion explodeFactor={rgbExplosion ? 1 : 0} />
            </group>

            {/* Layers Stage */}
            <group position={[0, 0, 0]}>
                <LayerTunnel
                    spacing={layerSpacing}
                    mode={mode}
                    noiseLevel={noiseLevel}
                    showTerrain={showTerrain}
                    rgbExplosion={rgbExplosion}
                    onLayerClick={onLayerClick}
                />
            </group>
        </group>
    );
}
