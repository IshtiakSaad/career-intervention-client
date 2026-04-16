import { TUserIdentity } from "./user.types";

/**
 * The Identity Transformer.
 *
 * This is the hard boundary between the backend's "wide object" and
 * what the UI is allowed to see. It enforces two failure policies:
 *
 * - HARD FAIL (Identity): If `id`, `email`, or `roles` are missing/malformed,
 *   the record is considered corrupt → returns null (triggers logout).
 * - SOFT FAIL (Feature): If a role-specific profile is missing or malformed,
 *   it is set to null → the UI gracefully hides that section.
 */

export function transformToIdentityModel(raw: any): TUserIdentity | null {
    // ─── Hard Failure Gate ───
    // These fields are non-negotiable. If they are missing, the identity
    // contract is broken and the system cannot render safely.
    if (!raw?.id || typeof raw.id !== "string") {
        console.error("[IDENTITY_TRANSFORMER]: HARD FAIL — missing or invalid 'id'.", { raw: raw?.id });
        return null;
    }

    if (!raw?.email || typeof raw.email !== "string") {
        console.error("[IDENTITY_TRANSFORMER]: HARD FAIL — missing or invalid 'email'.", { id: raw.id });
        return null;
    }

    if (!Array.isArray(raw?.roles) || raw.roles.length === 0) {
        console.error("[IDENTITY_TRANSFORMER]: HARD FAIL — missing or empty 'roles'.", { id: raw.id });
        return null;
    }

    if (!raw?.updatedAt) {
        console.error("[IDENTITY_TRANSFORMER]: HARD FAIL — missing 'updatedAt' (version anchor).", { id: raw.id });
        return null;
    }

    // ─── Soft Normalization ───
    // These fields are important but non-critical. If missing, we synthesize
    // deterministic fallbacks so the UI remains stable.

    const mentorProfile = normalizeMentorProfile(raw.mentorProfile);
    const menteeProfile = normalizeMenteeProfile(raw.menteeProfile);
    const adminProfile = normalizeAdminProfile(raw.adminProfile);

    return {
        // Hard identity
        id: raw.id,
        email: raw.email,
        roles: raw.roles,
        updatedAt: raw.updatedAt,

        // Soft identity (with fallbacks)
        name: raw.name || "Unnamed User",
        profileImageUrl: raw.profileImageUrl || null,
        timezone: raw.timezone || "UTC",
        gender: raw.gender || "OTHER",
        accountStatus: raw.accountStatus || "ACTIVE",
        twoFactorEnabled: Boolean(raw.twoFactorEnabled),
        needPasswordChange: Boolean(raw.needPasswordChange),
        phoneNumber: raw.phoneNumber || null,
        lastLoginAt: raw.lastLoginAt || null,
        createdAt: raw.createdAt || new Date().toISOString(),

        // Role-specific sections (soft-fail)
        mentorProfile,
        menteeProfile,
        adminProfile,
    };
}

// ─── Section-Level Normalizers ───

function normalizeMentorProfile(raw: any) {
    if (!raw || typeof raw !== "object" || !raw.id) {
        return null;
    }

    return {
        id: raw.id,
        bio: raw.bio ?? null,
        currentWorkingPlace: raw.currentWorkingPlace ?? null,
        designation: raw.designation ?? null,
        experience: typeof raw.experience === "number" ? raw.experience : 0,
        verificationBadge: Boolean(raw.verificationBadge),
        ratingCount: raw.ratingCount ?? 0,
        ratingAverage: raw.ratingAverage ?? 0.0,
        totalSessions: raw.totalSessions ?? 0,
        completedSessions: raw.completedSessions ?? 0,
        cancelRate: raw.cancelRate ?? 0.0,
        activeStatus: raw.activeStatus !== false,
        description: raw.description ?? null,
        headline: raw.headline ?? null,
        location: raw.location ?? null,
        linkedinUrl: raw.linkedinUrl ?? null,
        portfolioUrl: raw.portfolioUrl ?? null,
        mentorSpecialties: Array.isArray(raw.mentorSpecialties)
            ? raw.mentorSpecialties.filter((ms: any) => ms?.specialty?.id && ms?.specialty?.name)
            : [],
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
    };
}

function normalizeMenteeProfile(raw: any) {
    if (!raw || typeof raw !== "object" || !raw.id) {
        return null;
    }

    return {
        id: raw.id,
        careerGoals: raw.careerGoals ?? null,
        activeStatus: raw.activeStatus !== false,
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
    };
}

function normalizeAdminProfile(raw: any) {
    if (!raw || typeof raw !== "object" || !raw.id) {
        return null;
    }

    return {
        id: raw.id,
        activeStatus: raw.activeStatus !== false,
        isDeleted: Boolean(raw.isDeleted),
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
    };
}
