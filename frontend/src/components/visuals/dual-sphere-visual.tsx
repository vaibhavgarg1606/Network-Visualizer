export function DualSphereVisual() {
    return (
        <div className="relative flex h-full items-center justify-center gap-6">
            <div className="h-14 w-14 rounded-full border border-white/20 bg-white/5">
                <div className="h-full w-full animate-ping rounded-full bg-white/30" />
            </div>
            <div className="h-14 w-14 rounded-full border border-white/20 bg-white/10">
                <div className="h-full w-full animate-pulse rounded-full bg-white/40" />
            </div>
            <div className="absolute h-1 w-12 bg-white/20" />
        </div>
    );
}
