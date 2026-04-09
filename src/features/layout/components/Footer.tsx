import { Logo } from "@features/branding/components";
import { NavLink } from "@features/navigation/components";
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative w-full bg-brand-obsidian border-t border-brand-acid/10 pt-16 overflow-hidden">
            {/* Background Tactical Grid - Subtle match to Hero */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#a3e635_1px,transparent_1px),linear-gradient(to_bottom,#a3e635_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <Logo />
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            Elite career intervention and surgical intelligence for global high-performers.
                            <span className="block mt-2 font-bold text-gray-300 italic uppercase tracking-wider text-[10px]">
                                THE SYSTEM FAVORS THE INSIDERS. WE ARE THE OVERRIDE.
                            </span>
                        </p>
                    </div>

                    {/* Operational Levels */}
                    <div className="flex flex-col gap-6">
                        <h4 className={`text-xs font-black text-brand-acid uppercase tracking-[0.2em] ${geistMono.className}`}>
                            [ OPERATIONAL LEVELS ]
                        </h4>
                        <nav className="flex flex-col gap-4">
                            <NavLink href="/research">Intelligence Archives</NavLink>
                            <NavLink href="/case-studies">Post-Mortem Analysis</NavLink>
                            <NavLink href="/methodology">Surgical Framework</NavLink>
                        </nav>
                    </div>

                    {/* Access Nodes */}
                    <div className="flex flex-col gap-6">
                        <h4 className={`text-xs font-black text-brand-acid uppercase tracking-[0.2em] ${geistMono.className}`}>
                            [ ACCESS NODES ]
                        </h4>
                        <nav className="flex flex-col gap-4">
                            <NavLink href="/mentors">Elite Practitioners</NavLink>
                            <NavLink href="/pathways">Infiltration Routes</NavLink>
                            <NavLink href="/assessment">AI Vulnerability Scan</NavLink>
                        </nav>
                    </div>

                    {/* Security & Support */}
                    <div className="flex flex-col gap-6">
                        <h4 className={`text-xs font-black text-brand-acid uppercase tracking-[0.2em] ${geistMono.className}`}>
                            [ PROTOCOLS ]
                        </h4>
                        <nav className="flex flex-col gap-4">
                            <NavLink href="/about">Personnel File</NavLink>
                            <NavLink href="/privacy">Data Encryption</NavLink>
                            <NavLink href="/terms">Rules of Engagement</NavLink>
                        </nav>
                    </div>
                </div>

                {/* Tactical Status Bar */}
                <div className="border-t border-white/5 py-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    {/* Scanning Line Indicator */}
                    <div className="absolute left-0 right-0 h-[1px] bg-brand-acid/20 animate-scan pointer-events-none opacity-50"></div>

                    <div className={`flex flex-wrap items-center gap-6 text-[10px] uppercase font-bold tracking-[0.25em] ${geistMono.className}`}>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-acid animate-pulse shadow-[0_0_8px_#a3e635]"></span>
                            <span className="text-brand-acid">CONNECTION ENCRYPTED [SSL/256-BIT]</span>
                        </div>
                        <div className="text-gray-500">
                            GEO-LOCATION: <span className="text-gray-300 underline decoration-brand-acid/30">[ HIDDEN ]</span>
                        </div>
                        <div className="text-gray-500">
                            VERSION: <span className="text-gray-300">4.0.0-PRO</span>
                        </div>
                    </div>

                    <div className={`text-[10px] text-gray-500 font-bold uppercase tracking-widest ${geistMono.className}`}>
                        &copy; {currentYear} SOCRATES HQ. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    );
};
