"use client";

import React, { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Mail, Lock, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginUserAction } from "@/services/auth";
import { FieldError } from "@/components/shared/forms/FieldError";

const LoginForm = () => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginUserAction, null);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message || "Signing in...", { id: "auth" });
            if (state.redirectTo) {
                router.push(state.redirectTo);
            }
        } else {
            toast.error(state.message || "Failed to sign in.", { id: "auth" });
        }

        return () => {
            toast.dismiss("auth");
        };
    }, [state, router]);

    const handleSubmit = (formData: FormData) => {
        toast.loading("Verifying credentials...", { id: "auth" });
        formAction(formData);
    };


    return (
        <div className="w-full">
            <form action={handleSubmit}>

                <div className="flex flex-col gap-5">
                    <div className="grid gap-2 text-left">
                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
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
                        <FieldError errors={state?.errors} name="email" />
                    </div>

                    <div className="grid gap-2 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" title="Password" className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="size-3.5 text-brand-acid" />
                                Password
                            </Label>
                            <a
                                href="/forget-password"
                                className={cn(
                                    buttonVariants({ variant: "link" }),
                                    "h-auto p-0 text-xs text-muted-foreground hover:text-brand-acid/80"
                                )}
                            >
                                Forgot password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="bg-brand-obsidian/50 border-white/10 focus:border-brand-acid/50 transition-all font-sans"
                        />
                        <FieldError errors={state?.errors} name="password" />
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

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold uppercase tracking-widest h-11 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    SIGNING IN...
                                </span>
                            ) : (
                                "SIGN IN"
                            )}
                        </Button>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
                                <span className="bg-[#050505] px-4">Or sign in with</span>
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

export default LoginForm;
