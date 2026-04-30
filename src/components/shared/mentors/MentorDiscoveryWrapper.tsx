"use client";

import React, { useState, useEffect } from "react";
import { MentorCard } from "@/components/shared/mentors/MentorCard";
import { BookingModal } from "@/components/shared/mentors/BookingModal";
import { getAllMentors } from "@/services/mentor/mentor.action";
import { getCurrentUser } from "@/services/auth/action";
import { 
  Search, 
  Filter, 
  X, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  LayoutGrid,
  List,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface MentorDiscoveryWrapperProps {
  initialMentors: any[];
  initialMeta: any;
  specialties: any[];
}

export const MentorDiscoveryWrapper = ({ 
  initialMentors, 
  initialMeta, 
  specialties 
}: MentorDiscoveryWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mentors, setMentors] = useState(initialMentors);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  
  // Selection/Modal State
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.getAll("specialties") || []
  );

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleFetch = async (page = 1) => {
    setLoading(true);
    const res = await getAllMentors({
      searchTerm,
      specialties: selectedSpecialties,
      page,
      limit: 10
    });
    
    if (res.success) {
      setMentors(res.data);
      setMeta(res.meta);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const toggleSpecialty = (name: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleBook = (mentor: any) => {
    if (!user) {
      toast.info("Authentication Required", {
        description: "Please log in to book a session with this mentor."
      });
      router.push("/login?redirect=/mentors");
      return;
    }
    setSelectedMentor(mentor);
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* Search & Overview */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-acid/10 border border-brand-acid/20">
            <Sparkles className="size-3.5 text-brand-acid" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-acid">Mentor Discovery Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[0.9]">
            Connect with Global <span className="text-brand-acid">Visionaries.</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Browse verified mentors, compare consultation styles, and secure your professional baseline.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or headline..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch(1)}
              className="pl-12 h-14 bg-muted/20 border-border/50 rounded-2xl focus:border-brand-acid/30 transition-all font-medium"
            />
          </div>
          <Button 
            onClick={() => handleFetch(1)}
            className="h-14 px-8 bg-brand-acid text-black font-black uppercase tracking-widest rounded-2xl"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        {/* Sidebar Filters */}
        <aside className="space-y-8 sticky top-32">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Specialties</h3>
              {selectedSpecialties.length > 0 && (
                <button 
                  onClick={() => { setSelectedSpecialties([]); handleFetch(1); }}
                  className="text-[10px] font-bold text-brand-acid uppercase hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {specialties?.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { toggleSpecialty(s.name); handleFetch(1); }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all group text-left",
                    selectedSpecialties.includes(s.name)
                      ? "bg-brand-acid/10 border-brand-acid/40 text-brand-acid"
                      : "bg-muted/5 border-border/30 text-muted-foreground hover:border-border hover:bg-muted/10"
                  )}
                >
                  {s.name}
                  <div className={cn(
                    "size-2 rounded-full transition-all",
                    selectedSpecialties.includes(s.name) ? "bg-brand-acid scale-125" : "bg-transparent"
                  )} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mentor Grid */}
        <main className="space-y-12">
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-6">
              <div className="relative">
                <Loader2 className="size-12 text-brand-acid animate-spin" />
                <div className="absolute inset-0 size-12 bg-brand-acid/20 blur-xl animate-pulse rounded-full" />
              </div>
              <p className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase">Syncing Talent Pool...</p>
            </div>
          ) : mentors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {mentors.map((mentor) => (
                  <MentorCard 
                    key={mentor.id} 
                    mentor={mentor} 
                    onBook={handleBook}
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta.total > meta.limit && (
                <div className="flex items-center justify-center gap-4 pt-12 border-t border-border/50">
                  <Button
                    variant="outline"
                    disabled={meta.page <= 1}
                    onClick={() => handleFetch(meta.page - 1)}
                    className="border-border/50"
                  >
                    <ChevronLeft className="size-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-xs font-black tracking-widest text-muted-foreground">
                    PAGE {meta.page} OF {Math.ceil(meta.total / meta.limit)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                    onClick={() => handleFetch(meta.page + 1)}
                    className="border-border/50"
                  >
                    Next
                    <ChevronRight className="size-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-32 text-center border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/5">
              <Filter className="size-12 text-muted-foreground/20 mx-auto mb-6" />
              <h3 className="text-2xl font-black tracking-tight text-foreground">No matches found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2 font-medium">
                Try adjusting your filters or search terms to discover more visionaries.
              </p>
              <Button 
                variant="link" 
                onClick={() => { setSearchTerm(""); setSelectedSpecialties([]); handleFetch(1); }}
                className="text-brand-acid font-bold uppercase tracking-widest mt-6"
              >
                Reset Exploration
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <BookingModal 
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          mentor={selectedMentor}
          userRole={user?.roles?.[0]}
        />
      )}
    </div>
  );
};
