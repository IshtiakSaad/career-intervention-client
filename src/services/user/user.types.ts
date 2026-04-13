import { PaginationMeta } from "@/components/shared/management/ManagementPagination";

/**
 * User type matching the backend's GET /api/v1/users/:id response.
 */
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
};

export type UserManagementResponse = {
    data: any[]; // Using any[] for now until full User profile struct is needed
    meta: PaginationMeta | null;
};
