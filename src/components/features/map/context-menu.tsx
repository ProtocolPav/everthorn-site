import { useEffect, useState } from "react";
import { useOL } from "rlayers";
import type { Coordinate } from "ol/coordinate";
import { CheckIcon, CopyIcon, LinkIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { MapOverlay } from "@/components/features/map/core/map-overlay.tsx";

/** Touch long-press that opens the menu (iOS Safari never fires `contextmenu`). */
const LONG_PRESS_MS = 500;
const LONG_PRESS_TOLERANCE_PX = 10;

function CopyStateIcon({ copied, icon: Icon }: { copied: boolean; icon: typeof CopyIcon }) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={copied ? "check" : "copy"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                {copied ? <CheckIcon className="size-3.5" weight="bold" /> : <Icon className="size-3.5" weight="bold" />}
            </motion.div>
        </AnimatePresence>
    );
}

function ContextMenuComponent({ x, z }: { x: number; z: number }) {
    const [coordsCopied, setCoordsCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleCopyCoordinates = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click

        const coords = `${x} 70 ${z}`;
        navigator.clipboard.writeText(coords).then();
        toast.success(`Copied ${coords} to clipboard`);
        setCoordsCopied(true);
        setTimeout(() => setCoordsCopied(false), 2000);
    };

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent card click

        navigator.clipboard.writeText(`https://everthorn.net/map?x=${x}&z=${z}`).then();
        toast.success(`Copied Map Link to clipboard`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const buttonClass =
        "text-[10px] md:text-xs px-2 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30";

    return (
        <Card className={"rounded-md rounded-tl-none bg-background/60 backdrop-blur-sm p-0"}>
            <CardContent className={"grid gap-1 p-0"}>
                <ButtonGroup>
                    <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-tl-none gap-1.5 ${buttonClass}`}
                        onClick={handleCopyCoordinates}
                    >
                        <span className="font-minecraft-seven tabular-nums">
                            {x}, {z}
                        </span>
                    </Button>

                    <Button variant="outline" size="sm" className={buttonClass} onClick={handleCopyCoordinates}>
                        <CopyStateIcon copied={coordsCopied} icon={CopyIcon} />
                    </Button>

                    <Button variant="outline" size="sm" className={buttonClass} onClick={handleCopyLink}>
                        <CopyStateIcon copied={linkCopied} icon={LinkIcon} />
                    </Button>
                </ButtonGroup>
            </CardContent>
        </Card>
    );
}

/** Right-click (or long-press) the map to copy that spot's coordinates or a link to it. */
export default function ContextMenu() {
    const { map } = useOL();
    const [position, setPosition] = useState<Coordinate | null>(null);

    useEffect(() => {
        const viewport = map.getViewport();
        // When the last long-press opened the menu (0 = opened by right click)
        let longPressAt = 0;

        const openAt = (clientX: number, clientY: number) => {
            const coordinate = map.getCoordinateFromPixel(map.getEventPixel({ clientX, clientY }));
            if (coordinate) setPosition(coordinate);
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            // Android fires contextmenu after our own long-press already opened the menu
            if (Date.now() - longPressAt < LONG_PRESS_MS) return;
            longPressAt = 0;
            openAt(e.clientX, e.clientY);
        };

        // Touch long-press
        let pressTimer: number | undefined;
        let pressStart: { x: number; y: number } | null = null;
        const cancelPress = () => {
            window.clearTimeout(pressTimer);
            pressStart = null;
        };
        const handlePointerDown = (e: PointerEvent) => {
            if (e.pointerType !== "touch" || !e.isPrimary) return cancelPress();
            pressStart = { x: e.clientX, y: e.clientY };
            pressTimer = window.setTimeout(() => {
                if (pressStart) {
                    longPressAt = Date.now();
                    openAt(pressStart.x, pressStart.y);
                }
                pressStart = null;
            }, LONG_PRESS_MS);
        };
        const handlePointerMove = (e: PointerEvent) => {
            if (!pressStart) return;
            const moved = Math.hypot(e.clientX - pressStart.x, e.clientY - pressStart.y);
            if (moved > LONG_PRESS_TOLERANCE_PX) cancelPress();
        };

        // Close on a click elsewhere, but not on the tap that ends the long-press itself
        const handleClick = () => {
            if (longPressAt && Date.now() - longPressAt < LONG_PRESS_MS * 2) return;
            setPosition(null);
        };

        viewport.addEventListener("contextmenu", handleContextMenu);
        viewport.addEventListener("pointerdown", handlePointerDown);
        viewport.addEventListener("pointermove", handlePointerMove);
        viewport.addEventListener("pointerup", cancelPress);
        viewport.addEventListener("pointercancel", cancelPress);
        map.on("click", handleClick);
        map.on("movestart", cancelPress);

        return () => {
            cancelPress();
            viewport.removeEventListener("contextmenu", handleContextMenu);
            viewport.removeEventListener("pointerdown", handlePointerDown);
            viewport.removeEventListener("pointermove", handlePointerMove);
            viewport.removeEventListener("pointerup", cancelPress);
            viewport.removeEventListener("pointercancel", cancelPress);
            map.un("click", handleClick);
            map.un("movestart", cancelPress);
        };
    }, [map]);

    if (!position) return null;

    const x = Math.floor(position[0]);
    const z = Math.floor(position[1]);

    return (
        <MapOverlay key={`${x},${z}`} position={position} positioning="top-left" stopEvent={true}>
            <ContextMenuComponent x={x} z={z} />
        </MapOverlay>
    );
}
