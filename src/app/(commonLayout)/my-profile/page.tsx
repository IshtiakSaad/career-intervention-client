import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/user/user.action";
import { ProfileHeader } from "./_components/ProfileHeader";
import { GeneralInfoSection } from "./_components/GeneralInfoSection";
import { SecuritySection } from "./_components/SecuritySection";
import { resolveProfileSections } from "./_components/SectionMap";

export const metadata = {
    title: "My Profile",
    description: "Manage your identity, professional information, and security settings.",
};

export default async function MyProfilePage() {
    // ─── Auth Guard (Fail-Closed) ───
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // ─── Polymorphic Section Resolution ───
    const roleSections = resolveProfileSections(user);

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* The Identity Shell */}
            <ProfileHeader user={user} />

            {/* General Information (shared across all roles) */}
            <GeneralInfoSection user={user} />

            {/* Role-Specific Sections (polymorphic rendering) */}
            {roleSections.map(({ role, component: SectionComponent }) => (
                <SectionComponent key={role} user={user} />
            ))}

            {/* Security & Access (shared, rendered last) */}
            <SecuritySection user={user} />
        </div>
    );
}