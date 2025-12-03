'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface VGG16LayerTunnelProps {
    layerSpacing: number;
    liveFeatureMaps?: Record<string, { maps: string[], total: number }>;
    onLayerClick: (id: number) => void;
    mode?: 'normal' | 'gradcam';
    gradcamData?: any;
    gradcamLayerIndex?: number | null;
    viewMode?: 'tunnel' | 'gallery';
}

function FeatureMap({ url, position, size, heatmapUrl, heatmapData, displacementScale = 0 }: { 
    url: string, 
    position: [number, number, number], 
    size: [number, number], 
    heatmapUrl?: string,
    heatmapData?: number[][],
    displacementScale?: number
}) {
    // Always call hooks unconditionally - use a fallback URL if heatmapUrl is not provided
    const texture = useTexture(url);
    const heatmapTexture = useTexture(heatmapUrl || url); // Use url as fallback to always call the hook
    
    // Create displaced geometry if heatmap data is available
    const geometry = useMemo(() => {
        if (heatmapData && displacementScale > 0) {
            // Validate heatmap data structure
            if (!Array.isArray(heatmapData) || heatmapData.length === 0) {
                console.warn('Invalid heatmapData format:', heatmapData);
                return new THREE.PlaneGeometry(size[0], size[1]);
            }
            
            const heatmapHeight = heatmapData.length;
            const firstRow = heatmapData[0];
            const heatmapWidth = Array.isArray(firstRow) ? firstRow.length : 0;
            
            if (heatmapWidth === 0 || heatmapHeight === 0) {
                console.warn('Empty heatmap data:', { heatmapWidth, heatmapHeight });
                return new THREE.PlaneGeometry(size[0], size[1]);
            }
            
            // Calculate min/max safely
            let minVal = Infinity;
            let maxVal = -Infinity;
            for (let y = 0; y < heatmapHeight; y++) {
                const row = heatmapData[y];
                if (Array.isArray(row)) {
                    for (let x = 0; x < heatmapWidth; x++) {
                        const val = row[x];
                        if (typeof val === 'number') {
                            minVal = Math.min(minVal, val);
                            maxVal = Math.max(maxVal, val);
                        }
                    }
                }
            }
            
            console.log('Creating displaced geometry:', { 
                heatmapWidth, 
                heatmapHeight, 
                displacementScale,
                sampleValue: heatmapData[Math.floor(heatmapHeight/2)]?.[Math.floor(heatmapWidth/2)],
                minValue: minVal,
                maxValue: maxVal,
                dataType: typeof heatmapData[0]?.[0]
            });
            
            const segments = 64; // Balanced resolution for smoother but less sharp displacement
            const planeGeometry = new THREE.PlaneGeometry(size[0], size[1], segments, segments);
            const positions = planeGeometry.attributes.position;
            const vertices = positions.array;
            
            let maxDisplacement = 0;
            let minDisplacement = Infinity;
            let displacedCount = 0;
            
            // Displace vertices based on heatmap values
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const y = vertices[i + 1];
                
                // Map vertex position to heatmap coordinates (0-1 range)
                // PlaneGeometry vertices range from -size/2 to +size/2
                const u = Math.max(0, Math.min(1, (x / size[0] + 0.5))); // Normalize to 0-1
                const v = Math.max(0, Math.min(1, (y / size[1] + 0.5))); // Normalize to 0-1
                
                const heatmapX = Math.floor(u * (heatmapWidth - 1));
                const heatmapY = Math.floor((1 - v) * (heatmapHeight - 1)); // Flip Y for correct mapping
                
                if (heatmapX >= 0 && heatmapX < heatmapWidth && heatmapY >= 0 && heatmapY < heatmapHeight) {
                    const row = heatmapData[heatmapY];
                    if (row && Array.isArray(row)) {
                        const intensity = typeof row[heatmapX] === 'number' ? row[heatmapX] : 0;
                        // Displace Z based on intensity (multiply by scale for visibility)
                        const displacement = intensity * displacementScale;
                        vertices[i + 2] = displacement;
                        maxDisplacement = Math.max(maxDisplacement, displacement);
                        minDisplacement = Math.min(minDisplacement, displacement);
                        if (displacement > 0) displacedCount++;
                    }
                }
            }
            
            console.log('Displacement stats:', { 
                min: minDisplacement, 
                max: maxDisplacement,
                displacedVertices: displacedCount,
                totalVertices: vertices.length / 3
            });
            
            positions.needsUpdate = true;
            planeGeometry.computeVertexNormals(); // Recalculate normals for lighting
            
            return planeGeometry;
        } else {
            return new THREE.PlaneGeometry(size[0], size[1]);
        }
    }, [size, heatmapData, displacementScale]);
    
    // Force remount when heatmap data changes to ensure geometry updates
    const geometryKey = heatmapData ? JSON.stringify(heatmapData).slice(0, 100) : 'no-heatmap';
    
    // Determine which texture to use (only use heatmapTexture if heatmapUrl was actually provided)
    const finalTexture = heatmapUrl ? heatmapTexture : texture;
    
    return (
        <mesh position={position} geometry={geometry} key={geometryKey}>
            <meshStandardMaterial 
                map={finalTexture} 
                transparent 
                side={THREE.DoubleSide} 
                opacity={heatmapUrl ? 0.9 : 0.9} // Higher opacity to show image better
                metalness={0.1}
                roughness={0.6}
                flatShading={false}
            />
        </mesh>
    );
}

