import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PanelProps {
    children: ReactNode;
    className?: string;
}

export default function Panel({ children, className }: PanelProps) {
    return (
        <div className={cn("rounded-3xl bg-[#0A0C10]/80 backdrop-blur-xl border border-white/10 p-6", className)}>
            {children}
        </div>
    );
}
