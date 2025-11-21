"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function ChronoCoilExperience() {
    const [sequence, setSequence] = useState("AAPL, AAPL, TSLA, TSLA, NVDA, AAPL");
    const tokens = sequence.split(",").map((token) => token.trim()).filter(Boolean);
    const [step, setStep] = useState(0);

    const gateValues = useMemo(() => {
        return tokens.map((_, idx) => ({
            input: Math.abs(Math.sin(idx * 0.6 + 1)),
            forget: Math.abs(Math.cos(idx * 0.45)),
            output: Math.abs(Math.sin(idx * 0.3 + 0.5)),
            cell: Math.abs(Math.sin(idx * 0.8)),
        }));
    }, [tokens]);

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Gate monitor
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Pulse through time steps
                    </h2>
                    <p className="text-white/65">
                        Click any block or drag the slider to inspect live gating signals.
                    </p>
                </div>
                <div className="space-y-6">
                    <input
                        value={sequence}
                        onChange={(event) => setSequence(event.currentTarget.value)}
                        className="w-full rounded-2xl border border-white/15 bg-transparent p-4 text-white outline-none"
                    />
                    <GlassPanel className="overflow-auto p-6">
                        <div className="flex gap-4">
                            {tokens.map((token, idx) => (
                                <button
                                    key={`${token}-${idx}`}
                                    onClick={() => setStep(idx)}
                                    className={`min-w-24 rounded-2xl px-4 py-3 text-center ${idx === step
                                            ? "bg-white text-black"
                                            : "border border-white/15 text-white/70"
                                        }`}
                                >
                                    t{idx} <br />
                                    {token}
                                </button>
                            ))}
                        </div>
                    </GlassPanel>
                    <input
                        type="range"
                        min={0}
                        max={Math.max(tokens.length - 1, 0)}
                        value={step}
                        onChange={(event) => setStep(Number(event.currentTarget.value))}
                        className="w-full accent-white"
                    />
                    <GlassPanel className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                        {["input", "forget", "output", "cell"].map((gate) => {
                            const value = gateValues[step]?.[gate as keyof typeof gateValues[number]] ?? 0;
                            return (
                                <div key={gate} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-white/60">
                                        <span>{gate.toUpperCase()} gate</span>
                                        <span>{value.toFixed(2)}</span>
                                    </div>
                                    <div className="h-32 rounded-3xl border border-white/10 bg-white/5">
                                        <div
                                            className="h-full w-full rounded-3xl bg-white"
                                            style={{ transform: `scaleY(${value})`, transformOrigin: "bottom" }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </GlassPanel>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Hidden state trajectory
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        UMAP projection
                    </h2>
                    <p className="text-white/65">
                        Tracks the position of the hidden state over time, revealing loops and drifts.
                    </p>
                </div>
                <GlassPanel className="relative h-80 p-6">
                    <svg className="h-full w-full" viewBox="0 0 400 300">
                        <polyline
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="2"
                            points={tokens
                                .map((_, idx) => {
                                    const x = 30 + idx * (320 / Math.max(tokens.length - 1, 1));
                                    const y =
                                        150 +
                                        Math.sin(idx * 0.8) * 80 +
                                        Math.cos(idx * 0.4) * 20;
                                    return `${x},${y}`;
                                })
                                .join(" ")}
                        />
                        {tokens.map((token, idx) => {
                            const x = 30 + idx * (320 / Math.max(tokens.length - 1, 1));
                            const y =
                                150 + Math.sin(idx * 0.8) * 80 + Math.cos(idx * 0.4) * 20;
                            return (
                                <circle
                                    key={`point-${idx}`}
                                    cx={x}
                                    cy={y}
                                    r={idx === step ? 8 : 5}
                                    fill={idx === step ? "#fff" : "rgba(255,255,255,0.5)"}
                                />
                            );
                        })}
                    </svg>
                </GlassPanel>
            </section>
        </div>
    );
}
