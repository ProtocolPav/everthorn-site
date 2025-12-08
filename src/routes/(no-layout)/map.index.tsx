import {createFileRoute} from '@tanstack/react-router'
import WorldMap from "@/components/features/map/world-map.tsx";

export const Route = createFileRoute('/(no-layout)/map/')({
  component: LiveMap,
    ssr: false
})

function LiveMap() {
    return (
        <div className="w-full h-screen">
            <WorldMap />
        </div>
    );
}
