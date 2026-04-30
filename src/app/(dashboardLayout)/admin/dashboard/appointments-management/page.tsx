"use client";

import React, { useState, useEffect } from "react";
import { getMySessions, updateSessionStatus } from "@/services/session/session.action";
import { ISession, SessionStatus } from "@/types/session";
import { SessionStatusBadge } from "@/components/shared/session/SessionStatusBadge";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Loader2, 
  Eye, 
  Settings2, 
  AlertCircle,
  MoreHorizontal,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminAppointmentsPage() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    // For ADMIN, this returns all platform sessions
    const res = await getMySessions();
    if (res.success && res.data) {
      setSessions(res.data);
    } else {
      toast.error(res.message || "Failed to fetch platform sessions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(s => 
    s.mentor?.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.mentee?.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Platform Appointments
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Global monitoring and oversight for all consulting sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, Mentor, or Mentee..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/20 border-border/50 focus:border-brand-acid/30 transition-all font-mono text-xs"
            />
          </div>
          <Button variant="outline" className="border-border/50 bg-muted/20">
            <Download className="size-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats (Mini) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", val: sessions.length, bg: "bg-blue-500/10 text-blue-400" },
          { label: "Pending Conf.", val: sessions.filter(s => s.status === SessionStatus.PENDING).length, bg: "bg-amber-500/10 text-amber-400" },
          { label: "Ongoing", val: sessions.filter(s => s.status === SessionStatus.ONGOING).length, bg: "bg-green-500/10 text-green-400" },
          { label: "Disputed", val: sessions.filter(s => s.status === SessionStatus.DISPUTED).length, bg: "bg-rose-500/10 text-rose-400", alert: true },
        ].map((stat, i) => (
          <div key={i} className={cn("p-4 rounded-2xl border border-border/50 backdrop-blur-sm", stat.bg)}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</p>
            <p className="text-2xl font-black mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border/50 bg-muted/10 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="size-8 text-brand-acid animate-spin" />
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-50">Auditing Global Ledger...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-background/50">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest py-4">ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Mentor / Mentee</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Schedule</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Value</TableHead>
                <TableHead className="text-right py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id} className="group border-border/50 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{session.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{session.mentor?.user.name}</span>
                        <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 py-0.5 px-1.5 rounded uppercase tracking-tighter">Mentor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">{session.mentee?.user.name}</span>
                        <span className="text-[9px] font-black bg-brand-acid/10 text-brand-acid py-0.5 px-1.5 rounded uppercase tracking-tighter">Mentee</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">{format(new Date(session.startTime), "MMM dd, yyyy")}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(session.startTime), "hh:mm a")} ({session.durationMinutes}m)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SessionStatusBadge status={session.status} className="scale-90 origin-left" />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-black text-brand-acid">${Number(session.priceAtBooking).toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="hover:bg-white/10">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-border/50">
                        <DropdownMenuItem className="text-xs font-bold gap-2">
                          <Eye className="size-3.5" /> View Logistics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold gap-2">
                          <Settings2 className="size-3.5" /> Force Lifecycle Jump
                        </DropdownMenuItem>
                        {session.status === SessionStatus.DISPUTED && (
                          <DropdownMenuItem className="text-xs font-bold gap-2 text-rose-400 bg-rose-500/10">
                            <AlertCircle className="size-3.5" /> Resolve Dispute
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && filteredSessions.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-bold text-muted-foreground/50 uppercase tracking-widest">No matching records found in platform logs</p>
        </div>
      )}
    </div>
  );
}
