import { getAllMentors, getSpecialties } from "@/services/mentor/mentor.action";
import { MentorDiscoveryWrapper } from "@/components/shared/mentors/MentorDiscoveryWrapper";
import { MOCK_MENTORS } from "@/lib/mock-mentors";

/**
 * CONSULTATION / MENTOR DISCOVERY PAGE
 * Server Component: Orchestrates high-speed talent acquisition data fetching.
 */
export default async function ConsultationPage() {
    const [mentorsRes, specialtiesRes] = await Promise.all([
        getAllMentors({ limit: 10 }),
        getSpecialties()
    ]);

    const initialMentors = mentorsRes.success && mentorsRes.data?.length > 0 
        ? mentorsRes.data 
        : MOCK_MENTORS;
    
    const initialMeta = mentorsRes.success 
        ? mentorsRes.meta 
        : { total: MOCK_MENTORS.length, page: 1, limit: 10 };
        
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


