import { useState } from "react";
import { Toggle } from "@/types/map-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CardsThree } from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const LayersControl = ({
                                  layers,
                                  update_layers,
                              }: {
    layers: Toggle[];
    update_layers: Function;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                onClick={() => setOpen(true)}
                onMouseEnter={() => setOpen(true)}
                asChild
            >
                <Button
                    variant={"outline"}
                    className={"flex gap-1 bg-background/30 p-2"}
                >
                    <CardsThree weight={"duotone"} size={20} />{" "}
                    <ChevronDown size={15} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                onMouseLeave={() => setOpen(false)}
                onInteractOutside={() => setOpen(false)}
                align={"end"}
                alignOffset={-61}
                sideOffset={8}
                className={"grid gap-1 bg-background/80 p-1.5 backdrop-blur-sm"}
            >
                <h3 className={"px-0.5 text-sm"}>Map Layers</h3>
                {layers.map((layer) => (
                    <Button
                        key={layer.id}
                        variant={"invisible"}
                        size={"sm"}
                        className={cn(
                            "flex w-full items-center justify-start gap-2 border bg-background/30",
                            layer.visible
                                ? "bg-gray-500/20 dark:bg-gray-200/20"
                                : "",
                        )}
                        onClick={() => {
                            update_layers(layer.id);
                        }}
                    >
                        {layer.image ? (
                            <img
                                src={layer.image as string}
                                alt={"pin icon"}
                                width={20}
                                height={20}
                            />
                        ) : null}
                        {layer.icon ? (
                            <layer.icon weight={"duotone"} size={20} />
                        ) : null}
                        {layer.name}
                    </Button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
