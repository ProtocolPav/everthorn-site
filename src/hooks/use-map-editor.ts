import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { PinOut, ProjectOut, PinUpdate, ProjectUpdate } from "@/api/nexuscore/model";
import {
    createPinV1PinsPost,
    invalidateGetPinV1PinsPinIdGet,
    invalidateListPinsV1PinsGet,
    partialUpdatePinV1PinsPinIdPatch,
    useListPinsV1PinsGet,
} from "@/api/nexuscore/pins/pins.ts";
import {
    invalidateGetProjectV1GuildsMeProjectsProjectIdGet,
    invalidateListProjectsV1GuildsMeProjectsGet,
    partialUpdateProjectV1GuildsMeProjectsProjectIdPatch,
    useListProjectsV1GuildsMeProjectsGet,
} from "@/api/nexuscore/projects/projects.ts";
import { pinDraftSchema, projectDraftSchema } from "@/lib/schemas/map-editor.tsx";
import type {
    MapEditorDraft,
    MapEditorItem,
    MapEditorKey,
    PinDraft,
    ProjectDraft,
} from "@/types/map-editor";

const NEW_PIN_KEY: MapEditorKey = "pin:new";

const PIN_FIELDS = ["name", "description", "coordinates", "dimension", "pin_type"] as const;
const PROJECT_FIELDS = ["name", "description", "coordinates", "dimension", "pin_id"] as const;

/** What a new pin starts as, before the admin fills it in. */
const EMPTY_PIN: PinDraft = {
    name: "",
    description: "",
    coordinates: [],
    dimension: "minecraft:overworld",
    pin_type: "relic",
};

function sameValue(a: unknown, b: unknown): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((value, i) => value === b[i]);
    }
    return a === b;
}

function pinBase(pin: PinOut | undefined): PinDraft {
    if (!pin) return EMPTY_PIN;
    return {
        name: pin.name,
        description: pin.description,
        coordinates: pin.coordinates,
        dimension: pin.dimension,
        pin_type: pin.pin_type,
    };
}

function projectBase(project: ProjectOut): ProjectDraft {
    return {
        name: project.name,
        description: project.description,
        coordinates: project.coordinates,
        dimension: project.dimension,
        pin_id: project.pin_id,
    };
}

/** First validation message, for a toast. */
function firstIssue(error: { issues: { message: string }[] }): string {
    return error.issues[0]?.message ?? "Some fields are not valid";
}

function keyOf(kind: "pin" | "project", id: string | number): MapEditorKey {
    return `${kind}:${id}`;
}

interface SaveResult {
    /** The item's key after saving: a new pin gets its real id. */
    key: MapEditorKey;
}

/**
 * Everything the admin map editor works on: the saved pins and projects, the unsaved changes made
 * to them on the map or in the side panel, and saving those changes to NexusCore.
 */
