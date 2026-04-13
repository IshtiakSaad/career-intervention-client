"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    Users,
    UserCog,
    GraduationCap,
    CalendarCheck,
    CalendarClock,
    Sparkles,
    UserCircle,
    ClipboardList,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/auth/LogoutButton";
import type { TUser } from "@/services/user";
import type { NavItem } from "@/constants/navigation";
import { getProfileHref } from "@/constants/navigation";
import type { UserRole } from "@/constants/routes";

/**
 * Map of icon name strings to their Lucide React components.
 * This resolves the Server → Client serialization boundary.
 */
const ICON_MAP: Record<string, LucideIcon> = {
    LayoutDashboard,
    Users,
    UserCog,
    GraduationCap,
    CalendarCheck,
    CalendarClock,
    Sparkles,
    UserCircle,
    ClipboardList,
};

interface DashboardSidebarProps {
    user: TUser;
    navItems: NavItem[];
}

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

const DashboardSidebar = ({ user, navItems }: DashboardSidebarProps) => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Persist collapse state in localStorage
    useEffect(() => {
        const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
        if (stored === "true") setCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
    };

    const userRole = (user.roles?.[0] as UserRole) || "MENTEE";
    const profileHref = getProfileHref(userRole);

    const roleBadgeColor: Record<string, string> = {
        ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
        MENTOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        MENTEE: "bg-brand-acid/20 text-brand-acid border-brand-acid/30",
    };

    return (
        <aside
            className={cn(
                "h-screen sticky top-0 flex flex-col border-r border-border bg-muted/30 transition-all duration-300 ease-in-out",
                collapsed ? "w-[68px]" : "w-[260px]"
            )}
        >
            {/* ─── Header ─── */}
            <div className={cn(
                "h-16 flex items-center border-b border-border px-4",
                collapsed ? "justify-center" : "justify-between"
            )}>
                {!collapsed && (
                    <span className="font-bold tracking-widest text-brand-acid uppercase text-xs">
                        SocratesHQ
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleCollapse}
                    className="text-muted-foreground hover:text-foreground"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <PanelLeftOpen className="size-4" />
                    ) : (
                        <PanelLeftClose className="size-4" />
                    )}
                </Button>
            </div>

            {/* ─── User Info ─── */}
            <div className={cn(
                "flex items-center gap-3 border-b border-border p-4",
                collapsed && "justify-center p-3"
            )}>
                <div className="relative shrink-0">
                    {user.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user.name || "User"}
                            className="size-9 rounded-full object-cover border-2 border-brand-acid/30"
                        />
                    ) : (
                        <div className="size-9 rounded-full bg-brand-acid/10 border-2 border-brand-acid/30 flex items-center justify-center">
                            <span className="text-brand-acid font-bold text-xs">
                                {(user.name || user.email)?.[0]?.toUpperCase() || "?"}
                            </span>
                        </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user.name || "User"}</p>
                        <span className={cn(
                            "inline-block text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border mt-0.5",
                            roleBadgeColor[userRole] || roleBadgeColor["MENTEE"]
                        )}>
                            {userRole}
                        </span>
                    </div>
                )}
            </div>

            {/* ─── Navigation ─── */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                {navItems.map((item, index) => {
                    const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href + "/"));

                    const showCategoryHeader = !collapsed && item.category && (
                        index === 0 || navItems[index - 1].category !== item.category
                    );

                    return (
                        <React.Fragment key={item.href}>
                            {showCategoryHeader && (
                                <div className="mt-4 mb-2 px-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                        {item.category}
                                    </span>
                                </div>
                            )}
                            <Link
                                href={item.href}
                                title={item.title}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                    collapsed && "justify-center px-2",
                                    isActive
                                        ? "bg-brand-acid/10 text-brand-acid border border-brand-acid/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                                )}
                            >
                                <Icon className={cn("size-4 shrink-0", isActive && "text-brand-acid")} />
                                {!collapsed && <span className="truncate">{item.title}</span>}
                            </Link>
                        </React.Fragment>
                    );
                })}

                {/* ─── Profile Link (Separated) ─── */}
                <div className="pt-2 mt-2 border-t border-border">
                    <Link
                        href={profileHref}
                        title="My Profile"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                            collapsed && "justify-center px-2",
                            pathname === profileHref
                                ? "bg-brand-acid/10 text-brand-acid border border-brand-acid/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                        )}
                    >
                        <UserCircle className={cn("size-4 shrink-0", pathname === profileHref && "text-brand-acid")} />
                        {!collapsed && <span>My Profile</span>}
                    </Link>
                </div>
            </nav>

            {/* ─── Footer ─── */}
            <div className={cn(
                "border-t border-border p-3",
                collapsed && "flex justify-center"
            )}>
                <LogoutButton
                    showLabel={!collapsed}
                    className={cn(collapsed && "px-2")}
                />
            </div>
        </aside>
    );
};

export default DashboardSidebar;
