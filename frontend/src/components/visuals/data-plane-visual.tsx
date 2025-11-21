export function DataPlaneVisual() {
    return (
        <div className="relative h-full w-full rounded-2xl border border-white/15 bg-gradient-to-br from-white/5 to-transparent">
            {Array.from({ length: 8 }).map((_, idx) => (
                <span
                    key={idx}
                    className="absolute h-2 w-2 rounded-full bg-white"
                    style={{
                        left: `${10 + idx * 10 + Math.random() * 8}%`,
                        top: `${20 + Math.random() * 50}%`,
                    }}
                />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-0.5 w-4/5 origin-left animate-spin-slow bg-white/70" />
            </div>
        </div>
    );
}
