"use client";

import React, { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logoutUserAction } from "@/services/auth/action";
import { clearFirebaseSessionAction } from "@/services/auth/firebase-session";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
    showLabel?: boolean;
}

const LogoutButton = ({
    className,
    variant = "ghost",
    showLabel = true
}: LogoutButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const { user: firebaseUser, logout: firebaseLogout } = useAuth();

    const handleLogout = () => {
        toast.loading("Logging out...", { id: "logout" });
        startTransition(async () => {
            try {
                // 1. Clear server-side firebase session cookies
                await clearFirebaseSessionAction();

                // 2. Sign out from Firebase Auth (client-side)
                if (firebaseUser) {
                    await firebaseLogout();
                }

                // 3. Clear client-side cookies (set during login via document.cookie)
                document.cookie = "firebase-session=; path=/; max-age=0";
                document.cookie = "accessToken=; path=/; max-age=0";

                // 4. Clear legacy JWT session
                await logoutUserAction();

                toast.success("Logged out successfully.", { id: "logout" });
            } catch (error) {
                if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                    toast.success("Logged out successfully.", { id: "logout" });
                    throw error;
                }
                toast.error("An error occurred during logout.", { id: "logout" });
            }
        });
    };


    return (
        <Button
            variant={variant}
            disabled={isPending}
            onClick={handleLogout}
            className={cn(
                "group/logout h-9 gap-2 transition-all active:scale-95",
                variant === "ghost" && "hover:bg-destructive/10 hover:text-destructive text-muted-foreground/60",
                className
            )}
            title="Log out of session"
        >
            {isPending ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <LogOut className="size-4 group-hover/logout:-translate-x-0.5 transition-transform" />
            )}
            {showLabel && (
                <span className="font-bold uppercase tracking-widest text-[10px]">
                    {isPending ? "Logging out..." : "Logout"}
                </span>
            )}
        </Button>
    );
};

export default LogoutButton;
