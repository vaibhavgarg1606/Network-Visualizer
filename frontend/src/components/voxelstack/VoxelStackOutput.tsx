import { BarChart3, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RightPanelTab = 'prediction' | 'features';

interface VoxelStackOutputProps {
    activeTab: RightPanelTab;
    setActiveTab: (tab: RightPanelTab) => void;
    prediction: any;
    selectedLayer: number | null;
    liveFeatureMaps: Record<string, { maps: string[], total: number }>;
    styles: {
        bg: string;
    };
}

export default function VoxelStackOutput({
    activeTab,
    setActiveTab,
    prediction,
    selectedLayer,
    liveFeatureMaps,
    styles
}: VoxelStackOutputProps) {
    return (
        <>
            {/* Panel Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('prediction')}
                    className={cn(
                        "flex-1 py-4 text-xs font-medium uppercase tracking-wider transition-colors relative",
                        activeTab === 'prediction' ? "text-white" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Output
                    {activeTab === 'prediction' && (
                        <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", styles.bg === 'bg-[#0a0505]' ? 'bg-red-500' : 'bg-cyan-400')} />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('features')}
                    className={cn(
                        "flex-1 py-4 text-xs font-medium uppercase tracking-wider transition-colors relative",
                        activeTab === 'features' ? "text-white" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Features
                    {activeTab === 'features' && (
                        <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", styles.bg === 'bg-[#0a0505]' ? 'bg-red-500' : 'bg-cyan-400')} />
                    )}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'prediction' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
                            <BarChart3 className="w-4 h-4" />
                            Class Probabilities
                        </div>

                        {prediction ? (
                            <div className="space-y-4">
                                {/* Top Prediction Card */}
                                <div className="p-5 rounded-2xl bg-[#1A1D24] border border-white/10 shadow-lg relative overflow-hidden">
                                    <div className="flex justify-between items-end mb-3 relative z-10">
                                        <span className="text-lg font-bold text-white">{prediction.top_class}</span>
                                        <span className="text-lg font-mono font-bold text-cyan-400">
                                            {(prediction.probabilities[0].score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                            style={{ width: `${prediction.probabilities[0].score * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Other Predictions List */}
                                <div className="space-y-3 px-1">
                                    {prediction.probabilities.slice(1).map((p: any, idx: number) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span>{p.label}</span>
                                                <span className="font-mono">{(p.score * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gray-500 rounded-full"
                                                    style={{ width: `${p.score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                <p className="text-sm">No prediction yet.</p>
                                <p className="text-xs mt-1">Upload an image to see results.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-2">
                        {selectedLayer !== null ? (
                            <div className="flex-1 flex flex-col gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-white">Layer {selectedLayer}</h3>
                                        <span className="text-xs font-mono text-gray-500">Conv2d</span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        64 filters, 3x3 kernel size. Early feature detection including edges and textures.
                                    </p>
                                </div>
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Feature Maps</h4>
                                        {liveFeatureMaps && Object.keys(liveFeatureMaps).length > 0 && selectedLayer !== null && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400">
                                                Showing {Object.values(liveFeatureMaps)[selectedLayer]?.maps.length || 0} of {Object.values(liveFeatureMaps)[selectedLayer]?.total || 0}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {liveFeatureMaps && Object.keys(liveFeatureMaps).length > 0 && selectedLayer !== null ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {(Object.values(liveFeatureMaps)[selectedLayer]?.maps || []).map((mapUrl: string, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="aspect-square rounded bg-white/5 border border-white/5 hover:border-cyan-400/50 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
                                                    >
                                                        <img src={mapUrl} alt={`Feature map ${i}`} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className="absolute bottom-1 right-1 text-[10px] font-mono text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">#{i}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                <p className="text-xs">No feature maps available</p>
                                                <p className="text-xs mt-1">Upload an image and predict first</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-400">Activation Mean</span>
                                        <span className="text-xs font-mono text-white">0.42</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[42%] bg-white/40" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Grid className="w-8 h-8 opacity-20" />
                                </div>
                                <p className="text-sm">Select a layer in the 3D view to inspect its feature maps.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
