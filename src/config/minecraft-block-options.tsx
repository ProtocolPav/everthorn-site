import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { SeamlessSelectOption } from "@/components/features/common/seamless-select.tsx";

// Helper function to format block name for display
const formatBlockName = (blockId: string): string => {
    const cleanId = blockId.replace('minecraft:', '');
    return cleanId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const MINECRAFT_BLOCKS_OPTIONS: SeamlessSelectOption[] =
    Object.values(MinecraftBlockTypes)
        .filter(value => typeof value === 'string')
        .map(blockType => ({
            value: blockType,
            label: formatBlockName(blockType)
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
