"use client";

import { Check, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { TSpecialty } from "@/services/specialty";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";

interface SpecialtyFilterProps {
    specialties: TSpecialty[];
}

export const SpecialtyFilter = ({ specialties }: SpecialtyFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get currently active specialties from URL
    const activeSpecialties = searchParams.getAll("specialties");

    const toggleSpecialty = useCallback((name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentSpecialties = params.getAll("specialties");

        if (currentSpecialties.includes(name)) {
            // Remove it
            const filtered = currentSpecialties.filter(s => s !== name);
            params.delete("specialties");
            filtered.forEach(s => params.append("specialties", s));
        } else {
            // Add it
            params.append("specialties", name);
        }

        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("specialties");
        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    return (
        <div className="flex items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/[0.03] border-white/10 hover:bg-white/5 text-[10px] uppercase tracking-[0.15em] font-black h-9 px-4 gap-2 transition-all active:scale-95"
                    >
                        <Filter className="size-3 text-brand-acid" />
                        Expertise Filter
                        {activeSpecialties.length > 0 && (
                            <Badge className="ml-1 bg-brand-acid text-brand-obsidian text-[9px] hover:bg-brand-acid h-4 min-w-[16px] flex items-center justify-center p-0 font-black">
                                {activeSpecialties.length}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] bg-brand-obsidian border-white/10 text-foreground">
                    <DropdownMenuLabel className="text-[10px] font-black tracking-widest text-muted-foreground uppercase py-3">
                        [ DOMAIN_EXPERTISE ]
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <div className="max-h-[300px] overflow-y-auto py-1">
                        {specialties.map((specialty) => {
                            const isActive = activeSpecialties.includes(specialty.name);
                            return (
                                <DropdownMenuCheckboxItem
                                    key={specialty.id}
                                    checked={isActive}
                                    onCheckedChange={() => toggleSpecialty(specialty.name)}
                                    className="text-[11px] font-medium py-2.5 focus:bg-brand-acid focus:text-brand-obsidian cursor-pointer transition-colors"
                                >
                                    {specialty.name.toUpperCase()}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </div>
                    {activeSpecialties.length > 0 && (
                        <>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem
                                onClick={clearFilters}
                                className="text-[10px] font-black tracking-widest text-brand-acid uppercase py-3 justify-center focus:bg-white/50 cursor-pointer"
                            >
                                <X className="size-3 mr-2" />
                                CLEAR ALL FILTERS
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Visual Indicators for Active Filters */}
            <div className="hidden lg:flex items-center gap-2">
                {activeSpecialties.map(name => (
                    <Badge
                        key={name}
                        variant="secondary"
                        className="bg-brand-acid/10 border-brand-acid/20 text-brand-acid text-[9px] font-black tracking-wider px-2 py-0.5 h-6 gap-1.5 cursor-default hover:bg-brand-acid/20 transition-all animate-in fade-in zoom-in"
                    >
                        {name.toUpperCase()}
                        <X
                            className="size-2.5 cursor-pointer hover:text-white transition-colors"
                            onClick={() => toggleSpecialty(name)}
                        />
                    </Badge>
                ))}
            </div>
        </div>
    );
};
