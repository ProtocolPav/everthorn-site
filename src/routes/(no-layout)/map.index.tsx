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
    head: () => ({
        meta: [
            {
                property: 'og:title',
                content: `Everthorn World Map`,
            },
            {
                property: 'og:description',
                content: "Explore the Everthorn world from our Interactive Live Map",
            },
            {
                property: 'og:image',
                content: `${import.meta.env.VITE_BASE_URL}/og/world_map.png`,
            },
            {
                property: 'og:url',
                content: `${import.meta.env.VITE_BASE_URL}/map`,
            },
            {
                name: 'twitter:title',
                content: `Everthorn World Map`
            },
            {
                name: 'twitter:description',
                content: "Explore the Everthorn world from an Interactive Live Map"
            },
            {
                name: 'twitter:image',
                content: `${import.meta.env.VITE_BASE_URL}/og/world_map.png`,
            },
            {
                name: 'twitter:url',
                content: `${import.meta.env.VITE_BASE_URL}/map`,
            }
        ],
    }),
})

function LiveMap() {
    return (
        <div className="w-full h-screen">
            <WorldMap />
        </div>
    );
}
