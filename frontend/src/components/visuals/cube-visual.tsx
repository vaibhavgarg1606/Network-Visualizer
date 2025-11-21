export function CubeVisual() {
    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="relative flex h-20 w-20 animate-spin-slow items-center justify-center">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="absolute h-full w-full rounded-[12px] border border-white/15"
                        style={{
                            transform: `rotateX(${idx * 15}deg) rotateY(${idx * 15}deg)`,
                            boxShadow: "inset 0 0 20px rgba(255,255,255,0.08)",
                        }}
                    />
                ))}
                <div className="absolute h-full w-full rounded-[12px] bg-gradient-to-br from-white/10 via-white/5 to-transparent blur" />
            </div>
        </div>
    );
}
