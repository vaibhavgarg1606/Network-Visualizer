"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function PatchFlowExperience() {
    const [activePatch, setActivePatch] = useState(5);
    const patches = 16;
    const attention = useMemo(() => {
        const base = Array.from({ length: patches }).map((_, idx) =>
            Math.max(0.1, Math.sin(idx + activePatch) * 0.4 + 0.5)
        );
        const total = base.reduce((sum, value) => sum + value, 0);
        return base.map((value) => value / total);
    }, [activePatch]);

    const clsSimilarities = Array.from({ length: patches }).map(
        (_, idx) => Math.max(0.1, Math.cos(idx - activePatch / 2) * 0.5 + 0.5)
    );

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Attention grid
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Inspect patch-wise focus inside the ViT encoder
                    </h2>
                    <p className="text-white/65">
                        Select any patch on the input grid. The reciprocal attention weights
                        illuminate how much the chosen region influenced every other patch.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                    <GlassPanel className="p-6">
                        <div className="grid grid-cols-4 gap-3">
                            {Array.from({ length: patches }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActivePatch(idx)}
                                    className="aspect-square rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/50"
                                    style={{
                                        boxShadow:
                                            idx === activePatch
                                                ? "0 0 25px rgba(255,255,255,0.6)"
                                                : undefined,
                                    }}
                                >
                                    <span className="text-xs text-white/70">#{idx + 1}</span>
                                </button>
                            ))}
                        </div>
                    </GlassPanel>
                    <GlassPanel className="space-y-4 p-6">
                        <p className="text-sm text-white/60">
                            Patch-to-patch attention heatmap
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {attention.map((value, idx) => (
                                <div
                                    key={idx}
                                    className="flex aspect-square items-center justify-center rounded-xl text-sm font-semibold text-white"
                                    style={{
                                        background: `rgba(255, 255, 255, ${value * 0.9})`,
                                        color: value > 0.55 ? "#050505" : "#ffffff",
                                    }}
                                >
                                    {value.toFixed(2)}
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        CLS token focus
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Visualize the global token synthesizer
                    </h2>
                    <p className="text-white/65">
                        The [CLS] vector aggregates context across all patches. Track cosine
                        similarity to understand which tokens dominate the summary.
                    </p>
                </div>
                <GlassPanel className="grid gap-4 p-6 sm:grid-cols-2">
                    {clsSimilarities.map((value, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-white/60">
                                <span>Patch #{idx + 1}</span>
                                <span>{value.toFixed(2)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-white"
                                    style={{ width: `${value * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </GlassPanel>
            </section>
        </div>
    );
}
