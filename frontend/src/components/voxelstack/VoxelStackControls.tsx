import { Box, RotateCcw, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/ImageUpload';
import Panel from '@/components/common/Panel';

interface VoxelStackControlsProps {
    currentImage: string | null;
    setCurrentImage: (img: string | null) => void;
    isPredicting: boolean;
    handlePredict: () => void;
    architecture: string;
    setArchitecture: (arch: string) => void;
    rgbExplosion: boolean;
    setRgbExplosion: (val: boolean) => void;
    layerSpacing: number;
    setLayerSpacing: (val: number) => void;
}

export default function VoxelStackControls({
    currentImage,
    setCurrentImage,
    isPredicting,
    handlePredict,
    architecture,
    setArchitecture,
    rgbExplosion,
    setRgbExplosion,
    layerSpacing,
    setLayerSpacing
}: VoxelStackControlsProps) {
    return (
        <>
            {/* Input Image */}
            <Panel className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Box className="w-4 h-4" />
                    Upload Image
                </div>
                <ImageUpload onImageSelect={setCurrentImage} className="flex-1" />
                <button
                    onClick={handlePredict}
                    disabled={isPredicting || !currentImage}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPredicting ? (
                        <RotateCcw className="w-4 h-4 animate-spin" />
                    ) : (
                        <Box className="w-4 h-4" />
                    )}
                    {isPredicting ? 'Predicting...' : 'Predict'}
                </button>
            </Panel>

            {/* Configuration */}
            <Panel className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Sliders className="w-4 h-4" />
                    Configuration
                </div>
                {/* Architecture selector removed to keep VoxelStack focused on a single ImageNet CNN setup */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">RGB Explosion</label>
                        <button
                            onClick={() => setRgbExplosion(!rgbExplosion)}
                            className={cn(
                                "w-8 h-4 rounded-full transition-colors relative",
                                rgbExplosion ? "bg-cyan-500" : "bg-gray-700"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform",
                                rgbExplosion ? "translate-x-4" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Layer Spacing</label>
                        <span className="text-xs font-mono text-gray-400">{layerSpacing}x</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={layerSpacing}
                        onChange={(e) => setLayerSpacing(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                </div>
            </Panel>
        </>
    );
}
