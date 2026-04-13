"use client";

import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/forms/FieldError";
import { TActionState } from "@/services/auth/auth.types";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createMentorAction } from "@/services/mentor/mentor.action";

interface AddMentorFormProps {
    onSuccess?: () => void;
}

/**
 * AddMentorForm (Add New Mentor)
 * Collects User Account details and Mentor Profile details in one go.
 */
export const AddMentorForm = ({ onSuccess }: AddMentorFormProps) => {
    const [state, formAction, isPending] = useActionState(createMentorAction, null);

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
        <form action={formAction} className="flex flex-col gap-4 py-4 max-h-[80vh] overflow-y-auto px-1">
            {/* Account Information */}
            <div className="space-y-4">
                <h3 className="text-brand-acid text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2"> Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="John Doe"
                            className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11"
                        />
                        <FieldError errors={state?.errors} name="name" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="mentor@example.com"
                            className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11"
                        />
                        <FieldError errors={state?.errors} name="email" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Initial Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11"
                        />
                        <FieldError errors={state?.errors} name="password" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gender" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Gender</Label>
                        <select
                            id="gender"
                            name="gender"
                            required
                            className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11 rounded-md px-3 text-sm focus:outline-none appearance-none"
                        >
                            <option value="" className="bg-brand-obsidian">Select Gender</option>
                            <option value="MALE" className="bg-brand-obsidian">Male</option>
                            <option value="FEMALE" className="bg-brand-obsidian">Female</option>
                            <option value="OTHERS" className="bg-brand-obsidian">Others</option>
                        </select>
                        <FieldError errors={state?.errors} name="gender" />
                    </div>
                </div>
            </div>

            {/* Professional Profile */}
            <div className="space-y-4 pt-4">
                <h3 className="text-brand-acid text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">Professional Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="designation" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Designation</Label>
                        <Input
                            id="designation"
                            name="designation"
                            placeholder="e.g. Senior Architect"
                            className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11"
                        />
                        <FieldError errors={state?.errors} name="designation" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="experience" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Experience (Years)</Label>
                        <Input
                            id="experience"
                            name="experience"
                            type="number"
                            placeholder="e.g. 5"
                            className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11"
                        />
                        <FieldError errors={state?.errors} name="experience" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="currentWorkingPlace" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Current Company</Label>
                    <Input
                        id="currentWorkingPlace"
                        name="currentWorkingPlace"
                        placeholder="e.g. Meta, OpenAi"
                        className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans h-11"
                    />
                    <FieldError errors={state?.errors} name="currentWorkingPlace" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-xs font-medium text-foreground/70 tracking-wide uppercase">Professional Bio</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about their expertise..."
                        className="min-h-[100px] bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all resize-none font-sans"
                    />
                    <FieldError errors={state?.errors} name="bio" />
                </div>
            </div>

            <div className="pt-6">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold uppercase tracking-widest h-12 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            CREATING...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <UserPlus className="size-4" />
                            CREATE MENTOR ACCOUNT
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};
