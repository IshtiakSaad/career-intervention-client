import React from "react";
import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";
import type { TUser } from "@/services/user";

interface DashboardHeaderProps {
    user: TUser;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    return (
        <header className="h-14 border-b border-border bg-muted/20 flex items-center justify-between px-6 shrink-0">
            {/* Breadcrumbs (Client Leaf) */}
            <DashboardBreadcrumbs />

            {/* User Quick Info */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground/60 font-medium hidden sm:block">
                    {user.email}
                </span>
                {user.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt={user.name || "User"}
                        className="size-8 rounded-full object-cover border border-border"
                    />
                ) : (
                    <div className="size-8 rounded-full bg-brand-acid/10 border border-border flex items-center justify-center">
                        <span className="text-brand-acid font-bold text-xs">
                            {(user.name || user.email)?.[0]?.toUpperCase() || "?"}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
};

export default DashboardHeader;
