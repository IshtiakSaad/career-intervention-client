"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Mail, Lock, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setFirebaseSessionAction } from "@/services/auth/firebase-session";

const LoginForm = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        setIsPending(true);
        toast.loading("Verifying credentials...", { id: "auth" });

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Set server-side session
            await setFirebaseSessionAction(
                user.email || "", 
                user.displayName || "User",
                (user.email === "admin@socrateshq.com") ? "ADMIN" : "USER"
            );

            // Redundant Client-Side Cookie (Aggressive fix for middleware)
            const isAdmin = user.email === "admin@socrateshq.com";

            const sessionData = JSON.stringify({ 
                email: user.email, 
                name: user.displayName || "User", 
                role: isAdmin ? "ADMIN" : "USER" 
            });

            document.cookie = `firebase-session=${encodeURIComponent(sessionData)}; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=lax`;
            document.cookie = `accessToken=firebase-dummy-token; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=lax`;

            toast.success("Signed in successfully!", { id: "auth" });
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to sign in.", { id: "auth" });
        } finally {
            setIsPending(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsPending(true);
        toast.loading("Connecting to Google...", { id: "auth" });
        
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            // Set server-side session
            await setFirebaseSessionAction(
                user.email || "", 
                user.displayName || user.email?.split('@')[0] || "User",
                (user.email === "admin@socrateshq.com") ? "ADMIN" : "USER"
            );

            // Redundant Client-Side Cookie (Aggressive fix for middleware)
            const isAdminGoogle = user.email === "admin@socrateshq.com";

            const sessionData = JSON.stringify({ 
                email: user.email, 
                name: user.displayName || user.email?.split('@')[0] || "User", 
                role: isAdminGoogle ? "ADMIN" : "USER" 
            });

            document.cookie = `firebase-session=${encodeURIComponent(sessionData)}; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=lax`;
            document.cookie = `accessToken=firebase-dummy-token; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=lax`;

            toast.success("Signed in with Google!", { id: "auth" });
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Google sign-in failed.", { id: "auth" });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleEmailLogin}>
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
                    </div>

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

                        <Button 
                            variant="outline" 
                            type="button" 
                            onClick={handleGoogleLogin}
                            disabled={isPending}
                            className="w-full border-white/10 hover:bg-white/5 uppercase tracking-wider text-xs h-10 transition-all font-sans"
                        >
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
