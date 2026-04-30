"use client";

import React, { useState, useEffect } from "react";
import { CIModal } from "@/components/shared/CIModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getMentorSlots, 
  bookSession 
} from "@/services/session/booking.action";
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: any;
  userRole?: string;
}

export const BookingModal = ({ isOpen, onClose, mentor, userRole }: BookingModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch slots when step 2 is reached OR when modal opens
  useEffect(() => {
    if (isOpen && mentor) {
      setLoadingSlots(true);
      getMentorSlots(mentor.id).then(res => {
        if (res.success) setSlots(res.data);
        setLoadingSlots(false);
      });
    }
  }, [isOpen, mentor]);

  const handleBooking = async () => {
    if (userRole !== "MENTEE") {
      toast.error("Role Error", {
        description: "Only Mentee accounts can book sessions. Please switch roles or login as a mentee."
      });
      return;
    }

    if (!selectedService || !selectedSlot) return;

    setBookingLoading(true);
    const res = await bookSession({
      serviceOfferingId: selectedService.id,
      availabilitySlotId: selectedSlot.id,
    });

    if (res.success) {
      toast.success("Booking Request Sent!", {
        description: `Your session with ${mentor.user.name} is now pending confirmation.`
      });
      onClose();
      // Reset state for next time
      setStep(1);
      setSelectedService(null);
      setSelectedSlot(null);
    } else {
      toast.error(res.message);
    }
    setBookingLoading(false);
  };

  return (
    <CIModal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "Select Consultation Type" : "Pick Your Time"}
      description={step === 1 ? `How would you like to work with ${mentor.user.name}?` : "Choose an available window from their schedule."}
      size="lg"
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((i) => (
            <div 
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                step >= i ? "bg-brand-acid shadow-[0_0_10px_rgba(202,255,0,0.3)]" : "bg-muted/30"
              )}
            />
          ))}
        </div>

        {step === 1 ? (
          /* Step 1: Service Selection */
          <div className="grid gap-4">
            {mentor.serviceOfferings?.map((service: any) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-300 group",
                  selectedService?.id === service.id 
                    ? "border-brand-acid bg-brand-acid/5 shadow-inner" 
                    : "border-border/50 bg-background/40 hover:border-brand-acid/30 hover:bg-muted/20"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className={cn("size-4 transition-colors", selectedService?.id === service.id ? "text-brand-acid" : "text-muted-foreground")} />
                    <span className="font-black text-foreground">{service.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {service.durationMinutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="size-3" />
                      {service.currency} ${service.price}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedService?.id === service.id 
                    ? "bg-brand-acid border-brand-acid text-black" 
                    : "border-muted-foreground/30 group-hover:border-brand-acid/50"
                )}>
                  {selectedService?.id === service.id && <CheckCircle2 className="size-4" />}
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Step 2: Slot Selection */
          <div className="space-y-4">
            {loadingSlots ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <Loader2 className="size-8 text-brand-acid animate-spin" />
                <p className="text-xs font-black tracking-widest text-muted-foreground uppercase opacity-50">Syncing Availability...</p>
              </div>
            ) : (() => {
                const compatibleSlots = slots.filter(slot => {
                  const durationMs = new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime();
                  const requiredMs = (selectedService?.durationMinutes || 0) * 60 * 1000;
                  return durationMs >= requiredMs;
                });

                if (compatibleSlots.length > 0) {
                  return (
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {compatibleSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "p-4 rounded-xl border flex flex-col items-center gap-1 transition-all text-center",
                            selectedSlot?.id === slot.id
                              ? "bg-brand-acid border-brand-acid text-black shadow-lg shadow-brand-acid/20"
                              : "bg-muted/10 border-border/50 hover:border-brand-acid/30"
                          )}
                        >
                          <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                            {format(new Date(slot.startTime), "EEE, d MMM")}
                          </span>
                          <span className="text-sm font-black">
                            {format(new Date(slot.startTime), "hh:mm a")}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                }

                return (
                  <div className="py-12 text-center rounded-3xl bg-muted/5 border border-dashed border-border/50 space-y-3">
                    <div className="size-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                       <Info className="size-6 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground lowercase first-letter:uppercase">No matching slots for this duration</h4>
                      <p className="text-xs text-muted-foreground max-w-[240px] mx-auto mt-1">
                        A {selectedService?.durationMinutes}m session requires a larger time window. Try selecting a shorter consultation type or check back later.
                      </p>
                    </div>
                  </div>
                );
            })()}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-8 border-t border-border/50 flex justify-between items-center bg-background/50">
          <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(1)} className="font-bold">
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          {step === 1 ? (
            <Button 
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="bg-brand-acid text-black font-extrabold px-8 group"
            >
              Continue to Slots
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button 
              disabled={!selectedSlot || bookingLoading}
              onClick={handleBooking}
              className="bg-brand-acid text-black font-extrabold px-10 relative overflow-hidden group"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          )}
        </div>
      </div>
    </CIModal>
  );
};
