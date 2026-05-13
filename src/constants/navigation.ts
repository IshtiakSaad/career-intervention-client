import { UserRole } from "./routes";

/**
 * Navigation item definition for the Dashboard Sidebar.
 * Uses string icon names instead of React components to allow
 * passing across the Server → Client component boundary.
 */
export type NavItem = {
    title: string;
    href: string;
    icon: string;
    roles: UserRole[];
    category?: "User Management" | "Platform Management";
};

/**
 * Single source of truth for all dashboard navigation items.
 * Filtered by role at render time in the Sidebar.
 */
export const DASHBOARD_NAV_ITEMS: NavItem[] = [
    // ─── ADMIN ───────────────────────────────────────
    {
        title: "Overview",
        href: "/admin/dashboard",
        icon: "LayoutDashboard",
        roles: ["ADMIN"],
    },
    {
        title: "Mentor Vetting",
        href: "/admin/dashboard/mentor-management",
        icon: "Users",
        roles: ["ADMIN"],
        category: "User Management",
    },
    {
        title: "User Directory",
        href: "/admin/dashboard/mentee-management",
        icon: "GraduationCap",
        roles: ["ADMIN"],
        category: "User Management",
    },
    {
        title: "Admin Roster",
        href: "/admin/dashboard/admins-management",
        icon: "UserCog",
        roles: ["ADMIN"],
        category: "User Management",
    },
    {
        title: "Platform Resources",
        href: "/admin/dashboard/items-management",
        icon: "Sparkles",
        roles: ["ADMIN"],
        category: "Platform Management",
    },
    {
        title: "Service Specialities",
        href: "/admin/dashboard/specialities-management",
        icon: "ClipboardList",
        roles: ["ADMIN"],
        category: "Platform Management",
    },
    {
        title: "Appointments",
        href: "/admin/dashboard/appointments-management",
        icon: "CalendarCheck",
        roles: ["ADMIN"],
        category: "Platform Management",
    },
    {
        title: "Schedules Monitor",
        href: "/admin/dashboard/schedules-management",
        icon: "CalendarClock",
        roles: ["ADMIN"],
        category: "Platform Management",
    },


    // ─── MENTOR ──────────────────────────────────────
    {
        title: "Overview",
        href: "/mentor/dashboard",
        icon: "LayoutDashboard",
        roles: ["MENTOR"],
    },
    {
        title: "Upcoming Sessions",
        href: "/mentor/dashboard/appointments",
        icon: "CalendarCheck",
        roles: ["MENTOR"],
    },
    {
        title: "Supply & Availability",
        href: "/mentor/dashboard/my-schedules",
        icon: "CalendarClock",
        roles: ["MENTOR"],
    },
    {
        title: "My Consultation Types",
        href: "/mentor/dashboard/my-services",
        icon: "Sparkles",
        roles: ["MENTOR"],
    },
    {
        title: "Manage My Items",
        href: "/items/manage",
        icon: "ClipboardList",
        roles: ["MENTOR"],
    },

    // ─── MENTEE ──────────────────────────────────────
    {
        title: "Overview",
        href: "/dashboard",
        icon: "LayoutDashboard",
        roles: ["MENTEE"],
    },
    {
        title: "Booked Sessions",
        href: "/dashboard/my-appointments",
        icon: "CalendarCheck",
        roles: ["MENTEE"],
    },
    {
        title: "My Action Plans",
        href: "/dashboard/my-action-plans",
        icon: "ClipboardList",
        roles: ["MENTEE"],
    },
    {
        title: "Manage My Items",
        href: "/items/manage",
        icon: "Sparkles",
        roles: ["MENTEE"],
    },
    {
        title: "Browse Mentors",
        href: "/consultation",
        icon: "Users",
        roles: ["MENTEE"],
    },
];


/**
 * Returns the correct profile href for a given role.
 */
export function getProfileHref(role: UserRole): string {
    return "/my-profile";
}

/**
 * Filters navigation items for a specific role.
 */
export function getNavForRole(role: UserRole): NavItem[] {
    return DASHBOARD_NAV_ITEMS.filter((item) => item.roles.includes(role));
}
