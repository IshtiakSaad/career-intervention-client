"use client";

import { useEffect, useState, useCallback } from "react";
import { Mentor, MentorFilters as FilterType } from "@features/mentors/types";
import { MentorService } from "@features/mentors/api/mentor-service";
import { MentorGrid } from "@features/mentors/components/MentorGrid";
import { MentorFilters } from "@features/mentors/components/MentorFilters";
import { Heading } from "@shared/ui";
import { Geist_Mono } from "next/font/google";
import { cn } from "@shared/lib/utils";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterType>({
        page: 1,
        limit: 12,
        searchTerm: "",
    });

    const fetchMentors = useCallback(async (currentFilters: FilterType) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await MentorService.getAllMentors(currentFilters);
            if (response.success) {
                setMentors(response.data);
            } else {
                setError(response.message || "Failed to fetch tactical data.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connection attempt refused.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMentors(filters);
    }, [filters, fetchMentors]);

    const handleFilterChange = (newFilters: FilterType) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex flex-col flex-1 w-full relative min-h-screen">
            {/* Design Elements: Gids and Glows */}
            <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-brand-acid/5 to-transparent pointer-events-none opacity-20"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#a3e635_1px,transparent_1px),linear-gradient(to_bottom,#a3e635_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>

            <main className="container mx-auto px-4 py-16 relative z-10">
                {/* Page Header */}
                <div className="flex flex-col gap-6 mb-16 max-w-4xl">
                    <div className="flex items-center gap-4">
                        <span className={cn("text-[10px] font-black text-brand-acid uppercase tracking-[0.4em] px-3 py-1 bg-brand-acid/10 border border-brand-acid/20", geistMono.className)}>
                            MENTOR_DIRECTORY_V2.0
                        </span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-acid/30 to-transparent"></div>
                    </div>
                    
                    <Heading level={1} className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                        Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-acid to-blue-400">Career Mentors.</span><br />
                        Tactical Intervention.
                    </Heading>
                    
                    <p className="text-xl md:text-lg text-gray-400 leading-relaxed max-w-2xl">
                        Browse the network of 5,000+ top-tier industry veterans ready to deploy career-saving interventions. Our RAG engine ranks matches based on latent trajectory alignment.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="mb-12 sticky top-32 z-40">
                    <MentorFilters 
                        onFilterChange={handleFilterChange} 
                        currentFilters={filters} 
                    />
                </div>

                {/* Main Content Area */}
                <div className="relative">
                    {/* Error State */}
                    {error && (
                        <div className="mb-8 p-6 bg-red-500/5 border border-red-500/20 text-red-500 flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">CRITICAL_ERROR</span>
                            <p className="text-sm font-bold uppercase">{error}</p>
                        </div>
                    )}

                    {/* Mentors Grid */}
                    <MentorGrid mentors={mentors} isLoading={isLoading} />
                </div>
            </main>
        </div>
    );
}
