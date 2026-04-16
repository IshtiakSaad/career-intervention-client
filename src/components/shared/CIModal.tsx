"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CIModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    size?: "md" | "lg" | "xl"; // md: lg (standard), lg: 2xl, xl: 4xl
}

/**
 * CIModal (Career Intervention Modal)
 * A premium, glassmorphism-inspired modal component for dashboard management.
 */
export const CIModal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
    size = "md"
}: CIModalProps) => {
    
    const sizeClasses = {
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    };
    
    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden"; // Trap scroll
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-brand-obsidian/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                className={cn(
                    "relative w-full bg-brand-obsidian/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300",
                    sizeClasses[size],
                    className
                )}
            >
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-acid/0 via-brand-acid to-brand-acid/0 opacity-50" />

                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-muted-foreground/60 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-brand-acid"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-8">
                    {children}
                </div>
            </div>
        </div>
    );
};
