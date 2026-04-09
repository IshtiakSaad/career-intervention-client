"use client";

import Link from "next/link";
import Image from "next/image";
import { Geist_Mono } from "next/font/google";
import { cn } from "@shared/lib/utils";
import { Mentor } from "../types";
import { Check, Star, Briefcase, MapPin, ExternalLink } from "lucide-react";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

interface MentorCardProps {
    mentor: Mentor;
    className?: string;
}

export const MentorCard = ({ mentor, className }: MentorCardProps) => {
    const { user, mentorSpecialties, designation, currentWorkingPlace, ratingAverage, experience, verificationBadge } = mentor;

    return (
        <div className={cn(
            "group relative bg-brand-obsidian border border-white/5 p-4 transition-all duration-300 hover:border-brand-acid/30 hover:bg-white/[0.03]",
            className
        )}>
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-acid/0 group-hover:border-brand-acid/40 transition-colors duration-300 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand-acid/0 group-hover:border-brand-acid/40 transition-colors duration-300 pointer-events-none"></div>

            <div className="flex flex-col gap-5 relative z-10">
                {/* Header: Avatar and Identity */}
                <div className="flex items-start gap-5">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <div className="absolute inset-0 border border-brand-acid/20 group-hover:border-brand-acid/50 transition-colors duration-300"></div>
                        {user.profileImageUrl ? (
                            <Image 
                                src={user.profileImageUrl} 
                                alt={user.name} 
                                fill 
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 p-1"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-2xl font-black text-brand-acid/40 group-hover:text-brand-acid/60 transition-colors">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        {verificationBadge && (
                            <div className="absolute -top-2 -right-2 bg-brand-acid text-black p-1 shadow-lg shadow-brand-acid/20">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-brand-acid transition-colors">
                                {user.name}
                            </h3>
                            <div className={cn("flex flex-col items-end gap-1 text-[10px] text-gray-500 font-bold", geistMono.className)}>
                                <span className="uppercase opacity-50 tracking-widest">EXP</span>
                                <span className="text-brand-acid">{experience}Y+</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                                <Briefcase className="w-3 h-3 text-brand-acid" />
                                <span className="truncate">{designation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <MapPin className="w-3 h-3 text-zinc-600" />
                                <span className="truncate uppercase tracking-wide">{currentWorkingPlace}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-2">
                    {mentorSpecialties.map((spec, idx) => (
                        <span 
                            key={idx} 
                            className={cn(
                                "text-[10px] font-black tracking-widest uppercase px-2 py-1 bg-white/5 border border-white/10 text-gray-400 group-hover:border-brand-acid/20 group-hover:text-gray-300 transition-all",
                                geistMono.className
                            )}
                        >
                            {spec.specialty.name}
                        </span>
                    ))}
                </div>

                {/* Footer: Rating and Actions */}
                <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-brand-acid fill-brand-acid" />
                            <span className={cn("text-xs font-bold text-white", geistMono.className)}>
                                {ratingAverage.toFixed(1)}
                            </span>
                        </div>
                        <span className={cn("text-[10px] text-gray-500 uppercase font-black", geistMono.className)}>
                            {mentor.ratingCount} REVIEWS
                        </span>
                    </div>

                    <Link 
                        href={`/mentors/${mentor.id}`}
                        className="flex items-center gap-2 text-[10px] font-black text-brand-acid uppercase tracking-[0.2em] group-hover:gap-3 transition-all"
                    >
                        DEPLOY PROTOCOL
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-10 transition-opacity">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] animate-scanline"></div>
            </div>
        </div>
    );
};
