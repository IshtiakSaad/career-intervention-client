import React, { Suspense } from "react";
import { ManagementHeader } from "@/components/shared/management/ManagementHeader";
import { ManagementSearchFilter } from "@/components/shared/management/ManagementSearchFilter";
import { ManagementSelectFilter } from "@/components/shared/management/ManagementSelectFilter";
import { ManagementTable } from "@/components/shared/management/ManagementTable";
import { ManagementTableSkeleton } from "@/components/shared/management/ManagementTableSkeleton";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { formatDate } from "@/lib/utils";
import { ManagementPagination, PaginationMeta } from "@/components/shared/management/ManagementPagination";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fetchAdmins } from "@/services/admin";


export const metadata = {
    title: "Administrators Management",
};

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Server Action to purge the data cache and force a re-fetch from the backend.
 */
async function refreshAction() {
    "use server";
    revalidatePath("/admin/dashboard/admins-management");
}


// ─── DATA COMPONENT (Server-Side) ───
async function AdminTableData({ paramsStr }: { paramsStr: string }) {
    const { data, meta } = await fetchAdmins(paramsStr);


    const columns = [
        { header: "Admin" },
        { header: "Email" },
        { header: "Joined Date" },
        { header: "Status" },
        { header: "Actions", className: "text-right" },
    ];

    return (
        <div className="flex flex-col h-full">
            <ManagementTable
                columns={columns}
                data={data}
                emptyMessage="No administrators found."
                renderRow={(admin) => (
                    <TableRow key={admin.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {admin.user?.profileImageUrl ? (
                                    <img
                                        src={admin.user.profileImageUrl}
                                        className="size-8 rounded-full border border-border object-cover"
                                        alt=""
                                    />
                                ) : (
                                    <div className="size-8 rounded-full bg-brand-acid/10 border border-brand-acid/30 flex items-center justify-center text-[10px] font-bold text-brand-acid">
                                        {admin.user?.name?.[0]?.toUpperCase() || "A"}
                                    </div>
                                )}
                                <span className="font-semibold text-foreground tracking-tight">
                                    {admin.user?.name || "N/A"}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{admin.user?.email || admin.email}</TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">
                            {formatDate(admin.createdAt)}
                        </TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${admin.activeStatus
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                                }`}>
                                {admin.activeStatus ? "Active" : "Inactive"}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <Link
                                href={`/admin/dashboard/admins-management/${admin.id}/edit`}
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

// ─── PAGE COMPONENT (Main Entry) ───
export default async function AdminsManagementPage({ searchParams }: PageProps) {
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
                title="Administrators"
                description="Manage platform administrators and their permissions."
            >
                <form action={refreshAction}>
                    <Button variant="outline" size="icon" type="submit" title="Force Refresh">
                        <RefreshCw className="size-4 text-muted-foreground" />
                    </Button>
                </form>
                <Link
                    href="/admin/dashboard/admins-management/new"
                    className={buttonVariants({ variant: "default", size: "default" }) + " bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold uppercase tracking-widest text-xs h-10 px-4"}
                >
                    <Plus className="size-4 mr-2" />
                    Add Admin
                </Link>
            </ManagementHeader>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 p-4 rounded-xl border border-border/50">
                <ManagementSearchFilter placeholder="Search by name or email..." />
                <ManagementSelectFilter
                    paramKey="activeStatus"
                    placeholder="Filter by status"
                    options={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                    ]}
                />
            </div>

            <div className="flex-1">
                <Suspense fallback={<ManagementTableSkeleton columnCount={4} rowCount={5} />}>
                    <AdminTableData paramsStr={params.toString()} />
                </Suspense>
            </div>

        </div>
    );
}
