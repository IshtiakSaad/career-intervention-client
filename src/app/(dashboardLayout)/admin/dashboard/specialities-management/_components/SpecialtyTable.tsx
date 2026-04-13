"use client";

import React, { useState } from "react";
import { ManagementTable } from "@/components/shared/management/ManagementTable";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, AlertTriangle, Loader2 } from "lucide-react";
import { CIModal } from "@/components/shared/CIModal";
import { SpecialtyForm } from "@/app/(dashboardLayout)/admin/dashboard/specialities-management/_components/SpecialtyForm";
import { updateSpecialtyAction, deleteSpecialtyAction } from "@/services/specialty";
import { TSpecialty } from "@/services/specialty";
import { toast } from "sonner";
import { ManagementPagination } from "@/components/shared/management/ManagementPagination";

interface SpecialtyTableProps {
    data: TSpecialty[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;
}

/**
 * SpecialtyTable
 * Extracted management table that handles Modal-based CRUD for each row.
 */
export const SpecialtyTable = ({ data, meta }: SpecialtyTableProps) => {
    const [editingSpecialty, setEditingSpecialty] = useState<TSpecialty | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeletePending, setIsDeletePending] = useState(false);

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsDeletePending(true);
        try {
            const res = await deleteSpecialtyAction(deletingId);
            if (res?.success) {
                toast.success(res.message);
                setDeletingId(null);
            } else {
                toast.error(res?.message || "Failed to delete specialty");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeletePending(false);
        }
    };

    const columns = [
        { header: "Icon" },
        { header: "Name" },
        { header: "Created At" },
        { header: "Actions", className: "text-right" },
    ];

    return (
        <div className="flex flex-col h-full gap-4">
            <ManagementTable
                columns={columns}
                data={data}
                emptyMessage="No specialities found."
                renderRow={(specialty) => (
                    <TableRow key={specialty.id} className="group hover:bg-white/5 transition-colors">
                        <TableCell>
                            {specialty.icon ? (
                                <img 
                                    src={specialty.icon} 
                                    className="size-8 rounded-lg border border-white/10 object-cover shadow-sm group-hover:border-brand-acid/30 transition-colors" 
                                    alt="" 
                                />
                            ) : (
                                <div className="size-8 rounded-lg bg-brand-acid/5 border border-brand-acid/20 flex items-center justify-center text-[10px] font-bold text-brand-acid/80 tracking-tighter shadow-sm group-hover:border-brand-acid/50 transition-colors">
                                    {specialty.name?.[0]?.toUpperCase() || "S"}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground tracking-tight group-hover:text-brand-acid transition-colors">
                            {specialty.name}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">
                            {specialty.createdAt ? new Date(specialty.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setEditingSpecialty(specialty)}
                                    className="size-8 text-muted-foreground hover:text-brand-acid"
                                >
                                    <Edit2 className="size-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setDeletingId(specialty.id)}
                                    className="size-8 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            />

            {meta && <ManagementPagination meta={meta} />}

            {/* EDIT MODAL */}
            <CIModal
                isOpen={!!editingSpecialty}
                onClose={() => setEditingSpecialty(null)}
                title="Edit Speciality"
                description={`Updating details for: ${editingSpecialty?.name}`}
            >
                {editingSpecialty && (
                    <SpecialtyForm 
                        action={updateSpecialtyAction.bind(null, editingSpecialty.id)}
                        defaultValues={{
                            name: editingSpecialty.name,
                            icon: editingSpecialty.icon
                        }}
                        onSuccess={() => setEditingSpecialty(null)}
                        submitLabel="Update Speciality"
                    />
                )}
            </CIModal>

            {/* DELETE CONFIRMATION MODAL */}
            <CIModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Delete Speciality"
                description="Are you sure you want to remove this category? This action cannot be undone."
                className="max-w-md"
            >
                <div className="flex flex-col gap-6 pt-2">
                    <div className="flex items-center gap-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                        <div className="p-2 bg-destructive/10 rounded-full">
                            <AlertTriangle className="size-5 text-destructive" />
                        </div>
                        <p className="text-xs text-destructive/80 font-medium leading-relaxed">
                            Deleting this specialty may affect mentors who are currently associated with it.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="flex-1 border-white/10 hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold"
                            onClick={() => setDeletingId(null)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            className="flex-1 font-bold uppercase tracking-widest text-[10px] bg-destructive hover:bg-destructive/90"
                            onClick={handleDelete}
                            disabled={isDeletePending}
                        >
                            {isDeletePending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "Confirm Delete"
                            )}
                        </Button>
                    </div>
                </div>
            </CIModal>
        </div>
    );
};
