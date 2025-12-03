"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

const DotShaderBackground = dynamic(
  () =>
    import("@/components/ui/dot-shader-background").then(
      (mod) => mod.DotScreenShader
    ),
  { ssr: false }
);

type Stat = {
  label: string;
  value: string;
};

type HeroSectionProps = {
  stats: Stat[];
};

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
      <div className="absolute inset-0">
        <DotShaderBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-[#050505]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center pointer-events-none">
        <GlassPanel className="w-full max-w-4xl rounded-[32px] p-10">
          <p className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.4em] text-white/70">
            <ShieldCheck className="h-4 w-4 text-white" />
            NeuroVision · Model Visualization Toolkit
          </p>
          <h1 className="text-4xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Visualize and Analyze Machine Learning Models Clearly
          </h1>
          <p className="mt-6 text-lg text-white/75 sm:text-xl">
            A lightweight platform to explore, interpret, and compare machine learning models. Inspect layers, activations, and predictions visually in one place.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/selection" className="pointer-events-auto">
              <Button size="lg" className="rounded-full border-white/30 bg-white/10 hover:bg-white/20">
                View Models
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="pointer-events-auto rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40">
              Open Playground
            </Button>
          </div>
        </GlassPanel>

        <div className="mt-10 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <GlassPanel
              key={stat.label}
              intensity="low"
              className="px-6 py-5 text-left"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-white/55">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {stat.value}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

