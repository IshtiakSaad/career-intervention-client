import { getMyActionPlans } from "@/services/session/action-plan.action";
import { ActionPlanViewer } from "@/components/shared/session/ActionPlanViewer";
import { ClipboardList, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * PRODUCTION-GRADE SERVER COMPONENT (v5.0)
 * Uses high-performance server-side data fetching.
 * Keeps interactivity contained within the ActionPlanViewer Client Component.
 */
export default async function MyActionPlansPage() {
  const res = await getMyActionPlans();
  const plans = res.success ? res.data || [] : [];
  const error = !res.success ? res.message : null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          My Outcome Vault
        </h1>
        <p className="text-muted-foreground mt-1 font-medium italic underline decoration-brand-acid/30 decoration-2 underline-offset-4">
          Access your personalized action plans, tasks, and consulting outcomes.
        </p>
      </div>

      {error ? (
        <div className="py-12 px-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="size-10 text-rose-500" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Syncing Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Link 
            href="/dashboard/my-action-plans" 
            className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
          >
            Retry Synchronization
          </Link>
        </div>
      ) : plans.length > 0 ? (
        <div className="space-y-16">
          {plans.map((plan) => (
            <div key={plan.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-brand-acid animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Deliverable ID: {plan.id.slice(0, 8)}
                  </span>
                </div>
                <Link 
                  href={`/dashboard/my-action-plans/${plan.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-brand-acid/30 hover:bg-brand-acid/10 hover:text-brand-acid transition-all")}
                >
                  <FileText className="size-4 mr-2" />
                  View Full Document
                </Link>
              </div>
              <ActionPlanViewer plan={plan} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
          <ClipboardList className="size-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold tracking-tight text-foreground">No outcomes archived</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm leading-relaxed">
            Action plans are created by your mentor after your sessions are completed. 
            Once your first session is finalized, your personalized roadmap will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
