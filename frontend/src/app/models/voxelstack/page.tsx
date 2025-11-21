'use client';

import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, Play, Pause, Rewind, FastForward, Layers, Activity, Eye, ShieldAlert, Zap, Mountain, RotateCcw, Github, Box, Maximize2, Sliders, Grid, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Scene from '@/components/Scene';

type ViewMode = 'normal' | 'adversarial' | 'gradcam';
type RightPanelTab = 'prediction' | 'features';

export default function VoxelStackPage() {
    const [mode, setMode] = useState<ViewMode>('normal');
    const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
    const [noiseLevel, setNoiseLevel] = useState(0);
    const [showTerrain, setShowTerrain] = useState(false);
    const [architecture, setArchitecture] = useState('vgg16');
    const [rgbExplosion, setRgbExplosion] = useState(false);
    const [layerSpacing, setLayerSpacing] = useState(2);
    const [activeTab, setActiveTab] = useState<RightPanelTab>('prediction');

    // Theme classes based on mode
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

    return (
        <main className={cn(
            "relative w-full min-h-screen overflow-y-auto text-white transition-colors duration-700 selection:bg-white/20 pb-24",
            styles.bg,
            styles.theme
        )}>
            {/* Background Bleed Effect */}
            <div className={cn("fixed inset-0 z-0 opacity-20 transition-all duration-1000 pointer-events-none", styles.bleed)} />

            <div className="relative z-10 max-w-[1800px] mx-auto p-6 space-y-8">

                {/* Header & Hero Section */}
                <header className="space-y-8">
                    {/* Top Nav */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
                                Vision
                            </span>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                VoxelStack
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl">
                                Hierarchical feature visualization. Explore how the model builds understanding from edges to objects through a deep layer tunnel.
                            </p>
                        </div>

                        {/* 3 Glass Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <Activity className={cn("w-6 h-6 mb-4", styles.accent)} />
                                <h3 className="text-sm font-medium text-white mb-2">Overview</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Visualizes the internal activation maps of CNN architectures (VGG16/ResNet50) in a 3D tunnel, revealing feature hierarchies.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <Box className={cn("w-6 h-6 mb-4", styles.accent)} />
                                <h3 className="text-sm font-medium text-white mb-2">Visualization Mode</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Interactive 3D tunnel where each slice represents a network layer. Hover to inspect kernels, click to view full feature maps.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <Maximize2 className={cn("w-6 h-6 mb-4", styles.accent)} />
                                <h3 className="text-sm font-medium text-white mb-2">Interactions</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Use the bottom controls to switch modes. Drag to rotate, scroll to zoom. Click layers to inspect specific activation grids.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Playground Interface - 3 Panels */}
                <div className="flex flex-col lg:flex-row gap-6 h-[700px]">

                    {/* Left Panel: Input & Controls (Fixed Width) */}
                    <div className="w-full lg:w-[320px] flex flex-col gap-4 h-full shrink-0">
                        {/* Input Image */}
                        <div className="flex-1 rounded-3xl bg-[#0A0C10]/80 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Box className="w-4 h-4" />
                                Input Source
                            </div>
                            <div className="flex-1 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/5">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-xl">🐼</span>
                                </div>
                                <span className="text-xs text-gray-500">Drag & drop image</span>
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="rounded-3xl bg-[#0A0C10]/80 backdrop-blur-xl border border-white/10 p-6 space-y-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Sliders className="w-4 h-4" />
                                Configuration
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Architecture</label>
                                <div className="flex bg-white/5 rounded-lg p-1">
                                    <button
                                        onClick={() => setArchitecture('vgg16')}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-md text-xs font-medium transition-all",
                                            architecture === 'vgg16' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        VGG16
                                    </button>
                                    <button
                                        onClick={() => setArchitecture('resnet50')}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-md text-xs font-medium transition-all",
                                            architecture === 'resnet50' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        ResNet50
                                    </button>
                                </div>
                            </div>

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
                        </div>
                    </div>

                    {/* Center Panel: 3D Visualization (Flexible Width) */}
                    <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl min-h-[400px]">
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
                            />
                        </div>

                        {/* Mode Specific Controls Floating - Standardized Dimensions */}
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
                    </div>

                    {/* Right Panel: Output & Inspection (Fixed Width) */}
                    <div className="w-full lg:w-[350px] rounded-3xl bg-[#0A0C10]/80 backdrop-blur-xl border border-white/10 flex flex-col h-full overflow-hidden shrink-0">

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

                                    {/* Detailed Prediction List */}
                                    <div className="space-y-3">
                                        {/* Top Prediction */}
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
                                            <div className="flex justify-between items-center mb-2 relative z-10">
                                                <span className="text-sm font-bold text-white">Giant Panda</span>
                                                <span className="text-sm font-mono font-bold text-cyan-400">99.8%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                                                <div className="h-full w-[99.8%] bg-cyan-400" />
                                            </div>
                                        </div>

                                        {/* Secondary Predictions */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span>Indri</span>
                                                <span>0.1%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[0.1%] bg-gray-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span>Lesser Panda</span>
                                                <span>0.05%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-[0.05%] bg-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Adversarial Target (Only in Attack Mode) */}
                                    {mode === 'adversarial' && (
                                        <div className="pt-6 border-t border-white/10">
                                            <div className="flex items-center gap-2 text-sm font-medium text-red-400 mb-4">
                                                <ShieldAlert className="w-4 h-4" />
                                                Adversarial Target
                                            </div>
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 relative overflow-hidden">
                                                <div className="flex justify-between items-center mb-2 relative z-10">
                                                    <span className="text-sm font-bold text-red-400">Gibbon</span>
                                                    <span className="text-sm font-mono font-bold text-red-500">98.2%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-red-900/30 rounded-full overflow-hidden relative z-10">
                                                    <div className="h-full w-[98.2%] bg-red-500" />
                                                </div>
                                            </div>
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
                                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Feature Map Grid</h4>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400">64 Filters</span>
                                                </div>

                                                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {Array.from({ length: 64 }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="aspect-square rounded bg-white/5 border border-white/5 hover:border-cyan-400/50 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
                                                            >
                                                                {/* Mock Filter Pattern */}
                                                                <div className={cn(
                                                                    "absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity",
                                                                    styles.bleed
                                                                )} />
                                                            </div>
                                                        ))}
                                                    </div>
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
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Mode Switcher */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-[#14161C]/90 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
                    <button
                        onClick={() => setMode('normal')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            mode === 'normal' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Normal
                    </button>
                    <button
                        onClick={() => setMode('adversarial')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            mode === 'adversarial' ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        )}
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Attack
                    </button>
                    <button
                        onClick={() => setMode('gradcam')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            mode === 'gradcam' ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]" : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                        )}
                    >
                        <Mountain className="w-4 h-4" />
                        Grad-CAM
                    </button>
                </div>
            </div>
        </main>
    );
}
