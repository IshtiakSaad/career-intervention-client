import { RAGDashboardWidget } from "./RAGDashboardWidget";
import { Heading } from "@shared/ui";
import { cn } from "@shared/lib/utils";
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export const RAGMentorshipSearch = () => {
    return (
        <section className="w-full bg-brand-obsidian py-24 border-b border-white/5 relative overflow-hidden">
            {/* Background Texture - Small Grid matches the Hero but slightly different */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#a3e635_1px,transparent_1px),linear-gradient(to_bottom,#a3e635_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
                {/* Left: The Engine Widget */}
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <RAGDashboardWidget />
                </div>

                {/* Right: The Marketing Copy */}
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left gap-8">
                    <div className="flex flex-col gap-4">
                        <span className={cn("text-[10px] font-black text-brand-acid uppercase tracking-[0.3em]", geistMono.className)}>
                            HYPER-PERSONALIZED MATCHING
                        </span>
                        <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.95] max-w-xl">
                            RAG-Based AI <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-acid to-cyan-400">Mentorship Search.</span>
                        </Heading>
                    </div>

                    <p className="text-lg md:text-base text-gray-400 leading-relaxed max-w-lg">
                        We don&apos;t just filter by tags. Our AI analyzes your career trajectory, past projects, and desired end-state to match you with the 0.1% of mentors who have actually walked your specific path.
                    </p>

                    {/* Features Checklist */}
                    <div className={cn("flex flex-col gap-5 text-sm font-bold uppercase tracking-widest", geistMono.className)}>
                        <div className="flex items-start gap-4">
                            <span className="w-4 h-4 rounded-full bg-brand-acid/10 border border-brand-acid flex items-center justify-center text-[10px] text-brand-acid mt-0.5">
                                ✓
                            </span>
                            <span className="text-gray-300">Latent semantic search across 5,000+ elite mentors</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="w-4 h-4 rounded-full bg-brand-acid/10 border border-brand-acid flex items-center justify-center text-[10px] text-brand-acid mt-0.5">
                                ✓
                            </span>
                            <span className="text-gray-300">Experience vector alignment for technical compatibility</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="w-4 h-4 rounded-full bg-brand-acid/10 border border-brand-acid flex items-center justify-center text-[10px] text-brand-acid mt-0.5">
                                ✓
                            </span>
                            <span className="text-gray-300">Goal-based intervention modeling</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
