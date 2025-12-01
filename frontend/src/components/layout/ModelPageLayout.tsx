import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModelPageLayoutProps {
    theme: {
        bg: string;
        theme: string;
        bleed: string;
    };
    header: ReactNode;
    leftPanel: ReactNode;
    centerPanel: ReactNode;
    rightPanel: ReactNode;
    bottomControls: ReactNode;
}

export default function ModelPageLayout({ theme, header, leftPanel, centerPanel, rightPanel, bottomControls }: ModelPageLayoutProps) {
    return (
        <main className={cn("relative w-full min-h-screen overflow-y-auto text-white transition-colors duration-700 selection:bg-white/20 pb-24", theme.bg, theme.theme)}>
            {/* Background Bleed Effect */}
            <div className={cn("fixed inset-0 z-0 opacity-20 transition-all duration-1000 pointer-events-none", theme.bleed)} />

            <div className="relative z-10 max-w-[1800px] mx-auto p-6 space-y-8">
                {header}

                {/* Main Playground Interface - 3 Panels */}
                <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
                    {/* Left Panel: Input & Controls */}
                    <div className="w-full lg:w-[320px] flex flex-col gap-4 h-full shrink-0">
                        {leftPanel}
                    </div>

                    {/* Center Panel: Visualization */}
                    <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl min-h-[400px]">
                        {centerPanel}
                    </div>

                    {/* Right Panel: Output & Inspection */}
                    <div className={cn("w-full lg:w-[350px] rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col h-full overflow-hidden shrink-0", theme.theme, theme.bg)}>
                        {rightPanel}
                    </div>
                </div>

                {bottomControls}
            </div>
        </main>
    );
}
