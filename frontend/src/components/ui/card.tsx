import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = true, children, ...props }, ref) => {
        return (
            <GlassPanel
                ref={ref}
                intensity="medium"
                className={cn(
                    "p-6",
                    hoverEffect && "hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
                    className
                )}
                {...props}
            >
                {children}
            </GlassPanel>
        );
    }
);

Card.displayName = "Card";
