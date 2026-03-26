import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { METADATA_OPTIONS, METADATA_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { RewardMetadata } from "@/types/quests";
import { EnchantmentMetadata } from "@/components/features/quests/fields/reward/metadata/enchantment-metadata.tsx";
import { RandomEnchantmentMetadata } from "@/components/features/quests/fields/reward/metadata/random-enchantment-metadata.tsx";
import { LoreMetadata } from "@/components/features/quests/fields/reward/metadata/lore-metadata.tsx";
import { NameMetadata } from "@/components/features/quests/fields/reward/metadata/name-metadata.tsx";
import { PotionMetadata } from "@/components/features/quests/fields/reward/metadata/potion-metadata.tsx";
import { DamageMetadata } from "@/components/features/quests/fields/reward/metadata/damage-metadata.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

interface MetadataSelectProps {
    value: RewardMetadata[];
    onChange: (value: RewardMetadata[]) => void;
}

export function MetadataSelect({ value, onChange }: MetadataSelectProps) {
    const existingTypes = new Set(value.map((m) => m.metadata_type));
    const availableOptions = METADATA_OPTIONS.filter((o) => !existingTypes.has(o.metadata_type));

    function addMetadata(metadataType: string) {
        const option = METADATA_OPTIONS_MAP[metadataType];
        if (!option) return;
        onChange([...value, option.defaultValue as RewardMetadata]);
    }

    function removeMetadata(index: number) {
        onChange(value.filter((_, i) => i !== index));
    }

    function updateMetadata(index: number, updated: RewardMetadata) {
        const next = [...value];
        next[index] = updated;
        onChange(next);
    }

    function renderMetadataField(index: number, metadata: RewardMetadata) {
        switch (metadata.metadata_type) {
            case "enchantment":
                return (
                    <EnchantmentMetadata
                        value={metadata}
                        onChange={(v) => updateMetadata(index, v)}
                    />
                );
            case "enchantment_random":
                return (
                    <RandomEnchantmentMetadata
                        value={metadata}
                        onChange={(v) => updateMetadata(index, v)}
                    />
                );
            case "lore":
                return (
                    <LoreMetadata
                        value={metadata}
                        onChange={(v) => updateMetadata(index, v)}
                    />
                );
            case "name":
                return (
                    <NameMetadata
                        value={metadata}
                        onChange={(v) => updateMetadata(index, v)}
                    />
                );
            case "potion":
                return (
                    <PotionMetadata
                        value={metadata}
                        onChange={(v) => updateMetadata(index, v)}
                    />
                );
            case "damage":
                return (
                    <DamageMetadata
                        value={metadata}
                        onChange={(v) => updateMetadata(index, v)}
                    />
                );
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Existing metadata entries */}
            {value.map((metadata, i) => {
                const option = METADATA_OPTIONS_MAP[metadata.metadata_type];
                return (
                    <Card key={i} className="p-0 bg-background/40">
                        <CardContent className="p-2 gap-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {option?.display ?? metadata.metadata_type}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    type="button"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => removeMetadata(i)}
                                >
                                    <XIcon size={14} />
                                </Button>
                            </div>
                            {renderMetadataField(i, metadata)}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Add metadata buttons */}
            {availableOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.length > 0 && <Separator className="w-full mb-1" />}
                    {availableOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <Button
                                key={option.metadata_type}
                                variant="outline"
                                size="sm"
                                type="button"
                                className="gap-1.5"
                                onClick={() => addMetadata(option.metadata_type)}
                            >
                                <Icon size={14} />
                                {option.display}
                            </Button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
