import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    PushPinIcon,
    TagIcon,
} from "@phosphor-icons/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Toggle } from "@/types/map-toggle";
import { cn } from "@/lib/utils";

export const PinsControl = ({
                                pins,
                                update_pins,
                            }: {
    pins: Toggle[];
    update_pins: Function;
}) => {
    const [open, setOpen] = useState(false);
    const visibleCount = pins.filter((p) => p.visible).length;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                onClick={() => setOpen(true)}
                asChild
            >
                <Button
                    variant={"outline"}
                    size="sm"
                    className={cn(
                        "relative bg-background/30 transition-all touch-manipulation font-minecraft-seven h-8 px-2.5 gap-1.5",
                        visibleCount > 0 && "bg-primary/10 border-primary/30"
                    )}
                >
                    <PushPinIcon weight={"duotone"} size={18} />
                    Pins
                    {visibleCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 text-[9px] font-bold"
                        >
                            {visibleCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                onInteractOutside={() => setOpen(false)}
                align={"end"}
                sideOffset={8}
                className="w-60 rounded-xl bg-background/95 p-1.5 shadow-xl backdrop-blur-xl border-border/50"
            >
                {/* Compact header */}
                <div className="flex items-center justify-between px-2 py-1">
                    <h3 className="text-[11px] font-bold tracking-tight">Map Pins</h3>
                    <span className="text-[9px] text-muted-foreground">
                        {visibleCount}/{pins.length}
                    </span>
                </div>

                <Separator className="mb-1" />

                {/* Compact pin list */}
                <div className="space-y-0.5 max-h-[400px] overflow-y-auto pr-0.5">
                    {pins.map((pin) => (
                        <Button
                            key={pin.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "group relative flex items-center gap-2 rounded-lg border p-1.5 transition-all w-full h-auto hover:shadow-sm active:scale-[0.98] touch-manipulation",
                                pin.visible
                                    ? "border-primary/40 bg-primary/8 shadow-sm hover:bg-primary/12 active:bg-primary/15"
                                    : "border-border/20 bg-background/30 hover:border-border/40 hover:bg-background/50 active:bg-background/60"
                            )}
                            onClick={() => update_pins(pin.id)}
                        >
                            {/* Icon with compact styling */}
                            <div
                                className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all",
                                    pin.visible
                                        ? "bg-primary/15 ring-1 ring-primary/30"
                                        : "bg-muted/40"
                                )}
                            >
                                {pin.image ? (
                                    <img
                                        src={pin.image as string}
                                        alt={pin.name}
                                        className="h-4 w-4 object-contain"
                                    />
                                ) : null}
                                {pin.icon ? (
                                    <pin.icon
                                        weight={"duotone"}
                                        size={14}
                                        className={cn(
                                            "transition-colors",
                                            pin.visible ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                ) : null}
                            </div>

                            {/* Name and status */}
                            <div className="flex flex-1 flex-col items-start gap-0.5 min-w-0">
                                <span
                                    className={cn(
                                        "text-xs font-medium truncate transition-colors leading-tight w-full text-left",
                                        pin.visible
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {pin.name}
                                </span>

                                {/* Status indicator */}
                                <div className="flex items-center gap-1">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-colors",
                                            pin.visible ? "bg-green-500" : "bg-muted-foreground/30"
                                        )}
                                    />
                                    <span className="text-[10px] text-muted-foreground/80">
                                        {pin.visible ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                            </div>

                            {/* Label toggle button with ShadCN */}
                            <Button
                                variant="secondary"
                                size="sm"
                                className={cn(
                                    "shrink-0 h-auto gap-1 rounded-md px-1.5 py-1 transition-all text-[10px] font-medium touch-manipulation active:scale-95",
                                    pin.label_visible
                                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 dark:hover:bg-amber-500/30 active:bg-amber-500/40"
                                        : "bg-muted/30 hover:bg-muted/50 active:bg-muted/60"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    update_pins(pin.id, true);
                                }}
                                title={pin.label_visible ? "Hide pin labels" : "Show pin labels"}
                            >
                                <div className="relative flex items-center">
                                    <TagIcon weight={pin.label_visible ? "fill" : "regular"} size={12} />
                                    {!pin.label_visible && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-[1.5px] bg-current -rotate-45 origin-center" />
                                        </div>
                                    )}
                                </div>
                                <span className={cn(!pin.label_visible && "line-through opacity-50")}>Aa</span>
                            </Button>
                        </Button>
                    ))}
                </div>

                {/* Compact footer */}
                <Separator className="my-1" />
                <div className="flex items-center justify-center px-1 py-0.5 text-[10px] text-muted-foreground">
                    {pins.length} pins
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
