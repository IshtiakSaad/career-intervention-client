import { Shield, Users, Target, Rocket } from "lucide-react";

/**
 * ABOUT PAGE
 * Describes the mission and framework of SocratesHQ.
 */
export default function AboutPage() {
    return (
        <div className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            {/* Header */}
            <div className="max-w-3xl mb-20">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
                    Engineering the Future of <span className="text-primary">Professional Growth</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    SocratesHQ was born from a simple observation: generic career advice doesn't work in elite industries. 
                    We built a platform that treats career development as a high-stakes engineering problem.
                </p>
            </div>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                <div className="p-10 bg-[#0a0a0a] border border-white/[0.06] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-24 h-24 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        To democratize access to elite mentorship. We believe that everyone deserves the tactical guidance 
                        usually reserved for the top 1% of earners. By connecting high-growth talent with vetted mentors, 
                        we're closing the guidance gap in global tech and leadership.
                    </p>
                </div>
                <div className="p-10 bg-[#0a0a0a] border border-white/[0.06] relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Shield className="w-24 h-24 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6">Our Standard</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We don't just accept anyone. Our mentors are vetted through a rigorous multi-stage verification 
                        process that checks industry experience, leadership history, and coaching efficacy. 
                        When you speak to a SocratesHQ mentor, you're speaking to a proven operator.
                    </p>
                </div>
            </div>

            {/* Framework Section */}
            <div className="text-center mb-20">
                <h2 className="text-3xl font-bold tracking-tight mb-4">The SocratesHQ Framework</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our proprietary mentorship methodology is built on four core pillars.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: Users, title: "Curated Matching", desc: "Algorithmic pairing based on domain depth." },
                    { icon: Target, title: "Action Plans", desc: "Every session results in a tactical roadmap." },
                    { icon: Shield, title: "Verified Identity", desc: "100% vetted profiles for trust." },
                    { icon: Rocket, title: "Velocity Tracking", desc: "Measure your career growth speed." },
                ].map((pillar, i) => (
                    <div key={i} className="text-center p-6 hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/[0.04]">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <pillar.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-bold mb-2">{pillar.title}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{pillar.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

