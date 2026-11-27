import React from "react";
import { useOL } from "rlayers";

import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics.ts";
import { MAP_ZOOM } from "@/lib/map-projections.ts";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer.ts";
import { ZOOM_TIERS, type ZoomTierId, dragZoom, zoomTier } from "@/components/features/map/core/edge-zoom.ts";
import { ZoomTierIcon, preloadZoomTierImages } from "./zoom-tier-icon";

type Side = "left" | "right";

/** How long the track and indicator stay up after the thumb lifts. */
const HIDE_DELAY_MS = 700;
const SETTLE_DURATION_MS = 200;
/** Until the strip has been used once, flash both tracks briefly on load so people find it. */
const HINT_STORAGE_KEY = "everthorn-map-edge-zoom-used";
const HINT_DELAY_MS = 800;
const HINT_DURATION_MS = 1600;
/** Keep the indicator on screen when the thumb is near the top of the strip. */
const INDICATOR_MIN_Y = 88;

interface Drag {
    pointerId: number;
    startY: number;
    startZoom: number;
    tier: ZoomTierId;
    atLimit: boolean;
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

function readFlag(key: string) {
    try {
        return localStorage.getItem(key) === "1";
    } catch {
        return false;
    }
}

function writeFlag(key: string) {
    try {
        localStorage.setItem(key, "1");
    } catch {
        // Private mode or blocked storage: the hint just shows again next time
    }
}

/**
 * Snapchat-style one-thumb zoom for touch screens: drag up or down along either edge of the map to
 * zoom in or out. The strips sit on top of the map viewport, so their touches never pan the map.
 * They're invisible until touched, then show a track against the screen edge and the creature
 * that matches the current height, with a haptic tick each time it changes.
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
    const [hinting, setHinting] = React.useState(false);

    React.useEffect(() => {
        preloadZoomTierImages();
        return () => window.clearTimeout(hideTimer.current);
    }, []);

    React.useEffect(() => {
        if (readFlag(HINT_STORAGE_KEY) || prefersReducedMotion()) return;
        const show = window.setTimeout(() => setHinting(true), HINT_DELAY_MS);
        const hide = window.setTimeout(() => setHinting(false), HINT_DELAY_MS + HINT_DURATION_MS);
        return () => {
            window.clearTimeout(show);
            window.clearTimeout(hide);
        };
    }, []);

    /** Thumb position within the strip, held to its ends once the finger slides past them. */
    const thumbY = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    };

    const onPointerDown = (side: Side) => (e: React.PointerEvent<HTMLDivElement>) => {
        if (drag.current) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        const view = map.getView();
        view.cancelAnimations();
        view.beginInteraction();
        const zoom = view.getZoom() ?? MAP_ZOOM.default;

        drag.current = {
            pointerId: e.pointerId,
            startY: e.clientY,
            startZoom: zoom,
            tier: zoomTier(zoom).id,
            atLimit: false,
        };
        window.clearTimeout(hideTimer.current);
        setHinting(false);
        setIndicator({ side, y: thumbY(e), zoom });
        setVisible(true);
        haptic("grab");
        writeFlag(HINT_STORAGE_KEY);
    };

    const onPointerMove = (side: Side) => (e: React.PointerEvent<HTMLDivElement>) => {
        const current = drag.current;
        if (!current || current.pointerId !== e.pointerId) return;

        const zoom = dragZoom(current.startZoom, e.clientY - current.startY);
        map.getView().setZoom(zoom);

        const tier = zoomTier(zoom).id;
        const atLimit = zoom <= MAP_ZOOM.min || zoom >= MAP_ZOOM.max;
        if (atLimit && !current.atLimit) {
            haptic("limit");
        } else if (tier !== current.tier) {
            haptic("tick");
        }
        current.tier = tier;
        current.atLimit = atLimit;

        setIndicator({ side, y: thumbY(e), zoom });
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
            {(["left", "right"] as const).map((side) => {
                const active = indicator?.side === side;
                return (
                    <div
                        key={side}
                        data-slot="map-edge-zoom"
                        data-side={side}
                        className={cn(
                            // Biased toward the bottom, where the thumb naturally rests
                            "absolute top-[38%] bottom-[4%] z-10 w-10 touch-none select-none [-webkit-touch-callout:none]",
                            side === "left" ? "left-0" : "right-0",
                        )}
                        onPointerDown={onPointerDown(side)}
                        onPointerMove={onPointerMove(side)}
                        onPointerUp={onPointerEnd}
                        onPointerCancel={onPointerEnd}
                        onLostPointerCapture={onPointerEnd}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <EdgeTrack
                            side={side}
                            visible={(visible && active) || hinting}
                            gripY={visible && active ? indicator.y : null}
                        />
                        {active && <ZoomIndicator indicator={indicator} visible={visible} />}
                    </div>
                );
            })}
        </>
    );
}

function EdgeTrack({ side, visible, gripY }: { side: Side; visible: boolean; gripY: number | null }) {
    const flush = side === "left" ? "left-0 rounded-r-full" : "right-0 rounded-l-full";

    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-y-0 w-1 transition-opacity duration-300 ease-out",
                flush,
                visible ? "opacity-100" : "opacity-0",
            )}
        >
            {/* Fades out at both ends so it reads as a soft guide, not a hard rule */}
            <div
                className={cn(
                    "absolute inset-0 bg-linear-to-b from-white/0 via-white/55 to-white/0 shadow-[0_0_10px_rgba(255,255,255,0.35)]",
                    flush,
                )}
            />
            {gripY !== null && (
                <div
                    className={cn(
                        "absolute h-16 w-1 -translate-y-1/2 bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)]",
                        flush,
                    )}
                    style={{ top: gripY }}
                />
            )}
        </div>
    );
}

function ZoomIndicator({ indicator, visible }: { indicator: Indicator; visible: boolean }) {
    const tier = zoomTier(indicator.zoom);
    const tierIndex = ZOOM_TIERS.findIndex((t) => t.id === tier.id);

    return (
        <div
            role="status"
            aria-label={`Zoom: ${tier.label}`}
            className={cn(
                // Up and inward of the thumb, so the finger doesn't cover it
                "pointer-events-none absolute flex w-16 -translate-y-full flex-col items-center gap-1.5 rounded-2xl border border-white/20 bg-background/60 p-2 shadow-lg shadow-black/30 backdrop-blur-md",
                "transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none",
                indicator.side === "left" ? "left-14 origin-bottom-left" : "right-14 origin-bottom-right",
                visible ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
            style={{ top: Math.max(indicator.y - 16, INDICATOR_MIN_Y) }}
        >
            <ZoomTierIcon
                key={tier.id}
                tier={tier.id}
                className="size-12 animate-in fade-in-0 zoom-in-75 duration-200 motion-reduce:animate-none"
            />
            {/* Where this tier sits between the sky and the ground */}
            <div className="flex gap-1" aria-hidden="true">
                {ZOOM_TIERS.map((t, i) => (
                    <span
                        key={t.id}
                        className={cn(
                            "h-1 rounded-full transition-all duration-200",
                            i === tierIndex ? "w-3 bg-white" : "w-1 bg-white/30",
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
