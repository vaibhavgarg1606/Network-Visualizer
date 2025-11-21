import {
    BrainCircuit,
    BrainCog,
    Cpu,
    Orbit,
    ShieldAlert,
    Sparkles,
    Stars,
} from "lucide-react";

export const stats = [
    { label: "Models analyzed", value: "10M+" },
    { label: "Researchers", value: "500K+" },
    { label: "Neural probes / sec", value: "2.4B" },
    { label: "Global uptime", value: "99.99%" },
];

export const features = [
    {
        title: "Neural Visualization",
        description:
            "Volumetric reconstructions, orbit cameras, and real-time activation scrubbing in one cinematic viewport.",
        icon: BrainCircuit,
    },
    {
        title: "GPU Acceleration",
        description:
            "Petaflop-grade CUDA swarms streaming interpretability layers at 240fps across multi-cloud constellations.",
        icon: Cpu,
    },
    {
        title: "Signal Intelligence",
        description:
            "Anomaly atlases, bias telemetry, and compliance heatmaps stitched into your mission control.",
        icon: Sparkles,
    },
    {
        title: "Quantum Nodes",
        description:
            "Federated experiments that route through quantum-inspired relay stations for zero-trust collaboration.",
        icon: Orbit,
    },
];

export const labs = [
    {
        title: "Atlas Vault",
        description:
            "140+ PB of curated multi-modal datasets with provenance tracking and cognitive fingerprints.",
        tag: "Verified",
        image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop",
    },
    {
        title: "Orbit Compute",
        description:
            "Elastic GPU constellations routed through carbon-aware zones and tuned for long-haul inference.",
        tag: "Green Compute",
        image:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
    },
    {
        title: "Signal Commons",
        description:
            "Community labs with peer-reviewed starter kits, telemetry templates, and lucide-grade iconography.",
        tag: "Open Source",
        image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop",
    },
];

export const researchCards = [
    {
        title: "Glassbox Anatomy",
        description:
            "Peel back every layer of the model stack with translucent volumetrics, 3D attention clusters, and synapse-level playback.",
        icon: BrainCog,
    },
    {
        title: "Adversarial Robustness",
        description:
            "Stress-test mission-critical systems with live adversarial barrages, shield metrics, and automated remediation flows.",
        icon: ShieldAlert,
    },
    {
        title: "Latent Space Cartography",
        description:
            "Plot hyperspace trajectories across your embeddings using holographic star maps, drift waypoints, and curiosity probes.",
        icon: Stars,
    },
];
