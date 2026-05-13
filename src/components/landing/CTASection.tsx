import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-primary/[0.03] -z-10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/[0.05] rounded-full blur-[100px]" />
            
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="bg-[#050505] border border-primary/20 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                    {/* Decorative scanner line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-y-[-100%] group-hover:translate-y-[600px] transition-transform duration-[3s] ease-linear" />
                    
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
                            Ready for Your Next <span className="text-primary">Breakthrough?</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-0 leading-relaxed">
                            Stop leaving your career to chance. Join SocratesHQ today and start working with a mentor who can engineer your success.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm text-sm font-bold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_40px_rgba(163,230,53,.1)]"
                        >
                            Initialize Registration
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
