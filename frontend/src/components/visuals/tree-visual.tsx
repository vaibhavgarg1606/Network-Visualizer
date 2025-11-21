export function TreeVisual() {
    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="relative h-20 w-20">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="absolute left-1/2 h-1 w-10 -translate-x-1/2 rounded-full border border-white/20"
                        style={{
                            top: `${idx * 12 + 10}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
