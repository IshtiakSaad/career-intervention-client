"use client";

import { Geist_Mono } from "next/font/google";
import { cn } from "@shared/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { MentorFilters as FilterType } from "../types";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

interface MentorFiltersProps {
    onFilterChange: (filters: FilterType) => void;
    currentFilters: FilterType;
}

export const MentorFilters = ({ onFilterChange, currentFilters }: MentorFiltersProps) => {
    const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== currentFilters.searchTerm) {
                onFilterChange({ ...currentFilters, searchTerm });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, currentFilters, onFilterChange]);

    return (
        <div className="w-full flex flex-col md:flex-row items-center gap-4 bg-brand-obsidian p-4 border border-white/5 shadow-2xl relative">
            {/* Search Input */}
            <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-acid transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="RESEARCH LATENT TRAJECTORIES (NAME, BIO, COMPANY)..."
                    className={cn(
                        "w-full bg-black/40 border border-white/5 py-3 pl-12 pr-10 text-[10px] font-black text-white placeholder:text-gray-700 tracking-[0.2em] focus:outline-none focus:border-brand-acid/30 transition-all uppercase",
                        geistMono.className
                    )}
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Filter Toggle Controls */}
            <button className={cn(
                "flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-brand-acid/30 hover:text-brand-acid transition-all",
                geistMono.className
            )}>
                <SlidersHorizontal className="w-4 h-4" />
                Tactical Filters
            </button>
            
            <div className="hidden md:flex items-center gap-4 ml-auto">
                <span className={cn("text-[9px] text-gray-700 font-bold uppercase tracking-widest", geistMono.className)}>
                    SCANNING {currentFilters.searchTerm ? 'QUERY' : 'ALL_VECTORS'}...
                </span>
                <div className="w-2 h-2 bg-brand-acid animate-pulse shadow-[0_0_8px_#a3e635]"></div>
            </div>
        </div>
    );
};
