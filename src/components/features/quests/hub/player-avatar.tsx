import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/** Initials fallback avatar — no avatar images exist for these users yet. */
export function PlayerAvatar({
    name,
    className,
    size = "sm",
}: {
    name: string;
    className?: string;
    size?: "default" | "sm" | "lg";
}) {
    const initials = name.slice(0, 2).toUpperCase();

    return (
        <Avatar size={size} className={cn("shrink-0", className)}>
            <AvatarFallback className="text-[10px] font-semibold uppercase">{initials}</AvatarFallback>
        </Avatar>
    );
}
