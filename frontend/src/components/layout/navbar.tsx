"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, Home } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { name: "Home", href: "/demo", icon: Home },
    { name: "Models", href: "/selection", icon: LayoutGrid },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
            <div className="glass-panel flex items-center gap-1 rounded-full border border-white/10 px-2 py-2 shadow-2xl backdrop-blur-xl">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                                isActive ? "text-white" : "text-white/60 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="navbar-active"
                                    className="absolute inset-0 rounded-full bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-1 ring-inset ring-white/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
