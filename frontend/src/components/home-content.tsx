import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
import { stats, features, labs, researchCards } from "@/data/home-data";
import { Card } from "@/components/ui/card";

type HomeContentProps = {
  showHero?: boolean;
};

export function HomeContent({ showHero = true }: HomeContentProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {showHero && <HeroSection stats={stats} />}

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/45">
            Core Features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Explore NeuroVision
          </h2>
          <p className="text-lg text-white/65">
            Understand how NeuroVision, a university minor project, helps you
            visualize and interpret machine learning models in a clear and
            structured way.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
          {researchCards.map((card) => (
            <Card
              key={card.title}
              className="bg-[#0b0b0b] p-8 backdrop-blur-2xl"
            >
              <card.icon className="h-12 w-12 text-white" />
              <h3 className="mt-6 text-2xl font-semibold text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-white/65">{card.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/45">
              Project Details
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Capabilities &amp; Roadmap
            </h2>
            <p className="text-lg text-white/65">
              See what the current version of NeuroVision can do today, and how
              we plan to extend it with additional models and interpretability
              tools over time.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-[#0b0b0b] p-8 backdrop-blur"
              >
                <feature.icon className="mb-6 h-10 w-10 text-white" />
                <h3 className="text-2xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 text-white/65">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/45">
              Datasets &amp; Experiments
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Hands-on labs with real data
            </h2>
            <p className="text-lg text-white/65">
              Work with standard vision datasets and interactive experiments to
              understand how different models behave on real examples.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {labs.map((lab) => (
              <Card
                key={lab.title}
                className="overflow-hidden p-0 bg-[#0b0b0b] backdrop-blur"
                hoverEffect={true}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={lab.image}
                    alt={lab.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <p className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/55">
                    {lab.tag}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {lab.title}
                  </h3>
                  <p className="mt-2 text-white/65">{lab.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

