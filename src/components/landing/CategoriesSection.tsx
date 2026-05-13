import Link from "next/link";
import { ArrowRight, Code, Briefcase, Globe, Database } from "lucide-react";

const CATEGORIES = [
    { name: "Software Engineering", count: "120+ Mentors", icon: Code },
    { name: "Product Management", count: "85+ Mentors", icon: Briefcase },
    { name: "Data Science & AI", count: "64+ Mentors", icon: Database },
    { name: "Executive Leadership", count: "42+ Mentors", icon: Globe },
];

export function CategoriesSection() {
    return (
        <section className="py-24 relative overflow-hidden">
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
             
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Explore Elite Domains
                        </h2>
                        <p className="text-muted-foreground max-w-xl">
                            Our mentors represent top-tier talent from global tech giants, Fortune 500s, and high-growth startups.
                        </p>
                    </div>
                    <Link 
                        href="/mentors"
                        className="group flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest"
                    >
                        View All Specialties
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <Link 
                            key={i}
                            href={`/mentors?category=${cat.name}`}
                            className="group p-1 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
                        >
                            <div className="p-6">
                                <div className="w-10 h-10 border border-white/[0.1] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all">
                                    <cat.icon className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">{cat.count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
