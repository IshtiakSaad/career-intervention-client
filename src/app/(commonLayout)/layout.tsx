import { Navbar } from "@features/navigation/components";
import { AnnouncementBar as ProtoUpdate, Footer } from "@features/layout/components";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-obsidian">
            <header className="sticky top-0 z-50 w-full flex flex-col shadow-2xl">
                <ProtoUpdate />
                <Navbar />
            </header>
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default CommonLayout;