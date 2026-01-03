// src/lib/map-regions.ts
import { Pin } from "@/types/pins";
import { Project } from "@/types/projects";

export const REGION_COLLAPSE_ZOOM = -2;

// Simple Point-in-Polygon algorithm (Ray casting)
// Returns true if point (x, z) is inside the polygon array of [x, z]
export function isPointInPolygon(x: number, z: number, polygon: [number, number][]) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], zi = polygon[i][1];
        const xj = polygon[j][0], zj = polygon[j][1];

        const intersect = ((zi > z) !== (zj > z))
            && (x < (xj - xi) * (z - zi) / (zj - zi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Helper to get center of polygon for the cluster marker
export function getPolygonCenter(polygon: [number, number][]): [number, number] {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    polygon.forEach(([x, z]) => {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
    });
    return [minX + (maxX - minX) / 2, minZ + (maxZ - minZ) / 2];
}

export type Region = {
    id: string;
    name: string;
    color: string;
    polygon: [number, number][]; // [x, z] coordinates
};

// DUMMY DATA
export const REGIONS: Region[] = [
    {
        id: 'aerondite',
        name: 'Aerondite',
        // "Rose-600": A noble, aggressive red for a central or capital region
        color: '#e11d48',
        polygon: [
            [54, -1052], [-312, -1060], [-489, -1021], [-656, -898],
            [-659, -730], [-670, -618], [-689, -511], [-663, -420],
            [-557, -328], [-479, -261], [-401, -194], [-118, -215],
            [64, -237], [294, -261], [525, -285], [675, -358],
            [825, -431], [826, -545], [827, -659], [711, -775],
            [596, -891], [437, -942], [278, -994], [166, -1023]
        ]
    },
    {
        id: 'the-frontier',
        name: 'The Frontier',
        // "Cyan-600": A distinct teal/blue. Good for wild, open, or coastal areas
        color: '#0891b2',
        polygon: [
            [-708, -514], [-703, -821], [-698, -1128], [-729, -1277],
            [-760, -1426], [-838, -1556], [-916, -1686], [-1092, -1674],
            [-1268, -1662], [-1524, -1344], [-1780, -1026], [-1870, -727],
            [-1960, -428], [-1984, -124], [-2008, 180], [-1760, 4],
            [-1512, -172], [-1361, -254], [-1210, -336], [-959, -425]
        ]
    },
    {
        id: 'northlands',
        name: 'Northlands',
        // "Violet-600": A deep, cold purple. Excellent for northern/mystical regions
        color: '#7c3aed',
        polygon: [
            [-550, -1936], [-682, -1818], [-814, -1700], [-738, -1359],
            [-662, -1018], [-517, -1062], [-372, -1106], [-278, -1121],
            [-184, -1136], [-70, -1112], [44, -1088], [231, -1096],
            [418, -1104], [462, -1114], [506, -1124], [558, -1167],
            [610, -1210], [620, -1294], [630, -1378], [594, -1510],
            [558, -1642], [477, -1737], [396, -1832], [282, -1888],
            [168, -1944], [-191, -1940]
        ]
    }
];

// Helper to sort items into regions
export function groupItemsByRegion(
    projects: Project[],
    pins: Pin[]
) {
    const groups: Record<string, { projects: Project[], pins: Pin[] }> = {};
    const unassigned: { projects: Project[], pins: Pin[] } = { projects: [], pins: [] };

    // Initialize groups
    REGIONS.forEach(r => groups[r.id] = { projects: [], pins: [] });

    // Sort Projects
    projects.forEach(p => {
        // Assuming Project has x/z or we convert from its coords
        // Adjust these accessors based on your actual Project type
        const x = Number(p.coordinates[0]);
        const z = Number(p.coordinates[2]);

        const region = REGIONS.find(r => isPointInPolygon(x, z, r.polygon));
        if (region) {
            groups[region.id].projects.push(p);
        } else {
            unassigned.projects.push(p);
        }
    });

    // Sort Pins
    pins.forEach(p => {
        const x = Number(p.coordinates[0]);
        const z = Number(p.coordinates[2]);

        const region = REGIONS.find(r => isPointInPolygon(x, z, r.polygon));
        if (region) {
            groups[region.id].pins.push(p);
        } else {
            unassigned.pins.push(p);
        }
    });

    return { groups, unassigned };
}
