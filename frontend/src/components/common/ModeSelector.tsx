import { Eye, ShieldAlert, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'normal' | 'adversarial' | 'gradcam';

interface ModeSelectorProps {
    mode: ViewMode;
    setMode: (mode: ViewMode) => void;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-[#14161C]/90 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
                <button
                    onClick={() => setMode('normal')}
                    className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        mode === 'normal' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Eye className="w-4 h-4" />
                    Normal
                </button>
                <button
                    onClick={() => setMode('adversarial')}
                    className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        mode === 'adversarial' ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    )}
                >
                    <ShieldAlert className="w-4 h-4" />
                    Attack
                </button>
                <button
                    onClick={() => setMode('gradcam')}
                    className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        mode === 'gradcam' ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]" : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                    )}
                >
                    <Mountain className="w-4 h-4" />
                    Grad-CAM
                </button>
            </div>
        </div>
    );
}
