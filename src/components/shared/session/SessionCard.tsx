"use client";

import React from "react";
import { ISession, SessionStatus } from "@/types/session";
import { SessionStatusBadge } from "./SessionStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  FileText, 
  ArrowRight, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: ISession;
  onCancel?: (id: string, version: number) => void;
  onJoin?: (id: string) => void;
}

export const SessionCard = ({ session, onCancel, onJoin }: SessionCardProps) => {
  const startTime = new Date(session.startTime);
  const isOngoing = session.status === SessionStatus.ONGOING;
  const isCompleted = [SessionStatus.COMPLETED, SessionStatus.SETTLED].includes(session.status);
  const isPending = session.status === SessionStatus.PENDING;
  const isConfirmed = session.status === SessionStatus.CONFIRMED;

  return (
    <Card className="group relative overflow-hidden bg-muted/20 border-border/50 hover:border-brand-acid/30 transition-all duration-500 backdrop-blur-sm">
      {/* Visual Accent for active sessions */}
      {isOngoing && (
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500 animate-pulse" />
      )}

      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Section: Time & Status */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-xl bg-background border border-border group-hover:border-brand-acid/20 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {format(startTime, "MMM")}
              </span>
              <span className="text-xl font-black text-foreground">
                {format(startTime, "dd")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {format(startTime, "EEE")}
              </span>
            </div>

            <div className="space-y-2">
              <SessionStatusBadge status={session.status} />
              <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-brand-acid transition-colors">
                {session.service?.title || "Career Consulting Session"}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>{format(startTime, "hh:mm a")} ({session.durationMinutes}m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCircle className="size-3.5" />
                  <span>Mentor: {session.mentor?.user.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            {/* Join Button */}
            {(isConfirmed || isOngoing) && (
              <Button 
                onClick={() => onJoin?.(session.id)}
                className="bg-brand-acid text-black font-bold hover:bg-brand-acid/80 shadow-[0_0_15px_-3px_rgba(217,249,157,0.3)] transition-all"
              >
                <Video className="size-4 mr-2" />
                Join Session
              </Button>
            )}

            {/* Action Plan Button */}
            {isCompleted && session.actionPlan && (
              <Link 
                href={`/dashboard/my-action-plans/${session.actionPlan.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "border-brand-acid/30 hover:bg-brand-acid/10 hover:text-brand-acid transition-all")}
              >
                <FileText className="size-4 mr-2" />
                View Action Plan
              </Link>
            )}

            {/* Cancel Button (Idempotent & Version Locked) */}
            {(isPending || isConfirmed) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onCancel?.(session.id, session.version)}
                className="text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Cancel
              </Button>
            )}

            {/* Context/Notes (Desktop only) */}
            <Button variant="ghost" size="icon-sm" className="hidden lg:flex text-muted-foreground hover:text-foreground">
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Footnote: SLA Warning or Settlement Status */}
        {isPending && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <AlertCircle className="size-3" />
            <span>Waiting for mentor confirmation • Auto-expires in 24h</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Internal Import helper
function UserCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
