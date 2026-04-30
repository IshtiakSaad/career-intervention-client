import { getAllMentors, getSpecialties } from "@/services/mentor/mentor.action";
import { MentorDiscoveryWrapper } from "@/components/shared/mentors/MentorDiscoveryWrapper";

/**
 * HIGH-PERFORMANCE DISCOVERY ENTRY POINT (v6.0)
 * Server-side data orchestration for SEO and FCP optimization.
 */
export default async function MentorsPage() {
  // Parallel data fetching for speed
  const [mentorsRes, specialtiesRes] = await Promise.all([
    getAllMentors({ page: 1, limit: 10 }),
    getSpecialties()
  ]);

  const initialMentors = mentorsRes.success ? mentorsRes.data : [];
  const initialMeta = mentorsRes.success ? mentorsRes.meta : { page: 1, limit: 10, total: 0 };
  const specialties = specialtiesRes.success ? specialtiesRes.data : [];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1440px] mx-auto">
        <MentorDiscoveryWrapper 
          initialMentors={initialMentors}
          initialMeta={initialMeta}
          specialties={specialties}
        />
      </div>
    </div>
  );
}
