import {useState, useMemo, useCallback, useEffect, useRef} from 'react'
import { Polygon, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import {getClosestEdgeIndex} from "@/lib/map-geometry.ts";

const createVertexIcon = () => {
    const iconMarkup = renderToStaticMarkup(
        // Outer Container: Large invisible hit-box (w-6 h-6 = 24px) for easy grabbing
        <div className="group flex h-6 w-6 cursor-pointer items-center justify-center">
            {/* Inner Dot: Tiny default (4px), Glassy & Large on Hover */}
            <div
                className="
                    h-1 w-1 rounded-full bg-white ring-1 ring-primary shadow-sm
                    transition-all duration-150 ease-out
                    group-hover:h-4 group-hover:w-4
                    group-hover:scale-[1.5]
                    group-hover:bg-primary/15
                    group-hover:ring-1 group-hover:ring-primary/80
                "
            />
            {/* Optional: Tiny crosshair center point only visible on hover for max precision */}
            <div className="absolute h-0.5 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    )

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [24, 24],   // Large hit area
        iconAnchor: [12, 12], // Center anchor
    })
}

interface EditablePolygonProps {
    id: string
    initialPositions: [number, number][]
    color: string
    onUpdate?: (id: string, newPositions: [number, number][]) => void
}

export function EditablePolygon({ id, initialPositions, color, onUpdate }: EditablePolygonProps) {
    const [positions, setPositions] = useState(initialPositions)

    // Use a ref to keep track of positions for event handlers
    // without triggering effect loops, but sync with state
    const positionsRef = useRef(initialPositions)

    useEffect(() => {
        setPositions(initialPositions)
        positionsRef.current = initialPositions
    }, [initialPositions])

    const vertexIcon = useMemo(() => createVertexIcon(), [])

    // --- Actions ---

    const handleDrag = useCallback((index: number, e: L.LeafletEvent) => {
        const { lat, lng } = e.target.getLatLng()

        // 1. Update React State (triggers re-render of Polygon line)
        setPositions((prev) => {
            const next = [...prev]
            next[index] = [lat, lng]
            positionsRef.current = next // Sync ref
            return next
        })
    }, [])

    const handleDragEnd = useCallback(() => {
        if (onUpdate) onUpdate(id, positionsRef.current)
    }, [id, onUpdate])

    const handleAddPoint = useCallback((e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e.originalEvent)

        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
        const currentPositions = positionsRef.current

        const insertIndex = getClosestEdgeIndex(e.latlng, currentPositions)
        const next = [...currentPositions]

        // Insert AFTER the closest edge start point
        next.splice(insertIndex + 1, 0, newPoint)

        setPositions(next)
        positionsRef.current = next

        if (onUpdate) onUpdate(id, next)
    }, [id, onUpdate])

    const handleRemovePoint = useCallback((index: number) => {
        const currentPositions = positionsRef.current

        if (currentPositions.length <= 3) return // Prevent invalid polygons

        const next = currentPositions.filter((_, i) => i !== index)

        setPositions(next)
        positionsRef.current = next

        if (onUpdate) onUpdate(id, next)
    }, [id, onUpdate])

    return (
        <>
            <Polygon
                positions={positions}
                pathOptions={{
                    color: color,
                    weight: 2,
                    opacity: 1,
                    fill: true,
                    fillColor: color,
                    fillOpacity: 0.2,
                }}
                eventHandlers={{
                    click: handleAddPoint,
                    // STOP Double click propagation to prevent Map Zoom
                    dblclick: (e) => {
                        L.DomEvent.stopPropagation(e.originalEvent)
                        L.DomEvent.preventDefault(e.originalEvent)
                    }
                }}
            />

            {positions.map((pos, index) => (
                <Marker
                    // CRITICAL: Use index only. Do NOT include lat/lng in key.
                    // If key changes, React destroys the marker, killing the drag.
                    key={`${id}-point-${index}`}
                    position={pos}
                    draggable={true}
                    icon={vertexIcon}
                    eventHandlers={{
                        drag: (e) => handleDrag(index, e),
                        dragend: handleDragEnd,
                        contextmenu: (e) => {
                            L.DomEvent.stopPropagation(e.originalEvent)
                            handleRemovePoint(index)
                        },
                        dblclick: (e) => {
                            L.DomEvent.stopPropagation(e.originalEvent)
                            L.DomEvent.preventDefault(e.originalEvent)
                        }
                    }}
                >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.8}>
                        Right-click to remove
                    </Tooltip>
                </Marker>
            ))}
        </>
    )
}