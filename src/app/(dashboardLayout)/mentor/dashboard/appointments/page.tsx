"use client";

import React, { useState, useEffect } from "react";
import { getMySessions, updateSessionStatus } from "@/services/session/session.action";
import { createActionPlan } from "@/services/session/action-plan.action";
import { ISession, SessionStatus } from "@/types/session";
import { MentorSessionCard } from "@/components/shared/session/MentorSessionCard";
import { CIModal } from "@/components/shared/CIModal";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Loader2, 
  Calendar, 
  Plus, 
  Trash2,
  ListTodo,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

// Action Plan Form Schema
const actionPlanSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  tasks: z.array(z.object({
    title: z.string().min(1, "Task title is required"),
    isDone: z.boolean(),
  })).min(1, "At least one task is required"),
  resources: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    url: z.string().url("Invalid URL"),
  })).optional(),
});

type ActionPlanFormValues = z.infer<typeof actionPlanSchema>;

export default function MentorAppointmentsPage() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed">("all");
  
  // Action Plan Modal State
  const [isAPModalOpen, setIsAPModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ActionPlanFormValues>({
    resolver: zodResolver(actionPlanSchema),
    defaultValues: {
      tasks: [{ title: "", isDone: false }],
      resources: [{ label: "", url: "" }],
    }
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({
    control,
    name: "tasks",
  });

  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
    control,
    name: "resources",
  });

  const fetchSessions = async () => {
    setLoading(true);
    const res = await getMySessions();
    if (res.success && res.data) {
      setSessions(res.data);
    } else {
      toast.error(res.message || "Failed to fetch appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateStatus = async (id: string, status: SessionStatus, version: number) => {
    const promise = updateSessionStatus(id, { status, version });

    toast.promise(promise, {
      loading: `Updating session status...`,
      success: (data) => {
        if (!data.success) throw new Error(data.message);
        fetchSessions();
        return "Session updated successfully";
      },
      error: (err) => err.message || "Update failed",
    });
  };

  const onSubmitActionPlan = async (values: ActionPlanFormValues) => {
    if (!selectedSession) return;

    const res = await createActionPlan({
      sessionId: selectedSession.id,
      ...values
    });

    if (res.success) {
      toast.success("Action plan submitted! Mentee has been notified.");
      setIsAPModalOpen(false);
      reset();
      fetchSessions();
    } else {
      toast.error(res.message || "Failed to submit action plan");
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === "pending") return s.status === SessionStatus.PENDING;
    if (filter === "confirmed") return s.status === SessionStatus.CONFIRMED || s.status === SessionStatus.ONGOING;
    if (filter === "completed") return s.status === SessionStatus.COMPLETED || s.status === SessionStatus.SETTLED;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Consultation Management
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic underline decoration-brand-acid/30 decoration-2 underline-offset-4">
            Confirmation, Join, and Outcome Lifecycle.
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-muted/20 border border-border/50 rounded-xl backdrop-blur-sm">
          {(["all", "pending", "confirmed", "completed"] as const).map((f) => (
            <Button
              key={f}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(f)}
              className={cn(
                "capitalize text-[10px] font-bold tracking-widest px-4",
                filter === f ? "bg-brand-acid text-black hover:bg-brand-acid/90" : "text-muted-foreground"
              )}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-brand-acid animate-spin" />
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-50">Syncing Delivery Board...</p>
        </div>
      ) : filteredSessions.length > 0 ? (
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <MentorSessionCard 
              key={session.id} 
              session={session} 
              onUpdateStatus={handleUpdateStatus}
              onJoin={(id) => window.open(`/meeting/${id}`, "_blank")}
              onCreateActionPlan={(s) => {
                setSelectedSession(s);
                setIsAPModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
          <Calendar className="size-10 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">No sessions {filter !== "all" ? `at state '${filter}'` : "found"}</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
            When mentees book your slots, they will appear here for confirmation.
          </p>
        </div>
      )}

      {/* Action Plan Modal */}
      <CIModal
        isOpen={isAPModalOpen}
        onClose={() => setIsAPModalOpen(false)}
        title="Create Action Plan"
        description={`Provide post-session goals and resources for ${selectedSession?.mentee?.user.name}`}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmitActionPlan)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Session Summary</label>
            <Textarea 
              placeholder="What did you discuss? What were the key takeaways?"
              className="bg-background/50 border-border/50 min-h-[120px]"
              {...register("summary")}
            />
            {errors.summary && <p className="text-[10px] text-rose-400 font-bold">{errors.summary.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logic: Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ListTodo className="size-3 text-brand-acid" />
                  Recommended Tasks
                </label>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => appendTask({ title: "", isDone: false })}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {taskFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input 
                      placeholder="e.g. Refactor portfolio repo"
                      className="bg-background/50 border-border/50"
                      {...register(`tasks.${index}.title` as const)}
                    />
                    {taskFields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeTask(index)}>
                        <Trash2 className="size-4 text-muted-foreground hover:text-rose-400" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logic: Resources */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ExternalLink className="size-3 text-brand-acid" />
                  Learning Resources
                </label>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => appendResource({ label: "", url: "" })}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {resourceFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="Label"
                      className="bg-background/50 border-border/50"
                      {...register(`resources.${index}.label` as const)}
                    />
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://..."
                        className="bg-background/50 border-border/50"
                        {...register(`resources.${index}.url` as const)}
                      />
                      {resourceFields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeResource(index)}>
                          <Trash2 className="size-4 text-muted-foreground hover:text-rose-400" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsAPModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-brand-acid text-black font-extrabold px-8">
              Submit Outcome
            </Button>
          </div>
        </form>
      </CIModal>
    </div>
  );
}
