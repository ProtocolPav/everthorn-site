import { createFileRoute } from '@tanstack/react-router'
import WorldMap from "@/components/features/map/world-map.tsx";

export const Route = createFileRoute('/admin/map')({
    staticData: {
        pageTitle: "Map Editor"
    },
    component: LiveMap,
    ssr: false,
})

function LiveMap() {
    return (
        <div
            style={{ width: '100%', height: 'calc(100vh - 3.6rem)'}}
        >
            <div className={'h-full w-full overflow-hidden'}>
                <WorldMap isAdminView={true} />
            </div>
        </div>
    );
}
