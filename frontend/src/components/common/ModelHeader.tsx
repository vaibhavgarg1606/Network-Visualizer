import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCard {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface ModelHeaderProps {
    title: string;
    description: string;
    infoCards: InfoCard[];
    styles: {
        accent: string;
    };
}

export default function ModelHeader({ title, description, infoCards, styles }: ModelHeaderProps) {
    return (
        <header className="space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">Vision</span>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{title}</h1>
                    <p className="text-xl text-gray-400 max-w-2xl">{description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {infoCards.map((card, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <card.icon className={cn("w-6 h-6 mb-4", styles.accent)} />
                            <h3 className="text-sm font-medium text-white mb-2">{card.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}
