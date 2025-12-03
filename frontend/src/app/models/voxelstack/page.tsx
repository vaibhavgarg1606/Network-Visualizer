'use client';
import { useState } from 'react';
import { Activity, Box, Maximize2 } from 'lucide-react';
import ModelPageLayout from '@/components/layout/ModelPageLayout';
import ModelHeader from '@/components/common/ModelHeader';
import ModeSelector, { ViewMode } from '@/components/common/ModeSelector';
import VoxelStackControls from '@/components/voxelstack/VoxelStackControls';
import VoxelStackScene from '@/components/voxelstack/VoxelStackScene';
import VoxelStackOutput, { RightPanelTab } from '@/components/voxelstack/VoxelStackOutput';

export default function VoxelStackPage() {
    const [mode, setMode] = useState<ViewMode>('normal');
    const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
    const [architecture, setArchitecture] = useState('vgg16');
    const [rgbExplosion, setRgbExplosion] = useState(false);
    const [layerSpacing, setLayerSpacing] = useState(2);
    const [activeTab, setActiveTab] = useState<RightPanelTab>('prediction');
    const [viewMode, setViewMode] = useState<'tunnel' | 'gallery'>('gallery');
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [liveFeatureMaps, setLiveFeatureMaps] = useState<Record<string, { maps: string[], total: number }>>({});
    const [gradcamData, setGradcamData] = useState<any>(null);
    const [gradcamLayerIndex, setGradcamLayerIndex] = useState<number | null>(null);
    const [isLoadingGradcam, setIsLoadingGradcam] = useState(false);

    const getThemeClasses = () => {
        switch (mode) {
            case 'gradcam':
                return {
                    theme: 'theme-blue',
                    bleed: 'bg-bleed-cyan',
                    accent: 'text-cyan-400',
                    border: 'border-cyan-400/30',
                    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
                    bg: 'bg-[#050a14]'
                };
            default:
                return {
                    theme: 'theme-cyan',
                    bleed: 'bg-bleed-cyan',
                    accent: 'text-white',
                    border: 'border-white/10',
                    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
                    bg: 'bg-[#050608]'
                };
        }
    };

    const styles = getThemeClasses();

    const handlePredict = async () => {
        if (!currentImage) return;
        setIsPredicting(true);
        try {
            const response = await fetch(`http://localhost:8000/api/models/${architecture}/predict/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: currentImage })
            });
            const data = await response.json();
            if (data.feature_maps) setLiveFeatureMaps(data.feature_maps);
            if (data.probabilities) setPrediction(data);
        } catch (error) {
            console.error('Prediction failed:', error);
        } finally {
            setIsPredicting(false);
        }
    };

    const handleGradcamLayerSelect = async (layerIndex: number) => {
        if (!currentImage || mode !== 'gradcam') return;

        setIsLoadingGradcam(true);
        setGradcamLayerIndex(layerIndex);

        try {
            const response = await fetch(`http://localhost:8000/api/models/${architecture}/gradcam/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: currentImage,
                    layer_index: layerIndex,
                    class_idx: prediction?.probabilities?.[0] ? null : null // Use top class
                })
            });
            const data = await response.json();
            console.log('Grad-CAM Response:', {
                hasHeatmap: !!data.heatmap,
                hasHeatmapData: !!data.heatmap_data,
                heatmapDataShape: data.heatmap_data ? `${data.heatmap_data.length}x${data.heatmap_data[0]?.length}` : 'none',
                layerName: data.layer_name,
                classLabel: data.class_label
            });
            setGradcamData(data);
        } catch (error) {
            console.error('Grad-CAM failed:', error);
            setGradcamData(null);
        } finally {
            setIsLoadingGradcam(false);
        }
    };

    // Reset Grad-CAM when mode changes
    const handleModeChange = (newMode: ViewMode) => {
        setMode(newMode);
        if (newMode !== 'gradcam') {
            setGradcamData(null);
            setGradcamLayerIndex(null);
        }
    };

    const infoCards = [
        {
            icon: Activity,
            title: "Overview",
            description: "Visualizes the internal activation maps of a CNN-based image classifier in a 3D tunnel, revealing feature hierarchies."
        },
        {
            icon: Box,
            title: "Visualization Mode",
            description: "Interactive 3D tunnel where each slice represents a network layer. Hover to inspect kernels, click to view full feature maps."
        },
        {
            icon: Maximize2,
            title: "Interactions",
            description: "Use the bottom controls to switch modes. Drag to rotate, scroll to zoom. Click layers to inspect specific activation grids."
        }
    ];

    return (
        <ModelPageLayout
            theme={styles}
            header={
                <ModelHeader
                    title="VoxelStack"
                    description="Hierarchical feature visualization. Explore how the model builds understanding from edges to objects through a deep layer tunnel."
                    infoCards={infoCards}
                    styles={styles}
                />
            }
            leftPanel={
                <VoxelStackControls
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                    isPredicting={isPredicting}
                    handlePredict={handlePredict}
                    architecture={architecture}
                    setArchitecture={setArchitecture}
                    rgbExplosion={rgbExplosion}
                    setRgbExplosion={setRgbExplosion}
                    layerSpacing={layerSpacing}
                    setLayerSpacing={setLayerSpacing}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            }
            centerPanel={
                <VoxelStackScene
                    mode={mode}
                    viewMode={viewMode}
                    rgbExplosion={rgbExplosion}
                    layerSpacing={layerSpacing}
                    setSelectedLayer={setSelectedLayer}
                    setActiveTab={setActiveTab}
                    architecture={architecture}
                    liveFeatureMaps={liveFeatureMaps}
                    gradcamData={gradcamData}
                    gradcamLayerIndex={gradcamLayerIndex}
                    onGradcamLayerSelect={handleGradcamLayerSelect}
                    isLoadingGradcam={isLoadingGradcam}
                />
            }
            rightPanel={
                <VoxelStackOutput
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    prediction={prediction}
                    selectedLayer={selectedLayer}
                    liveFeatureMaps={liveFeatureMaps}
                    styles={styles}
                />
            }
            bottomControls={
                <ModeSelector mode={mode} setMode={handleModeChange} />
            }
        />
    );
}
