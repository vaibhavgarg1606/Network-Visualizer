export function HyperplaneVisual() {
    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border border-white/15" />
                <div className="absolute inset-0 rounded-full border border-white/10 translate-x-1 translate-y-1" />
                <div className="absolute inset-0 h-full w-[2px] scale-y-125 translate-x-10 bg-white/70" />
            </div>
        </div>
    );
}
