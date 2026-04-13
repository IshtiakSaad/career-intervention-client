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

export interface ManagementColumn {
    header: string;
    className?: string;
}

interface ManagementTableProps<T> {
    columns: ManagementColumn[];
    data: T[];
    renderRow: (item: T, index: number) => React.ReactNode;
    emptyMessage?: string;
}

export function ManagementTable<T>({ 
    columns, 
    data, 
    renderRow, 
    emptyMessage = "No records found." 
}: ManagementTableProps<T>) {
    return (
        <Card className="bg-card/50 w-full rounded-xl border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                            {columns.map((col, idx) => (
                                <TableHead key={idx} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    className="h-32 text-center text-muted-foreground font-medium"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => renderRow(item, index))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
