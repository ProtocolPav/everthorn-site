import React from "react";
import { RLayerVector, RFeature, ROverlay, useOL } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import { Point } from "ol/geom";

import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import type { Toggle } from "@/types/map-toggle";
import { ProjectCard } from "@/components/features/projects/project-card";
import type { ProjectOut } from "@/api/nexuscore/model";
import { MapTooltip } from "@/components/features/map/core/tooltip";
import {AnimatePresence, motion} from "motion/react";

const PROJECT_ICON_SCALE = 0.32;

const STATUS_ICONS: Record<string, string> = {
    abandoned: abandonedPin,
    completed: completedPin,
};

function getIconSrc(status: string): string {
    return STATUS_ICONS[status] ?? projectPin;
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
        const { map } = useOL();
        const [selectedId, setSelectedId] = React.useState<string | null>(null);

        // Close popup on map interaction or when layer/dimension changes
        React.useEffect(() => {
            setSelectedId(null);
            if (!map) return;

            const close = () => setSelectedId(null);
            map.on("click", close);
            map.on("pointerdrag", close);

            return () => {
                map.un("click", close);
                map.un("pointerdrag", close);
            };
        }, [map, currentlayer, toggle.visible]);

        if (!toggle.visible) return null;

        const filtered_projects = all_projects.filter(
            (p) => p.dimension === `minecraft:${currentlayer}` && !p.pin_id,
        );

        if (filtered_projects.length === 0) return null;

        return (
            <RLayerVector>
                {filtered_projects.map((project) => {
                    const [x, , z] = project.coordinates;
                    const isSelected = selectedId === project.project_id;

                    return (
                        <RFeature
                            key={project.project_id}
                            geometry={new Point([x, z])}
                            onClick={() => {
                                setSelectedId((prev) =>
                                    prev === project.project_id ? null : project.project_id,
                                );
                                return false; // Prevents map click listener from closing immediately
                            }}
                        >
                            <RStyle>
                                <RIcon
                                    src={getIconSrc(project.status)}
                                    anchor={[0, 1]}
                                    anchorXUnits="fraction"
                                    anchorYUnits="fraction"
                                    scale={PROJECT_ICON_SCALE}
                                />
                            </RStyle>

                            <MapTooltip label_visible={toggle.label_visible ?? false}>
                                {project.name}
                            </MapTooltip>

                            <AnimatePresence>
                                {isSelected && (
                                    <ROverlay
                                        positioning="bottom-center"
                                        offset={[0, -30]}
                                        autoPan
                                        className="map-popup pointer-events-auto drop-shadow-2xl drop-shadow-black/50"
                                    >
                                        <motion.div
                                            style={{ transformOrigin: "bottom center" }}
                                            initial={{
                                                opacity: 0,
                                                scaleX: 0.2,
                                                scaleY: 0.05,
                                                y: 25,
                                                filter: "blur(8px)",
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scaleX: 1,
                                                scaleY: 1,
                                                y: 0,
                                                filter: "blur(0px)",
                                                transition: {
                                                    duration: 0.3,
                                                    ease: [0.16, 1, 0.3, 1], // snappy mac-style ease-out
                                                },
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scaleX: 0.05,
                                                scaleY: 0.1,
                                                y: 25,
                                                filter: "blur(12px)",
                                                transition: {
                                                    duration: 0.22,
                                                    ease: [0.7, 0, 0.84, 0], // accelerating suction into the pin
                                                },
                                            }}
                                        >
                                            <ProjectCard
                                                className="w-84"
                                                project={project}
                                                onClick={() => {}}
                                            />
                                        </motion.div>
                                    </ROverlay>
                                )}
                            </AnimatePresence>
                        </RFeature>
                    );
                })}
            </RLayerVector>
        );
    },
);

ProjectLayer.displayName = "ProjectLayer";