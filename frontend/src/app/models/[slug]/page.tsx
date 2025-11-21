"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, Atom, Layers3, Network, Sparkles } from "lucide-react";
import { modelLookup, type ModelSlug } from "@/data/model-catalog";
import { GlassPanel } from "@/components/ui/glass-panel";

// Vision Models
import VoxelStackExperience from "@/components/features/models/voxel-stack";
import LatentMorphExperience from "@/components/features/models/latent-morph";
import PatchFlowExperience from "@/components/features/models/patch-flow";

// Language Models
import AttentioCoreExperience from "@/components/features/models/attentio-core";
import ChronoCoilExperience from "@/components/features/models/chrono-coil";
import TransFlowExperience from "@/components/features/models/trans-flow";

// Tabular Models
import HyperSectorExperience from "@/components/features/models/hyper-sector";
import FractalLogicExperience from "@/components/features/models/fractal-logic";
import SimpleFitExperience from "@/components/features/models/simple-fit";

type PageProps = {
  params: Promise<{ slug: string }>;
};


const experienceRegistry: Record<ModelSlug, () => React.ReactNode> = {
  voxelstack: VoxelStackExperience,
  latentmorph: LatentMorphExperience,
  patchflow: PatchFlowExperience,
  "attentio-core": AttentioCoreExperience,
  chronocoil: ChronoCoilExperience,
  transflow: TransFlowExperience,
  hypersector: HyperSectorExperience,
  fractallogic: FractalLogicExperience,
  simplefit: SimpleFitExperience,
  gridwalker: () => (
    <GlassPanel className="p-6 text-center text-white/60">
      Detailed visualization for GridWalker is coming soon.
    </GlassPanel>
  ),
};

export default function ModelDetailPage({ params }: PageProps) {
  const resolved = use(params);
  const slug = resolved.slug as ModelSlug;
  const meta = modelLookup[slug];

  if (!meta) {
    notFound();
  }

  const Experience = experienceRegistry[slug];

  if (!Experience) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 pb-20 pt-10 text-white">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/selection"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hub
          </Link>
          <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/50">
            {meta.category}
          </span>
        </div>
        <header className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.4em] text-white/40">
              {meta.type}
            </p>
            <h1 className="text-4xl font-semibold sm:text-5xl">{meta.name}</h1>
            <p className="text-lg text-white/65">{meta.subtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <GlassPanel className="p-6">
              <Sparkles className="mb-3 h-6 w-6 text-white/60" />
              <p className="text-sm text-white/60">Overview</p>
              <p className="mt-2 text-white/80">{meta.description}</p>
            </GlassPanel>
            <GlassPanel className="p-6">
              <Atom className="mb-3 h-6 w-6 text-white/60" />
              <p className="text-sm text-white/60">Visualization mode</p>
              <p className="mt-2 text-white/80">
                Tailored cinematic interface capturing the exact interpretability
                hooks described in the mission brief.
              </p>
            </GlassPanel>
            <GlassPanel className="p-6">
              <Network className="mb-3 h-6 w-6 text-white/60" />
              <p className="text-sm text-white/60">Interactions</p>
              <p className="mt-2 text-white/80">
                Fully client-side mockups with live sliders, gauges, and attention heatmaps.
              </p>
            </GlassPanel>
          </div>
        </header>
        <Experience />
      </div>
    </div>
  );
}

