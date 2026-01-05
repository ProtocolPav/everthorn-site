import L from "leaflet";

/**
 * Finds the index of the polygon segment closest to the clicked point.
 * Returns the index 'i' where the segment is formed by positions[i] and positions[i+1].
 */
export function getClosestEdgeIndex(
    clickLatLng: L.LatLng,
    polyPositions: [number, number][]
): number {
    let minDistance = Infinity
    let closestIndex = -1

    const px = clickLatLng.lat
    const py = clickLatLng.lng

    for (let i = 0; i < polyPositions.length; i++) {
        const [x1, y1] = polyPositions[i]
        const [x2, y2] = polyPositions[(i + 1) % polyPositions.length] // Wrap around to first point

        // Project point onto line segment
        const A = px - x1
        const B = py - y1
        const C = x2 - x1
        const D = y2 - y1

        const dot = A * C + B * D
        const lenSq = C * C + D * D
        let param = -1

        if (lenSq !== 0) param = dot / lenSq

        let xx, yy

        if (param < 0) {
            xx = x1
            yy = y1
        } else if (param > 1) {
            xx = x2
            yy = y2
        } else {
            xx = x1 + param * C
            yy = y1 + param * D
        }

        const dx = px - xx
        const dy = py - yy
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < minDistance) {
            minDistance = distance
            closestIndex = i
        }
    }

    return closestIndex
}

/**
 * Calculates the shortest distance from a point to a polygon's edge.
 */
export function getDistanceToPolygon(
    latlng: L.LatLng,
    polyPositions: [number, number][]
): number {
    let minDist = Infinity
    const px = latlng.lat
    const py = latlng.lng

    for (let i = 0; i < polyPositions.length; i++) {
        const [x1, y1] = polyPositions[i]
        const [x2, y2] = polyPositions[(i + 1) % polyPositions.length]

        // Distance from point (px, py) to segment (x1,y1)-(x2,y2)
        const A = px - x1
        const B = py - y1
        const C = x2 - x1
        const D = y2 - y1

        const dot = A * C + B * D
        const lenSq = C * C + D * D
        let param = -1
        if (lenSq !== 0) param = dot / lenSq

        let xx, yy
        if (param < 0) { xx = x1; yy = y1 }
        else if (param > 1) { xx = x2; yy = y2 }
        else { xx = x1 + param * C; yy = y1 + param * D }

        const dx = px - xx
        const dy = py - yy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < minDist) minDist = dist
    }
    return minDist
}