"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function HyperSectorExperience() {
    type Point = { x: number; y: number; label: number; support: boolean };
    const [kernel, setKernel] = useState<"linear" | "rbf" | "poly">("linear");

    const points = useMemo<Point[]>(() => {
        return Array.from({ length: 26 }).map((_, idx) => {
            const label = idx % 2 ? 1 : -1;
            const baseX = label === 1 ? Math.random() * 30 + 60 : Math.random() * 30 + 10;
            const baseY =
                label === 1 ? Math.random() * 25 + 55 : Math.random() * 25 + 15;
            const margin = Math.abs(baseX - baseY) / 50;
            return {
                x: baseX,
                y: baseY,
                label,
                support: margin < 0.35,
            };
        });
    }, []);

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Battleground
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Interactive boundary & margin
                    </h2>
                    <p className="text-white/65">
                        Support vectors glow because they alone sculpt the hyperplane.
                    </p>
                </div>
                <GlassPanel className="space-y-4 p-6">
                    <div className="flex flex-wrap gap-3">
                        {["linear", "rbf", "poly"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setKernel(option as typeof kernel)}
                                className={`rounded-full px-4 py-2 text-sm uppercase tracking-[0.3em] ${kernel === option ? "bg-white text-black" : "border border-white/20 text-white/60"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                        {points.map((pt, idx) => (
                            <div
                                key={idx}
                                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    left: `${pt.x}%`,
                                    top: `${pt.y}%`,
                                    background: pt.label === 1 ? "#64ffda" : "#ff6584",
                                    boxShadow: pt.support
                                        ? `0 0 20px ${pt.label === 1 ? "rgba(100,255,218,0.8)" : "rgba(255,101,132,0.8)"
                                        }`
                                        : "none",
                                }}
                            />
                        ))}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    kernel === "linear"
                                        ? "linear-gradient(120deg, rgba(255,101,132,0.2), rgba(100,255,218,0.2))"
                                        : kernel === "rbf"
                                            ? "radial-gradient(circle at 50% 50%, rgba(100,255,218,0.2), transparent 60%), radial-gradient(circle at 40% 40%, rgba(255,101,132,0.2), transparent 40%)"
                                            : "conic-gradient(from 90deg, rgba(255,101,132,0.2), rgba(100,255,218,0.2))",
                            }}
                        />
                        <div className="absolute inset-0 border border-white/10" />
                    </div>
                </GlassPanel>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Kernel comparison
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Snap between geometric regimes
                    </h2>
                    <p className="text-white/65">
                        Observe how the decision surface bends as we swap kernels.
                    </p>
                </div>
                <GlassPanel className="space-y-4 p-6">
                    <p className="text-sm text-white/60">
                        Current kernel: <span className="font-semibold text-white">{kernel.toUpperCase()}</span>
                    </p>
                    <p className="text-white/70">
                        Linear keeps the dividing boundary planar. RBF envelopes difficult manifolds,
                        while Polynomial builds higher-order bends.
                    </p>
                </GlassPanel>
            </section>
        </div>
    );
}
