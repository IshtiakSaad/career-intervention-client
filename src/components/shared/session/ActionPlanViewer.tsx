"use client";

import React from "react";
import { IActionPlan } from "@/types/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ClipboardList, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Calendar,
  FileText,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionPlanViewerProps {
  plan: IActionPlan;
  className?: string;
}

export const ActionPlanViewer = ({ plan, className }: ActionPlanViewerProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden bg-muted/10 border-border/50 backdrop-blur-xl shadow-2xl rounded-3xl",
      className
    )}>
      {/* Premium Decorative Gradient */}
      <div className="absolute -top-24 -right-24 size-64 bg-brand-acid/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-acid/20 via-brand-acid/50 to-brand-acid/20" />

      <CardHeader className="pt-8 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-acid/10 border border-brand-acid/20">
              <Sparkles className="size-5 text-brand-acid" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">
                Your Career Roadmap
              </CardTitle>
              <CardDescription className="font-medium text-muted-foreground/70">
                Created on {new Date(plan.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </CardDescription>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 py-1 rounded-full border border-border bg-background/50">
              Outcome Document v{plan.version}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-10 space-y-10">
        
        {/* Summary Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-acid flex items-center gap-2">
            <FileText className="size-3.5" />
            Executive Summary
          </h3>
          <div className="p-6 rounded-2xl bg-background/40 border border-border/50 shadow-inner group">
            <p className="text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap italic">
              "{plan.summary}"
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Tasks Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-acid flex items-center gap-2">
              <ClipboardList className="size-3.5" />
              Priority Actions
            </h3>
            <div className="space-y-3">
              {plan.tasks.map((task, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border transition-all duration-300",
                    task.isDone 
                      ? "bg-brand-acid/5 border-brand-acid/20 opacity-80" 
                      : "bg-background/20 border-border/50 hover:border-brand-acid/30"
                  )}
                >
                  <div className="mt-0.5">
                    {task.isDone ? (
                      <CheckCircle2 className="size-5 text-brand-acid" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-bold",
                      task.isDone ? "text-muted-foreground line-through decoration-brand-acid/50" : "text-foreground"
                    )}>
                      {task.title}
                    </p>
                    {task.deadline && (
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <Calendar className="size-3" />
                        Target: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-acid flex items-center gap-2">
              <ExternalLink className="size-3.5" />
              Knowledge Vault
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {plan.resources?.map((res, idx) => (
                <a 
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-background/20 border border-border/50 hover:border-brand-acid/30 hover:bg-brand-acid/5 transition-all group"
                >
                  <span className="text-sm font-bold text-foreground group-hover:text-brand-acid transition-colors">
                    {res.label}
                  </span>
                  <div className="p-1.5 rounded-lg bg-muted/20 text-muted-foreground group-hover:bg-brand-acid group-hover:text-black transition-all">
                    <ArrowUpRight className="size-4" />
                  </div>
                </a>
              ))}
              {!plan.resources?.length && (
                <p className="text-xs font-medium text-muted-foreground italic bg-muted/10 p-4 rounded-xl border border-dashed border-border/50">
                  No external resources attached.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Notes Footnote */}
        {plan.notes && (
          <section className="pt-6 border-t border-border/50">
            <div className="flex items-start gap-3 text-muted-foreground/60 italic text-sm font-medium">
              <span className="text-brand-acid not-italic font-black text-xs uppercase tracking-widest mt-1">Note:</span>
              <p>{plan.notes}</p>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
};
