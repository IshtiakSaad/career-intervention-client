import { Zap, Target, BarChart3, ShieldCheck } from "lucide-react";

const FEATURES = [
    {
        title: "Tactical Execution",
        description: "Don't just dream; execute. Get step-by-step action plans tailored to your specific career goals.",
        icon: Zap,
    },
    {
        title: "Precision Targeting",
        description: "Connect with mentors who specifically specialize in your industry, role, and career stage.",
        icon: Target,
    },
    {
        title: "Data-Driven Growth",
        description: "Track your progress with performance metrics and accountability milestones in every session.",
        icon: BarChart3,
    },
    {
        title: "Vetted Excellence",
        description: "Every mentor on SocratesHQ undergoes a rigorous verification process for elite quality assurance.",
        icon: ShieldCheck,
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-[#0a0a0a] border-y border-white/[0.04]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Engineered for High-Performance Careers
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We've optimized the mentorship experience to provide maximum ROI on your time and investment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature, i) => (
                        <div 
                            key={i}
                            className="p-8 bg-[#050505] border border-white/[0.06] hover:border-primary/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
