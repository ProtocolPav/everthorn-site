import React from "react";
import { useOL } from "rlayers";

import { cn } from "@/lib/utils";
import { MAP_ZOOM } from "@/lib/map-projections.ts";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer.ts";
import { type ZoomTierId, dragZoom, zoomTier } from "@/components/features/map/core/edge-zoom.ts";
import { ZoomTierIcon } from "./zoom-tier-icon";

type Side = "left" | "right";

/** How long the strip and indicator stay up after the thumb lifts. */
const HIDE_DELAY_MS = 600;
const SETTLE_DURATION_MS = 200;
const LEVEL_COUNT = MAP_ZOOM.max - MAP_ZOOM.min + 1;

interface Drag {
    pointerId: number;
    startY: number;
    startZoom: number;
    tier: ZoomTierId;
}

interface Indicator {
    side: Side;
    /** Thumb position, relative to the strip's top edge. */
    y: number;
    zoom: number;
}

function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function buzz(ms: number) {
    // Android only; iOS Safari has no Vibration API
    navigator.vibrate?.(ms);
}

/**
 * Snapchat-style one-thumb zoom for touch screens: drag up or down along either edge of the map to
 * zoom in or out. The strips sit on top of the map viewport, so their touches never pan the map.
 * They're invisible until touched, then show a pixel-art indicator of the zoom level beside the thumb.
 */
export function EdgeZoomControl() {
    const isTouch = useCoarsePointer();
    if (!isTouch) return null;
    return <EdgeZoomStrips />;
}

function EdgeZoomStrips() {
    const { map } = useOL();
    const drag = React.useRef<Drag | null>(null);
    const hideTimer = React.useRef<number | undefined>(undefined);
    const [indicator, setIndicator] = React.useState<Indicator | null>(null);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => () => window.clearTimeout(hideTimer.current), []);

    const onPointerDown = (side: Side) => (e: React.PointerEvent<HTMLDivElement>) => {
        if (drag.current) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        const view = map.getView();
        view.cancelAnimations();
        view.beginInteraction();
        const zoom = view.getZoom() ?? MAP_ZOOM.default;

        drag.current = { pointerId: e.pointerId, startY: e.clientY, startZoom: zoom, tier: zoomTier(zoom).id };
        window.clearTimeout(hideTimer.current);
        setIndicator({ side, y: e.clientY - e.currentTarget.getBoundingClientRect().top, zoom });
        setVisible(true);
        buzz(10);
    };

    const onPointerMove = (side: Side) => (e: React.PointerEvent<HTMLDivElement>) => {
        const current = drag.current;
        if (!current || current.pointerId !== e.pointerId) return;

        const zoom = dragZoom(current.startZoom, e.clientY - current.startY);
        map.getView().setZoom(zoom);

        const tier = zoomTier(zoom).id;
        if (tier !== current.tier) {
            current.tier = tier;
            buzz(5);
        }
        setIndicator({ side, y: e.clientY - e.currentTarget.getBoundingClientRect().top, zoom });
    };

    const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!drag.current || drag.current.pointerId !== e.pointerId) return;
        drag.current = null;

        // Settle on a whole zoom level so the pixel-art tiles stay crisp
        const view = map.getView();
        view.endInteraction(0);
        const settled = Math.round(view.getZoom() ?? MAP_ZOOM.default);
        view.animate({ zoom: settled, duration: prefersReducedMotion() ? 0 : SETTLE_DURATION_MS });
        setIndicator((prev) => (prev ? { ...prev, zoom: settled } : prev));

        hideTimer.current = window.setTimeout(() => setVisible(false), HIDE_DELAY_MS);
    };

    return (
        <>
            {(["left", "right"] as const).map((side) => (
                <div
                    key={side}
                    data-slot="map-edge-zoom"
                    data-side={side}
                    className={cn(
                        "absolute inset-y-[18%] z-10 w-9 touch-none select-none",
                        side === "left" ? "left-0" : "right-0",
                    )}
                    onPointerDown={onPointerDown(side)}
                    onPointerMove={onPointerMove(side)}
                    onPointerUp={onPointerEnd}
                    onPointerCancel={onPointerEnd}
                    onLostPointerCapture={onPointerEnd}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <EdgeTrack side={side} visible={visible && indicator?.side === side} />
                    {indicator?.side === side && <ZoomIndicator indicator={indicator} visible={visible} />}
                </div>
            ))}
        </>
    );
}

function EdgeTrack({ side, visible }: { side: Side; visible: boolean }) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-y-0 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.45)] transition-opacity duration-300",
                side === "left" ? "left-1" : "right-1",
                visible ? "opacity-100" : "opacity-0",
            )}
        />
    );
}

function ZoomIndicator({ indicator, visible }: { indicator: Indicator; visible: boolean }) {
    const tier = zoomTier(indicator.zoom);
    const filled = Math.round(indicator.zoom) - MAP_ZOOM.min + 1;

    return (
        <div
            className={cn(
                // Up and inward of the thumb, so the finger doesn't cover it
                "pointer-events-none absolute flex -translate-y-full items-center gap-2.5 rounded-2xl border border-white/20 bg-background/60 py-1.5 pr-3 pl-1.5 backdrop-blur-sm transition-opacity duration-300",
                indicator.side === "left" ? "left-12" : "right-12 flex-row-reverse pr-1.5 pl-3",
                visible ? "opacity-100" : "opacity-0",
            )}
            style={{ top: indicator.y - 12 }}
        >
            <div className="flex size-11 items-center justify-center rounded-xl bg-black/30">
                <ZoomTierIcon key={tier.id} tier={tier.id} className="size-9 animate-in zoom-in-50 duration-150" />
            </div>
            <div className={cn("flex flex-col gap-1", indicator.side === "right" && "items-end")}>
                <span className="font-minecraft-seven text-sm leading-none tracking-wide whitespace-nowrap">
                    {tier.label}
                </span>
                {/* XP-bar style zoom gauge */}
                <div className="flex gap-px rounded-[2px] bg-black/50 p-px" aria-hidden="true">
                    {Array.from({ length: LEVEL_COUNT }, (_, i) => (
                        <span
                            key={i}
                            className={cn("h-1.5 w-1.5", i < filled ? "bg-lime-400" : "bg-white/15")}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
