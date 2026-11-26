import type { PinOut, ProjectOut } from "@/api/nexuscore/model";

/** What a map editor item is. */
export type MapEditorKind = "pin" | "project";

/** `pin:<id>`, `project:<id>`, or `pin:new` for a pin that isn't saved yet. */
export type MapEditorKey = `pin:${string}` | `project:${string}`;

/** The fields the map editor can change on a pin. */
export interface PinDraft {
    name: string;
    description: string;
    coordinates: number[];
    dimension: string;
    pin_type: string;
}

/** The fields the map editor can change on a project. */
export interface ProjectDraft {
    name: string;
    description: string;
    coordinates: number[];
    dimension: string;
    pin_id: number | null;
}

/** Unsaved changes to one item: only the fields that differ from the saved version. */
export type MapEditorDraft = Partial<PinDraft & ProjectDraft>;

/** A pin or project as the editor shows it, with any unsaved changes applied. */
export interface MapEditorItem {
    key: MapEditorKey;
    kind: MapEditorKind;
    name: string;
    description: string;
    /** `[x, y, z]` */
    coordinates: number[];
    dimension: string;
    /** Pins only. */
    pin_type?: string;
    /** Projects only. */
    status?: ProjectOut["status"];
    /** Projects only. */
    pin_id?: number | null;
    /** A pin that has not been created yet. */
    isNew: boolean;
    /** Has unsaved changes. */
    isDirty: boolean;
    /** The saved version, or `null` for a new pin. */
    source: PinOut | ProjectOut | null;
}

/** What the next click on the map does. */
export type MapEditorPlacing = "new-pin" | "relocate" | null;
