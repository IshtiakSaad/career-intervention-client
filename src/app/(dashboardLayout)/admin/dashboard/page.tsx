import React from "react";
import { ManagementHeader } from "@/components/shared/management/ManagementHeader";
import { ShieldCheck, Activity, Users, Calendar } from "lucide-react";

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <ManagementHeader 
                title="Command Center" 
                description="Welcome to the SocratesHQ administrative nexus. Control platform growth and user vetting from this tactical hub."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Nodes", val: "Verified", icon: Activity, color: "text-brand-acid" },
                    { label: "System Integrity", val: "Optimal", icon: ShieldCheck, color: "text-blue-400" },
                    { label: "Auth Layer", val: "Firebase", icon: ShieldCheck, color: "text-amber-400" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-border/50 bg-muted/20 backdrop-blur-sm group hover:border-brand-acid/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`size-5 ${stat.color}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Status: Active</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-foreground tracking-tight">{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-3xl border border-border/50 bg-brand-obsidian/40 backdrop-blur-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic mb-4">Master Admin Authorized</h2>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed font-medium">
                        You are currently operating under the <span className="text-brand-acid">Master Admin</span> protocol. Use the navigation sidebar to access deep-management tools for mentors, mentees, and platform resources.
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="size-32" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;