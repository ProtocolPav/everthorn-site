import * as React from "react";
import { useBlocker } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowClockwiseIcon, PlusIcon, PushPinIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Kbd } from "@/components/ui/kbd.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { MapPanel, MapReadout } from "@/components/features/map/core/map-panel.tsx";
import { EditorMap } from "@/components/features/map/editor/editor-map.tsx";
import type { MapFocus, MapPoint } from "@/components/features/map/editor/editor-map.tsx";
import { EditorItemList } from "@/components/features/map/editor/editor-item-list.tsx";
import { EditorItemPanel } from "@/components/features/map/editor/editor-item-panel.tsx";
import { DEFAULT_LAYERS } from "@/config/map-defaults.ts";
import { DEFAULT_PIN_Y, dimensionToLayer, layerToDimension } from "@/config/map-editor-options.ts";
import { NEW_PIN_KEY, useMapEditor } from "@/hooks/use-map-editor.ts";
import type { MapEditorItem, MapEditorKey, MapEditorPlacing } from "@/types/map-editor";

/** A readable reason from a thrown `Error` or a NexusCore error response (`{ status, data: { detail } }`). */
function errorMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    const response = error as { status?: number; data?: { detail?: unknown } } | null;
    const detail = response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && typeof detail[0]?.msg === "string") return detail[0].msg;
    if (response?.status) return `The server responded with ${response.status}`;
    return "Something went wrong";
}

function liveMapUrl(item: MapEditorItem): string {
    return `/map?x=${item.coordinates[0]}&z=${item.coordinates[2]}&zoom=2`;
}

