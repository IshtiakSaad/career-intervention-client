"use client";

import React, { useState, useEffect } from "react";
import { getMySessions, updateSessionStatus } from "@/services/session/session.action";
import { getMyActionPlans } from "@/services/session/action-plan.action";
import { ISession, SessionStatus, IActionPlan } from "@/types/session";
import { SessionCard } from "@/components/shared/session/SessionCard";
import { ActionPlanViewer } from "@/components/shared/session/ActionPlanViewer";
import { toast } from "sonner";
import { Calendar, Filter, Search, Loader2, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MyAppointmentsPage() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");
  const [search, setSearch] = useState("");

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

  const handleCancel = async (id: string, version: number) => {
    const promise = updateSessionStatus(id, { 
      status: SessionStatus.CANCELLED_BY_MENTEE,
      version 
    });

    toast.promise(promise, {
      loading: "Cancelling appointment...",
      success: (data) => {
        if (!data.success) throw new Error(data.message);
        fetchSessions();
        return "Appointment cancelled successfully";
      },
      error: (err) => err.message || "Failed to cancel appointment",
    });
  };

  const handleJoin = (id: string) => {
    toast.info("Connecting to secure consultation room...", {
      description: "Join tracking is active for evidence baseline.",
    });
    // Implementation for meeting room redirect would go here
    window.open(`/meeting/${id}`, "_blank");
  };

  const filteredSessions = sessions.filter(s => {
    // Role logic: assuming mentee view
    const isPast = [
      SessionStatus.COMPLETED, 
      SessionStatus.SETTLED, 
      SessionStatus.CANCELLED_BY_MENTEE, 
      SessionStatus.CANCELLED_BY_MENTOR,
      SessionStatus.EXPIRED,
      SessionStatus.REFUNDED,
      SessionStatus.REJECTED
    ].includes(s.status);

    if (filter === "active" && isPast) return false;
    if (filter === "past" && !isPast) return false;

    if (search) {
      return s.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
             s.mentor?.user.name.toLowerCase().includes(search.toLowerCase());
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            My Appointments
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage your career consulting sessions and track your progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search mentor or service..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/20 border-border/50 focus:border-brand-acid/30 transition-all"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/50 bg-muted/20">
                <Filter className="size-4 mr-2" />
                {filter === "all" ? "All Status" : filter === "active" ? "Active" : "Past"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-background/95 backdrop-blur-xl border-border/50">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Sessions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("active")}>Active Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("past")}>Past Sessions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-8 text-brand-acid animate-spin" />
          <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase opacity-50">
            Synchronizing Lifestyle Data...
          </p>
        </div>
      ) : filteredSessions.length > 0 ? (
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <SessionCard 
              key={session.id} 
              session={session} 
              onCancel={handleCancel}
              onJoin={handleJoin}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
          <div className="size-16 rounded-3xl bg-muted/20 border border-border flex items-center justify-center mb-4">
            <Calendar className="size-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">No appointments found</h3>
          <p className="text-muted-foreground max-w-xs mt-1">
            {search || filter !== "all" 
              ? "Try adjusting your filters or search query." 
              : "You haven't booked any sessions yet. Start your career journey today!"}
          </p>
          {!search && filter === "all" && (
            <Link 
              href="/mentors" 
              className={cn(buttonVariants({ variant: "default" }), "mt-6 bg-brand-acid text-black font-bold")}
            >
              Find a Mentor
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Internal Link helper removed, using real Next.js Link

