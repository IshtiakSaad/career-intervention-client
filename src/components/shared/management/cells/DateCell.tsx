import React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface DateCellProps {
    date: string | Date | number;
    className?: string;
    showIcon?: boolean;
}

/**
 * DateCell
 * Standardized date display for management tables.
 */
export const DateCell = ({ date, className, showIcon = false }: DateCellProps) => {
    if (!date) return <span className="text-muted-foreground/30">—</span>;

    const d = new Date(date);
    const formatted = d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {showIcon && <Calendar className="size-3 text-brand-acid/40" />}
            <span className="text-[10px] font-medium text-muted-foreground/80 tracking-widest uppercase truncate">
                {formatted}
            </span>
        </div>
    );
};
