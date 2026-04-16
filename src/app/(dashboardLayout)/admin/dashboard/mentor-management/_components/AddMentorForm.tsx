"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/forms/FieldError";
import { Loader2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { createMentorAction } from "@/services/mentor/mentor.action";
import { TSpecialty } from "@/services/specialty";
import { useState, useActionState, useEffect } from "react";
import { useSpecialtySelection } from "@/hooks/useSpecialtySelection";
import { MultiSelectSpecialty } from "@/components/shared/forms/MultiSelectSpecialty";

interface AddMentorFormProps {
    onSuccess?: () => void;
    specialties: TSpecialty[];
}

/**
 * AddMentorForm (Add New Mentor)
 * Collects User Account details and Mentor Profile details in one go.
 */
export const AddMentorForm = ({ onSuccess, specialties }: AddMentorFormProps) => {
    const [state, formAction, isPending] = useActionState(createMentorAction, null);

    // 1. Initialize local state for ALL form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        headline: "",
        designation: "",
        experience: 0,
        currentWorkingPlace: "",
        location: "",
        linkedinUrl: "",
        portfolioUrl: "",
        bio: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        state?.fields?.specialties || []
    );

    // 2. Sync server-returned fields to local state on validation error
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
            toast.success(state.message || "Mentor created successfully!");
            if (onSuccess) onSuccess();
        } else if (state.message) {
            toast.error(state.message || "Failed to create mentor.");
        }
    }, [state, onSuccess]);

    return (
        <form action={formAction} className="flex flex-col gap-8 py-6 px-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                {/* Left Column: Account & Identity */}
                <div className="space-y-6">
                    <div className="space-y-1.5 border-l-2 border-brand-acid pl-4">
                        <h3 className="text-brand-acid text-[11px] font-black uppercase tracking-[0.15em]">[ ACCOUNT_PROVISIONING ]</h3>
                        <p className="text-[9px] text-muted-foreground/50 uppercase tracking-tight font-medium">Identity and access credentials</p>
                    </div>

                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Full Legal Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="JONATHAN DOE"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="name" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Network Identifier (Email)</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="mentor.office@socrates.com"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="email" />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Phone Line</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="+1-XXX-XXX-XXXX"
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                                />
                                <FieldError errors={state?.errors} name="phoneNumber" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Gender Ref</Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 rounded-md px-3 text-sm focus:outline-none appearance-none font-medium"
                                >
                                    <option value="" className="bg-brand-obsidian">Select Option</option>
                                    <option value="MALE" className="bg-brand-obsidian">Male</option>
                                    <option value="FEMALE" className="bg-brand-obsidian">Female</option>
                                    <option value="OTHERS" className="bg-brand-obsidian">Others</option>
                                </select>
                                <FieldError errors={state?.errors} name="gender" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Access Key (Password)</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                            />
                            <FieldError errors={state?.errors} name="password" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Professional Metadata */}
                <div className="space-y-6">
                    <div className="space-y-1.5 border-l-2 border-brand-acid pl-4">
                        <h3 className="text-brand-acid text-[11px] font-black uppercase tracking-[0.15em]">[ PROFESSIONAL_PROFILE ]</h3>
                        <p className="text-[9px] text-muted-foreground/50 uppercase tracking-tight font-medium">Domain expertise and social reach</p>
                    </div>

                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="headline" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Professional Headline</Label>
                            <Input
                                id="headline"
                                name="headline"
                                value={formData.headline}
                                onChange={handleInputChange}
                                placeholder="E.G. PRINCIPAL ARCHITECT @ TECH CORP"
                                className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium placeholder:text-muted-foreground/30"
                            />
                            <FieldError errors={state?.errors} name="headline" />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="designation" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Designation Rank</Label>
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
                            <div className="grid gap-2">
                                <Label htmlFor="experience" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Exp (Total Yrs)</Label>
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

                        <div className="grid grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="currentWorkingPlace" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Current Organization</Label>
                                <Input
                                    id="currentWorkingPlace"
                                    name="currentWorkingPlace"
                                    value={formData.currentWorkingPlace}
                                    onChange={handleInputChange}
                                    placeholder="GOOGLE"
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                                />
                                <FieldError errors={state?.errors} name="currentWorkingPlace" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Operations Base</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="NEW YORK, US"
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all h-11 text-sm font-medium"
                                />
                                <FieldError errors={state?.errors} name="location" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="linkedinUrl" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">LinkedIn Handle</Label>
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
                            <div className="grid gap-2">
                                <Label htmlFor="portfolioUrl" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">Digital Portfolio</Label>
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
            </div>

            {/* Specialties & Bio (Full Width Section) */}
            <div className="space-y-8 pt-4 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <MultiSelectSpecialty
                        selectedSpecialties={selectedSpecialties}
                        availableSpecialties={availableSpecialties}
                        onToggle={toggleSpecialty}
                    />

                    {/* Hidden inputs to capture data for the Server Action */}
                    {selectedIds.map(id => (
                        <input key={id} type="hidden" name="specialties" value={id} />
                    ))}

                    <div className="grid gap-3">
                        <Label htmlFor="bio" className="text-[9px] font-bold text-brand-acid tracking-[0.2em] uppercase">Comprehensive Bio-Data</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="TRANSMIT PROFESSIONAL JOURNEY AND IMPACT SUMMARY..."
                            className="min-h-[160px] bg-white/[0.03] border-white/10 focus:border-brand-acid/40 focus:ring-2 focus:ring-brand-acid/10 transition-all resize-none text-sm p-5 font-medium leading-relaxed placeholder:text-muted-foreground/20"
                        />
                        <FieldError errors={state?.errors} name="bio" />
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onSuccess}
                    className="flex-1 border border-white/10 hover:bg-white/5 text-foreground/50 hover:text-foreground font-bold uppercase tracking-[0.2em] h-14 rounded-xl transition-all"
                >
                    <X className="size-4 mr-2" />
                    CANCEL
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-[2] bg-brand-acid text-brand-obsidian hover:bg-brand-acid/95 font-black uppercase tracking-[0.2em] h-14 rounded-xl shadow-xl shadow-brand-acid/5 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isPending ? (
                        <span className="flex items-center gap-3">
                            <Loader2 className="size-5 animate-spin" />
                            PROVISIONING...
                        </span>
                    ) : (
                        <span className="flex items-center gap-3">
                            <UserPlus className="size-5" />
                            DEPLOY PROFILE
                        </span>
                    )}
                </Button>
            </div>
        </form >
    );
};
