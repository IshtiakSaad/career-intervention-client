import { HeroContent } from "@features/marketing/components/HeroContent";

export const Hero = () => {
    return (
        <section className="relative w-full flex flex-col items-center justify-center pt-20 pb-24 overflow-hidden bg-brand-obsidian">
            {/* Tactical Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                {/* CSS Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                {/* Radial Depth Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_70%)]"></div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(163,230,53,0.03)_50%)] bg-[size:100%_4px] animate-scan"></div>
            </div>

            {/* Content Integration */}
            <div className="relative z-10 w-full flex justify-center">
                <HeroContent />
            </div>
        </section>
    );
};
