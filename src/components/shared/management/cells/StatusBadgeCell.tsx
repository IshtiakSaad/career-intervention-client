import React from "react";
import { cn } from "@/lib/utils";

/**
 * Status Types
 */
export type TStatusType = "ACTIVE" | "PENDING" | "VERIFIED" | "BLOCKED" | "SUCCESS" | "FAILED" | "UNVERIFIED" | boolean;

interface StatusBadgeCellProps {
    status: TStatusType;
    className?: string;
}

/**
 * StatusBadgeCell
 * Renders a premium, glassmorphism status badge.
 */
export const StatusBadgeCell = ({ status, className }: StatusBadgeCellProps) => {
    
    // Normalize status for booleans
    const normalizedStatus = typeof status === "boolean" 
        ? (status ? "VERIFIED" : "UNVERIFIED") 
        : status;

    const config: Record<string, { label: string; bg: string; text: string; dot: string }> = {
        ACTIVE: { label: "Active", bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
        SUCCESS: { label: "Success", bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
        VERIFIED: { label: "Verified", bg: "bg-brand-acid/10", text: "text-brand-acid", dot: "bg-brand-acid" },
        PENDING: { label: "Pending", bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
        BLOCKED: { label: "Blocked", bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },
        FAILED: { label: "Failed", bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },
        UNVERIFIED: { label: "Pending", bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-500" },
    };

    const current = config[normalizedStatus] || config.PENDING;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/5",
            current.bg,
            current.text,
            className
        )}>
            <span className={cn("size-1 rounded-full animate-pulse", current.dot)} />
            {current.label}
        </span>
    );
};
