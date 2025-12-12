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
                onMouseEnter={() => setOpen(true)}
                asChild
            >
                <Button
                    variant={"outline"}
                    size="default"
                    className={cn(
                        "relative px-3 gap-2 bg-background/40 backdrop-blur-sm border-border/60 transition-all touch-manipulation font-minecraft-seven shadow-sm hover:bg-background/60 hover:shadow-md hover:border-border/80",
                        visibleCount > 0 && "bg-primary/12 border-primary/50 hover:bg-primary/15 hover:border-primary/60 shadow-primary/5"
                    )}
                >
                    <div className="relative flex items-center justify-center">
                        <PushPinIcon
                            weight={visibleCount > 0 ? "fill" : "duotone"}
                            size={20}
                            className={"transition-all duration-200 text-primary drop-shadow-sm"}
                        />
                        {visibleCount > 0 && (
                            <div className="absolute -bottom-1 -right-1 h-3 min-w-3 px-0.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold shadow-md ring-1 ring-background">
                                {visibleCount}
                            </div>
                        )}
                    </div>
                    <span className={"text-sm font-semibold tracking-wide transition-colors text-foreground"}>
                        Pins
                    </span>
                </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                onInteractOutside={() => setOpen(false)}
                onMouseLeave={() => setOpen(false)}
                align={"center"}
                sideOffset={4}
                collisionPadding={10}
                className="w-60 rounded-2xl bg-background/70 p-2 shadow-2xl backdrop-blur-xl border border-border/60"
            >
                {/* Refined header */}
                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-2">
                        <PushPinIcon weight={"duotone"} size={15}/>
                        <h3 className="text-xs font-bold tracking-tight">Map Pins</h3>
                    </div>
                    <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-semibold">
                        {visibleCount}/{pins.length}
                    </Badge>
                </div>

                <Separator className="mb-1.5" />

                {/* Refined pin list */}
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {pins.map((pin) => (
                        <Button
                            key={pin.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "group relative flex items-center gap-2 rounded-xl border transition-all w-full h-auto hover:shadow-md active:scale-[0.98] touch-manipulation",
                                pin.visible
                                    ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm hover:from-primary/15 hover:to-primary/8 active:from-primary/20 active:to-primary/10"
                                    : "border-border/30 bg-gradient-to-br from-background/40 to-background/20 hover:border-border/50 hover:from-background/60 hover:to-background/40 active:from-background/80 active:to-background/60"
                            )}
                            onClick={() => update_pins(pin.id)}
                        >
                            {/* Refined icon container */}
                            <div
                                className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                                    pin.visible
                                        ? "bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/40 shadow-sm"
                                        : "bg-gradient-to-br from-muted/60 to-muted/30"
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
                                        size={15}
                                        className={cn(
                                            "transition-colors",
                                            pin.visible ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                ) : null}
                            </div>

                            {/* Content area */}
                            <div className="flex flex-1 flex-col items-start justify-center gap-0.5 min-w-0 py-1.5">
                                <span
                                    className={cn(
                                        "text-xs font-semibold truncate transition-colors leading-tight w-full text-left",
                                        pin.visible
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {pin.name}
                                </span>

                                {/* Refined status */}
                                <div className="flex items-center gap-1">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-all",
                                            pin.visible
                                                ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]"
                                                : "bg-muted-foreground/40"
                                        )}
                                    />
                                    <span className={cn(
                                        "text-[10px] font-medium transition-colors",
                                        pin.visible ? "text-green-600/80 dark:text-green-400/80" : "text-muted-foreground/70"
                                    )}>
                                        {pin.visible ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                            </div>

                            {/* Refined label button */}
                            <Button
                                variant="secondary"
                                size="sm"
                                className={cn(
                                    "shrink-0 h-auto gap-1 rounded-lg px-1.5 py-1.5 transition-all text-[10px] font-semibold touch-manipulation active:scale-95 shadow-sm",
                                    pin.label_visible
                                        ? "bg-gradient-to-br from-amber-500/25 to-amber-500/15 text-amber-700 dark:text-amber-300 hover:from-amber-500/35 hover:to-amber-500/25 border border-amber-500/30"
                                        : "bg-gradient-to-br from-muted/40 to-muted/20 hover:from-muted/60 hover:to-muted/40 border border-border/40"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    update_pins(pin.id, true);
                                }}
                            >
                                <div className="relative flex items-center">
                                    <TagIcon weight={pin.label_visible ? "fill" : "regular"} size={12} />
                                    {!pin.label_visible && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-[1.5px] bg-current -rotate-45 origin-center" />
                                        </div>
                                    )}
                                </div>
                                <span className={cn(!pin.label_visible && "line-through opacity-60")}>Aa</span>
                            </Button>
                        </Button>
                    ))}
                </div>

                {/* Refined footer */}
                <Separator className="my-1.5" />
                <div className="flex items-center justify-center gap-1.5 px-2 py-1 text-[10px] text-muted-foreground/80 font-medium">
                    Choose which Pins to view
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
