import { BrainCircuit, BrainCog, Cpu, Sparkles, Stars } from "lucide-react";

export const stats = [
  { label: "Models", value: "5 integrated" },
  { label: "Architectures", value: "CNN & Classical" },
  { label: "Team", value: "3 students" },
  { label: "Roadmap", value: "RNN, LSTM, Transformers" },
];

export const features = [
  {
    title: "CNN Visualization",
    description:
      "Inspect convolutional layers, feature maps, and predictions from CNN-based vision models used in the project.",
    icon: BrainCircuit,
  },
  {
    title: "Classical ML Models",
    description:
      "Compare neural networks with baseline classical models such as logistic regression and SVMs on the same tasks.",
    icon: BrainCog,
  },
  {
    title: "Playground Mode",
    description:
      "Experiment with different inputs, observe outputs, and build intuition for how models behave without writing code.",
    icon: Sparkles,
  },
  {
    title: "Upcoming Enhancements",
    description:
      "Planned support for sequence models and additional interpretability views as part of the ongoing university minor project.",
    icon: Stars,
  },
];

export const labs = [
  {
    title: "MNIST Classification Lab",
    description:
      "Explore how a CNN learns to recognize handwritten digits using the MNIST dataset, with layer-wise visualizations.",
    tag: "Available now",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200&auto=format&fit=crop",
  },
  {
    title: "CIFAR-10 Vision Lab (Planned)",
    description:
      "Planned extension of the platform to small natural images using CIFAR-10 for more complex vision experiments.",
    tag: "Planned",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200&auto=format&fit=crop",
  },
  {
    title: "Classical ML Playground",
    description:
      "Interactive space to compare simple machine learning models with deep learning approaches on the same datasets.",
    tag: "In progress",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop",
  },
];

export const researchCards = [
  {
    title: "Model Architecture View",
    description:
      "See an overview of each model’s structure, including layers, connections, and key configuration details.",
    icon: BrainCircuit,
  },
  {
    title: "Activation & Prediction Heatmaps",
    description:
      "Visualize intermediate activations and output confidence to understand what the model focuses on.",
    icon: Sparkles,
  },
  {
    title: "Dataset & Input Preview",
    description:
      "Inspect sample inputs, labels, and preprocessing steps to understand how data flows through the system.",
    icon: Cpu,
  },
];
