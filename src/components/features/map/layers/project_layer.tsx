import React, { useEffect, useRef } from "react";
import { useRLayersComponent } from "rlayers";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import Overlay from "ol/Overlay";
import { createRoot } from "react-dom/client";
import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import type { Toggle } from "@/types/map-toggle";
import type { ProjectOut } from "@/api/nexuscore/model";
import { ProjectCard } from "@/components/features/projects/project-card.tsx";

const ICON_WIDTH = 20.46;
const ICON_HEIGHT = 33.28;

function getIconUrl(project: ProjectOut): string {
    switch (project.status) {
        case "abandoned": return abandonedPin;
        case "completed": return completedPin;
        default: return projectPin;
    }
}

function buildProjectStyle(project: ProjectOut): Style {
    return new Style({
        image: new Icon({
            src: getIconUrl(project),
            width: ICON_WIDTH,
            height: ICON_HEIGHT,
            // anchor: bottom-left of the icon [0, 1] in fraction units
            anchor: [0, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
        }),
    });
}

export const ProjectLayer = React.memo(({ all_projects, toggle, currentlayer }: { all_projects: ProjectOut[]; toggle: Toggle; currentlayer: string }) => {
    const { map } = useRLayersComponent();
    const layerRef = useRef<VectorLayer<VectorSource> | null>(null);
    const popupOverlayRef = useRef<Overlay | null>(null);
    const popupContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!map) return;

        const container = document.createElement("div");
        container.className = "ol-popup";
        const popupOverlay = new Overlay({
            element: container,
            autoPan: { animation: { duration: 250 } },
            offset: [4, -15],
        });
        map.addOverlay(popupOverlay);
        popupOverlayRef.current = popupOverlay;
        popupContainerRef.current = container;

        return () => {
            map.removeOverlay(popupOverlay);
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;

        if (layerRef.current) map.removeLayer(layerRef.current);

        if (!toggle.visible) {
            layerRef.current = null;
            return;
        }

        const filtered = all_projects.filter(
            p => p.dimension === `minecraft:${currentlayer}` && !p.pin_id
        );

        const source = new VectorSource();
        filtered.forEach(project => {
            const feature = new Feature({
                geometry: new Point([project.coordinates[0], -project.coordinates[2]]),
                project,
            });
            feature.setStyle(buildProjectStyle(project));
            source.addFeature(feature);
        });

        const layer = new VectorLayer({ source, zIndex: 10 });
        map.addLayer(layer);
        layerRef.current = layer;

        const handleClick = (e: any) => {
            const feature = map.forEachFeatureAtPixel(e.pixel, f => f, {
                layerFilter: l => l === layer,
            });
            if (feature) {
                const projectData: ProjectOut = feature.get("project");
                const coord = (feature.getGeometry() as Point).getCoordinates();
                const container = popupContainerRef.current!;
                container.innerHTML = "";
                const root = createRoot(container);
                root.render(<ProjectCard className="w-[21rem]" project={projectData} onClick={() => {}} />);
                popupOverlayRef.current?.setPosition(coord);
            } else {
                popupOverlayRef.current?.setPosition(undefined);
            }
        };
        map.on("singleclick", handleClick);

        return () => {
            map.removeLayer(layer);
            map.un("singleclick", handleClick);
        };
    }, [map, all_projects, toggle.visible, toggle.label_visible, currentlayer]);

    return null;
});

ProjectLayer.displayName = "ProjectLayer";
