"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getMySlots, createAvailabilitySlots, deleteSlot, bulkCreateAvailabilitySlotsAction, bulkDeleteSlotsByDateRange } from "@/services/session/slot.action";
import { getMyOfferings } from "@/services/offering/offering.action";
import { IAvailabilitySlot } from "@/types/session";
import { toast } from "sonner";
import { Plus, Trash2, Clock, Loader2, Info, CalendarCheck, Layers, CalendarDays, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const WEEKDAYS = [
  { label: "Sunday", short: "Sun", value: 0 },
  { label: "Monday", short: "Mon", value: 1 },
  { label: "Tuesday", short: "Tue", value: 2 },
  { label: "Wednesday", short: "Wed", value: 3 },
  { label: "Thursday", short: "Thu", value: 4 },
  { label: "Friday", short: "Fri", value: 5 },
  { label: "Saturday", short: "Sat", value: 6 },
];

export default function MySchedulesPage() {
  const [slots, setSlots] = useState<IAvailabilitySlot[]>([]);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"agenda" | "bulk">("agenda");

  // Shared State
  const [selectedServiceId, setSelectedServiceId] = useState("");

  // Single Mode State
  const [singleStartDateTime, setSingleStartDateTime] = useState("");

  // Bulk Mode State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [dailyStartTime, setDailyStartTime] = useState("");
  const [dailyEndTime, setDailyEndTime] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [slotsRes, offeringsRes] = await Promise.all([
      getMySlots(),
      getMyOfferings()
    ]);

    if (slotsRes.success && slotsRes.data) {
      setSlots(slotsRes.data);
    } else {
      toast.error(slotsRes.message || "Failed to fetch slots");
    }

    if (offeringsRes.success && offeringsRes.data) {
      setOfferings(offeringsRes.data);
      if (offeringsRes.data.length > 0 && !selectedServiceId) {
        setSelectedServiceId(offeringsRes.data[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !singleStartDateTime) {
      toast.error("Please select a service and start time.");
      return;
    }

    const service = offerings.find(o => o.id === selectedServiceId);
    if (!service) return;

    const start = new Date(singleStartDateTime);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    setSubmitting(true);
    const res = await createAvailabilitySlots({
      serviceId: selectedServiceId,
      slots: [{
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      }]
    });

    if (res.success) {
      toast.success("Availability slot created.");
      setSingleStartDateTime("");
      fetchData();
    } else {
      toast.error(res.message || "Failed to create slot.");
    }
    setSubmitting(false);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !startDate || !endDate || selectedWeekdays.length === 0 || !dailyStartTime || !dailyEndTime) {
      toast.error("Please fill in all bulk parameters.");
      return;
    }

    setSubmitting(true);
    const idempotencyKey = crypto.randomUUID();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const res = await bulkCreateAvailabilitySlotsAction({
      serviceId: selectedServiceId,
      startDate,
      endDate,
      weekdays: selectedWeekdays,
      dailyStartTime,
      dailyEndTime,
      timezone
    }, idempotencyKey);

    if (res.success) {
      toast.success(`Generated ${res.data?.created || 0} slots safely. Skipped ${res.data?.skipped || 0} overlaps.`);
      setActiveTab("agenda");
      fetchData();
    } else {
      toast.error(res.message || "Failed to generate bulk slots.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteSlot(id);
    if (res.success) {
      toast.success("Slot removed");
      fetchData();
    } else {
      toast.error(res.message || "Failed to remove slot");
    }
  };

  const handleClearDay = async (dateStr: string) => {
    if (!confirm(`Are you sure you want to clear all available slots for ${format(new Date(`${dateStr}T00:00:00`), "MMM do")}?`)) return;
    
    // Create boundaries for the day in UTC
    const startObj = new Date(`${dateStr}T00:00:00`);
    const endObj = new Date(`${dateStr}T23:59:59.999`);
    
    setSubmitting(true);
    const res = await bulkDeleteSlotsByDateRange(startObj.toISOString(), endObj.toISOString());
    
    if (res.success) {
      toast.success(`Cleared ${res.deletedCount} available slots from your agenda.`);
      fetchData();
    } else {
      toast.error(res.message || "Failed to clear the day.");
    }
    setSubmitting(false);
  };

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  // Mathematical Grouping for Agenda
  const groupedSlots = useMemo(() => {
    const groups = slots.reduce((acc, slot) => {
      const dateKey = format(new Date(slot.startTime), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    }, {} as Record<string, IAvailabilitySlot[]>);

    // Sort slots within each day
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });

    return groups;
  }, [slots]);

  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in py-6 md:py-10">
      
      {/* Header & Global Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Mentorship <span className="text-brand-acid">Calendar</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Control your calendar inventory. Select a consultation type below to mathematically lock duration and break metrics.
          </p>
        </div>

        <div className="w-full lg:w-72 space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Service Context</label>
          <select 
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full h-11 bg-muted/20 border border-border/50 text-foreground font-bold text-sm rounded-xl px-4 focus:ring-1 focus:border-brand-acid transition-all"
          >
            {offerings.map(o => (
              <option key={o.id} value={o.id}>{o.title} ({o.durationMinutes}m + {o.bufferMinutes || 0}m break)</option>
            ))}
            {offerings.length === 0 && <option value="">No services available</option>}
          </select>
        </div>
      </div>

      {/* Master Tabs */}
      <div className="flex bg-muted/10 p-1.5 rounded-2xl border border-border/50 max-w-md mx-auto lg:mx-0">
        <button 
          onClick={() => setActiveTab('agenda')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50",
            activeTab === 'agenda' ? "bg-brand-acid text-black shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <CalendarDays className="size-4" />
          Agenda Detail
        </button>
        <button 
          onClick={() => setActiveTab('bulk')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50",
            activeTab === 'bulk' ? "bg-brand-acid text-black shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <Layers className="size-4" />
          Bulk Engine
        </button>
      </div>

      {/* Tab Content: AGENDA */}
      {activeTab === 'agenda' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Quick Add Bar */}
          <div className="bg-brand-acid/5 border border-brand-acid/20 rounded-2xl p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="p-2.5 rounded-xl bg-brand-acid/20">
                <Zap className="size-5 text-brand-acid" />
              </div>
              <div>
                <h3 className="font-black text-brand-acid">Deploy Fast Slot</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Injects safely into the current service context</p>
              </div>
            </div>
            
            <form onSubmit={handleSingleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Input 
                type="datetime-local" 
                value={singleStartDateTime}
                onChange={(e) => setSingleStartDateTime(e.target.value)}
                required
                className="w-full sm:w-64 bg-background border-border/50 h-11 rounded-xl"
              />
              <Button type="submit" disabled={submitting || !selectedServiceId} className="w-full sm:w-auto h-11 bg-white text-black hover:bg-white/90 font-black rounded-xl px-8">
                {submitting ? <Loader2 className="size-4 animate-spin" /> : "Deploy"}
              </Button>
            </form>
          </div>

          {/* Agenda List */}
          <div className="space-y-10">
            {loading ? (
              <div className="py-32 flex flex-col items-center gap-4">
                <Loader2 className="size-10 text-brand-acid animate-spin" />
                <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Syncing Calendar...</p>
              </div>
            ) : sortedDates.length > 0 ? (
              sortedDates.map((date) => (
                <div key={date} className="space-y-4 relative">
                  {/* Date Header */}
                  <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-3 flex items-center gap-4">
                    <h2 className="text-xl font-black text-foreground">
                      {format(new Date(`${date}T00:00:00`), "EEEE, MMMM do")}
                    </h2>
                    <div className="h-px bg-border/50 flex-1" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleClearDay(date)}
                      disabled={submitting}
                      className="text-xs font-bold border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      Clear Day
                    </Button>
                  </div>

                  {/* Horizontal Rows */}
                  <div className="grid gap-3">
                    {groupedSlots[date].map((slot) => (
                      <div 
                        key={slot.id} 
                        className={cn(
                          "group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-500",
                          slot.status === "BOOKED" 
                            ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/40 shadow-[0_0_20px_-5px_rgba(245,158,11,0.25)] scale-[1.01]" 
                            : "bg-muted/10 border-border/50 hover:border-brand-acid/40"
                        )}
                      >
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "flex items-center justify-center w-28 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase",
                            slot.status === "BOOKED" ? "bg-amber-400 text-black shadow-md shadow-amber-500/20" : "bg-emerald-500/20 text-emerald-400"
                          )}>
                            {slot.status === "BOOKED" ? "★ BOOKED" : slot.status}
                          </div>
                          <div className="flex items-center gap-3 text-lg font-bold">
                            <Clock className={cn("size-5", slot.status === "BOOKED" ? "text-amber-500" : "text-brand-acid")} />
                            <span className="text-foreground">{format(new Date(slot.startTime), "hh:mm a")}</span>
                            <span className="text-muted-foreground px-2">→</span>
                            <span className="text-muted-foreground">{format(new Date(slot.endTime), "hh:mm a")}</span>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 flex items-center justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(slot.id)}
                            disabled={slot.status === "BOOKED"}
                            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors size-10 rounded-xl"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-border/30 rounded-3xl bg-muted/5">
                <CalendarCheck className="size-16 text-muted-foreground/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-foreground">Empty Agenda</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2">
                  You have zero slots booked or available. Switch to the Bulk Engine to define your active weeks instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: BULK GENERATOR */}
      {activeTab === 'bulk' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-muted/10 border border-border/50 rounded-3xl p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10">
              
              <div className="text-center space-y-2">
                <Layers className="size-12 text-brand-acid mx-auto mb-4" />
                <h2 className="text-3xl font-black text-foreground">Algorithmic Block Generator</h2>
                <p className="text-muted-foreground font-medium">
                  We calculate duration, buffers, and timezone intersections server-side. You just define the bounds.
                </p>
              </div>

              <form onSubmit={handleBulkSubmit} className="space-y-10">
                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-acid">1. Generation Span</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Start Date</label>
                      <Input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 bg-background border-border/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">End Date</label>
                      <Input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 bg-background border-border/50 rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Weekdays */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-acid">2. Active Days</h3>
                  <div className="flex flex-wrap gap-3">
                    {WEEKDAYS.map(day => (
                      <button 
                        key={day.value}
                        type="button"
                        onClick={() => toggleWeekday(day.value)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-sm font-black transition-all border",
                          selectedWeekdays.includes(day.value) 
                            ? "bg-brand-acid text-black border-brand-acid shadow-lg shadow-brand-acid/20" 
                            : "bg-background/50 border-border/50 text-muted-foreground hover:border-brand-acid/50 hover:text-foreground"
                        )}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Times */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-acid">3. Daily Window Boundary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Daily Start Time</label>
                      <Input type="time" required value={dailyStartTime} onChange={(e) => setDailyStartTime(e.target.value)} className="h-12 bg-background border-border/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Daily End Time</label>
                      <Input type="time" required value={dailyEndTime} onChange={(e) => setDailyEndTime(e.target.value)} className="h-12 bg-background border-border/50 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="p-4 rounded-xl bg-brand-acid/10 border border-brand-acid/20 flex gap-4 mb-6">
                    <Info className="size-5 text-brand-acid shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-brand-acid/80 leading-relaxed">
                      Overlap prevention is active. This engine will skip inserting into any time blocks that conflict with existing agenda items or required break buffers.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submitting || offerings.length === 0} 
                    className="w-full h-14 bg-brand-acid text-black text-lg font-black uppercase tracking-widest rounded-xl hover:bg-brand-acid/90 shadow-xl shadow-brand-acid/10"
                  >
                    {submitting ? <Loader2 className="size-6 animate-spin" /> : "Initiate Generator"}
                  </Button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
