"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ModelHub } from "@/components/model-hub";

export default function SelectionPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#030303] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/10 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 space-y-10">
        <button
          onClick={() => router.push("/demo")}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to command deck
        </button>
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-white/45">
            NeuroVision model library
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold sm:text-5xl">
                Choose a model to explore
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                Browse curated models across vision, language, and tabular tasks.
                Hover to preview, launch to open interactive detail pages.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/60">
                <Sparkles className="h-4 w-4" />
                Curated decks
              </div>
              <p className="mt-2 text-3xl font-semibold text-white">5 decks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-24">
        <ModelHub variant="page" />
      </div>
    </div>
  );
}


