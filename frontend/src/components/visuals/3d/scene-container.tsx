"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { View } from "@react-three/drei";

interface SceneContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function SceneContainer({ children, className }: SceneContainerProps) {
    return (
        <div className={className}>
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                className="h-full w-full"
            >
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </Canvas>
        </div>
    );
}
