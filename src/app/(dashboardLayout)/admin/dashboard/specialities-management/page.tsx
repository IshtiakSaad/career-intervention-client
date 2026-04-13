import React, { Suspense } from "react";
import { SpecialtyHeader } from "@/app/(dashboardLayout)/admin/dashboard/specialities-management/_components/SpecialtyHeader";
import { SpecialtyTable } from "@/app/(dashboardLayout)/admin/dashboard/specialities-management/_components/SpecialtyTable";
import { ManagementSearchFilter } from "@/components/shared/management/ManagementSearchFilter";
import { ManagementTableSkeleton } from "@/components/shared/management/ManagementTableSkeleton";
import { fetchSpecialties } from "@/services/specialty";

export const metadata = {
    title: "Specialities Management",
};

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function SpecialtyTableData({ paramsStr }: { paramsStr: string }) {
    const { data, meta } = await fetchSpecialties(paramsStr);
    return <SpecialtyTable data={data} meta={meta} />;
}

export default async function SpecialitiesManagementPage({ searchParams }: PageProps) {
    const rawParams = await searchParams;
    const params = new URLSearchParams();
    
    if (rawParams) {
        Object.keys(rawParams).forEach(key => {
            const val = rawParams[key];
            if (typeof val === 'string') params.set(key, val);
        });
    }

    return (
        <div className="flex flex-col h-full gap-6">
            <SpecialtyHeader />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 p-4 rounded-xl border border-border/50">
                <ManagementSearchFilter placeholder="Search by name..." />
            </div>

            <div className="flex-1">
                <Suspense fallback={<ManagementTableSkeleton columnCount={4} rowCount={5} />}>
                    <SpecialtyTableData paramsStr={params.toString()} />
                </Suspense>
            </div>
        </div>
    );
}
