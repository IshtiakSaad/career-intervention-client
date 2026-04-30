"use client";

import React, { useState, useActionState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CIModal } from "@/components/shared/CIModal";
import { FieldError } from "@/components/shared/forms/FieldError";
import { toast } from "sonner";
import { 
  createOfferingAction, 
  updateOfferingAction, 
  deleteOfferingAction 
} from "@/services/offering/offering.action";
import { cn } from "@/lib/utils";

interface ServiceOfferingManagerProps {
  initialOfferings: any[];
}

export const ServiceOfferingManager = ({ initialOfferings }: ServiceOfferingManagerProps) => {
  const [offerings, setOfferings] = useState(initialOfferings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<any>(null);

  // Form Action State
  const [state, formAction, isPending] = useActionState(
    editingOffering 
      ? updateOfferingAction.bind(null, editingOffering.id) 
      : createOfferingAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setIsModalOpen(false);
      setEditingOffering(null);
      // Hard refresh or local state sync - here we assume the page will revalidate
      window.location.reload(); 
    } else if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to retire this consultation type?")) return;
    
    const res = await deleteOfferingAction(id);
    if (res && res.success) {
      toast.success(res.message);
      setOfferings(prev => prev.filter(o => o.id !== id));
    } else {
      toast.error(res?.message || "Deletion failed");
    }
  };

  const openEdit = (offering: any) => {
    setEditingOffering(offering);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingOffering(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground uppercase">Consultation Portfolio</h2>
          <p className="text-sm text-muted-foreground font-medium">Define your consultation types, durations, and baseline pricing.</p>
        </div>
        <Button 
          onClick={openAdd}
          className="bg-brand-acid text-black font-black uppercase tracking-widest rounded-xl px-6"
        >
          <Plus className="size-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {offerings.length > 0 ? (
          offerings.map((offering) => (
            <div 
              key={offering.id}
              className="group relative overflow-hidden bg-muted/10 border border-border/50 rounded-2xl p-6 hover:border-brand-acid/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-brand-acid/10 border border-brand-acid/20">
                    <Sparkles className="size-4 text-brand-acid" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openEdit(offering)}
                      className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(offering.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-lg text-foreground tracking-tight group-hover:text-brand-acid transition-colors">
                    {offering.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium line-clamp-2 mt-1">
                    {offering.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-border/30 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-brand-acid" />
                    <span className="text-xs font-bold text-foreground">{offering.durationMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-brand-acid" />
                    <span className="text-sm font-black text-foreground">${offering.price}</span>
                  </div>
                </div>
              </div>

              {!offering.isActive && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20">Inactive</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border/30 rounded-3xl bg-muted/5">
            <Sparkles className="size-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">No consultation types yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">Start by adding your first service offering to become visible on the Discovery Hub.</p>
          </div>
        )}
      </div>

      <CIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffering ? "Edit Consultation Type" : "Add Consultation Type"}
        description="Configure how mentees perceive and book this service."
        size="md"
      >
        <form action={formAction} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Service Title</Label>
              <Input 
                id="title"
                name="title"
                defaultValue={editingOffering?.title}
                placeholder="e.g. 1-on-1 Career Strategy"
                className="h-12 bg-white/5 border-white/10 rounded-xl"
              />
              <FieldError errors={state?.errors} name="title" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="durationMinutes" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration (Min)</Label>
                <Input 
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  defaultValue={editingOffering?.durationMinutes || 60}
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                />
                <FieldError errors={state?.errors} name="durationMinutes" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bufferMinutes" className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">Break (Min)</Label>
                <Input 
                  id="bufferMinutes"
                  name="bufferMinutes"
                  type="number"
                  defaultValue={editingOffering?.bufferMinutes || 0}
                  className="h-12 bg-emerald-500/5 border-emerald-500/20 text-emerald-400 rounded-xl focus-visible:ring-emerald-500/30"
                  placeholder="e.g. 15"
                />
                <FieldError errors={state?.errors} name="bufferMinutes" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price (USD)</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingOffering?.price || 50}
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                />
                <FieldError errors={state?.errors} name="price" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea 
                id="description"
                name="description"
                defaultValue={editingOffering?.description}
                placeholder="What can the mentee expect from this session?"
                className="min-h-[100px] bg-white/5 border-white/10 rounded-xl resize-none"
              />
              <FieldError errors={state?.errors} name="description" />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 font-bold h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="flex-[2] bg-brand-acid text-black font-black uppercase tracking-widest h-12 rounded-xl"
            >
              {isPending ? <Loader2 className="size-5 animate-spin" /> : (editingOffering ? "Update Service" : "Deploy Service")}
            </Button>
          </div>
        </form>
      </CIModal>
    </div>
  );
};
