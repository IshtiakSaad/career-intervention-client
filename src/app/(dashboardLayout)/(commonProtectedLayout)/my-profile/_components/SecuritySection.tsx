"use client";

import { TUserIdentity } from "@/services/user/user.types";
import { formatDate } from "@/lib/utils";
import { Shield, Key, Smartphone, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface SecuritySectionProps {
    user: TUserIdentity;
}

export function SecuritySection({ user }: SecuritySectionProps) {
    return (
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border/30 bg-muted/10">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Shield className="size-4 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-foreground tracking-tight uppercase">Security & Access</h2>
                        <p className="text-[10px] text-muted-foreground/50 tracking-wide">Authentication and account protection</p>
                    </div>
                </div>
            </div>

            {/* Security Items */}
            <div className="p-6 space-y-3">
                {/* Password Status */}
                <SecurityItem
                    icon={Key}
                    label="Password"
                    status={user.needPasswordChange ? "Action Required" : "Secure"}
                    statusColor={user.needPasswordChange ? "amber" : "green"}
                    description={user.needPasswordChange
                        ? "Your password needs to be changed for security purposes."
                        : "Your password is secure and up to date."
                    }
                    action={
                        <Link
                            href="/change-password"
                            className={buttonVariants({ variant: "outline", size: "sm" }) + " text-[9px] tracking-widest uppercase font-bold h-7 px-3"}
                        >
                            Change
                        </Link>
                    }
                />

                {/* 2FA Status */}
                <SecurityItem
                    icon={Smartphone}
                    label="Two-Factor Authentication"
                    status={user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    statusColor={user.twoFactorEnabled ? "green" : "red"}
                    description={user.twoFactorEnabled
                        ? "Your account is protected with two-factor authentication."
                        : "Enable 2FA to add an extra layer of security to your account."
                    }
                />

                {/* Last Login */}
                <SecurityItem
                    icon={Clock}
                    label="Last Login"
                    status={user.lastLoginAt ? formatDate(user.lastLoginAt) : "Unknown"}
                    statusColor="neutral"
                    description="The most recent sign-in recorded for this account."
                />

                {/* Account Status */}
                <SecurityItem
                    icon={user.accountStatus === "ACTIVE" ? Shield : AlertTriangle}
                    label="Account Status"
                    status={user.accountStatus}
                    statusColor={user.accountStatus === "ACTIVE" ? "green" : "red"}
                    description={`Your account is currently ${user.accountStatus.toLowerCase()}.`}
                />
            </div>
        </div>
    );
}

// ─── Internal Security Item ───

function SecurityItem({
    icon: Icon,
    label,
    status,
    statusColor,
    description,
    action,
}: {
    icon: any;
    label: string;
    status: string;
    statusColor: "green" | "amber" | "red" | "neutral";
    description: string;
    action?: React.ReactNode;
}) {
    const colorMap = {
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        red: "bg-red-500/10 text-red-400 border-red-500/20",
        neutral: "bg-muted text-muted-foreground border-border/50",
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border/30 gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 rounded-md bg-muted/30 flex items-center justify-center shrink-0">
                    <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground tracking-tight">{label}</p>
                    <p className="text-[10px] text-muted-foreground/50 truncate">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-md text-[9px] uppercase font-black tracking-[0.15em] border ${colorMap[statusColor]}`}>
                    {status}
                </span>
                {action}
            </div>
        </div>
    );
}
