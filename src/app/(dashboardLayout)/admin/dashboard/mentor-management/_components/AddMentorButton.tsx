"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CIModal } from "@/components/shared/CIModal";
import { AddMentorForm } from "./AddMentorForm";
import { TSpecialty } from "@/services/specialty";

/**
 * AddMentorButton (Client Component)
 * Manages the modal state for creating a new mentor since the main page is a Server Component.
 */
export const AddMentorButton = ({ specialties }: { specialties: TSpecialty[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-brand-acid text-brand-obsidian hover:bg-brand-acid/90 font-bold gap-2 shrink-0 h-10 px-4 rounded-lg transition-all active:scale-95"
            >
                <Plus className="size-4" />
                <span className="hidden sm:inline">ADD NEW MENTOR</span>
                <span className="sm:hidden">ADD</span>
            </Button>

            <CIModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                size="xl"
                title="Create Mentor Account"
                description="Initialize a new professional mentor account with secure credentials."
            >
                <AddMentorForm specialties={specialties} onSuccess={() => setIsOpen(false)} />
            </CIModal>
        </>
    );
};
