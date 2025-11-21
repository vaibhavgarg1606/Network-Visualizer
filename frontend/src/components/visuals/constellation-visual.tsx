export function ConstellationVisual() {
    return (
        <div className="relative h-full">
            <div className="absolute inset-0">
                {Array.from({ length: 12 }).map((_, idx) => (
                    <span
                        key={idx}
                        className="absolute h-1.5 w-1.5 rounded-full bg-white/70"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
                <div className="absolute inset-0 animate-pulse border border-white/10" />
            </div>
        </div>
    );
}
