import { Button } from "@/components/ui/button";
import { PencilSimpleIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function EditControl({
                                isEditing,
                                setIsEditing,
                            }: {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}) {
    return (
        <Button
            variant="outline"
            size="default"
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
                "relative px-3 gap-2 bg-background/40 backdrop-blur-sm border-border/60 transition-all touch-manipulation font-minecraft-seven shadow-sm hover:bg-background/60 hover:shadow-md hover:border-border/80",
                isEditing && "bg-orange-500/12 border-orange-500/50 hover:bg-orange-500/15 hover:border-orange-500/60 shadow-orange-500/5"
            )}
        >
            {isEditing ? (
                <CheckIcon
                    weight="bold"
                    size={20}
                    className="text-orange-500 drop-shadow-sm transition-all duration-200"
                />
            ) : (
                <PencilSimpleIcon
                    weight="duotone"
                    size={20}
                    className="text-muted-foreground transition-all duration-200"
                />
            )}
            <span className={cn(
                "text-sm font-semibold tracking-wide transition-colors",
                isEditing ? "text-foreground" : "text-muted-foreground"
            )}>
                {isEditing ? "Exit Edit Mode" : "Edit"}
            </span>
        </Button>
    );
}
