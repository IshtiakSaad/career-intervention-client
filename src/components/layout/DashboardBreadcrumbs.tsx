"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Converts a URL segment like "appointments-management" → "Appointments Management"
 */
function formatSegment(segment: string): string {
    return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const DashboardBreadcrumbs = () => {
    const pathname = usePathname();

    // Build breadcrumbs from the current path
    const segments = pathname.split("/").filter(Boolean);

    // Strip known layout group prefixes
    const cleanSegments = segments.filter(
        (s) => !s.startsWith("(") && !s.endsWith(")")
    );

    return (
        <nav className="flex items-center gap-1.5 text-sm">
            {cleanSegments.map((segment, index) => {
                const isLast = index === cleanSegments.length - 1;

                return (
                    <React.Fragment key={segment + index}>
                        {index > 0 && (
                            <ChevronRight className="size-3 text-muted-foreground/40" />
                        )}
                        <span
                            className={cn(
                                "tracking-wide",
                                isLast
                                    ? "font-semibold text-foreground"
                                    : "text-muted-foreground/60 font-medium"
                            )}
                        >
                            {formatSegment(segment)}
                        </span>
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
