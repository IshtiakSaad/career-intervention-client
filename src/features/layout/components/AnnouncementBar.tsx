import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export const AnnouncementBar = () => {
    return (
        <div className={`w-full bg-gradient-to-r from-brand-acid via-cyan-400 to-blue-500 py-1 flex items-center justify-center ${geistMono.className}`}>
            <p className="text-[10px] md:text-xs font-black text-brand-obsidian uppercase tracking-[0.25em]">
                TERMS &amp; CONDITIONS REVISED / April 2026
            </p>
        </div>
    );
};
