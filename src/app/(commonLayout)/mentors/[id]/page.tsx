"use client";

import { useEffect, useState, use } from "react";
import { Mentor } from "@features/mentors/types";
import { MentorService } from "@features/mentors/api/mentor-service";
import { Heading } from "@shared/ui";
import { Geist_Mono } from "next/font/google";
import { cn } from "@shared/lib/utils";
import Image from "next/image";
import { 
    ChevronLeft, 
    Star, 
    Briefcase, 
    MapPin, 
    ShieldCheck, 
    Calendar, 
    MessageSquare,
    Zap,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export default function MentorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMentor = async () => {
            setIsLoading(true);
            try {
                const response = await MentorService.getSingleMentor(id);
                if (response.success) {
                    setMentor(response.data);
                } else {
                    setError(response.message || "Failed to retrieve latent profile.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Protocol connection error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMentor();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-obsidian flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-brand-acid/20 border-t-brand-acid animate-spin rounded-full"></div>
                    <span className={cn("text-[10px] text-brand-acid font-black uppercase tracking-[0.3em]", geistMono.className)}>
                        DECRYPTING_PROFILE_VECTORS...
                    </span>
                </div>
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="min-h-screen bg-brand-obsidian flex flex-col items-center justify-center p-4">
                <Heading level={2} className="text-red-500 mb-4 uppercase tracking-tighter">ERROR::ACCESS_DENIED</Heading>
                <p className="text-gray-500 mb-8 uppercase text-xs tracking-widest font-bold">{error || "PROFILE_NOT_FOUND"}</p>
                <Link href="/mentors" className="text-brand-acid border border-brand-acid/20 px-6 py-2 uppercase text-[10px] font-black tracking-widest hover:bg-brand-acid/5 scale-100 active:scale-95 transition-all">
                    RETURN TO DIRECTORY
                </Link>
            </div>
        );
    }

    const { user, mentorSpecialties, designation, currentWorkingPlace, bio, experience, verificationBadge, ratingAverage, ratingCount } = mentor;

    return (
        <div className="min-h-screen bg-brand-obsidian text-white selection:bg-brand-acid selection:text-black">
            {/* Top Navigation Bar */}
            <div className="sticky top-16 z-40 w-full bg-brand-obsidian/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/mentors" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-acid transition-colors">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Command Center
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className={cn("text-[8px] text-gray-600 font-bold uppercase", geistMono.className)}>
                            PROTECTED_INTEL // ID_{id.slice(0, 8)}
                        </span>
                        <div className="w-2 h-2 bg-brand-acid shadow-[0_0_8px_#a3e635] animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
                    {/* Left Column: Tactical Identity & Metrics */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Hero Header */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                             <div className="relative w-40 h-40 flex-shrink-0 group">
                                 <div className="absolute inset-0 border-2 border-brand-acid/20 group-hover:border-brand-acid transition-colors duration-500"></div>
                                 <div className="absolute -inset-2 border border-brand-acid/10 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                                 {user.profileImageUrl ? (
                                     <Image 
                                        src={user.profileImageUrl} 
                                        alt={user.name} 
                                        fill 
                                        className="object-cover p-2 grayscale group-hover:grayscale-0 transition-all duration-700"
                                     />
                                 ) : (
                                     <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-5xl font-black text-brand-acid/20 uppercase italic">
                                         {user.name.charAt(0)}
                                     </div>
                                 )}
                             </div>

                             <div className="flex-1 space-y-4">
                                 <div className="flex flex-wrap items-center gap-3">
                                     <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                                         {user.name}
                                     </h1>
                                     {verificationBadge && (
                                         <div className="bg-brand-acid text-black px-2 py-1 flex items-center gap-1">
                                             <ShieldCheck className="w-4 h-4" />
                                             <span className="text-[10px] font-black uppercase tracking-widest">VERIFIED_ELITE</span>
                                         </div>
                                     )}
                                 </div>

                                 <div className="flex flex-col gap-2">
                                     <div className="flex items-center gap-3 text-brand-acid">
                                         <Briefcase className="w-5 h-5" />
                                         <span className="text-xl font-bold uppercase tracking-tight">{designation}</span>
                                     </div>
                                     <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-sm">
                                         <MapPin className="w-4 h-4" />
                                         {currentWorkingPlace}
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className={cn("text-[10px] font-black text-brand-acid tracking-[0.3em] uppercase", geistMono.className)}>
                                    STRATEGIC_DOSSIER
                                </span>
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                            </div>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                                {bio || "Initial latent bio vector not provided. This operative maintains high operational security regarding their origin profile."}
                            </p>
                        </div>

                        {/* Specialties Grid */}
                        <div className="space-y-8">
                             <div className="flex items-center gap-4">
                                <span className={cn("text-[10px] font-black text-brand-acid tracking-[0.3em] uppercase", geistMono.className)}>
                                    SEMANTIC_EXPERT_DOMAINS
                                </span>
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                             </div>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                 {mentorSpecialties && mentorSpecialties.length > 0 ? (
                                     mentorSpecialties.map((spec, i) => (
                                         <div key={i} className="bg-white/[0.02] border border-white/5 p-4 group hover:border-brand-acid/30 transition-all">
                                             <div className="flex items-center justify-between mb-4">
                                                 <div className="w-6 h-6 bg-brand-acid/10 border border-brand-acid/20 flex items-center justify-center">
                                                     <Zap className="w-3 h-3 text-brand-acid" />
                                                 </div>
                                                 <span className={cn("text-[9px] text-gray-600 font-bold", geistMono.className)}>
                                                     #{i + 1}
                                                 </span>
                                             </div>
                                             <h4 className="font-black text-sm uppercase tracking-widest group-hover:text-brand-acid transition-colors">
                                                 {spec.specialty.name}
                                             </h4>
                                         </div>
                                     ))
                                 ) : (
                                     <div className="col-span-full py-8 border border-dashed border-white/5 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                         NO_SPECIALTY_VECTORS_LOADED
                                     </div>
                                 )}
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Deployment Control Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-40 bg-brand-obsidian border border-brand-acid/20 p-8 shadow-[0_0_50px_rgba(163,230,53,0.05)] relative overflow-hidden group">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[radial-gradient(#a3e635_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none"></div>

                            <div className="relative z-10 space-y-8">
                                <div className="space-y-2">
                                    <div className={cn("flex justify-between items-end", geistMono.className)}>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">MATCH_PROBABILITY</span>
                                        <span className="text-brand-acid font-black text-xl">98%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 w-full">
                                        <div className="h-full bg-brand-acid shadow-[0_0_10px_#a3e635] w-[98%]"></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 border border-white/5">
                                        <div className={cn("text-[9px] text-gray-600 font-bold uppercase mb-1", geistMono.className)}>RATING</div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-brand-acid fill-brand-acid" />
                                            <span className="text-xl font-black">{ratingAverage.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 border border-white/5">
                                        <div className={cn("text-[9px] text-gray-600 font-bold uppercase mb-1", geistMono.className)}>EXPERIENCE</div>
                                        <div className="text-xl font-black">{experience}Y+</div>
                                    </div>
                                </div>

                                {/* Primary Action */}
                                <button className="w-full bg-brand-acid hover:bg-brand-acid/90 text-black font-black uppercase tracking-[0.2em] py-4 flex items-center justify-center gap-3 transition-all group/btn">
                                    EXECUTE INTERVENTION
                                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>

                                {/* Lateral Actions */}
                                <div className="space-y-3 pt-4">
                                    <button className="w-full border border-white/10 hover:border-brand-acid/30 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                        <Calendar className="w-4 h-4 text-brand-acid" />
                                        SYNC SCHEDULE
                                    </button>
                                    <button className="w-full border border-white/10 hover:border-brand-acid/30 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                        <MessageSquare className="w-4 h-4 text-brand-acid" />
                                        DIRECT TRANSMISSION
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <p className={cn("text-[9px] text-gray-600 text-center leading-relaxed font-bold uppercase", geistMono.className)}>
                                        WARNING: Protocol execution subject to platform terms of engagement. Interventions are non-refundable after vector alignment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015] contrast-200">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50"></div>
            </div>
        </div>
    );
}
