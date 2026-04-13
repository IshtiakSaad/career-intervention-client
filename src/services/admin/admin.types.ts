import { PaginationMeta } from "@/components/shared/management/ManagementPagination";

export type AdminManagementResponse = {
    data: any[];
    meta: PaginationMeta | null;
};