/** Asks before leaving the page with unsaved changes. */
function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
    const blocker = useBlocker({
        shouldBlockFn: () => dirty,
        enableBeforeUnload: () => dirty,
        withResolver: true,
    });

    return (
        <AlertDialog open={blocker.status === "blocked"} onOpenChange={(open) => !open && blocker.reset?.()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You've moved or edited things on the map that aren't saved yet. They'll be lost if you leave.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => blocker.reset?.()}>Keep editing</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => blocker.proceed?.()}>
                        Leave
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ListSkeleton() {
    return (
        <div className="flex flex-col gap-3 p-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 px-3 py-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            ))}
        </div>
    );
}

/**
 * The admin map editor: every project and pin on the world map, to move by dragging, place new
 * pins with a click, and edit their details in the side panel.
 */
function MapEditor() {
    const editor = useMapEditor();
    const { itemsByKey, update, discard, startNewPin, save } = editor;

    const [layer, setLayer] = React.useState("overworld");
    const [selectedKey, setSelectedKey] = React.useState<MapEditorKey | null>(null);
    const [placing, setPlacing] = React.useState<MapEditorPlacing>(null);
    const [focus, setFocus] = React.useState<MapFocus | null>(null);
    const [savingAll, setSavingAll] = React.useState(false);

    const selected = selectedKey ? (itemsByKey.get(selectedKey) ?? null) : null;
    const visibleItems = React.useMemo(
        () => editor.items.filter((item) => dimensionToLayer(item.dimension) === layer),
        [editor.items, layer],
    );

    // A selection can disappear, e.g. a discarded new pin
    React.useEffect(() => {
        if (selectedKey && !editor.isLoading && !itemsByKey.has(selectedKey)) setSelectedKey(null);
    }, [selectedKey, itemsByKey, editor.isLoading]);

    // Escape stops placing
    React.useEffect(() => {
        if (!placing) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPlacing(null);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [placing]);

    /** Selects an item and brings it into view, switching dimension if needed. */
    const focusItem = React.useCallback(
        (key: MapEditorKey) => {
            const item = itemsByKey.get(key);
            setSelectedKey(key);
            setPlacing(null);
            if (!item) return;
            setLayer(dimensionToLayer(item.dimension));
            const [x, , z] = item.coordinates;
            if (Number.isFinite(x) && Number.isFinite(z)) setFocus({ x, z, id: Date.now() });
        },
        [itemsByKey],
    );

    const handleMapSelect = React.useCallback((key: MapEditorKey | null) => {
        setSelectedKey(key);
    }, []);

    const handlePlace = React.useCallback(
        ({ x, z }: MapPoint) => {
            const dimension = layerToDimension(layer);
            if (placing === "new-pin") {
                const y = DEFAULT_PIN_Y[layer] ?? 64;
                setSelectedKey(startNewPin({ coordinates: [x, y, z], dimension }));
            } else if (placing === "relocate" && selected) {
                const y = Number.isFinite(selected.coordinates[1]) ? selected.coordinates[1] : (DEFAULT_PIN_Y[layer] ?? 64);
                update(selected.key, { coordinates: [x, y, z], dimension });
            }
            setPlacing(null);
        },
        [layer, placing, selected, startNewPin, update],
    );

    const handleMove = React.useCallback(
        (key: MapEditorKey, { x, z }: MapPoint) => {
            const item = itemsByKey.get(key);
            if (!item) return;
            update(key, { coordinates: [x, item.coordinates[1], z] });
        },
        [itemsByKey, update],
    );

    const handleSave = React.useCallback(
        async (key: MapEditorKey) => {
            const item = itemsByKey.get(key);
            if (!item) return;
            try {
                const result = await save(key);
                if (key === NEW_PIN_KEY) setSelectedKey(result.key);
                toast.success(item.isNew ? `Created ${item.name}` : `Saved ${item.name}`, {
                    icon: <PushPinIcon weight="fill" />,
                    action: { label: "View on live map", onClick: () => window.open(liveMapUrl(item), "_blank") },
                });
            } catch (error) {
                toast.error(`Couldn't save ${item.name || "the pin"}`, {
                    icon: <WarningCircleIcon weight="fill" />,
                    description: errorMessage(error),
                    action: { label: "Retry", onClick: () => void handleSave(key) },
                });
            }
        },
        [itemsByKey, save],
    );

    const handleSaveAll = React.useCallback(async () => {
        setSavingAll(true);
        let saved = 0;
        const failed: string[] = [];
        for (const key of editor.dirtyKeys) {
            try {
                const result = await save(key);
                if (key === NEW_PIN_KEY && selectedKey === NEW_PIN_KEY) setSelectedKey(result.key);
                saved += 1;
            } catch (error) {
                failed.push(`${itemsByKey.get(key)?.name || "New pin"}: ${errorMessage(error)}`);
            }
        }
        setSavingAll(false);

        if (failed.length === 0) {
            toast.success(`Saved ${saved} ${saved === 1 ? "change" : "changes"}`, { icon: <PushPinIcon weight="fill" /> });
        } else {
            toast.error(`${failed.length} couldn't be saved`, {
                icon: <WarningCircleIcon weight="fill" />,
                description: failed.join("\n"),
                duration: Infinity,
                action: { label: "Retry", onClick: () => void handleSaveAll() },
            });
        }
    }, [editor.dirtyKeys, itemsByKey, save, selectedKey]);

    const handleDiscard = React.useCallback(
        (key: MapEditorKey) => {
            const item = itemsByKey.get(key);
            if (!item) return;
            const draft = { ...item };
            discard(key);
            if (item.isNew) {
                setSelectedKey(null);
                return;
            }
            toast("Changes discarded", {
                action: {
                    label: "Undo",
                    onClick: () =>
                        update(key, {
                            name: draft.name,
                            description: draft.description,
                            coordinates: draft.coordinates,
                            dimension: draft.dimension,
                            ...(draft.kind === "pin" ? { pin_type: draft.pin_type } : { pin_id: draft.pin_id ?? null }),
                        }),
                },
            });
        },
        [discard, itemsByKey, update],
    );

    function startPlacing(mode: Exclude<MapEditorPlacing, null>) {
        setPlacing((prev) => (prev === mode ? null : mode));
    }

    return (
        <div data-slot="map-editor" className="flex h-[calc(100dvh-3.5rem)] flex-col lg:flex-row">
            <UnsavedChangesGuard dirty={editor.dirtyKeys.length > 0} />

            {/* Map */}
            <div data-slot="map-editor-canvas" className="relative min-h-0 flex-1">
                <EditorMap
                    layer={layer}
                    items={visibleItems}
                    selectedKey={selectedKey}
                    placing={placing}
                    focus={focus}
                    onSelect={handleMapSelect}
                    onPlace={handlePlace}
                    onMove={handleMove}
                >
                    {(hover) => (
                        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between gap-3 p-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MapPanel>
                                        <Select
                                            value={layer}
                                            onValueChange={(value) => {
                                                setLayer(value);
                                                setPlacing((prev) => (prev === "new-pin" ? prev : null));
                                            }}
                                        >
                                            <SelectTrigger className="w-36 border-0 bg-transparent shadow-none dark:bg-transparent">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEFAULT_LAYERS.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>
                                                        <img src={option.image as string} alt="" className="size-4 [image-rendering:pixelated]" />
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </MapPanel>
                                    <MapPanel className="p-0.5">
                                        <Button
                                            variant={placing === "new-pin" ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => startPlacing("new-pin")}
                                            disabled={!!itemsByKey.get(NEW_PIN_KEY)}
                                            title={itemsByKey.get(NEW_PIN_KEY) ? "Save or cancel the new pin first" : undefined}
                                        >
                                            <PlusIcon />
                                            New pin
                                        </Button>
                                    </MapPanel>
                                </div>

                                <MapPanel className="flex h-9 items-center gap-3 px-3 text-sm">
                                    {hover ? (
                                        <>
                                            <MapReadout axis="X" value={hover.x} />
                                            <MapReadout axis="Z" value={hover.z} />
                                        </>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Hover the map</span>
                                    )}
                                </MapPanel>
                            </div>

                            {placing && (
                                <MapPanel className="flex items-center gap-3 self-center py-1.5 pr-1.5 pl-4 text-sm">
                                    <span>
                                        {placing === "new-pin"
                                            ? "Click the map where the new pin should go"
                                            : `Click the map to move ${selected?.name || "it"} there`}
                                    </span>
                                    <Kbd>Esc</Kbd>
                                    <Button variant="ghost" size="icon-sm" onClick={() => setPlacing(null)} title="Cancel">
                                        <XIcon />
                                    </Button>
                                </MapPanel>
                            )}
                        </div>
                    )}
                </EditorMap>
            </div>

            {/* Side panel */}
            <aside
                data-slot="map-editor-sidebar"
                className="h-[45%] w-full shrink-0 border-t bg-background lg:h-full lg:w-[380px] lg:border-t-0 lg:border-l"
            >
                {editor.isLoading ? (
                    <ListSkeleton />
                ) : editor.isError ? (
                    <div className="p-4">
                        <Alert variant="destructive" className="bg-destructive/5">
                            <WarningCircleIcon className="size-4" />
                            <AlertTitle>Couldn't load the map</AlertTitle>
                            <AlertDescription className="flex flex-col items-start gap-3">
                                {errorMessage(editor.error)}
                                <Button variant="outline" size="sm" onClick={() => void editor.refetch()}>
                                    <ArrowClockwiseIcon />
                                    Try again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : selected ? (
                    <EditorItemPanel
                        key={selected.key}
                        item={selected}
                        pins={editor.pins}
                        saving={editor.saving.has(selected.key)}
                        relocating={placing === "relocate"}
                        onChange={(patch) => {
                            update(selected.key, patch);
                            // Follow the item to its new dimension, so it doesn't vanish from the map
                            if (patch.dimension) setLayer(dimensionToLayer(patch.dimension));
                        }}
                        onSave={() => void handleSave(selected.key)}
                        onDiscard={() => handleDiscard(selected.key)}
                        onBack={() => {
                            setSelectedKey(null);
                            setPlacing(null);
                        }}
                        onFocus={() => focusItem(selected.key)}
                        onToggleRelocate={() => startPlacing("relocate")}
                        onSelect={focusItem}
                    />
                ) : (
                    <EditorItemList
                        items={editor.items}
                        selectedKey={selectedKey}
                        onSelect={focusItem}
                        dirtyCount={editor.dirtyKeys.length}
                        savingAll={savingAll}
                        onSaveAll={() => void handleSaveAll()}
                    />
                )}
            </aside>
        </div>
    );
}

export { MapEditor };
