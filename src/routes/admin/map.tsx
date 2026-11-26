import { createFileRoute } from "@tanstack/react-router";

import { MapEditor } from "@/components/features/map/editor/map-editor.tsx";

export const Route = createFileRoute("/admin/map")({
    staticData: {
        pageTitle: "Map Editor",
    },
    component: MapEditor,
    ssr: false,
});
