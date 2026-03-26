import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
    CoinsIcon,
    GiftIcon,
    SwordIcon,
    SparkleIcon,
    TagIcon,
    FlaskIcon,
    LightningIcon,
    WrenchIcon,
} from "@phosphor-icons/react";
import { RewardFormValues } from "@/lib/schemas/quest-form.tsx";

export type RewardKind = "balance" | "item";

export interface RewardOption {
    reward_kind: RewardKind;
    display: string;
    icon: PhosphorIcon;
    defaultValue: RewardFormValues;
}

export interface MetadataOption {
    metadata_type: string;
    display: string;
    icon: PhosphorIcon;
    defaultValue: object;
}

export const REWARD_OPTIONS: RewardOption[] = [
    {
        reward_kind: "balance",
        display: "Balance",
        icon: CoinsIcon,
        defaultValue: {
            balance: 0,
            item: null,
            count: null,
            display_name: null,
            item_metadata: [],
        },
    },
    {
        reward_kind: "item",
        display: "Item",
        icon: GiftIcon,
        defaultValue: {
            balance: null,
            item: "",
            count: 1,
            display_name: null,
            item_metadata: [],
        },
    },
];

export const REWARD_OPTIONS_MAP: Record<RewardKind, RewardOption> = Object.fromEntries(
    REWARD_OPTIONS.map((r) => [r.reward_kind, r])
) as Record<RewardKind, RewardOption>;

export const METADATA_OPTIONS: MetadataOption[] = [
    {
        metadata_type: "enchantment",
        display: "Enchantment",
        icon: SparkleIcon,
        defaultValue: { metadata_type: "enchantment", enchantment_id: "", enchantment_level: 1 },
    },
    {
        metadata_type: "enchantment_random",
        display: "Random Enchantment",
        icon: SparkleIcon,
        defaultValue: { metadata_type: "enchantment_random", level_min: 1, level_max: 5, treasure: false },
    },
    {
        metadata_type: "lore",
        display: "Lore",
        icon: TagIcon,
        defaultValue: { metadata_type: "lore", item_lore: [] },
    },
    {
        metadata_type: "name",
        display: "Custom Name",
        icon: WrenchIcon,
        defaultValue: { metadata_type: "name", item_name: "" },
    },
    {
        metadata_type: "potion",
        display: "Potion Effect",
        icon: FlaskIcon,
        defaultValue: { metadata_type: "potion", potion_effect: "", potion_delivery: "" },
    },
    {
        metadata_type: "damage",
        display: "Damage",
        icon: LightningIcon,
        defaultValue: { metadata_type: "damage", damage_percentage: 100 },
    },
];

export const METADATA_OPTIONS_MAP: Record<string, MetadataOption> = Object.fromEntries(
    METADATA_OPTIONS.map((m) => [m.metadata_type, m])
);
