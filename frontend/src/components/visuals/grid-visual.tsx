export function GridVisual() {
    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                {Array.from({ length: 36 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="border border-white/5"
                        style={{
                            animation: "pulse 3s ease-in-out infinite",
                            animationDelay: `${idx * 40}ms`,
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0">
                <svg className="h-full w-full stroke-white/30" viewBox="0 0 100 100">
                    <path
                        d="M10 30 L40 50 L70 20 L90 70"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="animate-pulse"
                    />
                </svg>
            </div>
        </div>
    );
}
