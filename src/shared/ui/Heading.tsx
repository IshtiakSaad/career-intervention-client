import { ReactNode } from "react";
import { cn } from "@shared/lib/utils";

interface HeadingProps {
    children: ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    variant?: "primary" | "secondary";
}

export const Heading = ({
    children,
    level = 1,
    className = "",
    variant = "primary"
}: HeadingProps) => {
    const Tag = `h${level}` as any;

    const baseStyles = "font-black tracking-tighter text-white uppercase italic leading-[0.95]";
    const variants = {
        primary: "text-5xl sm:text-7xl md:text-9xl",
        secondary: "text-2xl sm:text-3xl md:text-4xl",
    };

    return (
        <Tag className={cn(baseStyles, variants[variant], className)}>
            {children}
        </Tag>
    );
};
