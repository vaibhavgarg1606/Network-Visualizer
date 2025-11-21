"use client";

import { useState, useMemo, useRef } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SceneContainer } from "@/components/visuals/3d/scene-container";
import { Layers3, Activity } from "lucide-react";
import { VoxelStackVisual } from "@/components/visuals/3d/voxel-stack-visual";

export default function VoxelStackExperience() {
    const [selectedLayer, setSelectedLayer] = useState(3);
    const [epsilon, setEpsilon] = useState(0.12);

    const featureMaps = useMemo(
        () =>
            Array.from({ length: 9 }).map((_, idx) => {
                const distance = Math.abs(idx - selectedLayer);
                return Math.max(0.15, 1 - distance * 0.18);
            }),
        [selectedLayer]
    );

    const prediction = epsilon > 0.38 ? "Gibbon" : "Panda";

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Layer Tunnel
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Trace activations through stacked convolutions
                    </h2>
                    <p className="text-white/65">
                        Select any layer to peel open the tunnel. The feature grid shows the
                        transformed image at that exact depth in the network.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                    <GlassPanel className="relative h-[420px] overflow-hidden">
                        <div className="absolute inset-0">
                            <SceneContainer>
                                <VoxelStackVisual selectedLayer={selectedLayer} />
                            </SceneContainer>
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/60">Active layer</p>
                                    <p className="text-4xl font-semibold text-white">
                                        {selectedLayer + 1}
                                    </p>
                                </div>
                                <Layers3 className="h-10 w-10 text-white/50" />
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min={0}
                                    max={11}
                                    value={selectedLayer}
                                    onChange={(event) =>
                                        setSelectedLayer(Number(event.currentTarget.value))
                                    }
                                    className="w-full accent-white"
                                />
                                <div className="text-sm text-white/60">
                                    Layer ablation instantly re-routes the signal.
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6">
                        <p className="text-sm uppercase tracking-[0.4em] text-white/40">
                            Feature map grid
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            {featureMaps.map((intensity, idx) => (
                                <div
                                    key={idx}
                                    className="relative h-32 overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/10 to-transparent"
                                >
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${intensity}), transparent 70%)`,
                                            filter: "grayscale(100%) contrast(160%)",
                                        }}
                                    />
                                    <span className="absolute bottom-2 right-3 text-xs text-white/50">
                                        L{idx + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Adversarial attack mode
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Inject imperceptible noise to flip predictions
                    </h2>
                    <p className="text-white/65">
                        Drag ε to modulate the perturbation budget. Watch the classifier snap
                        to a different label without any visible change to the pixel space.
                    </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <GlassPanel className="space-y-4 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/60">Epsilon (ε)</p>
                                <p className="text-4xl font-semibold text-white">
                                    {epsilon.toFixed(2)}
                                </p>
                            </div>
                            <Activity className="h-10 w-10 text-white/50" />
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={0.6}
                            step={0.02}
                            value={epsilon}
                            onChange={(event) =>
                                setEpsilon(Number(event.currentTarget.value))
                            }
                            className="w-full accent-white"
                        />
                        <div className="mt-4 space-y-2 text-sm">
                            <p className="font-semibold text-white">Predicted label</p>
                            <p className="text-xl text-white">
                                {prediction}
                                <span className="ml-2 text-sm text-white/60">
                                    confidence {(1 - Math.abs(0.4 - epsilon)).toFixed(2)}
                                </span>
                            </p>
                        </div>
                    </GlassPanel>
                    <GlassPanel className="relative overflow-hidden p-6">
                        {/* Placeholder for Image - using a div for now to avoid external dependency issues if image fails */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-60" />
                        <div className="relative z-10 h-64 w-full rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                            <span className="text-white/40">Input Image</span>
                        </div>
                        <div className="relative z-10 mt-4">
                            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                                Input canvas
                            </p>
                            <p className="mt-2 text-white/70">
                                Noise energy distributed across all pixels with ℓ∞ constraint.
                                Toggle epsilon to reveal vulnerability zones.
                            </p>
                        </div>
                    </GlassPanel>
                </div>
            </section>
        </div>
    );
}