function PlaceholderLayer({ size, color, opacity = 0.3, heatmapUrl, heatmapData, displacementScale = 0 }: { 
    size: [number, number], 
    color: string, 
    opacity?: number, 
    heatmapUrl?: string,
    heatmapData?: number[][],
    displacementScale?: number
}) {
    // Always call hooks unconditionally - use a dummy data URL if heatmapUrl is not provided
    // Create a 1x1 transparent PNG data URL as fallback
    const fallbackUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const heatmapTexture = useTexture(heatmapUrl || fallbackUrl);
    
    // Create displaced geometry if heatmap data is available
    const geometry = useMemo(() => {
        if (heatmapData && displacementScale > 0 && Array.isArray(heatmapData) && heatmapData.length > 0) {
            // Validate heatmap data structure
            if (!Array.isArray(heatmapData) || heatmapData.length === 0) {
                return new THREE.PlaneGeometry(size[0], size[1]);
            }
            
            const heatmapHeight = heatmapData.length;
            const firstRow = heatmapData[0];
            const heatmapWidth = Array.isArray(firstRow) ? firstRow.length : 0;
            
            if (heatmapWidth === 0 || heatmapHeight === 0) {
                return new THREE.PlaneGeometry(size[0], size[1]);
            }
            
            const segments = 128;
            const planeGeometry = new THREE.PlaneGeometry(size[0], size[1], segments, segments);
            const positions = planeGeometry.attributes.position;
            const vertices = positions.array;
            
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const y = vertices[i + 1];
                
                const u = Math.max(0, Math.min(1, (x / size[0] + 0.5)));
                const v = Math.max(0, Math.min(1, (y / size[1] + 0.5)));
                
                const heatmapX = Math.floor(u * (heatmapWidth - 1));
                const heatmapY = Math.floor((1 - v) * (heatmapHeight - 1));
                
                if (heatmapX >= 0 && heatmapX < heatmapWidth && heatmapY >= 0 && heatmapY < heatmapHeight) {
                    const row = heatmapData[heatmapY];
                    if (row && Array.isArray(row)) {
                        const intensity = row[heatmapX] || 0;
                        vertices[i + 2] = intensity * displacementScale;
                    }
                }
            }
            
            positions.needsUpdate = true;
            planeGeometry.computeVertexNormals();
            
            return planeGeometry;
        } else {
            return new THREE.PlaneGeometry(size[0], size[1]);
        }
    }, [size, heatmapData, displacementScale]);

    // Determine if we should use the heatmap texture (only if heatmapUrl was actually provided)
    const useHeatmap = !!heatmapUrl;
    
    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial
                map={useHeatmap ? heatmapTexture : undefined}
                color={useHeatmap ? undefined : color}
                transparent
                opacity={useHeatmap ? 0.7 : opacity}
                metalness={0.2}
                roughness={0.4}
            />
            {!heatmapData && (
                <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(size[0], size[1])]} />
                    <lineBasicMaterial color="white" transparent opacity={0.2} />
                </lineSegments>
            )}
        </mesh>
    );
}

