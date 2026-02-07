// lib/minecraft-options.ts
import {
    MinecraftBlockTypes,
    MinecraftItemTypes,
    MinecraftEntityTypes,
} from "@minecraft/vanilla-data"
import type { VirtualizedComboboxOption } from "@/components/features/common/virtualized-combobox.tsx"

/**
 * Formats a namespaced identifier into a readable label
 * minecraft:diamond_sword -> Diamond Sword
 * amethyst:crystal_block -> Crystal Block
 */
export function formatNamespacedId(id: string): string {
    const path = id.includes(":") ? id.split(":")[1] : id
    return path
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/**
 * Generates search terms for better filtering
 */
function generateSearchTerms(id: string): string[] {
    const path = id.includes(":") ? id.split(":")[1] : id
    const words = path.split("_")
    return [
        path,
        path.replace(/_/g, " "),
        ...words,
    ]
}

/**
 * Creates options from namespaced identifiers
 */
function createOptions(
    identifiers: string[],
    customOptions: VirtualizedComboboxOption[] = []
): VirtualizedComboboxOption[] {
    const generatedOptions = identifiers.map((id) => ({
        value: id,
        label: formatNamespacedId(id),
        searchTerms: generateSearchTerms(id),
    }))

    return [...generatedOptions, ...customOptions]
}

// Base Minecraft options
export const MINECRAFT_BLOCK_OPTIONS = createOptions(
    Object.values(MinecraftBlockTypes)
)

export const MINECRAFT_ITEM_OPTIONS = createOptions(
    Object.values(MinecraftItemTypes)
)

export const MINECRAFT_ENTITY_OPTIONS = createOptions(
    Object.values(MinecraftEntityTypes)
)

export const CUSTOM_BLOCK_OPTIONS = createOptions(
    Object.values(MinecraftBlockTypes),
    [
        {
            value: "amethyst:everthorn_e",
            label: "[AM] Everthorn E",
            searchTerms: ["amethyst"],
        },
        {
            value: "amethyst:whoopee_cushion",
            label: "[AM] Whoopee Cushion",
            searchTerms: ["amethyst"],
        },
        {
            value: "amethyst:reactor",
            label: "[AM] Monolithic Reactor",
            searchTerms: ["amethyst"],
        },
    ] as VirtualizedComboboxOption[]
)

export const CUSTOM_ENTITY_OPTIONS = createOptions(
    Object.values(MinecraftEntityTypes),
    [
        {
            value: "amethyst:endstone_golem",
            label: "[AM] Endstone Golem",
            searchTerms: ["amethyst"],
        },
        {
            value: "amethyst:the_breath",
            label: "[AM] The Breath",
            searchTerms: ["amethyst"],
        }
    ] as VirtualizedComboboxOption[]
)
