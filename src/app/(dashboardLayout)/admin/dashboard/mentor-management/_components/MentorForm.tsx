"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/forms/FieldError";
import { TActionState } from "@/services/auth/auth.types";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { TSpecialty } from "@/services/specialty";
import { useSpecialtySelection } from "@/hooks/useSpecialtySelection";
import { MultiSelectSpecialty } from "@/components/shared/forms/MultiSelectSpecialty";

interface MentorFormProps {
    action: (prevState: any, formData: FormData) => Promise<TActionState>;
    defaultValues?: {
        designation?: string;
        currentWorkingPlace?: string;
        bio?: string;
        experience?: number;
        headline?: string;
        location?: string;
        linkedinUrl?: string;
        portfolioUrl?: string;
    };
    onSuccess?: () => void;
    submitLabel?: string;
    specialties: TSpecialty[];
    defaultSpecialtyIds?: string[];
}

/**
 * MentorForm (Mentor Form)
 * Handles profile updates for Mentors with specific fields like Designation and Bio.
 */
export const MentorForm = ({
    action,
    defaultValues,
    onSuccess,
    submitLabel = "Save Profile",
    specialties,
    defaultSpecialtyIds = []
}: MentorFormProps) => {
    const [state, formAction, isPending] = useActionState(action, null);
    
    // 1. Initialize local state from defaultValues
    const [formData, setFormData] = useState({
        headline: defaultValues?.headline ?? "",
        designation: defaultValues?.designation ?? "",
        experience: defaultValues?.experience ?? 0,
        currentWorkingPlace: defaultValues?.currentWorkingPlace ?? "",
        location: defaultValues?.location ?? "",
        linkedinUrl: defaultValues?.linkedinUrl ?? "",
        portfolioUrl: defaultValues?.portfolioUrl ?? "",
        bio: defaultValues?.bio ?? "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const {
        selectedIds,
        selectedSpecialties,
        availableSpecialties,
        toggleSpecialty
    } = useSpecialtySelection(
        specialties, 
        state?.fields?.specialties || defaultSpecialtyIds
    );

    // 2. Synchronize server-side field updates back to local state
    useEffect(() => {
        if (state?.fields) {
            setFormData(prev => ({
                ...prev,
                ...state.fields
            }));
        }
    }, [state?.fields]);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message || "Profile updated!");
            if (onSuccess) onSuccess();
        } else {
            toast.error(state.message || "Failed to save changes.");
        }
    }, [state, onSuccess]);

    return (
        <form action={formAction} className="flex flex-col gap-8 py-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                
                {/* Basic Career Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5 border-l-2 border-brand-acid pl-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-acid">[ PROFESSIONAL_FOUNDATION ]</span>
                    </div>
 
                    <div className="grid gap-5">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="headline" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                System Headline
                            </Label>
                            <Input
                                id="headline"
                                name="headline"
                                value={formData.headline}
                                onChange={handleInputChange}
                                placeholder="SENIOR ARCHITECT @ META"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="headline" />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="grid gap-2 text-left">
                                <Label htmlFor="designation" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                    Current Rank
                                </Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    placeholder="ARCHITECT"
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                                />
                                <FieldError errors={state?.errors} name="designation" />
                            </div>
 
                            <div className="grid gap-2 text-left">
                                <Label htmlFor="experience" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                    Tenure (Yrs)
                                </Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="10"
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                                 />
                                <FieldError errors={state?.errors} name="experience" />
                            </div>
                        </div>
 
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="currentWorkingPlace" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                Current Organization
                            </Label>
                            <Input
                                id="currentWorkingPlace"
                                name="currentWorkingPlace"
                                value={formData.currentWorkingPlace}
                                onChange={handleInputChange}
                                placeholder="GOOGLE, INC."
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="currentWorkingPlace" />
                        </div>
                    </div>
                </div>
 
                {/* Social & Geographical Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5 border-l-2 border-brand-acid pl-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-acid">[ EXTERNAL_FOOTPRINT ]</span>
                    </div>
 
                    <div className="grid gap-5">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="location" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                Operations Base
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="SAN FRANCISCO, US"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="location" />
                        </div>
 
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="linkedinUrl" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                LinkedIn System URL
                            </Label>
                            <Input
                                id="linkedinUrl"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                placeholder="URL/IN/USERNAME"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="linkedinUrl" />
                        </div>
 
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="portfolioUrl" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                                Digital Portfolio
                            </Label>
                            <Input
                                id="portfolioUrl"
                                name="portfolioUrl"
                                value={formData.portfolioUrl}
                                onChange={handleInputChange}
                                placeholder="HTTPS://DOMAIN.DEV"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="portfolioUrl" />
                        </div>
                    </div>
                </div>
            </div>
 
            <div className="grid gap-2 text-left pt-2">
                <Label htmlFor="bio" className="text-[9px] font-bold text-brand-acid tracking-[0.2em] uppercase">
                    Detailed Professional Narrative
                </Label>
                <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="TRANSMIT PROFESSIONAL JOURNEY AND IMPACT SUMMARY..."
                    className="min-h-[160px] bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all resize-none p-5 text-sm font-medium leading-relaxed"
                />
                <FieldError errors={state?.errors} name="bio" />
            </div>

            <div className="pt-2 border-t border-white/5">
                <MultiSelectSpecialty
                    selectedSpecialties={selectedSpecialties}
                    availableSpecialties={availableSpecialties}
                    onToggle={toggleSpecialty}
                />
                
                {/* Hidden inputs for Server Action */}
                {selectedIds.map(id => (
                    <input key={id} type="hidden" name="specialties" value={id} />
                ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4 mt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onSuccess}
                    className="flex-1 border border-white/10 hover:bg-white/5 text-foreground/50 hover:text-foreground font-bold uppercase tracking-[0.2em] h-12 rounded-xl transition-all"
                >
                    <X className="size-4 mr-2" />
                    DISCARD
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-[2] bg-brand-acid text-brand-obsidian hover:bg-brand-acid/95 font-black uppercase tracking-[0.2em] h-12 rounded-xl shadow-xl shadow-brand-acid/5 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isPending ? (
                        <span className="flex items-center gap-3">
                            <Loader2 className="size-5 animate-spin" />
                            SAVING...
                        </span>
                    ) : (
                        <span className="flex items-center gap-3">
                            <Save className="size-5" />
                            {submitLabel.toUpperCase()}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};
