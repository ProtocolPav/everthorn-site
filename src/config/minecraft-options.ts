// lib/minecraft-options.ts
import {
    MinecraftBlockTypes,
    MinecraftItemTypes,
    MinecraftEntityTypes,
} from "@minecraft/vanilla-data"
import type { VirtualizedComboboxOption } from "@/components/features/common/virtualized-combobox.tsx"

/**
 * Formats a Minecraft identifier into a readable label
 * minecraft:diamond_sword -> Diamond Sword
 */
function formatMinecraftLabel(identifier: string): string {
    return identifier
        .replace("minecraft:", "")
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/**
 * Generates search terms for better filtering
 */
function generateSearchTerms(identifier: string): string[] {
    const withoutNamespace = identifier.replace("minecraft:", "")
    const words = withoutNamespace.split("_")
    return [
        withoutNamespace,
        withoutNamespace.replace(/_/g, " "),
        ...words,
    ]
}

/**
 * Creates a VirtualizedComboboxOption from a Minecraft identifier
 */
function createMinecraftOption(identifier: string): VirtualizedComboboxOption {
    return {
        value: identifier,
        label: formatMinecraftLabel(identifier),
        searchTerms: generateSearchTerms(identifier),
    }
}

export const MINECRAFT_BLOCK_OPTIONS: VirtualizedComboboxOption[] = Object.values(
    MinecraftBlockTypes
).map(createMinecraftOption)

export const MINECRAFT_ITEM_OPTIONS: VirtualizedComboboxOption[] = Object.values(
    MinecraftItemTypes
).map(createMinecraftOption)

export const MINECRAFT_ENTITY_OPTIONS: VirtualizedComboboxOption[] = Object.values(
    MinecraftEntityTypes
).map(createMinecraftOption)
