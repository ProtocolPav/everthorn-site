import React from "react";
import { RLayerVector, RFeature, RPopup } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import { Point } from "ol/geom";
import { Overlay } from "ol";
import { useOL, RContext } from "rlayers";

import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import type { Toggle } from "@/types/map-toggle";
import { ProjectCard } from "@/components/features/projects/project-card.tsx";
import type { ProjectOut } from "@/api/nexuscore/model";

// Native pin size is 64x104, Leaflet used 20.46x33.28 (≈0.32x scale).
// Keep scale so icons match Leaflet's smaller size.
const PROJECT_ICON_SCALE = 0.32;

function getIconSrc(project: ProjectOut): string {
    switch (project.status) {
        case "abandoned":
            return abandonedPin;
        case "completed":
            return completedPin;
        default:
            return projectPin;
    }
}

/**
 * Tooltip that does NOT block map interactions.
 * Leaflet's .leaflet-tooltip has `pointer-events: none` and lives in a
 * non-stopevent container. RLayers' ROverlay defaults to stopEvent:true,
 * which makes the map ignore wheel events when hovering the tooltip (page
 * scrolls instead). We create an OL Overlay with `stopEvent: false` and
 * `pointerEvents: none` to match Leaflet.
 */
function ProjectNameTooltip({ name }: { name: string }) {
    const { map } = useOL();
    const { location } = React.useContext(RContext) as { location?: number[] };
    const elRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<Overlay | null>(null);

    React.useEffect(() => {
        if (!map || !location || !elRef.current) return;
        const overlay = new Overlay({
            element: elRef.current,
            positioning: "center-right",
            offset: [-3, -9],
            stopEvent: false,
        });
        overlay.setPosition(location as any);
        map.addOverlay(overlay);
        overlayRef.current = overlay;
        return () => {
            map.removeOverlay(overlay);
        };
    }, [map, location]);

    React.useEffect(() => {
        if (overlayRef.current && location) {
            overlayRef.current.setPosition(location as any);
        }
    }, [location]);

    if (!location) return null;

    return (
        <div ref={elRef} style={{ pointerEvents: "none" }}>
            <div className="bg-background/70 border-none rounded-sm text-foreground text-xs font-minecraft-seven py-1 px-1.5 whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.4)] pointer-events-none leading-none">
                {name}
            </div>
        </div>
    );
}

export const ProjectLayer = React.memo(
    ({
        all_projects,
        toggle,
        currentlayer,
    }: {
        all_projects: ProjectOut[];
        toggle: Toggle;
        currentlayer: string;
    }) => {
        if (!toggle.visible) return null;

        const filtered_projects = all_projects.filter(
            (project) => project.dimension === `minecraft:${currentlayer}` && !project.pin_id,
        );

        if (filtered_projects.length === 0) return null;

        return (
            <RLayerVector zIndex={10}>
                {filtered_projects.map((project) => {
                    const [x, , z] = project.coordinates;
                    return (
                        <RFeature
                            key={`${project.project_id}-${toggle.label_visible}`}
                            geometry={new Point([x, z])}
                        >
                            <RStyle>
                                <RIcon
                                    src={getIconSrc(project)}
                                    anchor={[0, 1]}
                                    anchorXUnits="fraction"
                                    anchorYUnits="fraction"
                                    scale={PROJECT_ICON_SCALE}
                                />
                            </RStyle>

                            {toggle.label_visible && (
                                <ProjectNameTooltip name={project.name} />
                            )}

                            {/* Matches src/styles/leaflet.css .leaflet-popup-content-wrapper (transparent, no tip) */}
                            <RPopup
                                trigger="click"
                                positioning="bottom-left"
                                offset={[4, -15]}
                                autoPan={true}
                                className="w-[21rem] bg-transparent border-0 p-0 m-0 drop-shadow-2xl drop-shadow-black/50 pointer-events-auto"
                            >
                                <div className="m-0 p-0 bg-transparent">
                                    <ProjectCard
                                        className="w-[21rem]"
                                        project={project}
                                        onClick={() => {}}
                                    />
                                </div>
                            </RPopup>
                        </RFeature>
                    );
                })}
            </RLayerVector>
        );
    },
);

ProjectLayer.displayName = "ProjectLayer";
