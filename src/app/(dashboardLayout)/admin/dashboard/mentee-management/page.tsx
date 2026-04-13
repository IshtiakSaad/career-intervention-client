import React, { Suspense } from "react";
import { ManagementHeader } from "@/components/shared/management/ManagementHeader";
import { ManagementSearchFilter } from "@/components/shared/management/ManagementSearchFilter";
import { ManagementSelectFilter } from "@/components/shared/management/ManagementSelectFilter";
import { ManagementTable } from "@/components/shared/management/ManagementTable";
import { ManagementTableSkeleton } from "@/components/shared/management/ManagementTableSkeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, User } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { formatDate } from "@/lib/utils";

export const metadata = {
    title: "Mentee Management",
};

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

import { ManagementPagination, PaginationMeta } from "@/components/shared/management/ManagementPagination";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { fetchUsers } from "@/services/user";

async function refreshAction() {
    "use server";
    revalidatePath("/admin/dashboard/mentee-management");
}

async function MenteeTableData({ paramsStr }: { paramsStr: string }) {
    const { data, meta } = await fetchUsers(`role=MENTEE&${paramsStr}`);


    const columns = [
        { header: "Mentee" },
        { header: "Career Goals" },
        { header: "Contact" },
        { header: "Joined" },
        { header: "Status" },
        { header: "Actions", className: "text-right" },
    ];

    return (
        <div className="flex flex-col h-full">
            <ManagementTable
                columns={columns}
                data={data}
                emptyMessage="No mentees found."
                renderRow={(mentee, idx) => (
                    <TableRow key={mentee.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {mentee.profileImageUrl ? (
                                    <img 
                                        src={mentee.profileImageUrl} 
                                        className="size-9 rounded-full border border-border object-cover" 
                                        alt="" 
                                    />
                                ) : (
                                    <div className="size-9 rounded-full bg-brand-acid/10 border border-brand-acid/20 flex items-center justify-center">
                                        <User className="size-4 text-brand-acid" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground tracking-tight">
                                        {mentee.name}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">{mentee.email}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <p className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">
                                {mentee.menteeProfile?.careerGoals || "No goals set"}
                            </p>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium">{mentee.phoneNumber || "No phone"}</span>
                                <span className="text-[10px] text-muted-foreground italic">
                                    Last Login: {mentee.lastLoginAt ? formatDate(mentee.lastLoginAt) : "Never"}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">
                            {formatDate(mentee.createdAt)}
                        </TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${
                                mentee.accountStatus === "ACTIVE" 
                                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}>
                                {mentee.accountStatus}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <Link 
                                href={`/admin/dashboard/mentee-management/${mentee.id}/edit`}
                                className={buttonVariants({ variant: "ghost", size: "sm" }) + " text-[10px] tracking-widest uppercase font-bold hover:text-brand-acid"}
                            >
                                Edit
                            </Link>
                        </TableCell>
                    </TableRow>
                )}
            />
            {meta && <ManagementPagination meta={meta} />}
        </div>
    );
}

export default async function MenteeManagementPage({ searchParams }: PageProps) {
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
            <ManagementHeader 
                title="Mentees" 
                description="Manage students and professionals seeking guidance."
            >
                <form action={refreshAction}>
                    <Button variant="outline" size="icon" type="submit" title="Force Refresh">
                        <RefreshCw className="size-4 text-muted-foreground" />
                    </Button>
                </form>
            </ManagementHeader>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 p-4 rounded-xl border border-border/50">
                <ManagementSearchFilter placeholder="Search mentees..." />
                <ManagementSelectFilter 
                    paramKey="accountStatus"
                    placeholder="Filter by status"
                    options={[
                        { label: "Active", value: "ACTIVE" },
                        { label: "Suspended", value: "SUSPENDED" },
                        { label: "Pending", value: "PENDING" },
                    ]}
                />
            </div>

            <div className="flex-1">
                <Suspense fallback={<ManagementTableSkeleton columnCount={6} rowCount={5} />}>
                    <MenteeTableData paramsStr={params.toString()} />
                </Suspense>
            </div>
        </div>
    );
}

