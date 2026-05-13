"use client";

import { TUserIdentity } from "@/services/user/user.types";
import { updateGeneralInfoAction } from "@/services/user/profile.action";
import { useActionState, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";

interface GeneralInfoSectionProps {
    user: TUserIdentity;
}

export function GeneralInfoSection({ user }: GeneralInfoSectionProps) {
    const [state, formAction, isPending] = useActionState(updateGeneralInfoAction, null);

    // Controlled state for form persistence during validation cycles
    const [formData, setFormData] = useState({
        name: user.name,
        phoneNumber: user.phoneNumber || "",
        timezone: user.timezone,
        gender: user.gender,
    });

    // Toast feedback
    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state && !state.success && state.message) {
            toast.error(state.message);
            // Persist fields on validation failure
            if (state.fields) {
                setFormData((prev) => ({ ...prev, ...state.fields }));
            }
        }
    }, [state]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border/30 bg-muted/10">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-brand-acid/10 flex items-center justify-center">
                        <User className="size-4 text-brand-acid" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-foreground tracking-tight uppercase">General Information</h2>
                        <p className="text-[10px] text-muted-foreground/50 tracking-wide">Core identity and contact details</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form action={formAction} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="general-name" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Full Name
                        </Label>
                        <Input
                            id="general-name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="general-phone" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Phone Number
                        </Label>
                        <Input
                            id="general-phone"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                            placeholder="+880 1XXX-XXXXXX"
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="general-timezone" className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Timezone
                        </Label>
                        <Input
                            id="general-timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={(e) => handleChange("timezone", e.target.value)}
                            className="bg-muted/20 border-border/50 focus:border-brand-acid/50 focus:ring-brand-acid/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">
                            Gender
                        </Label>
                        <input type="hidden" name="gender" value={formData.gender} />
                        <Select value={formData.gender} onValueChange={(v) => v && handleChange("gender", v)}>
                            <SelectTrigger className="bg-muted/20 border-border/50">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

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
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
