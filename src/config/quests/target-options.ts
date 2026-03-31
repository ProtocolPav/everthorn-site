import type { ObjectiveTypes, Target } from "@/types/quests";
import type { TargetFormValues } from "@/lib/schemas/quest-form.tsx";
import {
    CUSTOM_ENTITY_OPTIONS,
    CUSTOM_BLOCK_OPTIONS,
} from "@/config/minecraft-options.ts";
import type { VirtualizedComboboxOption } from "@/components/common/virtualized-combobox.tsx";

export const TARGET_DEFAULTS: Record<ObjectiveTypes, () => TargetFormValues> = {
    kill: () => ({
        target_uuid: crypto.randomUUID(),
        target_type: 'kill',
        count: undefined,
        entity: '',
    }),
    mine: () => ({
        target_uuid: crypto.randomUUID(),
        target_type: 'mine',
        count: undefined,
        block: '',
    }),
    scriptevent: () => ({
        target_uuid: crypto.randomUUID(),
        target_type: 'scriptevent',
        count: undefined,
        script_id: '',
    }),
};

interface TargetEntityConfig {
    options: VirtualizedComboboxOption[];
    fieldName: string;
    searchPlaceholder: string;
}

export const TARGET_ENTITY_CONFIG: Record<'kill' | 'mine', TargetEntityConfig> = {
    kill: {
        options: CUSTOM_ENTITY_OPTIONS,
        fieldName: 'entity',
        searchPlaceholder: 'Search entities...',
    },
    mine: {
        options: CUSTOM_BLOCK_OPTIONS,
        fieldName: 'block',
        searchPlaceholder: 'Search blocks...',
    },
};
