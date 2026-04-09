import { Badge, Heading } from "@shared/ui";

export const HeroContent = () => {
    return (
        <div className="flex flex-col items-center text-center max-w-6xl px-4 py-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Tactical Status Badge */}
            <Badge className="mb-12" />

            {/* Aggressive Penalty-Focused Title */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[0.95]">
                THE SYSTEM FAVORS THE INSIDERS.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-acid via-cyan-400 to-blue-500">WE ARE THE OVERRIDE.</span>
            </h1>

            {/* Surgical Sub-copy */}
            <div className="flex flex-col items-center text-center gap-4 border-t-2 border-white/10 max-w-3xl mx-auto px-4 py-2 my-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                <p className="text-lg md:text-sm text-gray-300 leading-relaxed">
                    <strong className="text-white">You have the skill. But skill isn't enough. You lack the intel of the exact coordinates.</strong>
                </p>
                <p className="text-base md:text-sm text-gray-400 leading-relaxed">
                    Stop relying on generic YouTube videos and &quot;Bhaiya&quot; advice. Bypass the gatekeepers with a brutal, 1-on-1 surgical audit and insider intelligence from elite practitioners who have already breached the circuit
                </p>
            </div>

        </div>
    );
};
