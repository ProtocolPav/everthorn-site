import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    StackIcon,
    EyeSlashIcon,
    CheckIcon,
} from "@phosphor-icons/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Toggle } from "@/types/map-toggle";
import { cn } from "@/lib/utils";

export const LayersControl = ({
                                  layers,
                                  update_layers,
                              }: {
    layers: Toggle[];
    update_layers: Function;
}) => {
    const [open, setOpen] = useState(false);
    const activeLayer = layers.find((l) => l.visible);

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
                        activeLayer && "bg-primary/12 border-primary/50 hover:bg-primary/15 hover:border-primary/60 shadow-primary/5"
                    )}
                >
                    <div className="relative flex items-center justify-center">
                        <StackIcon
                            weight={activeLayer ? "fill" : "duotone"}
                            size={20}
                            className={cn(
                                "transition-all duration-200",
                                activeLayer ? "text-primary drop-shadow-sm" : "text-muted-foreground"
                            )}
                        />
                        {activeLayer && (
                            <div className="absolute -bottom-1 -right-1 size-3 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-md ring-1 ring-background">
                                {activeLayer.image ? (
                                    <img
                                        src={activeLayer.image as string}
                                        alt={activeLayer.name}
                                        className="size-2 object-contain"
                                    />
                                ) : activeLayer.icon ? (
                                    <activeLayer.icon
                                        weight="duotone"
                                        size={10}
                                        className="text-primary-foreground"
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                    <span className={cn(
                        "text-sm font-semibold tracking-wide transition-colors",
                        activeLayer ? "text-foreground" : "text-muted-foreground"
                    )}>
                        View
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                onInteractOutside={() => setOpen(false)}
                onMouseLeave={() => setOpen(false)}
                align={"center"}
                sideOffset={7}
                collisionPadding={10}
                className="w-60 rounded-2xl bg-background/70 p-2 shadow-2xl backdrop-blur-xl border border-border/60"
            >
                {/* Refined header */}
                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-2">
                        <StackIcon weight={"duotone"} size={15}/>
                        <h3 className="text-xs font-bold tracking-tight">Map Layers</h3>
                    </div>
                </div>

                <Separator className="mb-1.5" />

                {/* Refined layer list */}
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {layers.map((layer) => (
                        <Button
                            key={layer.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "group relative flex items-center gap-2 rounded-xl border transition-all w-full h-auto hover:shadow-md active:scale-[0.98] touch-manipulation",
                                layer.visible
                                    ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm hover:from-primary/15 hover:to-primary/8 active:from-primary/20 active:to-primary/10"
                                    : "border-border/30 bg-gradient-to-br from-background/40 to-background/20 hover:border-border/50 hover:from-background/60 hover:to-background/40 active:from-background/80 active:to-background/60"
                            )}
                            onClick={() => update_layers(layer.id)}
                        >
                            {/* Refined icon container */}
                            <div
                                className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                                    layer.visible
                                        ? "bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/40 shadow-sm"
                                        : "bg-gradient-to-br from-muted/60 to-muted/30"
                                )}
                            >
                                {layer.image ? (
                                    <img
                                        src={layer.image as string}
                                        alt={layer.name}
                                        className="h-4 w-4 object-contain"
                                    />
                                ) : null}
                                {layer.icon ? (
                                    <layer.icon
                                        weight={"duotone"}
                                        size={15}
                                        className={cn(
                                            "transition-colors",
                                            layer.visible ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                ) : null}
                            </div>

                            {/* Content area */}
                            <div className="flex flex-1 flex-col items-start justify-center gap-0.5 min-w-0 py-1.5">
                                <div className="flex items-center gap-1.5 w-full">
                                    <span
                                        className={cn(
                                            "text-xs font-semibold truncate transition-colors leading-tight",
                                            layer.visible
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {layer.name}
                                    </span>
                                    {layer.description && (
                                        <span className={cn(
                                            "text-[10px] font-mono font-medium px-1 py-0.5 rounded bg-muted/50 transition-colors shrink-0",
                                            layer.visible ? "text-foreground/70" : "text-muted-foreground/60"
                                        )}>
                                            Y: {layer.description}
                                        </span>
                                    )}
                                </div>

                                {/* Refined status */}
                                <div className="flex items-center gap-1">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-all",
                                            layer.visible
                                                ? "bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                                                : "bg-muted-foreground/40"
                                        )}
                                    />
                                    <span className={cn(
                                        "text-[10px] font-medium transition-colors",
                                        layer.visible ? "text-blue-600/80 dark:text-blue-400/80" : "text-muted-foreground/70"
                                    )}>
                                        {layer.visible ? "Active" : "Hidden"}
                                    </span>
                                </div>
                            </div>

                            {/* Active indicator */}
                            <div className={cn(
                                "shrink-0 flex items-center justify-center rounded-lg h-7 w-7 transition-all",
                                layer.visible
                                    ? "bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "bg-muted/30 text-muted-foreground/50"
                            )}>
                                {layer.visible ? (
                                    <CheckIcon weight="bold" size={14} />
                                ) : (
                                    <EyeSlashIcon weight="regular" size={14} />
                                )}
                            </div>
                        </Button>
                    ))}
                </div>

                {/* Refined footer */}
                <Separator className="my-1.5" />
                <div className="flex items-center justify-center gap-1.5 px-2 py-1 text-[10px] text-muted-foreground/80 font-medium">
                    Choose which Layers to display
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
