import { ShieldAlert, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';
import Scene from '@/components/Scene';
import { ViewMode } from '@/components/common/ModeSelector';

interface VoxelStackSceneProps {
    mode: ViewMode;
    noiseLevel: number;
    setNoiseLevel: (val: number) => void;
    showTerrain: boolean;
    setShowTerrain: (val: boolean) => void;
    rgbExplosion: boolean;
    layerSpacing: number;
    setSelectedLayer: (id: number) => void;
    setActiveTab: (tab: 'prediction' | 'features') => void;
    architecture: string;
    liveFeatureMaps: Record<string, { maps: string[], total: number }>;
}

export default function VoxelStackScene({
    mode,
    noiseLevel,
    setNoiseLevel,
    showTerrain,
    setShowTerrain,
    rgbExplosion,
    layerSpacing,
    setSelectedLayer,
    setActiveTab,
    architecture,
    liveFeatureMaps
}: VoxelStackSceneProps) {
    return (
        <>
            <div className="absolute inset-0">
                <Scene
                    mode={mode}
                    noiseLevel={noiseLevel}
                    showTerrain={showTerrain}
                    rgbExplosion={rgbExplosion}
                    layerSpacing={layerSpacing}
                    onLayerClick={(id) => {
                        setSelectedLayer(id);
                        setActiveTab('features');
                    }}
                    architecture={architecture}
                    liveFeatureMaps={liveFeatureMaps}
                />
            </div>
            {/* Mode Specific Controls */}
            {mode === 'adversarial' && (
                <div className="absolute top-6 right-6 bg-[#14161C]/90 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 w-64 animate-in fade-in slide-in-from-top-4 z-20">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Attack Config</span>
                        </div>
                        <span className="text-xs font-mono text-red-300">ε: {(noiseLevel / 1000).toFixed(3)}</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                            <span>Stealth</span>
                            <span>Aggressive</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={noiseLevel}
                            onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-red-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
                        />
                    </div>
                </div>
            )}
            {mode === 'gradcam' && (
                <div className="absolute top-6 right-6 bg-[#14161C]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 w-64 animate-in fade-in slide-in-from-top-4 z-20">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Mountain className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Terrain View</span>
                        </div>
                        <span className="text-xs font-mono text-cyan-300">{showTerrain ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Enable Displacement</span>
                        <button
                            onClick={() => setShowTerrain(!showTerrain)}
                            className={cn(
                                "w-10 h-5 rounded-full transition-colors relative",
                                showTerrain ? "bg-cyan-500" : "bg-gray-700"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                                showTerrain ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
