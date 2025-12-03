export type ModelCategory = "Vision" | "Language" | "Tabular" | "Agents";

export type ModelSlug =
  | "voxelstack"
  | "latentmorph"
  | "patchflow"
  | "attentio-core"
  | "chronocoil"
  | "transflow"
  | "hypersector"
  | "fractallogic"
  | "simplefit"
  | "gridwalker"
  | "mnist";

export type ModelCard = {
  name: string;
  slug: ModelSlug;
  type: string;
  subtitle: string;
  description: string;
  status?: "available" | "planned";
};

export const categoryOrder: ModelCategory[] = [
  "Vision",
  "Language",
  "Tabular",
  "Agents",
];

export const modelCatalog: Record<ModelCategory, ModelCard[]> = {
  Vision: [
    {
      name: "VoxelStack",
      slug: "voxelstack",
      type: "CNN (ImageNet)",
      subtitle: "Hierarchical Spatial Analysis",
      description:
        "Rotating layered cube showing spatial convolutions lighting in sequence.",
    },
    {
      name: "MNIST CNN",
      slug: "mnist",
      type: "CNN (MNIST)",
      subtitle: "Handwritten Digit Classification",
      description:
        "End-to-end pipeline for classifying MNIST digits with layer-wise visualizations and live predictions.",
      status: "available",
    },
    {
      name: "PatchFlow",
      slug: "patchflow",
      type: "ViT (Vision Transformer)",
      subtitle: "Attention Over Image Patches",
      description:
        "Floating tiled grid with pulsating connectors representing patch attention.",
      status: "planned",
    },
    {
      name: "LatentMorph",
      slug: "latentmorph",
      type: "VAE (Generative)",
      subtitle: "Generative Manifold Mapping",
      description:
        "Liquid sphere warping between cube, orb, and prism to mimic latent shifts.",
      status: "planned",
    },
  ],
  Language: [
    {
      name: "Attentio Core",
      slug: "attentio-core",
      type: "Transformer (BERT/GPT)",
      subtitle: "Contextual Embedding Matrix",
      description:
        "Constellation web of nodes shifting brightness like multi-head attention.",
      status: "planned",
    },
    {
      name: "ChronoCoil",
      slug: "chronocoil",
      type: "LSTM/RNN",
      subtitle: "Sequential State Memory",
      description:
        "Neon helix with traveling light showing looping temporal memory.",
      status: "planned",
    },
    {
      name: "TransFlow",
      slug: "transflow",
      type: "Seq2Seq (Encoder/Decoder)",
      subtitle: "Translation Sequence Generation",
      description:
        "Dual spheres transferring volume from encoder to decoder flows.",
      status: "planned",
    },
  ],
  Tabular: [
    {
      name: "HyperSector",
      slug: "hypersector",
      type: "SVM",
      subtitle: "Optimal Boundary Maximization",
      description:
        "Bisected orb with razor-thin neon hyperplane dividing decision regions.",
      status: "planned",
    },
    {
      name: "FractalLogic",
      slug: "fractallogic",
      type: "Decision Tree",
      subtitle: "Hierarchical Splitting Engine",
      description:
        "Crystal tree rotating with glowing paths highlighting decision routes.",
      status: "planned",
    },
    {
      name: "SimpleFit",
      slug: "simplefit",
      type: "Linear Regression",
      subtitle: "Linear Predictive Modeling",
      description:
        "Data plane with rotating glowing line fitting scattered minimal points.",
      status: "planned",
    },
  ],
  Agents: [
    {
      name: "GridWalker",
      slug: "gridwalker",
      type: "DQN",
      subtitle: "Policy Optimization",
      description:
        "Prismatic compass snapping to cardinal points as actions fire.",
      status: "planned",
    },
  ],
};

export const modelLookup = Object.entries(modelCatalog).reduce<
  Record<ModelSlug, ModelCard & { category: ModelCategory }>
>((acc, [category, cards]) => {
  cards.forEach((model) => {
    acc[model.slug] = { ...model, category: category as ModelCategory };
  });
  return acc;
}, {} as Record<ModelSlug, ModelCard & { category: ModelCategory }>);


