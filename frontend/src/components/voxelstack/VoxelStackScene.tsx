import { Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';
import Scene from '@/components/Scene';
import { ViewMode } from '@/components/common/ModeSelector';

interface VoxelStackSceneProps {
    mode: ViewMode;
    rgbExplosion: boolean;
    layerSpacing: number;
    setSelectedLayer: (id: number) => void;
    setActiveTab: (tab: 'prediction' | 'features') => void;
    architecture: string;
    liveFeatureMaps: Record<string, { maps: string[], total: number }>;
    gradcamData?: any;
    gradcamLayerIndex?: number | null;
    onGradcamLayerSelect?: (layerIndex: number) => void;
    isLoadingGradcam?: boolean;
    viewMode: 'tunnel' | 'gallery';
}

export default function VoxelStackScene({
    mode,
    viewMode,
    rgbExplosion,
    layerSpacing,
    setSelectedLayer,
    setActiveTab,
    architecture,
    liveFeatureMaps,
    gradcamData,
    gradcamLayerIndex,
    onGradcamLayerSelect,
    isLoadingGradcam
}: VoxelStackSceneProps) {
    // Get available conv layers for Grad-CAM
    const getAvailableLayers = () => {
        if (architecture === 'vgg16') {
            return Array.from({ length: 13 }, (_, i) => ({
                index: i,
                name: `Conv${Math.floor(i / 2) + 1}_${(i % 2) + 1}`,
                displayName: `Conv ${i + 1}`
            }));
        }
        return [];
    };
    return (
        <>
            <div className="absolute inset-0">
                <Scene
                    mode={mode}
                    viewMode={viewMode}
                    rgbExplosion={rgbExplosion}
                    layerSpacing={layerSpacing}
                    onLayerClick={(id) => {
                        if (mode === 'gradcam' && onGradcamLayerSelect) {
                            onGradcamLayerSelect(id);
                        } else {
                            setSelectedLayer(id);
                            setActiveTab('features');
                        }
                    }}
                    architecture={architecture}
                    liveFeatureMaps={liveFeatureMaps}
                    gradcamData={gradcamData}
                    gradcamLayerIndex={gradcamLayerIndex}
                />
            </div>
            {/* Mode Specific Controls */}
            {mode === 'gradcam' && (
                <div className="absolute top-6 right-6 bg-[#14161C]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 w-72 animate-in fade-in slide-in-from-top-4 z-20">
                    <div className="flex items-center gap-2 mb-3">
                        <Mountain className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Grad-CAM Layer Selection</span>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] text-gray-400 uppercase">Select Conv Layer</span>
                        <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
                            {getAvailableLayers().map((layer) => (
                                <button
                                    key={layer.index}
                                    onClick={() => onGradcamLayerSelect?.(layer.index)}
                                    disabled={isLoadingGradcam}
                                    className={cn(
                                        "px-2 py-1.5 rounded text-[10px] font-medium transition-all",
                                        gradcamLayerIndex === layer.index
                                            ? "bg-cyan-500 text-black"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white",
                                        isLoadingGradcam && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {layer.displayName}
                                </button>
                            ))}
                        </div>
                        {gradcamData && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="text-[10px] text-gray-400">
                                    Layer: <span className="text-cyan-400">{gradcamData.layer_name}</span>
                                </div>
                                <div className="text-[10px] text-gray-400">
                                    Class: <span className="text-cyan-400">{gradcamData.class_label}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
