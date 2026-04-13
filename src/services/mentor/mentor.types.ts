import { PaginationMeta } from "@/components/shared/management/ManagementPagination";

export type MentorManagementResponse = {
    data: any[];
    meta: PaginationMeta | null;
};
