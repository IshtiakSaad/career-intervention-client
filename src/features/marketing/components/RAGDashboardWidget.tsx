"use client";

import { Geist_Mono } from "next/font/google";
import { cn } from "@shared/lib/utils";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

interface MentorCardProps {
    name: string;
    role: string;
    company: string;
    specialty: string;
    match: number;
    isLoading?: boolean;
    loadingText?: string;
}

const MentorMatchCard = ({ name, role, company, specialty, match, isLoading, loadingText }: MentorCardProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-sm"></div>
                <div className="flex-1 space-y-2">
                    <div className={cn("text-[10px] text-brand-acid uppercase tracking-widest font-bold", geistMono.className)}>
                        {loadingText || "ANALYZING LATENT EXPERIENCE VECTORS..."}
                    </div>
                    <div className="h-1 bg-white/5 w-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-brand-acid/20 animate-scan"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-brand-acid/30 hover:bg-white/[0.07] transition-all duration-300">
            {/* Avatar Placeholder */}
            <div className="w-12 h-12 bg-zinc-800 border border-brand-acid/10 flex items-center justify-center text-zinc-600 font-bold overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-acid/5 to-transparent"></div>
                 {name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{name}</h4>
                    <span className={cn("text-[10px] font-black text-brand-acid px-2 py-0.5 border border-brand-acid/20", geistMono.className)}>
                        {match}% MATCH
                    </span>
                </div>
                <p className="text-[11px] text-gray-400 truncate tracking-wide">
                    {role} @ <span className="text-gray-300">{company}</span> &bull; {specialty}
                </p>
                <div className="mt-2 h-0.5 bg-white/5 w-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-acid shadow-[0_0_8px_#a3e635]" 
                        style={{ width: `${match}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export const RAGDashboardWidget = () => {
    return (
        <div className="w-full max-w-lg bg-brand-obsidian border border-white/10 p-1 shadow-2xl relative">
            {/* Inner Glow / Scanline layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                 <div className="absolute inset-x-0 h-[100px] bg-gradient-to-b from-brand-acid/10 to-transparent top-0"></div>
            </div>

            {/* Widget Content */}
            <div className="bg-black/40 p-4 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-acid/10 border border-brand-acid/20 flex items-center justify-center">
                            <span className="text-brand-acid text-xs font-bold">∑</span>
                        </div>
                        <div>
                             <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">
                                 Socrates <span className="text-brand-acid">RAG-Engine</span>
                             </h3>
                             <p className={cn("text-[9px] text-brand-acid/60 font-bold uppercase mt-1", geistMono.className)}>
                                 PROCESSING INTENT...
                             </p>
                        </div>
                    </div>
                    <span className={cn("text-[9px] text-gray-600 font-bold", geistMono.className)}>
                        V.2.0.4.4
                    </span>
                </div>

                {/* Profiles List */}
                <div className="flex flex-col gap-3">
                    <MentorMatchCard 
                        name="Marcus V." 
                        role="Staff Engineer" 
                        company="Stripe" 
                        specialty="Platform Scale"
                        match={98}
                    />
                    <MentorMatchCard 
                        name="Elena K." 
                        role="VP Product" 
                        company="Meta" 
                        specialty="AI Infrastructure"
                        match={94}
                    />
                    {/* Blinking Placeholder Card */}
                    <MentorMatchCard 
                        name="" 
                        role="" 
                        company="" 
                        specialty=""
                        match={0}
                        isLoading={true}
                    />
                </div>
            </div>
        </div>
    );
};
