"use client";

import React, { useState, useEffect } from "react";
import { getAllSlotsAction } from "@/services/mentor/mentor.action";
import { 
  Search, 
  Filter, 
  Loader2, 
  Calendar, 
  Clock, 
  User, 
  Activity,
  Trash2,
  CheckCircle2,
  XCircle
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SchedulesManagementPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchSlots = async () => {
    setLoading(true);
    const res = await getAllSlotsAction({
        status: statusFilter === "all" ? undefined : statusFilter
    });
    if (res.success && res.data) {
      setSlots(res.data);
    } else {
      toast.error(res.message || "Failed to fetch platform slots");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, [statusFilter]);

  const filteredSlots = slots.filter(slot => 
    slot.mentor?.user?.name.toLowerCase().includes(search.toLowerCase()) ||
    slot.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "BOOKED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "EXPIRED": return "bg-muted/10 text-muted-foreground border-border/50";
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
            Global <span className="text-brand-acid">Schedules</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Oversight of all mentor availability windows and platform inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search mentor..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/20 border-border/50 focus:border-brand-acid/30 transition-all font-mono text-xs"
            />
          </div>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-full md:w-40 bg-muted/20 border-border/50 font-bold text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
              <SelectItem value="all" className="text-xs font-bold font-sans">All Inventory</SelectItem>
              <SelectItem value="AVAILABLE" className="text-xs font-bold font-sans">Available Only</SelectItem>
              <SelectItem value="BOOKED" className="text-xs font-bold font-sans">Booked Only</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={fetchSlots}
            className="border-border/50 bg-muted/20 hover:bg-white/10"
          >
            <Activity className="size-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Slots", val: slots.length, Icon: Calendar, color: "text-blue-400" },
          { label: "Available", val: slots.filter(s => s.status === "AVAILABLE").length, Icon: CheckCircle2, color: "text-green-400" },
          { label: "Booked", val: slots.filter(s => s.status === "BOOKED").length, Icon: Clock, color: "text-brand-acid" },
          { label: "Occupancy", val: slots.length ? `${Math.round((slots.filter(s => s.status === "BOOKED").length / slots.length) * 100)}%` : "0%", Icon: Activity, color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl border border-border/50 bg-muted/5 flex items-center justify-between group hover:border-brand-acid/20 transition-all">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn("text-2xl font-black", stat.color)}>{stat.val}</p>
            </div>
            <div className={cn("p-2 rounded-xl bg-muted/10 border border-border/30 group-hover:scale-110 transition-transform", stat.color)}>
              <stat.Icon className="size-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Slots Ledger */}
      <div className="rounded-3xl border border-border/50 bg-muted/10 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="size-10 text-brand-acid animate-spin" />
            <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-50">Indexing Temporal Database...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-background/50">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[120px] text-[10px] font-black uppercase tracking-widest py-5">Slot ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Origin (Mentor)</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Temporal Window</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 text-center">Lifecycle</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">System Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlots.map((slot) => (
                <TableRow key={slot.id} className="group border-border/50 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{slot.id.slice(0, 13)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-full bg-brand-acid/10 border border-brand-acid/20 flex items-center justify-center">
                        <User className="size-3.5 text-brand-acid" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-foreground">{slot.mentor?.user?.name || "Unlinked"}</p>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Verified Mentor</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground flex items-center gap-2">
                        <Calendar className="size-3 text-brand-acid" />
                        {format(new Date(slot.startTime), "MMM dd, yyyy")}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                        <Clock className="size-3" />
                        {format(new Date(slot.startTime), "hh:mm a")} – {format(new Date(slot.endTime), "hh:mm a")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      getStatusStyle(slot.status)
                    )}>
                      {slot.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {format(new Date(slot.createdAt), "MMM dd, HH:mm")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && filteredSlots.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-border/30 rounded-3xl bg-muted/5">
          <XCircle className="size-10 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xs font-black tracking-widest text-muted-foreground/50 uppercase">Zero-result temporal intersection</p>
        </div>
      )}
    </div>
  );
}
