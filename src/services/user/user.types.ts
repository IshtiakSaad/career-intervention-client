import { PaginationMeta } from "@/components/shared/management/ManagementPagination";

// ─── Nested Role-Specific Profile Contracts ───

export type TMentorProfile = {
    id: string;
    bio: string | null;
    currentWorkingPlace: string | null;
    designation: string | null;
    experience: number;
    verificationBadge: boolean;
    ratingCount: number;
    ratingAverage: number;
    totalSessions: number;
    completedSessions: number;
    cancelRate: number;
    activeStatus: boolean;
    description: string | null;
    headline: string | null;
    location: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    mentorSpecialties?: { specialty: { id: string; name: string } }[];
    createdAt: string;
    updatedAt: string;
};

export type TMenteeProfile = {
    id: string;
    careerGoals: string | null;
    activeStatus: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TAdminProfile = {
    id: string;
    activeStatus: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

// ─── Core User Identity Contract ───

export type TUser = {
    id: string;
    email: string;
    name: string | null;
    profileImageUrl: string | null;
    timezone: string;
    gender: string;
    accountStatus: string;
    twoFactorEnabled: boolean;
    needPasswordChange: boolean;
    phoneNumber: string | null;
    roles: string[];
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
    // Nested role-specific profiles (populated by backend include)
    mentorProfile?: TMentorProfile | null;
    menteeProfile?: TMenteeProfile | null;
    adminProfile?: TAdminProfile | null;
};

// ─── Normalized Identity Model (What UI receives) ───

export type TUserIdentity = {
    // Hard identity (fail-closed if missing)
    id: string;
    email: string;
    roles: string[];
    updatedAt: string;
    // Soft identity (synthesized if missing)
    name: string;
    profileImageUrl: string | null;
    timezone: string;
    gender: string;
    accountStatus: string;
    twoFactorEnabled: boolean;
    needPasswordChange: boolean;
    phoneNumber: string | null;
    lastLoginAt: string | null;
    createdAt: string;
    // Role-specific sections (soft-fail: null if malformed)
    mentorProfile: TMentorProfile | null;
    menteeProfile: TMenteeProfile | null;
    adminProfile: TAdminProfile | null;
};

// ─── Management Response ───

export type UserManagementResponse = {
    data: any[];
    meta: PaginationMeta | null;
};
