"use client";

import React, { useState } from "react";
import { ManagementTable } from "@/components/shared/management/ManagementTable";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Eye, ShieldCheck, ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";
import { CIModal } from "@/components/shared/CIModal";
import { MentorForm } from "./MentorForm";
import { UserInfoCell } from "@/components/shared/management/cells/UserInfoCell";
import { StatusBadgeCell } from "@/components/shared/management/cells/StatusBadgeCell";
import { DateCell } from "@/components/shared/management/cells/DateCell";
import { updateMentorAction, deleteMentorAction, verifyMentorAction } from "@/services/mentor";
import { ManagementPagination } from "@/components/shared/management/ManagementPagination";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MentorTableProps {
    data: any[];
    meta: any;
}

/**
 * MentorTable (Mentor Table)
 * Specialized management table using reusable UI cells and CRUD modals.
 */
export const MentorTable = ({ data, meta }: MentorTableProps) => {
    const [editingMentor, setEditingMentor] = useState<any | null>(null);
    const [viewingMentor, setViewingMentor] = useState<any | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isMutationPending, setIsMutationPending] = useState(false);

    const handleVerifyToggle = async (id: string, currentStatus: boolean) => {
        setIsMutationPending(true);
        try {
            const res = await verifyMentorAction(id, !currentStatus);
            if (res?.success) {
                toast.success(res.message);
            } else if (res) {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsMutationPending(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsMutationPending(true);
        try {
            const res = await deleteMentorAction(deletingId);
            if (res?.success) {
                toast.success(res.message);
                setDeletingId(null);
            } else if (res) {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to delete record");
        } finally {
            setIsMutationPending(false);
        }
    };

    const columns = [
        { header: "Mentor Details" },
        { header: "Designation" },
        { header: "Status" },
        { header: "Joined" },
        { header: "Actions", className: "text-right" },
    ];

    return (
        <div className="flex flex-col h-full gap-4">
            <ManagementTable
                columns={columns}
                data={data}
                emptyMessage="No Mentors found."
                renderRow={(mentor) => (
                    <TableRow key={mentor.id} className="group hover:bg-white/5 transition-colors">
                        <TableCell>
                            <UserInfoCell
                                name={mentor.user?.name}
                                email={mentor.user?.email}
                                image={mentor.user?.profileImageUrl}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
                                    {mentor.designation || "Not Set"}
                                </span>
                                <span className="text-[10px] text-muted-foreground/50 truncate uppercase font-medium">
                                    {mentor.currentWorkingPlace || "Independent"}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <StatusBadgeCell status={mentor.verificationBadge} />
                        </TableCell>
                        <TableCell>
                            <DateCell date={mentor.createdAt} />
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVerifyToggle(mentor.id, mentor.verificationBadge)}
                                    title={mentor.verificationBadge ? "Unverify Account" : "Verify Account"}
                                    className={cn(
                                        "size-8",
                                        mentor.verificationBadge ? "text-brand-acid" : "text-muted-foreground"
                                    )}
                                    disabled={isMutationPending}
                                >
                                    {mentor.verificationBadge ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewingMentor(mentor)}
                                    className="size-8 text-muted-foreground hover:text-foreground"
                                >
                                    <Eye className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingMentor(mentor)}
                                    className="size-8 text-muted-foreground hover:text-brand-acid"
                                >
                                    <Edit2 className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeletingId(mentor.id)}
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

            {/* VIEW MODAL (Task 70-10) */}
            <CIModal
                isOpen={!!viewingMentor}
                onClose={() => setViewingMentor(null)}
                title="Mentor Details"
                className="max-w-xl"
            >
                {viewingMentor && (
                    <div className="flex flex-col gap-6 text-left">
                        <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <UserInfoCell
                                name={viewingMentor.user?.name}
                                email={viewingMentor.user?.email}
                                image={viewingMentor.user?.profileImageUrl}
                                className="scale-110 origin-left"
                            />
                            <div className="h-10 w-px bg-white/10" />
                            <StatusBadgeCell status={viewingMentor.verificationBadge} className="scale-110" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Designation</p>
                                <p className="text-sm font-semibold">{viewingMentor.designation || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Experience</p>
                                <p className="text-sm font-semibold">{viewingMentor.experience} Years</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Working At</p>
                                <p className="text-sm font-semibold">{viewingMentor.currentWorkingPlace || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Rating</p>
                                <p className="text-sm font-semibold">{viewingMentor.ratingAverage} / 5.0</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Biography</p>
                            <p className="text-xs leading-relaxed text-foreground/70 bg-white/5 p-4 rounded-xl border border-white/5">
                                {viewingMentor.bio || "No biography provided."}
                            </p>
                        </div>
                    </div>
                )}
            </CIModal>

            {/* EDIT MODAL (Task 70-11) */}
            <CIModal
                isOpen={!!editingMentor}
                onClose={() => setEditingMentor(null)}
                title="Edit Mentor Profile"
                description={`Updating system records for ${editingMentor?.user?.name}`}
            >
                {editingMentor && (
                    <MentorForm
                        action={updateMentorAction.bind(null, editingMentor.id)}
                        defaultValues={{
                            designation: editingMentor.designation,
                            currentWorkingPlace: editingMentor.currentWorkingPlace,
                            bio: editingMentor.bio,
                            experience: editingMentor.experience
                        }}
                        onSuccess={() => setEditingMentor(null)}
                        submitLabel="Update Mentor"
                    />
                )}
            </CIModal>

            {/* DELETE MODAL */}
            <CIModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Remove Mentor"
                description="This will soft-delete the user record. They will no longer be able to log in or be visible in searches."
                className="max-w-md"
            >
                <div className="flex flex-col gap-6 pt-2">
                    <div className="flex items-center gap-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                        <AlertTriangle className="size-5 text-destructive" />
                        <p className="text-xs text-destructive/80 font-medium">
                            This action is permanent for the dashboard view but can be reversed via direct database access.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 border-white/10" onClick={() => setDeletingId(null)}>Cancel</Button>
                        <Button variant="destructive" className="flex-1 font-bold" onClick={handleDelete} disabled={isMutationPending}>
                            {isMutationPending ? <Loader2 className="size-4 animate-spin" /> : "Remove Mentor"}
                        </Button>
                    </div>
                </div>
            </CIModal>
        </div>
    );
};
