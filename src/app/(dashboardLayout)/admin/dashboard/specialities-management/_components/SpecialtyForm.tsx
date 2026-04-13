"use client";

import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/forms/FieldError";
import { TActionState } from "@/services/auth/auth.types";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface SpecialtyFormProps {
    action: (prevState: any, formData: FormData) => Promise<TActionState>;
    defaultValues?: {
        name?: string;
        icon?: string;
    };
    onSuccess?: () => void;
    submitLabel?: string;
}

/**
 * SpecialtyForm
 * Standardized form for creating and updating specialties.
 */
export const SpecialtyForm = ({
    action,
    defaultValues,
    onSuccess,
    submitLabel = "Save Specialty"
}: SpecialtyFormProps) => {
    const [state, formAction, isPending] = useActionState(action, null);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message || "Action successful!");
            if (onSuccess) onSuccess();
        } else {
            toast.error(state.message || "Action failed.");
        }
    }, [state, onSuccess]);

    return (
        <form action={formAction} className="flex flex-col gap-6">
            <div className="grid gap-2 text-left">
                <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
                    Specialty Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={defaultValues?.name}
                    placeholder="e.g. Software Engineering"
                    className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                    required
                />
                <FieldError errors={state?.errors} name="name" />
            </div>

            <div className="grid gap-2 text-left">
                <Label htmlFor="icon" className="text-sm font-medium text-foreground/80">
                    Icon URL (Optional)
                </Label>
                <Input
                    id="icon"
                    name="icon"
                    defaultValue={defaultValues?.icon}
                    placeholder="https://example.com/icon.png"
                    className="bg-white/5 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                />
                <FieldError errors={state?.errors} name="icon" />
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
                            PROCESSING...
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
