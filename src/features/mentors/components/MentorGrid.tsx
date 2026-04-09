"use client";

import { Mentor } from "../types";
import { MentorCard } from "./MentorCard";
import { Geist_Mono } from "next/font/google";
import { cn } from "@shared/lib/utils";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

interface MentorGridProps {
    mentors: Mentor[];
    isLoading?: boolean;
}

export const MentorGrid = ({ mentors, isLoading }: MentorGridProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-brand-obsidian border border-white/5 p-4 animate-pulse h-64 relative overflow-hidden">
                        <div className="flex gap-5 mb-5">
                            <div className="w-20 h-20 bg-white/5 border border-white/10"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-white/5 w-3/4"></div>
                                <div className="h-3 bg-white/5 w-1/2"></div>
                                <div className="h-3 bg-white/5 w-2/3"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <div className="h-6 bg-white/5 w-16"></div>
                             <div className="h-6 bg-white/5 w-20"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (mentors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 bg-black/20">
                <div className="w-16 h-16 bg-brand-acid/5 border border-brand-acid/20 flex items-center justify-center mb-6">
                    <span className="text-brand-acid text-2xl font-black">!</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
                    Zero Latent Matches Found
                </h3>
                <p className="text-gray-500 text-sm max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                    The RAG-Engine could not find any mentors matching your current search parameters.
                </p>
                <button 
                    onClick={() => window.location.reload()} 
                    className={cn("mt-8 text-xs font-black text-brand-acid uppercase tracking-widest hover:text-white transition-colors underline underline-offset-8", geistMono.className)}
                >
                    RESET SEARCH PARAMETERS
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
            ))}
        </div>
    );
};
