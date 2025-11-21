"use client";

import { useState, useMemo, useRef } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SceneContainer } from "@/components/visuals/3d/scene-container";
import { LatentMorphVisual } from "@/components/visuals/3d/latent-morph-visual";

export default function LatentMorphExperience() {
    const [selected, setSelected] = useState<number[]>([]);
    const [morph, setMorph] = useState(0.5);
    const [attributes, setAttributes] = useState({
        gender: 0.5,
        hair: 0.4,
        smile: 0.6,
    });

    const morphLabel =
        selected.length === 2
            ? `Point A ➜ Point B`
            : "Select two points";

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Latent galaxy
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Navigate compressed manifolds in 3D scatter space
                    </h2>
                    <p className="text-white/65">
                        Each glowing node is a latent embedding. Click two distant points to
                        define the interpolation path and scrub through the morph.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                    <GlassPanel className="relative h-[420px] overflow-hidden">
                        <div className="absolute inset-0">
                            <SceneContainer>
                                <LatentMorphVisual morphProgress={morph} />
                            </SceneContainer>
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <div className="space-y-3">
                                <p className="text-sm uppercase tracking-[0.4em] text-white/50">
                                    Interpolation path
                                </p>
                                <p className="text-2xl font-semibold text-white">{morphLabel}</p>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={morph}
                                    onChange={(event) => setMorph(Number(event.currentTarget.value))}
                                    className="w-full accent-white"
                                />
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="space-y-6 p-6">
                        <div>
                            <p className="text-sm text-white/60">Morph preview</p>
                            <div className="mt-3 flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent text-4xl font-semibold text-white/70">
                                {selected.length < 2
                                    ? "⟳"
                                    : `${Math.round(morph * 100)}%`}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-white/60">Disentanglement sliders</p>
                            {Object.entries(attributes).map(([key, value]) => (
                                <div key={key} className="mt-4">
                                    <div className="flex items-center justify-between text-sm text-white/60">
                                        <span className="capitalize">{key}</span>
                                        <span>{Math.round(value * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        value={value}
                                        onChange={(event) =>
                                            setAttributes((prev) => ({
                                                ...prev,
                                                [key]: Number(event.currentTarget.value),
                                            }))
                                        }
                                        className="w-full accent-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </section>
        </div>
    );
}
