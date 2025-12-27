import {Tooltip as LTooltip, Popup, Marker} from "react-leaflet";
import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import {Project} from "@/types/projects";
import L from "leaflet";
import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import {Toggle} from "@/types/map-toggle";
import {ProjectCard} from "@/components/features/projects/project-card.tsx";

const project_icon = new L.Icon({
    iconUrl: projectPin,
    iconSize: [20.46, 33.28],  // Originally [25.6, 41.6]
    iconAnchor: [0, 33.28],  // Originally [0, 41.6]
});

const abandoned_icon = new L.Icon({
    iconUrl: abandonedPin,
    iconSize: [20.46, 33.28],  // Originally [25.6, 41.6]
    iconAnchor: [0, 33.28],  // Originally [0, 41.6]
});

const completed_icon = new L.Icon({
    iconUrl: completedPin,
    iconSize: [20.46, 33.28],  // Originally [25.6, 41.6]
    iconAnchor: [0, 33.28],  // Originally [0, 41.6]
});

function get_icon(project: Project) {
    switch (project.status) {
        case "abandoned":
            return abandoned_icon
        case "completed":
            return completed_icon

        default:
            return project_icon

    }
}

function createClusterCustomIcon (cluster: any ) {
    return L.divIcon({
        html: `<span>${cluster.getChildCount()}</span>`,
        className: cluster.getChildCount() > 5 ? 'marker-cluster-many' : 'marker-cluster',
        iconSize: L.point(40, 40),
    });
}

export const ProjectLayer = React.memo(({all_projects, toggle, currentlayer}: {all_projects: Project[], toggle: Toggle, currentlayer: string}) => {
    if (!toggle.visible) return null

    const filtered_projects = all_projects.filter(project => project.dimension === `minecraft:${currentlayer}` && !project.pin_id)

    return (
        <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon} chunkedLoading={true} maxClusterRadius={50}>
            {filtered_projects.map(project => (
                <Marker
                    icon={get_icon(project)}
                    position={[-project.coordinates[2], project.coordinates[0]]}
                    key={`${project.project_id}-${toggle.label_visible}`}
                >
                    <LTooltip offset={[4, -11]} direction={'left'} permanent={toggle.label_visible}>{project.name}</LTooltip>
                    <Popup
                        offset={[4, -15]}
                        closeButton={false}
                        autoPan={true}
                        className={'items-center w-[21rem]'}
                    >
                        <ProjectCard className={'w-[21rem]'} project={project} />
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    )
})

ProjectLayer.displayName = "ProjectLayer";