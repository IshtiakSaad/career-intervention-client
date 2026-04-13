/* eslint-disable no-restricted-imports */
"use client";

import React, { useState } from "react";
import { ManagementHeader } from "@/components/shared/management/ManagementHeader";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { CIModal } from "@/components/shared/CIModal";
import { SpecialtyForm } from "./SpecialtyForm";
import { createSpecialtyAction } from "@/services/specialty";
import { useRouter } from "next/navigation";

/**
 * SpecialtyHeader
 * Manages the page-level title and triggers the creation modal.
 */
export const SpecialtyHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <ManagementHeader 
                title="Specialities" 
                description="Manage global specialty categories for mentors and career paths."
            >
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => router.refresh()}
                    title="Force Refresh"
                >
                    <RefreshCw className="size-4 text-muted-foreground" />
                </Button>
                
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold uppercase tracking-widest text-xs h-10 px-4"
                >
                    <Plus className="size-4 mr-2" />
                    Add Speciality
                </Button>
            </ManagementHeader>

            <CIModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Speciality"
                description="Add a new category for mentors to specialize in."
            >
                <SpecialtyForm 
                    action={createSpecialtyAction}
                    onSuccess={() => setIsModalOpen(false)}
                    submitLabel="Create Speciality"
                />
            </CIModal>
        </>
    );
};
