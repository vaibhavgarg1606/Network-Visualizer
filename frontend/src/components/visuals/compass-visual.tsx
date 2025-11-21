export function CompassVisual() {
    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="h-16 w-16 animate-flip rounded-lg border border-white/20">
                <div className="absolute inset-2 border border-white/10" />
                <div className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white" />
                <div className="absolute left-1/2 top-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 bg-white" />
            </div>
        </div>
    );
}
