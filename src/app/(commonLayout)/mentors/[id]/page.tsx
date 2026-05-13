import { getMentorDetails } from "@/services/mentor/mentor.action";
import { MOCK_MENTORS } from "@/lib/mock-mentors";
import {
    Star,
    MapPin,
    Briefcase,
    CheckCircle2,
    Sparkles,
    Globe,
    Calendar,
    ArrowLeft,
    ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MentorDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = "force-dynamic";

export default async function MentorDetailPage({ params }: MentorDetailPageProps) {


    const { id } = await params;
    const res = await getMentorDetails(id);


    let mentor = res.success ? res.data : null;

    // Fallback to mock data if API fails (essential for testing m1, m2, etc.)
    if (!mentor) {
        mentor = MOCK_MENTORS.find(m => m.id === id) || null;
    }

    if (!mentor) {
        return notFound();
    }

    const { user, serviceOfferings, mentorSpecialties } = mentor;

    const startingPrice = serviceOfferings?.length > 0 
        ? Math.min(...serviceOfferings.map((s: any) => parseFloat(s.price))) 
        : 0;

    return (
        <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            <Link 
                href="/consultation"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-brand-acid transition-colors mb-12"
            >
                <ArrowLeft className="size-4" />
                Back to Discovery
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
                {/* Left Column: Profile Details */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
                        <div className="relative size-40 rounded-3xl overflow-hidden border-2 border-brand-acid/20 shadow-2xl">
                            <Image 
                                src={user.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} 
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{user.name}</h1>
                                {mentor.verificationBadge && (
                                    <CheckCircle2 className="size-6 text-brand-acid" fill="currentColor" />
                                )}
                            </div>
                            <p className="text-xl font-bold text-brand-acid flex items-center gap-2 uppercase tracking-widest">
                                <Sparkles className="size-5" />
                                {mentor.headline || mentor.designation || "Career Consultant"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1 text-brand-acid">
                                <Star className="size-4" fill="currentColor" />
                                <span className="text-lg font-black">{mentor.ratingAverage?.toFixed(1) || "5.0"}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Experience</p>
                            <p className="text-lg font-black">{mentor.experience || 5}+ Years</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sessions</p>
                            <p className="text-lg font-black">{mentor.totalSessions || 100}+</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                            <p className="text-lg font-black truncate">{mentor.location || "Remote"}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase">Professional Bio</h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed font-medium">
                            {mentor.bio || "This mentor has not provided a detailed bio yet, but they come highly recommended for career strategy and growth."}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase">Specialties</h2>
                        <div className="flex flex-wrap gap-2">
                            {mentorSpecialties?.map((ms: any) => (
                                <Badge 
                                    key={ms.specialty.id} 
                                    className="bg-brand-acid/10 border-brand-acid/30 text-brand-acid px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                                >
                                    {ms.specialty.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Card */}
                <aside className="sticky top-32 space-y-6">
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Starting at</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-foreground">${startingPrice}</span>
                                <span className="text-sm font-bold text-muted-foreground">/ session</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button className="w-full h-16 rounded-2xl bg-brand-acid text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all">
                                <Calendar className="size-5 mr-3" />
                                Book Appointment
                            </Button>
                            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
                                Instant Confirmation • Secure Payment
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Connect</h3>
                                <div className="flex gap-4">
                                    {mentor.linkedinUrl && (
                                        <a href={mentor.linkedinUrl} className="text-muted-foreground hover:text-brand-acid transition-colors">
                                            <ExternalLink className="size-5" />
                                        </a>
                                    )}

                                    {mentor.portfolioUrl && (
                                        <a href={mentor.portfolioUrl} className="text-muted-foreground hover:text-brand-acid transition-colors">
                                            <Globe className="size-5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                    <Briefcase className="size-4 text-brand-acid" />
                                    <span>{mentor.currentWorkingPlace || "Independent Consultant"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                    <MapPin className="size-4 text-brand-acid" />
                                    <span>{mentor.location || "Remote"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-acid/5 border border-brand-acid/20 rounded-[2rem] p-6">
                        <p className="text-xs font-bold text-brand-acid leading-relaxed text-center italic">
                            "Elite mentorship is not just advice; it's a strategic blueprint for your career apex."
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
