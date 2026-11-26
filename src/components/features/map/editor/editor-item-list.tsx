import * as React from "react";
import {
    FloppyDiskIcon,
    MagnifyingGlassIcon,
    MapPinSimpleAreaIcon,
    SpinnerGapIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { PinTypeBadge } from "@/components/features/pins/pin-type-badge.tsx";
import { ProjectStatusBadge } from "@/components/features/projects/project-status-badge.tsx";
import { MAP_DIMENSION_OPTIONS } from "@/config/map-editor-options.ts";
import { cn } from "@/lib/utils.ts";
import type { MapEditorItem, MapEditorKey } from "@/types/map-editor";

type ListFilter = "all" | "project" | "pin";

interface EditorItemListProps {
    items: MapEditorItem[];
    selectedKey: MapEditorKey | null;
    onSelect: (key: MapEditorKey) => void;
    /** Number of items with unsaved changes. */
    dirtyCount: number;
    savingAll: boolean;
    onSaveAll: () => void;
}

function dimensionLabel(dimension: string): string {
    return MAP_DIMENSION_OPTIONS.find((option) => option.value === dimension)?.label ?? dimension;
}

function EditorItemRow({
    item,
    selected,
    onSelect,
}: {
    item: MapEditorItem;
    selected: boolean;
    onSelect: (key: MapEditorKey) => void;
}) {
    const [x, , z] = item.coordinates;

    return (
        <button
            type="button"
            data-slot="map-editor-item"
            data-selected={selected}
            onClick={() => onSelect(item.key)}
            className={cn(
                "flex w-full flex-col gap-1.5 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors",
                "hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                selected && "border-border bg-accent",
            )}
        >
            <div data-slot="map-editor-item-header" className="flex items-center gap-2">
                {item.isDirty && (
                    <span
                        data-slot="map-editor-item-dirty"
                        title="Unsaved changes"
                        className="size-2 shrink-0 rounded-full bg-amber-400 ring-2 ring-amber-400/25"
                    />
                )}
                <span className={cn("min-w-0 flex-1 truncate text-sm font-medium", !item.name && "italic text-muted-foreground")}>
                    {item.name || "Untitled pin"}
                </span>
                {item.kind === "project" && item.status ? (
                    <ProjectStatusBadge status={item.status} className="shrink-0" />
                ) : (
                    <PinTypeBadge type={item.pin_type ?? "relic"} className="shrink-0 shadow-none" />
                )}
            </div>
            <div data-slot="map-editor-item-meta" className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{dimensionLabel(item.dimension)}</span>
                <span aria-hidden>·</span>
                <span className="font-mono tabular-nums">
                    {Number.isFinite(x) && Number.isFinite(z) ? `${x}, ${z}` : "No location"}
                </span>
            </div>
        </button>
    );
}

/** Searchable list of every project and pin, whatever dimension they are in. */
function EditorItemList({ items, selectedKey, onSelect, dirtyCount, savingAll, onSaveAll }: EditorItemListProps) {
    const [query, setQuery] = React.useState("");
    const [filter, setFilter] = React.useState<ListFilter>("all");

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return items
            .filter((item) => filter === "all" || item.kind === filter)
            .filter((item) => !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
            .sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name));
    }, [items, query, filter]);

    const counts = React.useMemo(
        () => ({
            all: items.length,
            project: items.filter((item) => item.kind === "project").length,
            pin: items.filter((item) => item.kind === "pin").length,
        }),
        [items],
    );

    return (
        <div data-slot="map-editor-item-list" className="flex h-full min-h-0 flex-col">
            <div data-slot="map-editor-item-list-header" className="flex flex-col gap-3 border-b p-3">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search projects and pins..."
                        className="pl-8"
                    />
                </div>
                <Tabs value={filter} onValueChange={(value) => setFilter(value as ListFilter)}>
                    <TabsList className="w-full">
                        <TabsTrigger value="all">All · {counts.all}</TabsTrigger>
                        <TabsTrigger value="project">Projects · {counts.project}</TabsTrigger>
                        <TabsTrigger value="pin">Pins · {counts.pin}</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-0.5 p-2">
                    {filtered.map((item) => (
                        <EditorItemRow key={item.key} item={item} selected={item.key === selectedKey} onSelect={onSelect} />
                    ))}

                    {filtered.length === 0 && (
                        <Empty className="py-10">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <MapPinSimpleAreaIcon />
                                </EmptyMedia>
                                <EmptyTitle>Nothing found</EmptyTitle>
                                <EmptyDescription>
                                    {query ? "No projects or pins match your search." : "There's nothing on the map yet."}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    )}
                </div>
            </ScrollArea>

            {dirtyCount > 0 && (
                <div
                    data-slot="map-editor-item-list-footer"
                    className="flex items-center justify-between gap-3 border-t bg-amber-500/5 px-3 py-2.5"
                >
                    <span className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{dirtyCount}</span> unsaved{" "}
                        {dirtyCount === 1 ? "change" : "changes"}
                    </span>
                    <Button size="sm" onClick={onSaveAll} disabled={savingAll}>
                        {savingAll ? <SpinnerGapIcon className="animate-spin" /> : <FloppyDiskIcon />}
                        Save all
                    </Button>
                </div>
            )}
        </div>
    );
}

export { EditorItemList };
