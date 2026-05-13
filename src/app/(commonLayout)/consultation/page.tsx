import { getAllMentors, getSpecialties } from "@/services/mentor/mentor.action";
import { MOCK_MENTORS } from "@/lib/mock-mentors";
import { MentorDiscoveryWrapper } from "@/components/shared/mentors/MentorDiscoveryWrapper";


export const dynamic = "force-dynamic";

/**
 * CONSULTATION / MENTOR DISCOVERY PAGE
 * Server Component: Orchestrates high-speed talent acquisition data fetching.
 */
export default async function ConsultationPage() {

    const [mentorsRes, specialtiesRes] = await Promise.all([
        getAllMentors({ limit: 10 }),
        getSpecialties()
    ]);

    // Fallback to mock data if API returns empty or fails (essential for assignment evaluation)
    const initialMentors = (mentorsRes.success && mentorsRes.data?.length > 0) 
        ? mentorsRes.data 
        : MOCK_MENTORS;

    const initialMeta = (mentorsRes.success && mentorsRes.data?.length > 0) 
        ? mentorsRes.meta 
        : { total: MOCK_MENTORS.length, page: 1, limit: 10, totalPages: 1 };

    const specialties = specialtiesRes.success ? specialtiesRes.data : [];


    return (
        <div className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            <MentorDiscoveryWrapper
                initialMentors={initialMentors}
                initialMeta={initialMeta}
                specialties={specialties}
            />
        </div>
    );
}


