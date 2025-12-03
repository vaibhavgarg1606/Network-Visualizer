'use client';

import { useMemo } from 'react';
import RGBExplosion from './RGBExplosion';
import LayerTunnel from './LayerTunnel';
import MnistLayerTunnel from './MnistLayerTunnel';
import OutputNodes from './OutputNodes';
import VGG16LayerTunnel from './VGG16LayerTunnel';

interface VoxelStackProps {
    mode: 'normal' | 'gradcam';
    rgbExplosion: boolean;
    layerSpacing: number;
    onLayerClick: (id: number) => void;
    architecture: string;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
    probabilities?: { label: string; score: number }[];
    gradcamData?: any;
    gradcamLayerIndex?: number | null;
    viewMode?: 'tunnel' | 'gallery';
}

export default function VoxelStack({ mode, rgbExplosion, layerSpacing, onLayerClick, architecture, liveFeatureMaps, probabilities, gradcamData, gradcamLayerIndex, viewMode = 'gallery' }: VoxelStackProps) {
    // Calculate center offset to rotate around the middle of the model
    const centerOffset = useMemo(() => {
        // In Grad-CAM mode with selected layer, center on that layer
        if (mode === 'gradcam' && gradcamLayerIndex !== null && gradcamLayerIndex !== undefined) {
            return gradcamLayerIndex * layerSpacing;
        }

        if (architecture === 'mnist') {
            // 4 layers (0, 1, 2, 3) -> Length = 3 * spacing
            return (3 * layerSpacing) / 2;
        } else if (architecture === 'vgg16') {
            // 16 layers (0 to 15) -> Length = 15 * spacing
            return (15 * layerSpacing) / 2;
        } else {
            // Default/Generic CNN
            const numLayers = liveFeatureMaps ? Object.keys(liveFeatureMaps).length : 8;
            return ((numLayers - 1) * layerSpacing) / 2;
        }
    }, [architecture, layerSpacing, liveFeatureMaps, mode, gradcamLayerIndex]);

    return (
        <group rotation={[0, -Math.PI / 4, 0]}>
            <group position={[0, 0, -centerOffset]}>
                {/* Input Stage - Only for generic ImageNet CNNs */}
                {architecture !== 'mnist' && (
                    <group position={[-5, 0, 0]}>
                        <RGBExplosion explodeFactor={rgbExplosion ? 1 : 0} />
                    </group>
                )}

                {/* Layers Stage */}
                <group position={[0, 0, 0]}>
                    {architecture === 'mnist' ? (
                        <MnistLayerTunnel
                            layerSpacing={layerSpacing}
                            liveFeatureMaps={liveFeatureMaps}
                            onLayerClick={onLayerClick}
                        />
                    ) : architecture === 'vgg16' ? (
                        <VGG16LayerTunnel
                            layerSpacing={layerSpacing}
                            liveFeatureMaps={liveFeatureMaps}
                            onLayerClick={onLayerClick}
                            mode={mode}
                            gradcamData={gradcamData}
                            gradcamLayerIndex={gradcamLayerIndex}
                            viewMode={viewMode}
                        />
                    ) : (
                        <LayerTunnel
                            spacing={layerSpacing}
                            mode={mode}
                            rgbExplosion={rgbExplosion}
                            onLayerClick={onLayerClick}
                            architecture={architecture}
                            liveFeatureMaps={liveFeatureMaps}
                        />
                    )}
                </group>

                {/* Output Nodes - Only for MNIST */}
                {architecture === 'mnist' && probabilities && (
                    <OutputNodes
                        probabilities={probabilities}
                        position={[0, 0, 4 * layerSpacing + 2]}
                    />
                )}
            </group>
        </group>
    );
}
