import { Hero, RAGMentorshipSearch } from "@features/marketing/components";

export default function Home() {
    return (
        <div className="flex flex-col flex-1 w-full relative">
            <Hero />
            <RAGMentorshipSearch />
        </div>
    );
}
