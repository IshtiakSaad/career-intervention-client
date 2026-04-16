"use client";

import { TUserIdentity } from "@/services/user/user.types";
import { updateMentorProfessionalAction } from "@/services/user/profile.action";
import { useActionState, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Briefcase, Star, Users, BadgeCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MentorProfileContentProps {
    user: TUserIdentity;
}

function MentorProfileContent({ user }: MentorProfileContentProps) {
    const mentor = user.mentorProfile;
    const [state, formAction, isPending] = useActionState(updateMentorProfessionalAction, null);

    const [formData, setFormData] = useState({
        bio: mentor?.bio || "",
        headline: mentor?.headline || "",
        designation: mentor?.designation || "",
        currentWorkingPlace: mentor?.currentWorkingPlace || "",
        location: mentor?.location || "",
        linkedinUrl: mentor?.linkedinUrl || "",
        portfolioUrl: mentor?.portfolioUrl || "",
    });

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state && !state.success && state.message) {
            toast.error(state.message);
            if (state.fields) {
                setFormData((prev) => ({ ...prev, ...state.fields }));
            }
        }
    }, [state]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (!mentor) {
        return null; // Soft fail: section hidden if profile is malformed
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border/30 bg-muted/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-brand-acid/10 flex items-center justify-center">
                            <Briefcase className="size-4 text-brand-acid" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-foreground tracking-tight uppercase">Professional Profile</h2>
                            <p className="text-[10px] text-muted-foreground/50 tracking-wide">Mentor-specific expertise and credentials</p>
                        </div>
                    </div>
                    {mentor.verificationBadge && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-green-500 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-md">
                            <BadgeCheck className="size-3" />
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="px-6 py-4 border-b border-border/20 bg-muted/5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Stat icon={Star} label="Rating" value={`${mentor.ratingAverage.toFixed(1)} (${mentor.ratingCount})`} />
                    <Stat icon={Users} label="Sessions" value={`${mentor.completedSessions} / ${mentor.totalSessions}`} />
                    <Stat icon={Briefcase} label="Experience" value={`${mentor.experience} yrs`} />
                    <Stat icon={BadgeCheck} label="Cancel Rate" value={`${(mentor.cancelRate * 100).toFixed(1)}%`} />
                </div>
            </div>

            {/* Form */}
            <form action={formAction} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="mentor-headline" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Professional Headline
                        </Label>
                        <Input
                            id="mentor-headline"
                            name="headline"
                            value={formData.headline}
                            onChange={(e) => handleChange("headline", e.target.value)}
                            placeholder="e.g., Senior Software Engineer at Google"
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mentor-designation" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Designation
                        </Label>
                        <Input
                            id="mentor-designation"
                            name="designation"
                            value={formData.designation}
                            onChange={(e) => handleChange("designation", e.target.value)}
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mentor-workplace" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Current Workplace
                        </Label>
                        <Input
                            id="mentor-workplace"
                            name="currentWorkingPlace"
                            value={formData.currentWorkingPlace}
                            onChange={(e) => handleChange("currentWorkingPlace", e.target.value)}
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mentor-location" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Location
                        </Label>
                        <Input
                            id="mentor-location"
                            name="location"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            placeholder="e.g., Dhaka, Bangladesh"
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="mentor-bio" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Biography
                        </Label>
                        <Textarea
                            id="mentor-bio"
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            rows={4}
                            placeholder="Tell mentees about your expertise, experience, and mentoring philosophy..."
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20 resize-none"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mentor-linkedin" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase flex items-center gap-1.5">
                            <ExternalLink className="size-2.5" /> LinkedIn URL
                        </Label>
                        <Input
                            id="mentor-linkedin"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mentor-portfolio" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase flex items-center gap-1.5">
                            <ExternalLink className="size-2.5" /> Portfolio URL
                        </Label>
                        <Input
                            id="mentor-portfolio"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleChange("portfolioUrl", e.target.value)}
                            placeholder="https://yourportfolio.com"
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>
                </div>

                {/* Specialties (read-only display) */}
                {mentor.mentorSpecialties && mentor.mentorSpecialties.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/20">
                        <p className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase mb-3">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                            {mentor.mentorSpecialties.map((ms) => (
                                <span
                                    key={ms.specialty.id}
                                    className="px-3 py-1 rounded-full text-[10px] font-bold text-brand-acid bg-brand-acid/10 border border-brand-acid/20 tracking-wider uppercase"
                                >
                                    {ms.specialty.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end mt-8 pt-6 border-t border-border/20">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-black uppercase tracking-[0.15em] text-[10px] h-9 px-6"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-3 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="size-3 mr-2" />
                                Save Professional Info
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ─── Internal Stat Component ───

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-md bg-muted/30 flex items-center justify-center">
                <Icon className="size-3.5 text-brand-acid" />
            </div>
            <div>
                <p className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground/40 font-bold">{label}</p>
                <p className="text-xs font-bold text-foreground">{value}</p>
            </div>
        </div>
    );
}

export default MentorProfileContent;
