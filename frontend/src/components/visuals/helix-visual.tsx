export function HelixVisual() {
    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="relative h-24 w-12">
                <div className="absolute inset-0 border border-white/20" />
                <div className="absolute inset-0 animate-spin-slow text-white/60">
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <span
                            key={idx}
                            className="absolute h-1.5 w-1.5 rounded-full bg-white"
                            style={{
                                left: idx % 2 === 0 ? "0" : "calc(100% - 6px)",
                                top: `${(idx / 12) * 100}%`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
