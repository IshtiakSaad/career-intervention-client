import React, { Suspense } from "react";
import { ManagementHeader } from "@/components/shared/management/ManagementHeader";
import { ManagementSearchFilter } from "@/components/shared/management/ManagementSearchFilter";
import { ManagementTableSkeleton } from "@/components/shared/management/ManagementTableSkeleton";
import { MentorTable } from "./_components/MentorTable";
import { fetchMentors } from "@/services/mentor";
import { formatFilterParams } from "@/lib/query-utils";
import { fetchSpecialties } from "@/services/specialty";
import { AddMentorButton } from "./_components/AddMentorButton";
import { SpecialtyFilter } from "./_components/SpecialtyFilter";
import { MentorTableSkeleton } from "./_components/MentorTableSkeleton";

export const metadata = {
    title: "Mentor Management | Admin Dashboard",
};

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function MentorTableData({ paramsStr, specialties }: { paramsStr: string, specialties: any[] }) {
    const { data, meta } = await fetchMentors(paramsStr);
    return <MentorTable data={data} meta={meta} specialties={specialties} />;
}

export default async function MentorManagementPage({ searchParams }: PageProps) {
    const rawParams = await searchParams;
    const searchParamsObj = new URLSearchParams();

    if (rawParams) {
        Object.keys(rawParams).forEach(key => {
            const val = rawParams[key];
            if (Array.isArray(val)) {
                val.forEach(v => {
                    if (v) searchParamsObj.append(key, v);
                });
            } else if (typeof val === 'string' && val) {
                searchParamsObj.set(key, val);
            }
        });
    }

    const paramsStr = formatFilterParams(searchParamsObj);

    // Fetch specialties for the Add Mentor form
    const specialtiesRes = await fetchSpecialties("");
    const specialties = specialtiesRes.data || [];

    return (
        <div className="flex flex-col h-full gap-6">
            <ManagementHeader
                title="Mentors Management"
                description="Monitor Mentor performance, verify their credentials, and oversee their profiles."
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <ManagementSearchFilter
                        placeholder="SEARCH MENTOR ARCHIVES..."
                        className="max-w-md w-full"
                    />
                    <SpecialtyFilter specialties={specialties} />
                </div>
                <AddMentorButton specialties={specialties} />
            </div>

            <div className="flex-1">
                <Suspense key={paramsStr} fallback={<MentorTableSkeleton />}>
                    <MentorTableData paramsStr={paramsStr} specialties={specialties} />
                </Suspense>
            </div>
        </div>
    );
}
