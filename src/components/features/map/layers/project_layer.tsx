import {Tooltip as LTooltip, Popup, Marker} from "react-leaflet";
import React from "react";
import {Project} from "@/types/projects";
import L from "leaflet";
import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import {Toggle} from "@/types/map-toggle";
import {ProjectCard} from "@/components/features/projects/project-card.tsx";
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {ProjectEditForm} from "@/components/features/projects/project-edit-form.tsx";

interface ProjectLayerProps {
    all_projects: Project[]
    toggle: Toggle
    current_layer: string
    isAdminView: boolean
    isEditing: boolean
}

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

export const ProjectLayer = React.memo(({all_projects, toggle, current_layer, isAdminView, isEditing}: ProjectLayerProps) => {
    if (!toggle.visible) return null

    const filtered_projects = all_projects.filter(project => project.dimension === `minecraft:${current_layer}` && !project.pin_id)

    return (
        <>
            {filtered_projects.map(project => (
                <Marker
                    icon={get_icon(project)}
                    position={[-project.coordinates[2], project.coordinates[0]]}
                    key={`${project.project_id}-${toggle.label_visible}`}
                    draggable={isEditing}
                >
                    <LTooltip offset={[4, -11]} direction={'left'} permanent={toggle.label_visible}>{project.name}</LTooltip>
                    <Popup
                        offset={[4, -15]}
                        closeButton={false}
                        autoPan={true}
                        autoPanPadding={[11, 60]}
                        className={'items-center w-[21rem]'}
                    >
                        {isAdminView ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <ProjectCard
                                        className="w-full max-w-sm lg:max-w-none"
                                        project={project}
                                        onClick={() => {}}
                                    />
                                </DialogTrigger>
                                <DialogContent className="p-0 min-w-[70vw] h-[85vh] flex flex-col overflow-hidden gap-0 sm:max-w-[70vw]">
                                    <DialogTitle hidden={true}>Edit Project</DialogTitle>
                                    <DialogDescription hidden={true}>Edit your Project</DialogDescription>

                                    <ProjectEditForm
                                        project={project}
                                        onSuccess={() => {}}
                                    />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <ProjectCard className={'w-[21rem]'} project={project} onClick={() => {}} />
                        )}
                    </Popup>
                </Marker>
            ))}
        </>
    )
})

ProjectLayer.displayName = "ProjectLayer";