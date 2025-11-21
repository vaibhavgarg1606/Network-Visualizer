"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function AttentioCoreExperience() {
    const [sentence, setSentence] = useState(
        "The crane lifted the beam above the river."
    );
    const tokens = sentence.split(/\s+/).filter(Boolean);
    const [focusIndex, setFocusIndex] = useState(0);

    const attentionWeights = useMemo(() => {
        return tokens.map((_, idx) => {
            const distance = Math.abs(idx - focusIndex);
            return Math.max(0.05, 1 - distance * 0.2);
        });
    }, [tokens, focusIndex]);

    const nextTokenCandidates = ["bridge", "carefully", "slowly", "structure", "while"];

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Context loom
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Hover any word to watch self-attention routes
                    </h2>
                    <p className="text-white/65">
                        Lines emerge from the selected token, intensifying around the strongest
                        query-key pairs.
                    </p>
                </div>
                <GlassPanel className="space-y-6 p-6">
                    <input
                        value={sentence}
                        onChange={(event) => setSentence(event.currentTarget.value)}
                        className="w-full rounded-2xl border border-white/15 bg-transparent p-4 text-lg text-white outline-none"
                    />
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
                        <div className="flex flex-wrap gap-3">
                            {tokens.map((token, idx) => (
                                <button
                                    key={`${token}-${idx}`}
                                    onMouseEnter={() => setFocusIndex(idx)}
                                    className={`rounded-full px-4 py-2 text-sm ${idx === focusIndex
                                            ? "bg-white text-black"
                                            : "border border-white/20 text-white/70"
                                        }`}
                                >
                                    {token}
                                </button>
                            ))}
                        </div>
                        <svg className="pointer-events-none absolute inset-0" viewBox="0 0 600 220">
                            {tokens.map((_, idx) => (
                                <line
                                    key={`line-${idx}`}
                                    x1={50 + focusIndex * 45}
                                    y1={60}
                                    x2={50 + idx * 45}
                                    y2={160}
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeWidth={attentionWeights[idx] * 4}
                                    strokeLinecap="round"
                                />
                            ))}
                        </svg>
                    </div>
                </GlassPanel>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Next-token probability
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Auto-complete diagnostics
                    </h2>
                    <p className="text-white/65">
                        Softmax outputs for the next position in decoder-only mode.
                    </p>
                </div>
                <GlassPanel className="grid gap-4 p-6 sm:grid-cols-5">
                    {nextTokenCandidates.map((token, idx) => {
                        const confidence = Math.max(
                            0.05,
                            Math.sin(idx + focusIndex) * 0.3 + 0.35
                        );
                        return (
                            <div key={token} className="space-y-2 text-center">
                                <div className="h-32 rounded-2xl border border-white/10 bg-white/5">
                                    <div
                                        className="h-full w-full origin-bottom rounded-2xl bg-white transition"
                                        style={{
                                            transform: `scaleY(${confidence})`,
                                            opacity: confidence + 0.25,
                                        }}
                                    />
                                </div>
                                <p className="text-sm font-semibold text-white">{token}</p>
                                <p className="text-xs text-white/60">
                                    {(confidence * 100).toFixed(1)}%
                                </p>
                            </div>
                        );
                    })}
                </GlassPanel>
            </section>
        </div>
    );
}
