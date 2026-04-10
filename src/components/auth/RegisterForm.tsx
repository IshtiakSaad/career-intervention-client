"use client";

import React, { useActionState, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Lock, Phone, Image, Target, Globe, Loader2 } from "lucide-react";
import { registerUserAction } from "@/services/auth";

const RegisterForm = () => {
    const [state, formAction, isPending] = useActionState(registerUserAction, null);
    const [gender, setGender] = useState<string>("");

    return (
        <div className="w-full">
            <form action={formAction}>
                <div className="flex flex-col gap-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="size-3.5 text-brand-acid" />
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                            />
                            {state?.errors?.name && (
                                <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.name[0]}</p>
                            )}
                        </div>
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="size-3.5 text-brand-acid" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                            />
                            {state?.errors?.email && (
                                <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.email[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Security */}
                    <div className="grid gap-2 text-left">
                        <Label htmlFor="password" title="Password" className="flex items-center gap-2">
                            <Lock className="size-3.5 text-brand-acid" />
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                        />
                        {state?.errors?.password && (
                            <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.password[0]}</p>
                        )}
                    </div>

                    {/* Contact & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                                <Phone className="size-3.5 text-brand-acid" />
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+880 1700 000 000"
                                className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                            />
                            {state?.errors?.phoneNumber && (
                                <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.phoneNumber[0]}</p>
                            )}
                        </div>
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="gender-select" className="flex items-center gap-2">
                                <User className="size-3.5 text-brand-acid" />
                                Gender
                            </Label>
                            <input type="hidden" name="gender" value={gender} />
                            <Select onValueChange={(val: any) => setGender(val as string)}>
                                <SelectTrigger id="gender-select" className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans text-left">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-brand-obsidian border-white/10">
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHERS">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {state?.errors?.gender && (
                                <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.gender[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Media */}
                    <div className="grid gap-2 text-left">
                        <Label htmlFor="file" className="flex items-center gap-2">
                            <Image className="size-3.5 text-brand-acid" />
                            Profile Picture
                        </Label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            accept="image/*"
                            className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans cursor-pointer"
                        />
                        {state?.errors?.file && (
                            <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.file[0]}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-tighter pl-1">JPG, PNG or GIF (Max 5MB)</p>
                    </div>

                    {/* Objectives */}
                    <div className="grid gap-2 text-left">
                        <Label htmlFor="careerGoals" className="flex items-center gap-2">
                            <Target className="size-3.5 text-brand-acid" />
                            Career Goals
                        </Label>
                        <Textarea
                            id="careerGoals"
                            name="careerGoals"
                            placeholder="Tell us about your professional aspirations..."
                            className="min-h-[80px] bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all resize-none font-sans"
                        />
                        {state?.errors?.careerGoals && (
                            <p className="text-[10px] text-destructive uppercase tracking-tighter font-bold">{state.errors.careerGoals[0]}</p>
                        )}
                    </div>

                    {/* Feedback Messages */}
                    {!state?.success && state?.message && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-widest text-center">
                            {state.message}
                        </div>
                    )}
                    {state?.success && (
                        <div className="p-3 bg-brand-acid/10 border border-brand-acid/20 text-brand-acid text-xs font-bold uppercase tracking-widest text-center">
                            {state.message}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold uppercase tracking-widest h-11 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    REGISTERING...
                                </span>
                            ) : (
                                "SIGN UP"
                            )}
                        </Button>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
                                <span className="bg-[#050505] px-4">Or sign up with</span>
                            </div>
                        </div>
                        <Button variant="outline" type="button" className="w-full border-white/10 hover:bg-white/5 uppercase tracking-wider text-xs h-10 transition-all font-sans">
                            <Globe className="mr-2 size-4" />
                            Google
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
