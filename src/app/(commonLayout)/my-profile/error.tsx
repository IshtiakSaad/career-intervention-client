"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ProfileError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Structured observability: log the error with context
        console.error("[PROFILE_ERROR_BOUNDARY]:", {
            event: "PROFILE_PAGE_CRASH",
            message: error.message,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 max-w-md mx-auto text-center animate-in fade-in duration-500">
            <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="size-8 text-destructive" />
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-black text-foreground tracking-tight">
                    Profile Load Failed
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    We couldn&apos;t load your profile data. This may be a temporary issue with our servers.
                </p>
                {error.digest && (
                    <p className="text-[9px] text-muted-foreground/30 font-mono tracking-wider mt-3">
                        Diagnostic: {error.digest}
                    </p>
                )}
            </div>

            <Button
                onClick={reset}
                variant="outline"
                className="font-bold uppercase tracking-[0.15em] text-[10px] h-9 px-6"
            >
                <RefreshCw className="size-3 mr-2" />
                Retry
            </Button>
        </div>
    );
}
