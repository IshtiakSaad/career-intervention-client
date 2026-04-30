"use client";

import { SessionStatus } from "@/types/session";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  CalendarX, 
  AlertTriangle,
  RefreshCcw,
  Ban
} from "lucide-react";

interface SessionStatusBadgeProps {
  status: SessionStatus | string;
  className?: string;
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<string, { 
  label: string; 
  color: string; 
  icon: any; 
  glow: string 
}> = {
  [SessionStatus.PENDING]: {
    label: "Pending Review",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Clock,
    glow: "shadow-[0_0_10px_-2px_rgba(251,191,36,0.3)]",
  },
  [SessionStatus.CONFIRMED]: {
    label: "Scheduled",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    icon: CheckCircle2,
    glow: "shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]",
  },
  [SessionStatus.ONGOING]: {
    label: "In Progress",
    color: "text-green-400 border-green-500/30 bg-green-500/10 animate-pulse",
    icon: PlayCircle,
    glow: "shadow-[0_0_15px_-3px_rgba(74,222,128,0.4)]",
  },
  [SessionStatus.COMPLETED]: {
    label: "Completed",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    icon: CheckCircle,
    glow: "shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]",
  },
  [SessionStatus.SETTLED]: {
    label: "Settled & Released",
    color: "text-brand-acid border-brand-acid/30 bg-brand-acid/10",
    icon: CheckCircle,
    glow: "shadow-[0_0_10px_-2px_rgba(217,249,157,0.3)]",
  },
  [SessionStatus.CANCELLED_BY_MENTEE]: {
    label: "Cancelled (Mentee)",
    color: "text-slate-400 border-slate-500/30 bg-slate-500/10",
    icon: CalendarX,
    glow: "",
  },
  [SessionStatus.CANCELLED_BY_MENTOR]: {
    label: "Cancelled (Mentor)",
    color: "text-slate-400 border-slate-500/30 bg-slate-500/10",
    icon: CalendarX,
    glow: "",
  },
  [SessionStatus.EXPIRED]: {
    label: "SLA Expired",
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    icon: Ban,
    glow: "",
  },
  [SessionStatus.NO_SHOW]: {
    label: "No-Show Reported",
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    icon: AlertTriangle,
    glow: "shadow-[0_0_10px_-2px_rgba(251,146,60,0.3)]",
  },
  [SessionStatus.DISPUTED]: {
    label: "Under Dispute",
    color: "text-red-400 border-red-500/30 bg-red-500/10 animate-bounce-subtle",
    icon: AlertTriangle,
    glow: "shadow-[0_0_15px_-3px_rgba(248,113,113,0.4)]",
  },
  [SessionStatus.REFUNDED]: {
    label: "Refunded",
    color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
    icon: RefreshCcw,
    glow: "",
  },
  [SessionStatus.REJECTED]: {
    label: "Booking Rejected",
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    icon: XCircle,
    glow: "",
  },
};

export const SessionStatusBadge = ({ status, className, showIcon = true }: SessionStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: "text-muted-foreground border-border bg-muted/50",
    icon: Clock,
    glow: "",
  };

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 backdrop-blur-sm",
      config.color,
      config.glow,
      className
    )}>
      {showIcon && <Icon className="size-3" />}
      <span>{config.label}</span>
      
      {/* Dynamic Status Dot for animated states */}
      {(status === SessionStatus.ONGOING || status === SessionStatus.DISPUTED) && (
        <span className="flex h-1.5 w-1.5 rounded-full bg-current ml-0.5 animate-ping" />
      )}
    </div>
  );
};
