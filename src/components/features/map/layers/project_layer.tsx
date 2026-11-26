import React from "react";

import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import type { Toggle } from "@/types/map-toggle";
import { ProjectCard } from "@/components/features/projects/project-card.tsx";
import type { ProjectOut } from "@/api/nexuscore/model";
import { createMarkerIconStyle } from "@/lib/map-styles.tsx";
import { MapMarker } from "@/components/features/map/core/map-marker.tsx";

// Pin images are 25.6×41.6, shown at 0.8× and anchored at their bottom-left corner
const ICON = { size: [20.46, 33.28] as [number, number], anchor: [0, 1] as [number, number] };

const project_style = createMarkerIconStyle(projectPin, ICON);
const abandoned_style = createMarkerIconStyle(abandonedPin, ICON);
const completed_style = createMarkerIconStyle(completedPin, ICON);

function get_style(project: ProjectOut) {
    switch (project.status) {
        case "abandoned":
            return abandoned_style;
        case "completed":
            return completed_style;
        default:
            return project_style;
    }
}

const ProjectMarker = React.memo(function ProjectMarker({
    project,
    labelVisible,
}: {
    project: ProjectOut;
    labelVisible: boolean;
}) {
    return (
        <MapMarker
            id={`project:${project.project_id}`}
            x={project.coordinates[0]}
            z={project.coordinates[2]}
            style={get_style(project)}
            label={project.name}
            labelVisible={labelVisible}
            popup={<ProjectCard className="w-84" project={project} onClick={() => {}} />}
        />
    );
});

/** Project markers. Render inside a vector or cluster layer. */
export const ProjectLayer = React.memo(
    ({ all_projects, toggle, currentlayer }: { all_projects: ProjectOut[]; toggle: Toggle; currentlayer: string }) => {
        if (!toggle.visible) return null;

        const filtered_projects = all_projects.filter(
            (project) => project.dimension === `minecraft:${currentlayer}` && !project.pin_id,
        );

        return (
            <>
                {filtered_projects.map((project) => (
                    <ProjectMarker
                        key={project.project_id}
                        project={project}
                        labelVisible={toggle.label_visible ?? false}
                    />
                ))}
            </>
        );
    },
);

ProjectLayer.displayName = "ProjectLayer";

/** The marker icon for an item, shared with the admin map editor. */
export { get_style as getProjectStyle };
