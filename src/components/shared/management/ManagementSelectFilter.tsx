"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
    label: string;
    value: string;
}

interface ManagementSelectFilterProps {
    paramKey: string;
    placeholder?: string;
    options: FilterOption[];
}

export const ManagementSelectFilter = ({ paramKey, placeholder = "Filter...", options }: ManagementSelectFilterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Default to "all" internally for the Select component if no param exists
    const currentValue = searchParams.get(paramKey) || "all";

    const handleValueChange = (value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value && value !== "all") {
            params.set(paramKey, value);
        } else {
            params.delete(paramKey);
        }
        params.delete("page"); // Reset page when filtering
        
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Select value={currentValue} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full md:w-[180px] bg-muted/20 border-border">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
