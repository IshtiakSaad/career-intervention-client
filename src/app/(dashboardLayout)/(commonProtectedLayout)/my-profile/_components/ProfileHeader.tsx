"use client";

import { TUserIdentity } from "@/services/user/user.types";
import { formatDate } from "@/lib/utils";
import { Shield, Mail, Clock, MapPin, Calendar, BadgeCheck } from "lucide-react";

interface ProfileHeaderProps {
    user: TUserIdentity;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const primaryRole = user.roles[0] || "USER";

    const roleColors: Record<string, string> = {
        ADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
        MENTOR: "bg-brand-acid/10 text-brand-acid border-brand-acid/20",
        MENTEE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            {/* Gradient Banner */}
            <div className="h-28 bg-gradient-to-r from-brand-acid/20 via-brand-acid/5 to-transparent" />

            {/* Profile Content */}
            <div className="px-8 pb-8 -mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        {user.profileImageUrl ? (
                            <img
                                src={user.profileImageUrl}
                                alt={user.name}
                                className="size-24 rounded-2xl border-4 border-background object-cover shadow-xl ring-2 ring-brand-acid/30"
                            />
                        ) : (
                            <div className="size-24 rounded-2xl border-4 border-background bg-brand-acid/10 flex items-center justify-center shadow-xl ring-2 ring-brand-acid/30">
                                <span className="text-2xl font-black text-brand-acid tracking-tight">
                                    {initials}
                                </span>
                            </div>
                        )}
                        {/* Status Indicator */}
                        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-green-500 border-2 border-background" title="Online" />
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-black text-foreground tracking-tight">
                                {user.name}
                            </h1>
                            {user.roles.map((role) => (
                                <span
                                    key={role}
                                    className={`px-2.5 py-0.5 rounded-md text-[9px] uppercase font-black tracking-[0.2em] border ${roleColors[role] || "bg-muted text-muted-foreground border-border"}`}
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                            <span className="flex items-center gap-1.5">
                                <Mail className="size-3" />
                                {user.email}
                            </span>
                            {user.phoneNumber && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="size-3" />
                                    {user.phoneNumber}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meta Stats */}
                    <div className="flex gap-6 text-center">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Timezone</p>
                            <p className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="size-3 text-brand-acid" />
                                {user.timezone}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Joined</p>
                            <p className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                                <Calendar className="size-3 text-brand-acid" />
                                {formatDate(user.createdAt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Security</p>
                            <p className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                                {user.twoFactorEnabled ? (
                                    <>
                                        <BadgeCheck className="size-3 text-green-500" />
                                        <span className="text-green-500">2FA On</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield className="size-3 text-amber-500" />
                                        <span className="text-amber-500">2FA Off</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
