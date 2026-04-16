"use client";

import { X } from "lucide-react";
import { TSpecialty } from "@/services/specialty";
import { Label } from "@/components/ui/label";

interface MultiSelectSpecialtyProps {
    label?: string;
    selectedSpecialties: TSpecialty[];
    availableSpecialties: TSpecialty[];
    onToggle: (id: string) => void;
    error?: string;
    description?: string;
}

/**
 * MultiSelectSpecialty
 * A premium UI component for selecting specialties using a "Pool" pattern.
 */
export const MultiSelectSpecialty = ({
    label = "Core Expertise",
    description = "Select from global specialties below...",
    selectedSpecialties,
    availableSpecialties,
    onToggle,
    error,
}: MultiSelectSpecialtyProps) => {
    return (
        <div className="grid gap-3">
            <Label className="text-[10px] font-bold text-brand-acid tracking-widest uppercase">
                {label}
            </Label>

            {/* Selected Specialties (Tags) */}
            <div className="flex flex-wrap gap-2 min-h-[44px] p-2.5 bg-white/5 rounded-xl border border-white/5 border-dashed">
                {selectedSpecialties.length > 0 ? (
                    selectedSpecialties.map((specialty) => (
                        <button
                            key={specialty.id}
                            type="button"
                            onClick={() => onToggle(specialty.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-acid text-brand-obsidian rounded-md text-[10px] font-bold uppercase transition-all hover:brightness-110 active:scale-95 group"
                        >
                            <span>{specialty.name}</span>
                            <X className="size-3 text-brand-obsidian/60 group-hover:text-brand-obsidian transition-colors" />
                        </button>
                    ))
                ) : (
                    <p className="text-[10px] text-muted-foreground/30 italic flex items-center px-2">
                        {description}
                    </p>
                )}
            </div>

            {/* Available Specialties (Pool) */}
            <div className="flex flex-wrap gap-2 mt-1">
                {availableSpecialties.map((specialty) => (
                    <button
                        key={specialty.id}
                        type="button"
                        onClick={() => onToggle(specialty.id)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-bold uppercase text-foreground/50 hover:text-foreground rounded-md transition-all"
                    >
                        {specialty.name}
                    </button>
                ))}
            </div>

            {/* Hidden inputs were moved to the parent to keep this component visual-only */}
            {error && <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-tight">{error}</p>}
        </div>
    );
};
