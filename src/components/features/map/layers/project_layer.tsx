import React from "react";
import { RLayerVector, RFeature, ROverlay, RPopup } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import { Point } from "ol/geom";

import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import type { Toggle } from "@/types/map-toggle";
import { ProjectCard } from "@/components/features/projects/project-card.tsx";
import type { ProjectOut } from "@/api/nexuscore/model";

// Native pin is 64×104, Leaflet used 20.46×33.28 (≈0.32× scale).
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

                            {toggle.label_visible ? (
                                <ROverlay
                                    positioning="center-right"
                                    offset={[-3, -9]}
                                    className="project-tooltip bg-background/70 border-none rounded-sm text-foreground text-xs font-minecraft-seven py-1 px-1.5 whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.4)] pointer-events-none leading-none"
                                >
                                    {project.name}
                                </ROverlay>
                            ) : (
                                <RPopup
                                    trigger="hover"
                                    positioning="center-right"
                                    offset={[-3, -9]}
                                    autoPan={false}
                                    className="project-tooltip bg-background/70 border-none rounded-sm text-foreground text-xs font-minecraft-seven py-1 px-1.5 whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.4)] pointer-events-none leading-none"
                                    delay={{ show: 0, hide: 0 }}
                                >
                                    {project.name}
                                </RPopup>
                            )}

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
