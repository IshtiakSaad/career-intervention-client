"use client";

import React, { useState } from "react";
import { ManagementTable } from "@/components/shared/management/ManagementTable";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Eye, ShieldCheck, ShieldAlert, AlertTriangle, Loader2, MapPin, Phone, ExternalLink, Globe, Briefcase, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { CIModal } from "@/components/shared/CIModal";
import { MentorForm } from "./MentorForm";
import { UserInfoCell } from "@/components/shared/management/cells/UserInfoCell";
import { StatusBadgeCell } from "@/components/shared/management/cells/StatusBadgeCell";
import { DateCell } from "@/components/shared/management/cells/DateCell";
import { updateMentorAction, deleteMentorAction, verifyMentorAction } from "@/services/mentor";
import { ManagementPagination } from "@/components/shared/management/ManagementPagination";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface MentorTableProps {
    data: any[];
    meta: any;
    specialties: any[];
}

/**
 * MentorTable (Mentor Table)
 * Specialized management table using reusable UI cells and CRUD modals.
 */
export const MentorTable = ({ data, meta, specialties }: MentorTableProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [editingMentor, setEditingMentor] = useState<any | null>(null);
    const [viewingMentor, setViewingMentor] = useState<any | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isMutationPending, setIsMutationPending] = useState(false);

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const handleSort = (key: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (sortBy === key) {
            if (sortOrder === "asc") {
                params.set("sortOrder", "desc");
            } else if (sortOrder === "desc") {
                params.delete("sortBy");
                params.delete("sortOrder");
            }
        } else {
            params.set("sortBy", key);
            params.set("sortOrder", "asc");
        }
        
        router.push(`?${params.toString()}`);
    };

    const handleLimitChange = (limit: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", limit);
        params.set("page", "1"); // Reset to page 1 on limit change
        router.push(`?${params.toString()}`);
    };

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
        { 
            header: "Designation", 
            sortKey: "designation",
            className: "cursor-pointer hover:text-brand-acid transition-colors" 
        },
        { 
            header: "Status", 
            sortKey: "verificationBadge",
            className: "cursor-pointer hover:text-brand-acid transition-colors" 
        },
        { 
            header: "Joined", 
            sortKey: "createdAt",
            className: "cursor-pointer hover:text-brand-acid transition-colors" 
        },
        { header: "Actions", className: "text-right" },
    ];

    const renderHeader = (col: any) => {
        if (!col.sortKey) return col.header;
        
        const isActive = sortBy === col.sortKey;
        
        return (
            <div 
                className="flex items-center gap-2"
                onClick={() => handleSort(col.sortKey)}
            >
                {col.header}
                <div className="flex flex-col">
                    {isActive ? (
                        sortOrder === "asc" ? (
                            <ChevronUp className="size-3 text-brand-acid" />
                        ) : (
                            <ChevronDown className="size-3 text-brand-acid" />
                        )
                    ) : (
                        <ArrowUpDown className="size-3 opacity-20" />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <ManagementTable
                columns={columns.map(col => ({ ...col, header: renderHeader(col) }))}
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Density:</span>
                    <select 
                        className="bg-transparent border-none text-[10px] font-black text-brand-acid focus:ring-0 cursor-pointer uppercase tracking-widest"
                        value={meta?.limit || 10}
                        onChange={(e) => handleLimitChange(e.target.value)}
                    >
                        <option value="10" className="bg-brand-obsidian">10 Recs</option>
                        <option value="20" className="bg-brand-obsidian">20 Recs</option>
                        <option value="50" className="bg-brand-obsidian">50 Recs</option>
                        <option value="100" className="bg-brand-obsidian">100 Recs</option>
                    </select>
                </div>
                {meta && <ManagementPagination meta={meta} />}
            </div>

            {/* VIEW MODAL (Task 70-10) */}
            <CIModal
                isOpen={!!viewingMentor}
                onClose={() => setViewingMentor(null)}
                title="Professional Snapshot"
                size="xl"
            >
                {viewingMentor && (
                    <div className="flex flex-col gap-8 text-left py-2">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <StatusBadgeCell status={viewingMentor.verificationBadge} className="scale-125" />
                            </div>
                            
                            <UserInfoCell
                                name={viewingMentor.user?.name}
                                email={viewingMentor.user?.email}
                                image={viewingMentor.user?.profileImageUrl}
                                className="scale-125 origin-left"
                            />

                            <div className="hidden md:block h-16 w-px bg-white/10 mx-4" />

                            <div className="flex-1 space-y-1">
                                <p className="text-brand-acid text-sm font-black uppercase tracking-[0.15em] line-clamp-1">
                                    {viewingMentor.headline || viewingMentor.designation || "Senior Professional"}
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground/70">
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="size-3.5" />
                                        <span>{viewingMentor.currentWorkingPlace || "Independent"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="size-3.5" />
                                        <span>{viewingMentor.location || "Remote"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Contact & Professional Info */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 border-b border-white/5 pb-2">Communication & Reach</h4>
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Phone className="size-4 text-brand-acid" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tight">Direct Phone</p>
                                                <p className="text-sm font-medium">{viewingMentor.user?.phoneNumber || "Not Provided"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Briefcase className="size-4 text-brand-acid" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tight">Designation & Rank</p>
                                                <p className="text-sm font-medium">{viewingMentor.designation || "N/A"} ({viewingMentor.experience}+ Yrs)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 border-b border-white/5 pb-2">Social Footprint</h4>
                                    <div className="flex gap-3">
                                        {viewingMentor.linkedinUrl ? (
                                            <a href={viewingMentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all h-11">
                                                <ExternalLink className="size-4 text-brand-acid" />
                                                <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">LinkedIn</span>
                                            </a>
                                        ) : (
                                            <div className="px-4 py-2 bg-white/5 border border-white/5 border-dashed rounded-xl grayscale opacity-40 h-11 flex items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">No LinkedIn</span>
                                            </div>
                                        )}
                                        {viewingMentor.portfolioUrl && (
                                            <a href={viewingMentor.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                                                <Globe className="size-4 text-brand-acid" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expertise & Bio */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 border-b border-white/5 pb-2">Core Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {viewingMentor.mentorSpecialties?.map((ms: any) => (
                                            <span key={ms.id} className="px-3 py-1 bg-brand-acid/10 border border-brand-acid/20 text-brand-acid text-[10px] font-black uppercase rounded-md tracking-wider">
                                                {ms.specialty?.name}
                                            </span>
                                        ))}
                                        {!viewingMentor.mentorSpecialties?.length && <p className="text-[10px] text-muted-foreground/40 italic">No specialties listed.</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 border-b border-white/5 pb-2">Biography</h4>
                                    <p className="text-xs leading-relaxed text-foreground/70 bg-white/5 p-4 rounded-xl border border-white/5 line-clamp-6">
                                        {viewingMentor.bio || "No professional biography has been provided for this mentor profile."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CIModal>

            {/* EDIT MODAL (Task 70-11) */}
            <CIModal
                isOpen={!!editingMentor}
                onClose={() => setEditingMentor(null)}
                size="xl"
                title="Update Professional Record"
                description={`Adjusting systems and metadata for ${editingMentor?.user?.name}`}
            >
                {editingMentor && (
                    <MentorForm
                        action={updateMentorAction.bind(null, editingMentor.id)}
                        specialties={specialties}
                        defaultSpecialtyIds={editingMentor.mentorSpecialties?.map((ms: any) => ms.specialtyId)}
                        defaultValues={{
                            designation: editingMentor.designation,
                            currentWorkingPlace: editingMentor.currentWorkingPlace,
                            bio: editingMentor.bio,
                            experience: editingMentor.experience,
                            headline: editingMentor.headline,
                            location: editingMentor.location,
                            linkedinUrl: editingMentor.linkedinUrl,
                            portfolioUrl: editingMentor.portfolioUrl
                        }}
                        onSuccess={() => setEditingMentor(null)}
                        submitLabel="Push Updates"
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
