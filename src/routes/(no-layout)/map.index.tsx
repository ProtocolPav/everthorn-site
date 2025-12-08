import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import WorldMap from "@/components/features/map/world-map.tsx";

const mapSearchSchema = z.object({
    x: z.number().optional(),
    z: z.number().optional(),
    zoom: z.number().min(-5).max(6).optional(),
})

export const Route = createFileRoute('/(no-layout)/map/')({
    component: LiveMap,
    ssr: false,
    validateSearch: mapSearchSchema,
})

function LiveMap() {
    return (
        <div className="w-full h-screen">
            <WorldMap />
        </div>
    );
}
