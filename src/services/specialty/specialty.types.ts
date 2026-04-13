import { PaginationMeta } from "@/components/shared/management/ManagementPagination";

export type TSpecialty = {
    id: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
};

export type SpecialtyManagementResponse = {
    data: TSpecialty[];
    meta: PaginationMeta | null;
};
