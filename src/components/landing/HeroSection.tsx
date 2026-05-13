import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* ── Animated background ── */}
            <div className="absolute inset-0 -z-10">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(163,230,53,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] animate-pulse" />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] mb-8">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                        Elite Career Mentorship
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.08] mb-6 max-w-4xl mx-auto">
                    Your Career,{" "}
                    <span className="text-primary relative">
                        Engineered
                        <svg
                            className="absolute -bottom-2 left-0 w-full"
                            viewBox="0 0 300 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 8C50 2 100 2 150 6C200 10 250 4 298 6"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="text-primary/40"
                            />
                        </svg>
                    </span>
                    {" "}for Global Success
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Connect with world-class mentors who have walked the path.
                    Get personalized career intervention strategies, actionable plans,
                    and the accountability you need to break through.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/items"
                        className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-sm text-sm font-semibold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_30px_rgba(163,230,53,.15)]"
                    >
                        Find Your Resource
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 border border-white/[0.1] text-foreground px-8 py-3.5 rounded-sm text-sm font-medium hover:bg-white/[0.04] transition-all"
                    >
                        Learn More
                    </Link>
                </div>

                {/* Stats bar */}
                <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center">
                    {[
                        { value: "500+", label: "Active Mentors" },
                        { value: "12K+", label: "Sessions Completed" },
                        { value: "95%", label: "Success Rate" },
                        { value: "40+", label: "Countries" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                                {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
