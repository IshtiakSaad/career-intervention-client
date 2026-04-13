import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/user";
import { getNavForRole } from "@/constants/navigation";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import type { UserRole } from "@/constants/routes";

interface BaseDashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * Server Component: The single entry point for all dashboard layouts.
 * 
 * - Fetches user data on the server (no client fetch).
 * - Passes user + nav config down to pure UI children.
 * - Redirects to /login if session is invalid.
 */
export default async function BaseDashboardLayout({ children }: BaseDashboardLayoutProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const userRole = (user.roles?.[0] as UserRole) || "MENTEE";
    const navItems = getNavForRole(userRole);

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar user={user} navItems={navItems} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <DashboardHeader user={user} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
