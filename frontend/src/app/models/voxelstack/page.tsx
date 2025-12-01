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
    const [noiseLevel, setNoiseLevel] = useState(0);
    const [showTerrain, setShowTerrain] = useState(false);
    const [architecture, setArchitecture] = useState('vgg16');
    const [rgbExplosion, setRgbExplosion] = useState(false);
    const [layerSpacing, setLayerSpacing] = useState(2);
    const [activeTab, setActiveTab] = useState<RightPanelTab>('prediction');
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [liveFeatureMaps, setLiveFeatureMaps] = useState<Record<string, { maps: string[], total: number }>>({});

    const getThemeClasses = () => {
        switch (mode) {
            case 'adversarial':
                return {
                    theme: 'theme-red',
                    bleed: 'bg-bleed-red',
                    accent: 'text-red-500',
                    border: 'border-red-500/10',
                    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
                    bg: 'bg-[#0a0505]'
                };
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

    const infoCards = [
        {
            icon: Activity,
            title: "Overview",
            description: "Visualizes the internal activation maps of CNN architectures (VGG16/ResNet50) in a 3D tunnel, revealing feature hierarchies."
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
                />
            }
            centerPanel={
                <VoxelStackScene
                    mode={mode}
                    noiseLevel={noiseLevel}
                    setNoiseLevel={setNoiseLevel}
                    showTerrain={showTerrain}
                    setShowTerrain={setShowTerrain}
                    rgbExplosion={rgbExplosion}
                    layerSpacing={layerSpacing}
                    setSelectedLayer={setSelectedLayer}
                    setActiveTab={setActiveTab}
                    architecture={architecture}
                    liveFeatureMaps={liveFeatureMaps}
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
                <ModeSelector mode={mode} setMode={setMode} />
            }
        />
    );
}