function useMapEditor() {
    const queryClient = useQueryClient();
    const pinsQuery = useListPinsV1PinsGet();
    const projectsQuery = useListProjectsV1GuildsMeProjectsGet();

    const [drafts, setDrafts] = React.useState<Partial<Record<MapEditorKey, MapEditorDraft>>>({});
    const [saving, setSaving] = React.useState<Set<MapEditorKey>>(() => new Set());

    const pinsById = React.useMemo(
        () => new Map((pinsQuery.data ?? []).map((pin) => [String(pin.id), pin])),
        [pinsQuery.data],
    );
    const projectsById = React.useMemo(
        () => new Map((projectsQuery.data ?? []).map((project) => [project.project_id, project])),
        [projectsQuery.data],
    );

    /** The saved fields an item's draft is compared against. */
    const baseOf = React.useCallback(
        (key: MapEditorKey): (PinDraft | ProjectDraft) | null => {
            const split = key.indexOf(":");
            const kind = key.slice(0, split);
            const id = key.slice(split + 1);
            if (kind === "pin") return id === "new" ? EMPTY_PIN : pinsById.has(id) ? pinBase(pinsById.get(id)) : null;
            const project = projectsById.get(id);
            return project ? projectBase(project) : null;
        },
        [pinsById, projectsById],
    );

    /** Changes fields of an item. Fields set back to their saved value stop counting as changes. */
    const update = React.useCallback(
        (key: MapEditorKey, patch: MapEditorDraft) => {
            const base = baseOf(key);
            if (!base) return;
            setDrafts((prev) => {
                const merged: MapEditorDraft = { ...prev[key], ...patch };
                const next: MapEditorDraft = {};
                for (const [field, value] of Object.entries(merged)) {
                    const saved = (base as unknown as Record<string, unknown>)[field];
                    // A new pin keeps every field it's given: there is nothing saved to fall back to
                    if (key === NEW_PIN_KEY || !sameValue(value, saved)) {
                        (next as Record<string, unknown>)[field] = value;
                    }
                }
                const rest = { ...prev };
                if (Object.keys(next).length === 0) delete rest[key];
                else rest[key] = next;
                return rest;
            });
        },
        [baseOf],
    );

    const discard = React.useCallback((key: MapEditorKey) => {
        setDrafts((prev) => {
            if (!(key in prev)) return prev;
            const rest = { ...prev };
            delete rest[key];
            return rest;
        });
    }, []);

    /** Starts a new, unsaved pin at a spot on the map. */
    const startNewPin = React.useCallback((fields: Partial<PinDraft>) => {
        setDrafts((prev) => ({ ...prev, [NEW_PIN_KEY]: { ...EMPTY_PIN, ...fields } }));
        return NEW_PIN_KEY;
    }, []);

    const items = React.useMemo<MapEditorItem[]>(() => {
        const list: MapEditorItem[] = [];

        for (const project of projectsQuery.data ?? []) {
            const key = keyOf("project", project.project_id);
            const draft = drafts[key];
            list.push({
                key,
                kind: "project",
                ...projectBase(project),
                ...draft,
                status: project.status,
                isNew: false,
                isDirty: !!draft,
                source: project,
            });
        }

        for (const pin of pinsQuery.data ?? []) {
            const key = keyOf("pin", pin.id);
            const draft = drafts[key];
            list.push({
                key,
                kind: "pin",
                ...pinBase(pin),
                ...draft,
                isNew: false,
                isDirty: !!draft,
                source: pin,
            });
        }

        const newPin = drafts[NEW_PIN_KEY];
        if (newPin) {
            list.push({
                key: NEW_PIN_KEY,
                kind: "pin",
                ...EMPTY_PIN,
                ...newPin,
                isNew: true,
                isDirty: true,
                source: null,
            });
        }

        return list;
    }, [drafts, pinsQuery.data, projectsQuery.data]);

    const itemsByKey = React.useMemo(() => new Map(items.map((item) => [item.key, item])), [items]);

    const dirtyKeys = React.useMemo(() => Object.keys(drafts) as MapEditorKey[], [drafts]);

    /** Saves one item's changes. Throws with a friendly message if it can't. */
    const save = React.useCallback(
        async (key: MapEditorKey): Promise<SaveResult> => {
            const item = itemsByKey.get(key);
            const draft = drafts[key];
            if (!item || !draft) return { key };

            setSaving((prev) => new Set(prev).add(key));
            try {
                if (item.kind === "pin") {
                    const parsed = pinDraftSchema.safeParse(item);
                    if (!parsed.success) throw new Error(firstIssue(parsed.error));

                    if (item.isNew) {
                        const created = await createPinV1PinsPost(parsed.data);
                        await invalidateListPinsV1PinsGet(queryClient);
                        discard(key);
                        return { key: keyOf("pin", created.id) };
                    }

                    const pin = item.source as PinOut;
                    const payload: PinUpdate = {};
                    for (const field of PIN_FIELDS) {
                        if (field in draft) (payload as Record<string, unknown>)[field] = parsed.data[field];
                    }
                    await partialUpdatePinV1PinsPinIdPatch(pin.id, payload);
                    await Promise.all([
                        invalidateListPinsV1PinsGet(queryClient),
                        invalidateGetPinV1PinsPinIdGet(queryClient, pin.id),
                    ]);
                } else {
                    const parsed = projectDraftSchema.safeParse(item);
                    if (!parsed.success) throw new Error(firstIssue(parsed.error));

                    const project = item.source as ProjectOut;
                    const payload: ProjectUpdate = {};
                    for (const field of PROJECT_FIELDS) {
                        if (field in draft) (payload as Record<string, unknown>)[field] = parsed.data[field];
                    }
                    await partialUpdateProjectV1GuildsMeProjectsProjectIdPatch(project.project_id, payload);
                    await Promise.all([
                        invalidateListProjectsV1GuildsMeProjectsGet(queryClient),
                        invalidateGetProjectV1GuildsMeProjectsProjectIdGet(queryClient, project.project_id),
                    ]);
                }

                // Only once the fresh data is in, so the marker doesn't jump back for a moment
                discard(key);
                return { key };
            } finally {
                setSaving((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }
        },
        [discard, drafts, itemsByKey, queryClient],
    );

    return {
        items,
        itemsByKey,
        pins: pinsQuery.data ?? [],
        isLoading: pinsQuery.isLoading || projectsQuery.isLoading,
        isError: pinsQuery.isError || projectsQuery.isError,
        error: pinsQuery.error ?? projectsQuery.error,
        refetch: () => Promise.all([pinsQuery.refetch(), projectsQuery.refetch()]),
        dirtyKeys,
        saving,
        update,
        discard,
        startNewPin,
        save,
    };
}

export { useMapEditor, NEW_PIN_KEY };
