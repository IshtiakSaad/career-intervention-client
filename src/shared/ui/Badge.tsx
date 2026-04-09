interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const Badge = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`inline-flex items-center px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase animate-in fade-in zoom-in duration-1000 ${className}`}>
            <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-acid opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#a3e635]"></span>
            </span>
            SYSTEM BYPASS PROTOCOL: <span className="ml-1 font-bold">ONLINE</span>
        </div>
    );
};
