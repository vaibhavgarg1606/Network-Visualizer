"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function FractalLogicExperience() {
    const [age, setAge] = useState(35);
    const [income, setIncome] = useState(70);

    const splits = [
        { label: "Age ≤ 40", gain: 0.32 },
        { label: "Income ≤ 90k", gain: 0.41 },
        { label: "Debt ≤ 20k", gain: 0.21 },
    ];

    const decisionPath = [
        "Root",
        age <= 40 ? "Age ≤ 40" : "Age > 40",
        income <= 90 ? "Income ≤ 90k" : "Income > 90k",
        "Approve",
    ];

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Decision path tracer
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Illuminate the IF/THEN chain
                    </h2>
                    <p className="text-white/65">
                        Enter sample features to pulse a neon trail down the tree.
                    </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <GlassPanel className="space-y-4 p-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-white/60">Age</span>
                            <input
                                type="number"
                                value={age}
                                onChange={(event) => setAge(Number(event.currentTarget.value))}
                                className="rounded-2xl border border-white/15 bg-transparent p-3 text-white outline-none"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-white/60">Income (k USD)</span>
                            <input
                                type="number"
                                value={income}
                                onChange={(event) => setIncome(Number(event.currentTarget.value))}
                                className="rounded-2xl border border-white/15 bg-transparent p-3 text-white outline-none"
                            />
                        </label>
                    </GlassPanel>
                    <GlassPanel className="space-y-3 p-6">
                        {decisionPath.map((node, idx) => (
                            <div
                                key={`${node}-${idx}`}
                                className={`rounded-2xl border p-4 text-lg ${idx === decisionPath.length - 1
                                        ? "border-white bg-white text-black"
                                        : "border-white/10 text-white"
                                    }`}
                            >
                                {node}
                            </div>
                        ))}
                    </GlassPanel>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Split visualization
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Entropy / Gini gains
                    </h2>
                    <p className="text-white/65">
                        Each node displays impurity before/after the split.
                    </p>
                </div>
                <GlassPanel className="grid gap-4 p-6 sm:grid-cols-3">
                    {splits.map((split) => (
                        <div key={split.label} className="space-y-2">
                            <p className="text-sm text-white/60">{split.label}</p>
                            <div className="h-32 rounded-3xl border border-white/10 bg-white/5">
                                <div
                                    className="h-full w-full rounded-3xl bg-white"
                                    style={{ transform: `scaleY(${split.gain})`, transformOrigin: "bottom" }}
                                />
                            </div>
                            <p className="text-xs text-white/60">Δ impurity {split.gain.toFixed(2)}</p>
                        </div>
                    ))}
                </GlassPanel>
            </section>
        </div>
    );
}
