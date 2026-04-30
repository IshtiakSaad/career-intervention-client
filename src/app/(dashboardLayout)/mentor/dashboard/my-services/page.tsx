import React from "react";
import { Metadata } from "next";
import { getMyOfferings } from "@/services/offering/offering.action";
import { ServiceOfferingManager } from "@/components/shared/mentor/ServiceOfferingManager";
import { Sparkles, Info } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Consultation Types | Mentor Dashboard",
  description: "Manage your mentorship services, pricing, and durations.",
};

export default async function MyServicesPage() {
  const offeringsRes = await getMyOfferings();

  if (!offeringsRes.success) {
    if (offeringsRes.message === "Unauthorized") {
      redirect("/login");
    }
  }

  const offerings = offeringsRes.data || [];

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-border/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-acid/10 border border-brand-acid/20">
            <Sparkles className="size-3.5 text-brand-acid" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-acid">Service Lifecycle</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Consultation <span className="text-brand-acid">Types</span></h1>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Provision your expertise by defining structured consultation services. These settings determine how mentees find, select, and book you in the Discovery Hub.
          </p>
        </div>
      </header>

      {offerings.length === 0 && (
        <div className="p-4 rounded-2xl bg-brand-acid/5 border border-brand-acid/20 flex gap-4">
          <Info className="size-5 text-brand-acid shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-brand-acid uppercase tracking-wider">Public Profile Visibility</p>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Your profile currently shows <span className="text-foreground">$0/session</span> on the Discovery Hub. Adding at least one consultation type will activate your pricing and allow mentees to book sessions.
            </p>
          </div>
        </div>
      )}

      <ServiceOfferingManager initialOfferings={offerings} />
    </div>
  );
}
