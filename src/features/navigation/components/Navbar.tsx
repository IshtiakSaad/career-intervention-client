import { Logo } from "@features/branding/components";
import { NavMenu } from "@features/navigation/components";
import { Button } from "@shared/ui";
import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="w-full bg-brand-obsidian/95 border-b border-white/5 py-4">
            <div className="container mx-auto px-4 flex items-center justify-between gap-4">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                    <Logo />
                </div>

                {/* Center: Navigation */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <NavMenu />
                </div>

                {/* Right: Auth Actions */}
                <div className="flex-shrink-0">
                    <Link href="/login">
                        <Button variant="outline" className="rounded-none border-brand-acid text-brand-acid hover:bg-brand-acid hover:text-brand-obsidian font-mono text-xs uppercase tracking-widest px-6 h-9 transition-all duration-300">
                            [ LOGIN / SIGNUP ]
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
