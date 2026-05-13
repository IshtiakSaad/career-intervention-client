import { ComponentType } from "react";
import { TUserIdentity } from "@/services/user/user.types";
import MentorProfileContent from "./MentorProfileContent";
import MenteeProfileContent from "./MenteeProfileContent";

/**
 * Polymorphic Section Map.
 *
 * Maps user roles to their respective profile content components.
 * This avoids switch-case explosion and allows horizontal scaling
 * of roles (e.g., adding GUEST, ALUMNI) without touching page logic.
 *
 * For multi-role users (ADMIN + MENTOR), ALL matching sections render.
 */

type ProfileSectionComponent = ComponentType<{ user: TUserIdentity }>;

type RoleSectionEntry = {
    role: string;
    component: ProfileSectionComponent;
    label: string;
};

export const ROLE_SECTION_MAP: RoleSectionEntry[] = [
    {
        role: "MENTOR",
        component: MentorProfileContent,
        label: "Professional Profile",
    },
    {
        role: "MENTEE",
        component: MenteeProfileContent,
        label: "Learning Profile",
    },
];

/**
 * Resolves which profile sections to render for a given user.
 * Returns an array because a user may have multiple roles.
 */
export function resolveProfileSections(user: TUserIdentity): RoleSectionEntry[] {
    return ROLE_SECTION_MAP.filter((entry) => user.roles.includes(entry.role));
}
