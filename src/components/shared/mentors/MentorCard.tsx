"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MentorCardProps {
  mentor: any;
  onBook: (mentor: any) => void;
}

export const MentorCard = ({ mentor, onBook }: MentorCardProps) => {
  const { user, serviceOfferings, mentorSpecialties } = mentor;
  
  // Logic: Get starting price
  const startingPrice = serviceOfferings?.length > 0 
    ? Math.min(...serviceOfferings.map((s: any) => parseFloat(s.price))) 
    : 0;

  return (
    <Card className="group relative overflow-hidden bg-muted/10 border-border/50 backdrop-blur-xl hover:border-brand-acid/30 transition-all duration-500 rounded-3xl h-full flex flex-col">
      {/* Decorative Aura */}
      <div className="absolute -top-10 -right-10 size-40 bg-brand-acid/5 blur-[60px] rounded-full group-hover:bg-brand-acid/10 transition-all duration-700" />
      
      <CardHeader className="p-6 pb-0 flex-none">
        <div className="flex items-start justify-between gap-4">
          <div className="relative">
            <div className="size-16 rounded-2xl overflow-hidden border-2 border-border/50 shadow-inner group-hover:border-brand-acid/40 transition-colors duration-500">
              <Image 
                src={user.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} 
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            {mentor.verificationBadge && (
              <div className="absolute -bottom-1 -right-1 bg-brand-acid text-black rounded-full p-0.5 border-2 border-background">
                <CheckCircle2 className="size-3" fill="currentColor" />
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-brand-acid">
              <Star className="size-3.5" fill="currentColor" />
              <span className="text-xs font-black tracking-tighter">{mentor.ratingAverage?.toFixed(1) || "5.0"}</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {mentor.totalSessions}+ Sessions
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-black tracking-tight text-foreground truncate group-hover:text-brand-acid transition-colors">
            {user.name}
          </h3>
          <p className="text-xs font-bold text-brand-acid/80 truncate uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="size-3 shrink-0" />
            {mentor.headline || mentor.designation || "Career Consultant"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Work Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Briefcase className="size-3.5 text-brand-acid" />
              <span className="truncate">{mentor.currentWorkingPlace || "Independent Consultant"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <MapPin className="size-3.5 text-brand-acid" />
              <span>{mentor.location || "Remote"}</span>
            </div>
          </div>

          {/* Bio Snippet */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-medium bg-muted/20 p-3 rounded-xl border border-border/30">
            {mentor.bio || "Specialized in helping professionals reach their career apex through structured mentorship and strategy."}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5">
            {mentorSpecialties?.slice(0, 3).map((ms: any) => (
              <Badge 
                key={ms.specialty.id} 
                variant="outline" 
                className="text-[9px] font-bold uppercase tracking-widest py-0.5 px-2 bg-transparent border-border/50 group-hover:border-brand-acid/20"
              >
                {ms.specialty.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Starting at</span>
            <span className="text-lg font-black text-foreground">
              ${startingPrice} <span className="text-[10px] font-bold text-muted-foreground">/ session</span>
            </span>
          </div>
          
          <Button 
            onClick={() => onBook(mentor)}
            className="rounded-2xl bg-brand-acid text-black font-extrabold shadow-[0_0_20px_rgba(202,255,0,0.1)] hover:shadow-[0_0_30px_rgba(202,255,0,0.2)] hover:scale-105 active:scale-95 transition-all"
          >
            BOOK NOW
            <ArrowUpRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
