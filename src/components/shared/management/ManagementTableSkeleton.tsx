import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ManagementTableSkeletonProps {
    columnCount?: number;
    rowCount?: number;
}

export const ManagementTableSkeleton = ({ 
    columnCount = 5, 
    rowCount = 5 
}: ManagementTableSkeletonProps) => {
    return (
        <Card className="bg-card w-full rounded-xl border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            {Array.from({ length: columnCount }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-[80%] max-w-[120px] bg-muted-foreground/20" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rowCount }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columnCount }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-5 w-full max-w-[200px]" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
