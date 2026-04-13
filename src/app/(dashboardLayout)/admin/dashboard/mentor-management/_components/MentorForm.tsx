"use client";

import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/forms/FieldError";
import { TActionState } from "@/services/auth/auth.types";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface MentorFormProps {
    action: (prevState: any, formData: FormData) => Promise<TActionState>;
    defaultValues?: {
        designation?: string;
        currentWorkingPlace?: string;
        bio?: string;
        experience?: number;
    };
    onSuccess?: () => void;
    submitLabel?: string;
}

/**
 * MentorForm (Mentor Form)
 * Handles profile updates for Mentors with specific fields like Designation and Bio.
 */
export const MentorForm = ({
    action,
    defaultValues,
    onSuccess,
    submitLabel = "Save Profile"
}: MentorFormProps) => {
    const [state, formAction, isPending] = useActionState(action, null);

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
        <form action={formAction} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2 text-left">
                    <Label htmlFor="designation" className="text-sm font-medium text-foreground/80">
                        Designation
                    </Label>
                    <Input
                        id="designation"
                        name="designation"
                        defaultValue={defaultValues?.designation}
                        placeholder="e.g. Senior Software Architect"
                        className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                    />
                    <FieldError errors={state?.errors} name="designation" />
                </div>

                <div className="grid gap-2 text-left">
                    <Label htmlFor="experience" className="text-sm font-medium text-foreground/80">
                        Years of Experience
                    </Label>
                    <Input
                        id="experience"
                        name="experience"
                        type="number"
                        defaultValue={defaultValues?.experience}
                        placeholder="e.g. 10"
                        className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                    />
                    <FieldError errors={state?.errors} name="experience" />
                </div>
            </div>

            <div className="grid gap-2 text-left">
                <Label htmlFor="currentWorkingPlace" className="text-sm font-medium text-foreground/80">
                    Current Working Place
                </Label>
                <Input
                    id="currentWorkingPlace"
                    name="currentWorkingPlace"
                    defaultValue={defaultValues?.currentWorkingPlace}
                    placeholder="e.g. Google, Tech HQ"
                    className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                />
                <FieldError errors={state?.errors} name="currentWorkingPlace" />
            </div>

            <div className="grid gap-2 text-left">
                <Label htmlFor="bio" className="text-sm font-medium text-foreground/80">
                    Professional Bio
                </Label>
                <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={defaultValues?.bio}
                    placeholder="Describe your expertise and impact..."
                    className="min-h-[100px] bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all resize-none font-sans"
                />
                <FieldError errors={state?.errors} name="bio" />
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold uppercase tracking-widest h-12 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            UPDATING...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save className="size-4" />
                            {submitLabel.toUpperCase()}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};
