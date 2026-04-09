"use client";

import { NavLink } from "@features/navigation/components/NavLink";

const NAV_ITEMS = [
    { label: "Research", href: "/research" },
    { label: "Pathways", href: "/pathways" },
    { label: "Mentors", href: "/mentors" },
    { label: "AI Assessment", href: "/assessment" },
    { label: "About", href: "/about" },
];

export const NavMenu = () => {
    return (
        <nav className="flex items-center gap-8 xl:gap-10">
            {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} href={item.href} className="whitespace-nowrap">
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
};
