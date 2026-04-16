"use client";

import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/**
 * MentorTableSkeleton
 * Tactical loading state mirroring the MentorTable layout.
 */
export const MentorTableSkeleton = () => {
    // Generate 5 mock rows
    const rows = Array.from({ length: 5 });

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in duration-500">
            <Card className="bg-card/50 w-full rounded-xl border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-white/5">
                                <TableHead className="w-[300px] h-12">
                                    <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
                                </TableHead>
                                <TableHead className="h-12">
                                    <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
                                </TableHead>
                                <TableHead className="h-12">
                                    <div className="h-2 w-16 bg-white/10 rounded animate-pulse" />
                                </TableHead>
                                <TableHead className="h-12">
                                    <div className="h-2 w-16 bg-white/10 rounded animate-pulse" />
                                </TableHead>
                                <TableHead className="text-right h-12">
                                    <div className="h-2 w-12 bg-white/10 rounded ml-auto animate-pulse" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((_, i) => (
                                <TableRow key={i} className="border-b border-white/5 h-20">
                                    {/* Details Column */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-white/5 animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="h-2 w-32 bg-white/10 rounded animate-pulse" />
                                                <div className="h-1.5 w-24 bg-white/5 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* Designation Column */}
                                    <TableCell>
                                        <div className="space-y-2">
                                            <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
                                            <div className="h-1.5 w-16 bg-white/5 rounded animate-pulse" />
                                        </div>
                                    </TableCell>
                                    {/* Status Column */}
                                    <TableCell>
                                        <div className="h-5 w-16 bg-white/10 rounded-full animate-pulse" />
                                    </TableCell>
                                    {/* Joined Column */}
                                    <TableCell>
                                        <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
                                    </TableCell>
                                    {/* Actions Column */}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <div className="size-8 bg-white/5 rounded animate-pulse" />
                                            <div className="size-8 bg-white/5 rounded animate-pulse" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between border-t border-white/5 bg-card/20 px-6 py-4 rounded-xl">
                <div className="h-2 w-32 bg-white/5 rounded animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-white/5 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};
