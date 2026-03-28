import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { METADATA_OPTIONS, METADATA_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { RewardMetadata } from "@/types/quests";
import { EnchantmentMetadata } from "@/components/features/quests/fields/reward/metadata/enchantment-metadata.tsx";
import { RandomEnchantmentMetadata } from "@/components/features/quests/fields/reward/metadata/random-enchantment-metadata.tsx";
import { LoreMetadata } from "@/components/features/quests/fields/reward/metadata/lore-metadata.tsx";
import { NameMetadata } from "@/components/features/quests/fields/reward/metadata/name-metadata.tsx";
import { PotionMetadata } from "@/components/features/quests/fields/reward/metadata/potion-metadata.tsx";
import { DamageMetadata } from "@/components/features/quests/fields/reward/metadata/damage-metadata.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { cn } from "@/lib/utils.ts";

interface MetadataSelectProps {
    value: RewardMetadata[];
    onChange: (value: RewardMetadata[]) => void;
    hasErrors?: boolean;
}

function getMetadataButtonHint(metadata: RewardMetadata): string | null {
    switch (metadata.metadata_type) {
        case "lore":
            return metadata.item_lore.length > 0 ? `${metadata.item_lore.length} lines` : null;
        case "name":
            return metadata.item_name || null;
        case "potion":
            return metadata.potion_effect
                ? metadata.potion_effect.replace(/^[^:]+:/, "").replaceAll("_", " ")
                : null;
        case "damage":
            return `${metadata.damage_percentage}%`;
        default:
            return null;
    }
}

export function MetadataSelect({ value, onChange, hasErrors }: MetadataSelectProps) {
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
                return <EnchantmentMetadata value={metadata} onChange={(v) => updateMetadata(index, v)} />;
            case "enchantment_random":
                return <RandomEnchantmentMetadata value={metadata} onChange={(v) => updateMetadata(index, v)} />;
            case "lore":
                return <LoreMetadata value={metadata} onChange={(v) => updateMetadata(index, v)} />;
            case "name":
                return <NameMetadata value={metadata} onChange={(v) => updateMetadata(index, v)} />;
            case "potion":
                return <PotionMetadata value={metadata} onChange={(v) => updateMetadata(index, v)} />;
            case "damage":
                return <DamageMetadata value={metadata} onChange={(v) => updateMetadata(index, v)} />;
        }
    }

    return (
        <div className={cn("flex flex-wrap gap-1.5 rounded-lg p-1.5", hasErrors && "ring-2 ring-destructive")}>
            {METADATA_OPTIONS.map((option) => {
                const Icon = option.icon;
                const existingIndices = value
                    .map((m, i) => (m.metadata_type === option.metadata_type ? i : -1))
                    .filter((i) => i !== -1);

                const isPresent = existingIndices.length > 0;

                // Non-repeatable and already added: show Edit + X with inline hint
                if (!option.repeatable && isPresent) {
                    const idx = existingIndices[0];
                    const metadata = value[idx];
                    const hint = getMetadataButtonHint(metadata);

                    return (
                        <Dialog key={option.metadata_type}>
                            <ButtonGroup>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm" type="button" className="gap-1.5 max-w-44 justify-start">
                                        <Icon size={14} />
                                        <span className="truncate">{option.display}</span>
                                        {hint && (
                                            <span className="text-muted-foreground text-[11px] font-mono truncate" title={hint}>
                                                {hint}
                                            </span>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    type="button"
                                    className="px-1.5 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeMetadata(idx)}
                                >
                                    <XIcon size={12} />
                                </Button>
                            </ButtonGroup>

                            <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                                <DialogTitle className="sr-only">{option.display}</DialogTitle>
                                {renderMetadataField(idx, metadata)}
                            </DialogContent>
                        </Dialog>
                    );
                }

                // Repeatable and has entries: show [Edit] [X]  [+] per instance
                if (option.repeatable && existingIndices.length > 0) {
                    return existingIndices.map((idx, i) => {
                        const metadata = value[idx];
                        const isLast = i === existingIndices.length - 1;
                        return (
                            <Dialog key={`${option.metadata_type}-${idx}`}>
                                <div className="flex gap-0.5">
                                    <ButtonGroup>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" size="sm" type="button" className="gap-1.5">
                                                <Icon size={14} />
                                                {option.display}
                                                <span className="bg-background/50 rounded px-1 text-[10px] font-mono tabular-nums">
                                                    {i + 1}
                                                </span>
                                            </Button>
                                        </DialogTrigger>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            type="button"
                                            className="px-1.5 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeMetadata(idx)}
                                        >
                                            <XIcon size={12} />
                                        </Button>
                                    </ButtonGroup>
                                    {isLast && (
                                        <ButtonGroup>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                type="button"
                                                className="px-1.5 text-muted-foreground hover:text-foreground"
                                                onClick={() => addMetadata(option.metadata_type)}
                                            >
                                                <PlusIcon size={12} />
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                </div>

                                <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                                    <DialogTitle className="sr-only">{option.display}</DialogTitle>
                                    {renderMetadataField(idx, metadata)}
                                </DialogContent>
                            </Dialog>
                        );
                    });
                }

                // Not present: show Add button
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
    );
}
