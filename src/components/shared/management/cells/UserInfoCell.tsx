import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { cn } from "@/lib/utils";

interface UserInfoCellProps {
    name: string;
    email: string;
    image?: string;
    className?: string;
}

export const UserInfoCell = ({ name, email, image, className }: UserInfoCellProps) => {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar className="size-9 border border-white/10 shadow-sm ring-1 ring-white/5 transition-all group-hover:ring-brand-acid/30">
                <AvatarImage src={image} className="object-cover" />
                <AvatarFallback className="bg-brand-acid/10 text-brand-acid text-xs font-bold uppercase tracking-tighter">
                    {name?.slice(0, 2) || "U"}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate tracking-tight group-hover:text-brand-acid transition-colors">
                    {name}
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-medium truncate uppercase tracking-widest -mt-0.5">
                    {email}
                </span>
            </div>
        </div>
    );
};
