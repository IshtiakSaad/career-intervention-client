import { useState, useMemo, useCallback } from "react";
import { TSpecialty } from "@/services/specialty";

/**
 * useSpecialtySelection
 * Manages the logic for a "Pool vs Selected" multi-select system.
 */
export const useSpecialtySelection = (
    allSpecialties: TSpecialty[],
    initialSelectedIds: string[] = []
) => {
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

    const toggleSpecialty = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const selectedSpecialties = useMemo(
        () => allSpecialties.filter((s) => selectedIds.includes(s.id)),
        [allSpecialties, selectedIds]
    );

    const availableSpecialties = useMemo(
        () => allSpecialties.filter((s) => !selectedIds.includes(s.id)),
        [allSpecialties, selectedIds]
    );

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    return {
        selectedIds,
        selectedSpecialties,
        availableSpecialties,
        toggleSpecialty,
        clearSelection,
    };
};