export default function VGG16LayerTunnel({ layerSpacing, liveFeatureMaps, onLayerClick, mode = 'normal', gradcamData, gradcamLayerIndex, viewMode = 'gallery' }: VGG16LayerTunnelProps) {
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

    // In Grad-CAM mode, only show selected layer (conv layers only, index 0-12)
    const filteredLayers = mode === 'gradcam' && gradcamLayerIndex !== null && gradcamLayerIndex !== undefined
        ? layers.filter((_, idx) => idx === gradcamLayerIndex && idx < 13) // Only conv layers
        : layers;

    // Scale factor for Grad-CAM selected layer
    const gradcamScale = mode === 'gradcam' && gradcamLayerIndex !== null ? 2.5 : 1.0;

    return (
        <group>
            {filteredLayers.map((layer, index) => {
                const originalIndex = layers.indexOf(layer);
                const maps = liveFeatureMaps?.[layer.id]?.maps || [];
                const isGradcamSelected = mode === 'gradcam' && originalIndex === gradcamLayerIndex;
                const layerSize = isGradcamSelected ? layer.size * gradcamScale : layer.size;

                // Use heatmap if available for Grad-CAM
                const heatmapUrl = isGradcamSelected && gradcamData?.heatmap ? gradcamData.heatmap : undefined;
                const heatmapData = isGradcamSelected && gradcamData?.heatmap_data ? gradcamData.heatmap_data : undefined;
                const displacementScale = isGradcamSelected ? 1.5 : 0; // Balanced scale to show both displacement and image
                
                // Debug: Log heatmap data availability
                if (isGradcamSelected) {
                    console.log('Grad-CAM Layer Selected:', {
                        layerIndex: originalIndex,
                        hasHeatmapUrl: !!heatmapUrl,
                        hasHeatmapData: !!heatmapData,
                        heatmapDataShape: heatmapData ? `${heatmapData.length}x${heatmapData[0]?.length}` : 'none',
                        displacementScale
                    });
                }

                // Limit maps to 5 in gallery mode
                const visibleMaps = viewMode === 'gallery' ? maps.slice(0, 5) : maps;
                const mapCount = visibleMaps.length;

                return (
                    <group
                        key={layer.id}
                        position={[0, 0, (mode === 'gradcam' && gradcamLayerIndex !== null) ? 0 : originalIndex * layerSpacing]}
                        scale={isGradcamSelected ? gradcamScale : 1}
                        onClick={(e) => {
                            e.stopPropagation();
                            onLayerClick(originalIndex);
                        }}
                    >
                        {visibleMaps.length > 0 ? (
                            <group>
                                {visibleMaps.map((url, mapIdx) => {
                                    // Calculate position based on viewMode
                                    let position: [number, number, number] = [0, 0, mapIdx * mapGap];

                                    if (viewMode === 'gallery') {
                                        // Side-by-side arrangement centered
                                        const totalWidth = (mapCount - 1) * (layerSize + mapGap);
                                        const startX = -totalWidth / 2;
                                        position = [startX + mapIdx * (layerSize + mapGap), 0, 0];
                                    }

                                    return (
                                        <FeatureMap
                                            key={mapIdx}
                                            url={url}
                                            position={position}
                                            size={[layerSize, layerSize]}
                                            heatmapUrl={isGradcamSelected ? heatmapUrl : undefined}
                                            heatmapData={isGradcamSelected ? heatmapData : undefined}
                                            displacementScale={displacementScale}
                                        />
                                    );
                                })}
                            </group>
                        ) : (
                            // Placeholder block
                            <group>
                                {Array.from({ length: isGradcamSelected ? 1 : (viewMode === 'gallery' ? 1 : 3) }).map((_, i) => (
                                    <PlaceholderLayer
                                        key={i}
                                        size={[layerSize, layerSize]}
                                        color={isGradcamSelected ? '#22d3ee' : layer.color}
                                        opacity={isGradcamSelected ? 0.6 : 0.3}
                                        heatmapUrl={isGradcamSelected ? heatmapUrl : undefined}
                                        heatmapData={isGradcamSelected ? heatmapData : undefined}
                                        displacementScale={displacementScale}
                                    />
                                ))}
                            </group>
                        )}
                    </group>
                );
            })}
        </group>
    );
}
