import Link from "next/link";

export const Logo = () => {
    return (
        <Link href="/" className="flex items-center group">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
                Socrates<span className="text-brand-acid not-italic tracking-normal">HQ</span>
            </span>
        </Link>
    );
};
