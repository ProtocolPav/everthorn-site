import type { TargetFormValues } from "@/lib/schemas/quest-form.tsx";
import {
    CUSTOM_ENTITY_OPTIONS,
    CUSTOM_BLOCK_OPTIONS,
} from "@/config/minecraft-options.ts";
import type { VirtualizedComboboxOption } from "@/components/common/virtualized-combobox.tsx";
import {ObjectiveOutObjectiveType} from "@/api/nexuscore/model";

export const TARGET_DEFAULTS: Record<ObjectiveOutObjectiveType, () => TargetFormValues> = {
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
    visit: () => ({
        target_uuid: crypto.randomUUID(),
        target_type: 'visit',
        count: 1,
        helper_text: '',
        coordinates: [0, 0, 0],
        horizontal_radius: 7,
        vertical_radius: undefined as any,
        seconds: 2
    })
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
