"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ManagementSearchFilterProps {
    placeholder?: string;
    delay?: number;
}

export const ManagementSearchFilter = ({ placeholder = "Search...", delay = 300 }: ManagementSearchFilterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Initialize from URL so sharing links works securely
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            // Only update URL if it actually changed to prevent loop
            if (params.get("search") !== searchTerm && (searchTerm || params.has("search"))) {
                if (searchTerm) {
                    params.set("search", searchTerm);
                } else {
                    params.delete("search");
                }
                params.delete("page"); // Reset page when searching
                router.push(`${pathname}?${params.toString()}`);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [searchTerm, pathname, router, searchParams, delay]);

    return (
        <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-muted/20 border-border"
            />
        </div>
    );
};
