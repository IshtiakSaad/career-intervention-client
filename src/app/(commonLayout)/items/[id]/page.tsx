"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Globe, Shield, Star, Tag, Zap } from "lucide-react";
import Link from "next/link";

// Mock data mapping
const MOCK_ITEMS: Record<string, any> = {
    "1": { id: "1", title: "FAANG Interview Masterclass", description: "This intensive masterclass is designed for high-performance engineers aiming for Tier-1 tech companies. We cover everything from advanced data structures to behavioral frameworks used by hiring managers at Google, Meta, and Amazon.", fullDescription: "Our comprehensive curriculum is refined every quarter to match the evolving interview landscapes of elite tech firms. You won't just learn algorithms; you'll learn how to communicate your technical decisions, navigate complex system design trade-offs, and master the 'leadership principles' that determine senior-level hires.", category: "Career", price: "$49", rating: 4.8, image: "💼", specs: ["12 Video Modules", "Mock Interview Prep", "Resume Review", "Discord Access"], related: ["2", "3"] },
    "2": { id: "2", title: "React Performance Engineering", description: "Deep dive into advanced rendering patterns and optimization techniques.", fullDescription: "Master the art of high-performance frontend engineering. This course dives deep into the internals of React's reconciliation engine, profiling techniques, and advanced patterns for building blazing-fast user interfaces at scale.", category: "Technical", price: "$79", rating: 4.9, image: "⚛️", specs: ["React 19 Ready", "Next.js Integration", "Profiling Workshop", "Lifetime Access"], related: ["1", "3"] },
    "3": { id: "3", title: "System Design for Architects", description: "Learn to build scalable distributed systems with real-world case studies.", fullDescription: "A deep dive into distributed systems. We cover load balancing, caching strategies, database sharding, and consensus algorithms using case studies from Uber, Netflix, and Twitter.", category: "Technical", price: "$99", rating: 4.7, image: "🏗️", specs: ["Scale 10M+ Users", "Microservices Design", "Cloud Native Patterns", "Case Study Library"], related: ["1", "2"] },
};

export default function ItemDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const item = MOCK_ITEMS[id] || MOCK_ITEMS["1"];

    return (
        <div className="pt-32 pb-24">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                {/* Back Button */}
                <Link 
                    href="/items"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Items
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Image/Visual */}
                    <div className="h-[400px] md:h-[500px] bg-[#0a0a0a] border border-white/[0.06] flex items-center justify-center text-[120px] shadow-2xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="relative z-10">{item.image}</div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary px-3 py-1 bg-primary/10 rounded-sm">
                                {item.category}
                            </span>
                            <div className="flex items-center gap-1 text-sm font-bold">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span>{item.rating}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
                            {item.title}
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            {item.description}
                        </p>

                        <div className="text-3xl font-bold text-foreground mb-10">
                            {item.price}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            {item.specs.map((spec: string, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-medium">{spec}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full bg-primary text-primary-foreground py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.98] shadow-[0_0_40px_rgba(163,230,53,.15)] mb-6">
                            Enroll Now
                        </button>
                        
                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                            Secure Transaction • Instant Access • 100% Vetted
                        </p>
                    </div>
                </div>

                {/* Detailed Description */}
                <div className="mt-24 pt-24 border-t border-white/[0.06]">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold mb-8 uppercase tracking-wider">Project Specification</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                                {item.fullDescription}
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                At SocratesHQ, we don't just provide content; we provide an intervention. Each module is paired with tactical exercises designed to be applied immediately in your professional environment. Our goal is to increase your career velocity through precision learning and high-stakes execution.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Items Section */}
                <div className="mt-32">
                    <h2 className="text-2xl font-bold mb-12 uppercase tracking-wider">Related Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {item.related.map((relId: string) => {
                            const relItem = MOCK_ITEMS[relId];
                            return (
                                <Link 
                                    key={relId} 
                                    href={`/items/${relId}`}
                                    className="p-6 bg-[#0a0a0a] border border-white/[0.06] hover:border-primary/30 transition-all group"
                                >
                                    <div className="text-4xl mb-6">{relItem.image}</div>
                                    <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">{relItem.title}</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{relItem.category} • {relItem.price}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

