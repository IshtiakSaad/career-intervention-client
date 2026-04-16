"use client";

import React, { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logoutUserAction } from "@/services/auth/action";
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

    const handleLogout = () => {
        toast.loading("Logging out...", { id: "logout" });
        startTransition(async () => {
            try {
                await logoutUserAction();
                toast.success("Logged out successfully.", { id: "logout" });
            } catch (error) {
                if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                    // This is expected. Success toast is hard, but we can do it here:
                    toast.success("Logged out successfully.", { id: "logout" });
                    throw error;
                }
                toast.error("An error occurred locally during logout.", { id: "logout" });
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
