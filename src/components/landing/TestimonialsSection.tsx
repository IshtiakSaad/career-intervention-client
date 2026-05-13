import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        quote: "SocratesHQ helped me transition from a Senior Engineer to a Lead in just 4 months. My mentor's tactical advice was a game-changer.",
        author: "Sarah Jenkins",
        role: "Engineering Lead @ Meta",
        avatar: "SJ"
    },
    {
        quote: "The level of expertise here is unmatched. I wasn't just getting generic advice; I was getting a roadmap for executive growth.",
        author: "Marcus Chen",
        role: "Product Director @ Stripe",
        avatar: "MC"
    },
    {
        quote: "Finally, a platform that understands that 'career coaching' needs to be as rigorous as the industries we work in.",
        author: "Elena Rodriguez",
        role: "VP of Data @ Fintech Inc.",
        avatar: "ER"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/[0.04]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Proven by Professionals
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of high-achievers who have leveled up their careers through our intervention framework.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="relative p-8 bg-[#050505] border border-white/[0.06]">
                            <Quote className="absolute top-6 right-8 w-10 h-10 text-white/[0.03] rotate-180" />
                            <p className="text-muted-foreground italic mb-8 relative z-10 leading-relaxed">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-acid/20 flex items-center justify-center text-primary text-xs font-bold rounded-sm">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{t.author}</h4>
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
