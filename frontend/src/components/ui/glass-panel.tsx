"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  intensity?: "low" | "medium" | "high";
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({
  intensity = "medium",
  children,
  className,
  ...props
}: GlassPanelProps) {
  const intensityStyles = {
    low: "bg-white/5 backdrop-blur-sm border-white/5",
    medium: "bg-white/10 backdrop-blur-md border-white/10",
    high: "bg-white/15 backdrop-blur-lg border-white/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-3xl border shadow-xl",
        intensityStyles[intensity],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
