import { useState, useEffect, useRef } from "react";
import { useOL } from "rlayers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CheckIcon, CopyIcon, LinkIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

interface ContextMenuState {
    pixel: [number, number];   // screen position for placement
    x: number;                  // Minecraft X
    z: number;                  // Minecraft Z
}

function ContextMenuComponent({ x, z, pixel }: ContextMenuState & { onClose: () => void }) {
    const [coordsCopied, setCoordsCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleCopyCoordinates = (e: React.MouseEvent) => {
        e.stopPropagation();
        const coords = `${x} 70 ${z}`;
        navigator.clipboard.writeText(coords);
        toast.success(`Copied ${coords} to clipboard`);
        setCoordsCopied(true);
        setTimeout(() => setCoordsCopied(false), 2000);
    };

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(`https://everthorn.net/map?x=${x}&z=${z}`);
        toast.success(`Copied Map Link to clipboard`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <div
            className="absolute z-50"
            style={{ left: pixel[0], top: pixel[1] }}
        >
            <Card className="rounded-md rounded-tl-none bg-background/60 backdrop-blur-sm p-0">
                <CardContent className="grid gap-1 p-0">
                    <ButtonGroup>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-tl-none text-[10px] md:text-xs px-2 gap-1.5 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                            onClick={handleCopyCoordinates}
                        >
                            <span className="font-minecraft-seven tabular-nums">
                                {x}, {z}
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] md:text-xs px-2 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                            onClick={handleCopyCoordinates}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {coordsCopied ? (
                                    <motion.div key="check" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                                        <CheckIcon className="size-3.5" weight="bold" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="copy" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                                        <CopyIcon className="size-3.5" weight="bold" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] md:text-xs px-2 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                            onClick={handleCopyLink}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {linkCopied ? (
                                    <motion.div key="check" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                                        <CheckIcon className="size-3.5" weight="bold" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="link" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                                        <LinkIcon className="size-3.5" weight="bold" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </ButtonGroup>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ContextMenu() {
    const { map } = useOL();
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const pixel = map.getEventPixel(e);
            const coord = map.getCoordinateFromPixel(pixel);
            if (!coord) return;

            setMenu({
                pixel: [pixel[0], pixel[1]],
                x: Math.floor(coord[0]),
                z: Math.floor(coord[1]),
            });
        };

        // Close on left click or map drag
        const handleClose = () => setMenu(null);

        const viewport = map.getViewport();
        viewport.addEventListener("contextmenu", handleContextMenu);
        viewport.addEventListener("click", handleClose);
        map.on("movestart", handleClose);

        return () => {
            viewport.removeEventListener("contextmenu", handleContextMenu);
            viewport.removeEventListener("click", handleClose);
            map.un("movestart", handleClose);
        };
    }, [map]);

    if (!menu) return null;

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50">
            <div className="pointer-events-auto">
                <ContextMenuComponent {...menu} onClose={() => setMenu(null)} />
            </div>
        </div>
    );
}