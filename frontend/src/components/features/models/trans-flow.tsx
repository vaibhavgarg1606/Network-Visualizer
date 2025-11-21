"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function TransFlowExperience() {
    const [source, setSource] = useState("La voiture rouge traverse le pont.");
    const [decoderStep, setDecoderStep] = useState(0);
    const sourceTokens = source.split(" ").filter(Boolean);
    const targetTokens = ["The", "red", "car", "crosses", "the", "bridge"];

    const alignment = useMemo(() => {
        return targetTokens.map((_, rowIdx) =>
            sourceTokens.map((__, colIdx) =>
                Math.max(0.1, Math.cos(rowIdx - colIdx) * 0.4 + 0.5)
            )
        );
    }, [sourceTokens]);

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Encoder-decoder pipeline
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Follow the context vector across modules
                    </h2>
                    <p className="text-white/65">
                        Input language streams into the encoder, gets bottled into a context sphere,
                        then feeds the decoder.
                    </p>
                </div>
                <GlassPanel className="grid gap-6 p-6 lg:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-white/60">Input language</p>
                        <textarea
                            value={source}
                            onChange={(event) => setSource(event.currentTarget.value)}
                            className="mt-4 min-h-[120px] w-full rounded-2xl border border-white/15 bg-transparent p-4 text-white outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="h-40 w-40 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent text-center">
                            <p className="pt-14 text-sm uppercase tracking-[0.3em] text-white/60">
                                Context
                            </p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-white/60">Output language</p>
                        <div className="mt-4 space-x-2 text-lg text-white/80">
                            {targetTokens.map((token, idx) => (
                                <span
                                    key={token}
                                    className={
                                        idx === decoderStep
                                            ? "rounded-full bg-white px-3 py-1 text-black"
                                            : ""
                                    }
                                >
                                    {token}
                                </span>
                            ))}
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={targetTokens.length - 1}
                            value={decoderStep}
                            onChange={(event) => setDecoderStep(Number(event.currentTarget.value))}
                            className="mt-6 w-full accent-white"
                        />
                    </div>
                </GlassPanel>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Attention alignment grid
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Decoder focus per output token
                    </h2>
                    <p className="text-white/65">
                        Rows are decoder steps; columns correspond to encoder tokens.
                    </p>
                </div>
                <GlassPanel className="overflow-auto p-6">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="p-2 text-left text-white/60">tᵒᵘᵗ</th>
                                {sourceTokens.map((token, idx) => (
                                    <th key={`${token}-${idx}`} className="p-2 text-white/60">
                                        {token}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {alignment.map((row, rowIdx) => (
                                <tr key={`row-${rowIdx}`}>
                                    <td className="p-2 font-semibold text-white">
                                        {targetTokens[rowIdx]}
                                    </td>
                                    {row.map((value, colIdx) => (
                                        <td
                                            key={`cell-${rowIdx}-${colIdx}`}
                                            className="p-2 text-center"
                                            style={{
                                                background:
                                                    rowIdx === decoderStep
                                                        ? `rgba(255,255,255,${value * 0.8})`
                                                        : "rgba(255,255,255,0.08)",
                                                color:
                                                    rowIdx === decoderStep && value > 0.6
                                                        ? "#050505"
                                                        : "#ffffff",
                                            }}
                                        >
                                            {value.toFixed(2)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassPanel>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Context vector visualization
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Encoding energy distribution
                    </h2>
                    <p className="text-white/65">
                        Modulate as the sentence shifts.
                    </p>
                </div>
                <GlassPanel className="grid gap-4 p-6 sm:grid-cols-3">
                    {sourceTokens.map((token, idx) => {
                        const energy = Math.max(0.1, Math.sin(idx + decoderStep) * 0.4 + 0.6);
                        return (
                            <div key={`energy-${token}-${idx}`}>
                                <p className="text-sm text-white/60">{token}</p>
                                <div className="mt-2 h-32 rounded-3xl border border-white/10 bg-white/5">
                                    <div
                                        className="h-full w-full origin-bottom rounded-3xl bg-white"
                                        style={{ transform: `scaleY(${energy})` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </GlassPanel>
            </section>
        </div>
    );
}
