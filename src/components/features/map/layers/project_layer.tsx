import React, { useState, useEffect } from "react";
import { Point } from "ol/geom";
import { RLayerVector, RFeature, ROverlay, RStyle, useOL } from "rlayers";
import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import { Toggle } from "@/types/map-toggle";
import { ProjectCard } from "@/components/features/projects/project-card.tsx";
import { ProjectOut } from "@/api/nexuscore/model";

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
    ({ all_projects, toggle, currentlayer }: { all_projects: ProjectOut[]; toggle: Toggle; currentlayer: string }) => {
        if (!toggle.visible) return null;

        const filtered_projects = all_projects.filter(
            (project) => project.dimension === `minecraft:${currentlayer}` && !project.pin_id
        );

        const [selected, setSelected] = useState<ProjectOut | null>(null);
        const { map } = useOL();

        useEffect(() => {
            if (!selected) return;
            const handle = (e: any) => {
                const pixel = map.getEventPixel(e.originalEvent);
                const feature = map.forEachFeatureAtPixel(pixel, (f) => f, { hitTolerance: 8 });
                if (!feature) setSelected(null);
            };
            map.on("click", handle);
            return () => map.un("click", handle);
        }, [map, selected]);

        if (filtered_projects.length === 0 && !selected) return null;

        return (
            <>
                <RLayerVector zIndex={10}>
                    {filtered_projects.map((project) => {
                        const src = getIconSrc(project);
                        return (
                            <RFeature
                                key={`${project.project_id}-${toggle.label_visible}`}
                                geometry={new Point([project.coordinates[0], project.coordinates[2]])}
                                onClick={() => setSelected(project)}
                            >
                                <RStyle.RStyle>
                                    <RStyle.RIcon src={src} anchor={[0, 1]} scale={0.32} />
                                </RStyle.RStyle>

                                {toggle.label_visible && (
                                    <ROverlay positioning="center-left" offset={[-8, -14]} className="pointer-events-none">
                                        <div className="leaflet-tooltip leaflet-tooltip-left !bg-card !text-card-foreground !border-border shadow-sm px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap !font-minecraft-seven tracking-wide">
                                            {project.name}
                                        </div>
                                    </ROverlay>
                                )}
                            </RFeature>
                        );
                    })}
                </RLayerVector>

                {selected && (
                    <RLayerVector zIndex={30}>
                        <RFeature geometry={new Point([selected.coordinates[0], selected.coordinates[2]])}>
                            <ROverlay positioning="top-center" offset={[10, -34]} autoPan className="w-[21rem] pointer-events-auto">
                                <ProjectCard className="w-[21rem] project-popup-card shadow-xl border" project={selected} onClick={() => setSelected(null)} />
                            </ROverlay>
                        </RFeature>
                    </RLayerVector>
                )}
            </>
        );
    }
);

ProjectLayer.displayName = "ProjectLayer";
