"use client";

import { useState, useMemo, Fragment } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

export default function SimpleFitExperience() {
    const basePoints = useMemo(
        () =>
            Array.from({ length: 12 }).map((_, idx) => ({
                x: idx,
                y: idx * 2 + 5 + (Math.sin(idx) * 4),
            })),
        []
    );
    const [outlierOffset, setOutlierOffset] = useState(18);

    const points = [...basePoints, { x: 11, y: outlierOffset }];

    const { slope, intercept } = useMemo(() => {
        const n = points.length;
        const sumX = points.reduce((sum, pt) => sum + pt.x, 0);
        const sumY = points.reduce((sum, pt) => sum + pt.y, 0);
        const sumXY = points.reduce((sum, pt) => sum + pt.x * pt.y, 0);
        const sumX2 = points.reduce((sum, pt) => sum + pt.x * pt.x, 0);
        const denom = n * sumX2 - sumX * sumX || 1;
        const b = (n * sumXY - sumX * sumY) / denom;
        const a = sumY / n - (b * sumX) / n;
        return { slope: b, intercept: a };
    }, [points]);

    const mse = useMemo(() => {
        return (
            points.reduce((sum, pt) => {
                const pred = slope * pt.x + intercept;
                return sum + Math.pow(pt.y - pred, 2);
            }, 0) / points.length
        );
    }, [points, slope, intercept]);

    return (
        <div className="space-y-10">
            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Prediction surface
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Fit the best line
                    </h2>
                    <p className="text-white/65">
                        Residuals glow to highlight the squared error budget.
                    </p>
                </div>
                <GlassPanel className="relative h-96 p-6">
                    <svg className="h-full w-full" viewBox="0 0 500 350">
                        {points.map((pt, idx) => {
                            const pred = slope * pt.x + intercept;
                            const yActual = 320 - pt.y * 10;
                            const yPred = 320 - pred * 10;
                            return (
                                <Fragment key={`pt-${idx}`}>
                                    <line
                                        x1={pt.x * 35 + 40}
                                        y1={yActual}
                                        x2={pt.x * 35 + 40}
                                        y2={yPred}
                                        stroke="rgba(255,255,255,0.5)"
                                        strokeDasharray="4 4"
                                    />
                                    <circle
                                        cx={pt.x * 35 + 40}
                                        cy={yActual}
                                        r={idx === points.length - 1 ? 8 : 5}
                                        fill={idx === points.length - 1 ? "#ff6b81" : "#fff"}
                                    />
                                </Fragment>
                            );
                        })}
                        <line
                            x1={40}
                            y1={320 - (slope * 0 + intercept) * 10}
                            x2={460}
                            y2={320 - (slope * 12 + intercept) * 10}
                            stroke="#64ffda"
                            strokeWidth="3"
                        />
                    </svg>
                    <div className="absolute right-6 top-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                        MSE: {mse.toFixed(2)}
                    </div>
                </GlassPanel>
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Outlier influence
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                        Drag a single point to pivot the entire fit
                    </h2>
                    <p className="text-white/65">
                        Move the rogue observation vertically to feel how fragile the least-squares objective can be.
                    </p>
                </div>
                <GlassPanel className="space-y-4 p-6">
                    <label className="flex items-center justify-between text-sm text-white/60">
                        Outlier Y position
                        <span className="text-white">{outlierOffset.toFixed(1)}</span>
                    </label>
                    <input
                        type="range"
                        min={2}
                        max={30}
                        step={0.5}
                        value={outlierOffset}
                        onChange={(event) => setOutlierOffset(Number(event.currentTarget.value))}
                        className="w-full accent-white"
                    />
                    <p className="text-white/65">
                        When the point escapes the cluster, the regression line pivots dramatically, inflating the MSE.
                    </p>
                </GlassPanel>
            </section>
        </div>
    );
}
