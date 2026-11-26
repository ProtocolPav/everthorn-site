import * as React from "react";
import {
    ArrowLeftIcon,
    ArrowSquareOutIcon,
    CaretUpDownIcon,
    CheckIcon,
    CrosshairIcon,
    FloppyDiskIcon,
    MapPinIcon,
    NotePencilIcon,
    PushPinIcon,
    SpinnerGapIcon,
    XIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button.tsx";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { SeamlessInput } from "@/components/common/seamless-input.tsx";
import { SeamlessSelect } from "@/components/common/seamless-select.tsx";
import { CoordinateInput } from "@/components/common/coordinate-input.tsx";
import { ProjectStatusBadge } from "@/components/features/projects/project-status-badge.tsx";
import { ProjectEditForm } from "@/components/features/projects/project-edit-form.tsx";
import { MAP_DIMENSION_OPTIONS, PIN_TYPE_OPTIONS } from "@/config/map-editor-options.ts";
import { cn } from "@/lib/utils.ts";
import type { Coordinates } from "@/lib/coordinates.ts";
import type { PinOut, ProjectOut } from "@/api/nexuscore/model";
import type { MapEditorDraft, MapEditorItem, MapEditorKey } from "@/types/map-editor";

interface EditorItemPanelProps {
    item: MapEditorItem;
    pins: PinOut[];
    saving: boolean;
    /** Waiting for a click on the map to move this item there. */
    relocating: boolean;
    onChange: (patch: MapEditorDraft) => void;
    onSave: () => void;
    onDiscard: () => void;
    onBack: () => void;
    onFocus: () => void;
    onToggleRelocate: () => void;
    onSelect: (key: MapEditorKey) => void;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
    return (
        <div data-slot="map-editor-section-title" className="flex items-center gap-2 text-sm font-semibold">
            <Icon className="size-4 text-primary" />
            <span>{children}</span>
        </div>
    );
}

function PropertyLabel({ children }: { children: React.ReactNode }) {
    return <FieldLabel className="text-[10px] font-bold uppercase text-muted-foreground/70">{children}</FieldLabel>;
}

/** Choose which pin, if any, stands in for a project on the live map. */
function PinLinkSelect({
    value,
    pins,
    onChange,
}: {
    value: number | null;
    pins: PinOut[];
    onChange: (pinId: number | null) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const linked = pins.find((pin) => pin.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
                    <span className={cn("flex min-w-0 items-center gap-2", !value && "text-muted-foreground")}>
                        <PushPinIcon className="size-4 shrink-0" />
                        <span className="truncate">
                            {linked ? linked.name : value ? `Pin #${value}` : "Not linked to a pin"}
                        </span>
                    </span>
                    <CaretUpDownIcon className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search pins..." />
                    <CommandList>
                        <CommandEmpty>No pins found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="__none"
                                onSelect={() => {
                                    onChange(null);
                                    setOpen(false);
                                }}
                            >
                                <XIcon />
                                Not linked
                                {value === null && <CheckIcon className="ml-auto" />}
                            </CommandItem>
                            {pins.map((pin) => (
                                <CommandItem
                                    key={pin.id}
                                    value={`${pin.name} ${pin.id}`}
                                    onSelect={() => {
                                        onChange(pin.id);
                                        setOpen(false);
                                    }}
                                >
                                    <PushPinIcon />
                                    <span className="truncate">{pin.name}</span>
                                    <span className="ml-auto font-mono text-xs text-muted-foreground">#{pin.id}</span>
                                    {value === pin.id && <CheckIcon />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

/** The project page's full editor (status, owner and more), in a dialog. */
function FullProjectEditor({ project }: { project: ProjectOut }) {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <NotePencilIcon />
                    Status, owner and more
                </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[85vh] min-w-[70vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[70vw]">
                <DialogTitle hidden>Edit Project</DialogTitle>
                <DialogDescription hidden>Edit your Project</DialogDescription>
                <ProjectEditForm project={project} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

/** Edit the selected pin or project: its details, and where it is on the map. */
function EditorItemPanel({
    item,
    pins,
    saving,
    relocating,
    onChange,
    onSave,
    onDiscard,
    onBack,
    onFocus,
    onToggleRelocate,
    onSelect,
}: EditorItemPanelProps) {
    const isPin = item.kind === "pin";
    const project = !isPin ? (item.source as ProjectOut) : null;
    const linkedPin = project && item.pin_id ? pins.find((pin) => pin.id === item.pin_id) : undefined;

    return (
        <form
            data-slot="map-editor-item-panel"
            className="flex h-full min-h-0 flex-col"
            onSubmit={(e) => {
                e.preventDefault();
                onSave();
            }}
        >
            {/* Header */}
            <div data-slot="map-editor-item-panel-header" className="flex items-center justify-between gap-2 border-b px-2 py-2">
                <Button type="button" variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeftIcon />
                    All items
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={onFocus} title="Show on the map">
                    <CrosshairIcon />
                    Show on map
                </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-6 p-4">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {item.isNew ? "New pin" : isPin ? `Pin #${(item.source as PinOut).id}` : "Project"}
                        </span>
                        <Field>
                            <FieldLabel className="sr-only">Name</FieldLabel>
                            <SeamlessInput
                                value={item.name}
                                autoFocus={item.isNew}
                                onChange={(e) => onChange({ name: e.target.value })}
                                placeholder={isPin ? "Pin name" : "Project name"}
                                className="-ml-2 px-2 text-2xl font-bold tracking-tight"
                            />
                        </Field>
                        <div className="flex flex-wrap items-center gap-2">
                            {isPin ? (
                                <SeamlessSelect
                                    value={item.pin_type}
                                    onValueChange={(value) => onChange({ pin_type: value })}
                                    options={PIN_TYPE_OPTIONS}
                                />
                            ) : (
                                item.status && <ProjectStatusBadge status={item.status} />
                            )}
                        </div>
                    </div>

                    <Field className="gap-1">
                        <PropertyLabel>Description</PropertyLabel>
                        <SeamlessInput
                            as="textarea"
                            value={item.description}
                            onChange={(e) => onChange({ description: e.target.value })}
                            placeholder={isPin ? "What's here? What does the shop sell?" : "Add a description..."}
                            className="-ml-2.5 min-h-16 text-sm leading-6"
                        />
                    </Field>

                    <Separator />

                    {/* Location */}
                    <div className="flex flex-col gap-4">
                        <SectionTitle icon={MapPinIcon}>Location</SectionTitle>

                        <Field className="gap-1.5">
                            <PropertyLabel>Dimension</PropertyLabel>
                            <SeamlessSelect
                                value={item.dimension}
                                onValueChange={(value) => onChange({ dimension: value })}
                                options={MAP_DIMENSION_OPTIONS}
                                className="h-8"
                            />
                        </Field>

                        <Field className="gap-1.5">
                            <PropertyLabel>Coordinates</PropertyLabel>
                            <CoordinateInput
                                className="w-full"
                                value={item.coordinates as Partial<Coordinates>}
                                onChange={(coordinates) => onChange({ coordinates })}
                                isInvalid={item.coordinates.length !== 3 || item.coordinates.some((v) => !Number.isFinite(v))}
                                addon={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        title="Click the map to move it there"
                                        onClick={onToggleRelocate}
                                        className={cn(
                                            "h-full gap-1.5 rounded-none px-3 text-muted-foreground hover:text-foreground",
                                            relocating && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                                        )}
                                    >
                                        <CrosshairIcon className="size-4" />
                                        {relocating ? "Click map" : "Pick"}
                                    </Button>
                                }
                            />
                            <FieldDescription className="text-xs">
                                Drag the highlighted marker on the map, or press Pick and click where it should go.
                            </FieldDescription>
                        </Field>
                    </div>

                    {/* Project extras */}
                    {project && (
                        <>
                            <Separator />
                            <div className="flex flex-col gap-4">
                                <SectionTitle icon={PushPinIcon}>Map pin</SectionTitle>
                                <Field className="gap-1.5">
                                    <PinLinkSelect
                                        value={item.pin_id ?? null}
                                        pins={pins}
                                        onChange={(pinId) => onChange({ pin_id: pinId })}
                                    />
                                    <FieldDescription className="text-xs">
                                        A linked project is shown on the live map by its pin instead of its own marker.
                                    </FieldDescription>
                                </Field>
                                {linkedPin && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-fit"
                                        onClick={() => onSelect(`pin:${linkedPin.id}`)}
                                    >
                                        <ArrowSquareOutIcon />
                                        Edit {linkedPin.name}
                                    </Button>
                                )}
                                <FullProjectEditor project={project} />
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div data-slot="map-editor-item-panel-footer" className="flex items-center justify-between gap-2 border-t p-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!item.isDirty || saving}
                    onClick={onDiscard}
                    className="text-muted-foreground hover:text-destructive"
                >
                    {item.isNew ? "Cancel" : "Discard changes"}
                </Button>
                <Button type="submit" size="sm" disabled={!item.isDirty || saving} className="min-w-28">
                    {saving ? <SpinnerGapIcon className="animate-spin" /> : <FloppyDiskIcon />}
                    {item.isNew ? "Create pin" : "Save"}
                </Button>
            </div>
        </form>
    );
}

export { EditorItemPanel };
