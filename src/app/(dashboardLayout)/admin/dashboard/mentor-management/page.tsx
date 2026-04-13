import React, { Suspense } from "react";
import { ManagementHeader } from "@/components/shared/management/ManagementHeader";
import { ManagementSearchFilter } from "@/components/shared/management/ManagementSearchFilter";
import { ManagementTableSkeleton } from "@/components/shared/management/ManagementTableSkeleton";
import { MentorTable } from "./_components/MentorTable";
import { fetchMentors } from "@/services/mentor";
import { formatFilterParams } from "@/lib/query-utils";
import { AddMentorButton } from "./_components/AddMentorButton";

export const metadata = {
    title: "Mentor Management | Admin Dashboard",
};

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function MentorTableData({ paramsStr }: { paramsStr: string }) {
    const { data, meta } = await fetchMentors(paramsStr);
    return <MentorTable data={data} meta={meta} />;
}

export default async function MentorManagementPage({ searchParams }: PageProps) {
    const rawParams = await searchParams;
    const searchParamsObj = new URLSearchParams();

    if (rawParams) {
        Object.keys(rawParams).forEach(key => {
            const val = rawParams[key];
            if (typeof val === 'string') searchParamsObj.set(key, val);
        });
    }

    const paramsStr = formatFilterParams(searchParamsObj);

    return (
        <div className="flex flex-col h-full gap-6">
            <ManagementHeader
                title="Mentors Management"
                description="Monitor Mentor performance, verify their credentials, and oversee their profiles."
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 p-4 rounded-xl border border-border/50">
                <ManagementSearchFilter placeholder="Search Mentors..." />
                <AddMentorButton />
            </div>

            <div className="flex-1">
                <Suspense fallback={<ManagementTableSkeleton columnCount={5} rowCount={5} />}>
                    <MentorTableData paramsStr={paramsStr} />
                </Suspense>
            </div>
        </div>
    );
}
