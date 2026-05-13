"use client";

import { TUserIdentity } from "@/services/user/user.types";
import { GraduationCap, Target } from "lucide-react";

interface MenteeProfileContentProps {
    user: TUserIdentity;
}

function MenteeProfileContent({ user }: MenteeProfileContentProps) {
    const mentee = user.menteeProfile;

    if (!mentee) {
        return null; // Soft fail: section hidden if profile is malformed
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border/30 bg-muted/10">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <GraduationCap className="size-4 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-foreground tracking-tight uppercase">Learning Profile</h2>
                        <p className="text-[10px] text-muted-foreground/50 tracking-wide">Your career development journey</p>
                    </div>
                </div>
            </div>

            {/* Career Goals */}
            <div className="p-6">
                <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/10 border border-border/30">
                        <div className="size-8 rounded-md bg-blue-500/10 flex items-center justify-center mt-0.5 shrink-0">
                            <Target className="size-4 text-blue-400" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Career Goals</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {mentee.careerGoals || "No career goals set yet. Consider adding your aspirations to help mentors guide you better."}
                            </p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/10 border border-border/30">
                        <span className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Account Status</span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] uppercase font-black tracking-[0.2em] border ${mentee.activeStatus
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                            {mentee.activeStatus ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenteeProfileContent;