"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
import {
  categoryOrder,
  modelCatalog,
  type ModelCategory,
} from "@/data/model-catalog";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CubeVisual } from "@/components/visuals/cube-visual";
import { BlobVisual } from "@/components/visuals/blob-visual";
import { GridVisual } from "@/components/visuals/grid-visual";
import { ConstellationVisual } from "@/components/visuals/constellation-visual";
import { HelixVisual } from "@/components/visuals/helix-visual";
import { DualSphereVisual } from "@/components/visuals/dual-sphere-visual";
import { HyperplaneVisual } from "@/components/visuals/hyperplane-visual";
import { TreeVisual } from "@/components/visuals/tree-visual";
import { DataPlaneVisual } from "@/components/visuals/data-plane-visual";
import { CompassVisual } from "@/components/visuals/compass-visual";

type ModelHubProps = {
  onClose?: () => void;
  variant?: "overlay" | "page";
  backHref?: string;
  backLabel?: string;
};

export function ModelHub({
  onClose,
  variant = "overlay",
  backHref,
  backLabel = "Back to labs",
}: ModelHubProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<ModelCategory>("Vision");
  const [search, setSearch] = useState("");

  const filteredModels = modelCatalog[activeCategory].filter((model) =>
    model.name.toLowerCase().includes(search.toLowerCase()) ||
    model.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    model.type.toLowerCase().includes(search.toLowerCase())
  );

  const isOverlay = variant === "overlay";

  return (
    <div
      className={
        isOverlay
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-2xl"
          : "mx-auto w-full max-w-6xl px-6 pb-20"
      }
    >
      <GlassPanel
        intensity="high"
        className={`relative bg-[#070707]/90 p-10 ${isOverlay ? "w-full max-w-6xl" : "w-full"
          }`}
      >
        {isOverlay && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/5 text-white/70 hover:text-white"
            aria-label="Close model hub"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {!isOverlay && (backHref || onClose) && (
          <div className="mb-6 flex items-center justify-between">
            {backHref ? (
              <Link href={backHref}>
                <Button variant="outline" className="gap-2 rounded-full border-white/15 text-white/70 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </Button>
              </Link>
            ) : onClose ? (
              <Button
                variant="outline"
                onClick={onClose}
                className="gap-2 rounded-full border-white/15 text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            ) : null}
            <span className="text-xs uppercase tracking-[0.4em] text-white/40">
              Selection Hub
            </span>
          </div>
        )}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                Model Selection Hub
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                Choose your neural payload
              </h3>
              <p className="text-sm text-white/60">
                Portals categorized by modality. Hover to reveal launch states.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search models"
                  className="w-64 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categoryOrder.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2 text-sm uppercase tracking-[0.2em] transition ${activeCategory === category
                    ? "border border-white bg-white text-black"
                    : "border border-white/20 text-white/60 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
                No models match the query.
              </div>
            ) : (
              filteredModels.map((model) => (
                <Card
                  key={model.name}
                  className="group relative overflow-hidden bg-gradient-to-b from-white/5 to-white/0"
                >
                  <div className="mb-4 h-24 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition duration-500 group-hover:rotate-1 group-hover:scale-105">
                    {model.name === "VoxelStack" && <CubeVisual />}
                    {model.name === "LatentMorph" && <BlobVisual />}
                    {model.name === "PatchFlow" && <GridVisual />}
                    {model.name === "Attentio Core" && <ConstellationVisual />}
                    {model.name === "ChronoCoil" && <HelixVisual />}
                    {model.name === "TransFlow" && <DualSphereVisual />}
                    {model.name === "HyperSector" && <HyperplaneVisual />}
                    {model.name === "FractalLogic" && <TreeVisual />}
                    {model.name === "SimpleFit" && <DataPlaneVisual />}
                    {model.name === "GridWalker" && <CompassVisual />}
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    {model.type}
                  </p>
                  <h4 className="mt-3 text-2xl font-semibold text-white">
                    {model.name}
                  </h4>
                  <p className="text-sm text-white/55">{model.subtitle}</p>
                  <p className="mt-3 text-sm text-white/60">{model.description}</p>
                  <Button
                    variant="glass"
                    onClick={() => {
                      router.push(`/models/${model.slug}`);
                    }}
                    className="mt-6 w-full opacity-0 transition group-hover:opacity-100"
                  >
                    Launch
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

