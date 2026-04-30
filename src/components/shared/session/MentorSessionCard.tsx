"use client";

import React from "react";
import { ISession, SessionStatus } from "@/types/session";
import { SessionStatusBadge } from "./SessionStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Clock, 
  User, 
  Video, 
  FilePlus, 
  CheckCircle, 
  UserX, 
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MentorSessionCardProps {
  session: ISession;
  onUpdateStatus: (id: string, status: SessionStatus, version: number) => void;
  onJoin?: (id: string) => void;
  onCreateActionPlan?: (session: ISession) => void;
}

export const MentorSessionCard = ({ 
  session, 
  onUpdateStatus, 
  onJoin,
  onCreateActionPlan 
}: MentorSessionCardProps) => {
  const startTime = new Date(session.startTime);
  const isPending = session.status === SessionStatus.PENDING;
  const isConfirmed = session.status === SessionStatus.CONFIRMED;
  const isOngoing = session.status === SessionStatus.ONGOING;
  const isCompleted = session.status === SessionStatus.COMPLETED;
  const isPast = new Date() > startTime;

  return (
    <Card className="group relative overflow-hidden bg-muted/20 border-border/50 hover:border-brand-acid/30 transition-all duration-500 backdrop-blur-sm">
      {/* Dynamic Visual Indicator */}
      {isPending && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}
      {isOngoing && <div className="absolute top-0 left-0 w-1 h-full bg-green-500 animate-pulse" />}

      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Session Intel */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center min-w-[70px] py-1 px-3 rounded-xl bg-background border border-border group-hover:border-brand-acid/20 transition-colors">
              <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{format(startTime, "MMM")}</span>
              <span className="text-xl font-black text-foreground">{format(startTime, "dd")}</span>
              <span className="text-[10px] font-bold text-brand-acid">{format(startTime, "HH:mm")}</span>
            </div>

            <div className="space-y-2">
              <SessionStatusBadge status={session.status} />
              <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-brand-acid transition-colors">
                {session.service?.title || "Career Session"}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  <span>Mentee: {session.mentee?.user.name}</span>
                </div>
                {session.notes && (
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="size-3.5 text-brand-acid" />
                    <span className="italic truncate max-w-[200px]">"{session.notes}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Hard Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Actions based on State Machine */}
            {isPending && (
              <Button 
                onClick={() => onUpdateStatus(session.id, SessionStatus.CONFIRMED, session.version)}
                className="bg-brand-acid text-black font-extrabold hover:bg-brand-acid/80 shadow-[0_0_10px_-2px_rgba(217,249,157,0.3)]"
              >
                Confirm Booking
              </Button>
            )}

            {(isConfirmed || isOngoing) && (
              <>
                <Button 
                  onClick={() => onJoin?.(session.id)}
                  className="bg-muted border border-border hover:border-brand-acid/30 transition-all font-bold"
                >
                  <Video className="size-4 mr-2" />
                  Enter Room
                </Button>
                
                {isPast && (
                  <Button 
                    onClick={() => onUpdateStatus(session.id, SessionStatus.COMPLETED, session.version)}
                    className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold"
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Complete
                  </Button>
                )}
              </>
            )}

            {isCompleted && !session.actionPlan && (
              <Button 
                onClick={() => onCreateActionPlan?.(session)}
                className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 font-bold"
              >
                <FilePlus className="size-4 mr-2" />
                Submit Action Plan
              </Button>
            )}

            {/* Negative Actions */}
            {(isPending || isConfirmed) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onUpdateStatus(session.id, SessionStatus.CANCELLED_BY_MENTOR, session.version)}
                className="text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
              >
                Decline
              </Button>
            )}

            {isConfirmed && isPast && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onUpdateStatus(session.id, SessionStatus.NO_SHOW, session.version)}
                className="text-muted-foreground hover:text-orange-400 hover:bg-orange-500/10"
              >
                <UserX className="size-4 mr-2" />
                No-Show
              </Button>
            )}
          </div>
        </div>

        {/* Warning Footnote */}
        {isConfirmed && !isPast && (
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-2 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
            <Clock className="size-3" />
            <span>Room opens at {format(startTime, "hh:mm a")} • Please be on time</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
