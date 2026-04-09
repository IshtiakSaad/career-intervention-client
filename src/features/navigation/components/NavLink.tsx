import Link from "next/link";
import { type ReactNode } from "react";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
}

export const NavLink = ({ href, children, className = "" }: NavLinkProps) => {
    return (
        <Link
            href={href}
            className={`text-[11px] font-bold text-gray-400 hover:text-brand-acid uppercase tracking-[0.15em] transition-all duration-300 ${className}`}
        >
            {children}
        </Link>
    );
};
