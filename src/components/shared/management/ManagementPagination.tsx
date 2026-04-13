"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

interface ManagementPaginationProps {
    meta: PaginationMeta;
}

export const ManagementPagination = ({ meta }: ManagementPaginationProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = meta?.page || 1;
    const totalPages = meta?.total && meta?.limit ? Math.ceil(meta.total / meta.limit) : 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            router.push(createPageURL(currentPage - 1));
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            router.push(createPageURL(currentPage + 1));
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-border/50 bg-card/20 px-4 py-3 sm:px-6 mt-4 rounded-xl">
            <div className="flex flex-1 justify-between sm:hidden">
                <Button
                    onClick={handlePrevious}
                    disabled={currentPage <= 1}
                    variant="outline"
                    size="sm"
                >
                    Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages}
                    variant="outline"
                    size="sm"
                >
                    Next
                </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{(currentPage - 1) * meta.limit + 1}</span> to{" "}
                        <span className="font-medium text-foreground">
                            {Math.min(currentPage * meta.limit, meta.total)}
                        </span>{" "}
                        of <span className="font-medium text-foreground">{meta.total}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <Button
                            onClick={handlePrevious}
                            disabled={currentPage <= 1}
                            variant="outline"
                            size="icon"
                            className="rounded-l-md rounded-r-none"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="size-4" aria-hidden="true" />
                        </Button>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-inset ring-border focus:z-20 focus:outline-offset-0">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={handleNext}
                            disabled={currentPage >= totalPages}
                            variant="outline"
                            size="icon"
                            className="rounded-l-none rounded-r-md"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="size-4" aria-hidden="true" />
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    );
};
