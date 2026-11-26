import type { ReactNode } from "react";
import { ArrowsDownUpIcon, DiceFiveIcon, MapPinAreaIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { ConsequenceToggle } from "@/components/features/quests/fields/customization/consequence-toggle.tsx";
import { RandomCountInput } from "@/components/features/quests/daily/template-form/random-count-input.tsx";
import { withTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import {
    describeAllowedTypes,
    getTemplateCustomizationDefault,
    isTemplateCustomizationAllowed,
    TEMPLATE_CUSTOMIZATION_IDS,
    type TemplateCustomizationId,
} from "@/config/quests/daily-template-options.ts";
import { formatNamespacedId, MINECRAFT_ITEM_OPTIONS } from "@/config/minecraft-options.ts";
import { formatDuration } from "@/lib/format.ts";
import { formatRandomCount, lowestRandomCount } from "@/lib/random-count.ts";
import type { DailyTemplateFormValues, TemplateCustomizationsFormValues } from "@/lib/schemas/daily-template-form.tsx";
import type { RandomCount } from "@/api/nexuscore/model";

const label = "text-sm text-muted-foreground";

type Options = NonNullable<TemplateCustomizationsFormValues>;
type OptionOf<K extends TemplateCustomizationId> = NonNullable<Options[K]>;

/** Chance of the customization being added to a roll; every template customization has one. */
function ChanceControl({ chance, onChange }: { chance: number; onChange: (chance: number) => void }) {
    const percent = Math.round(chance * 100);
    function set(value: number) {
        onChange(Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0)) / 100);
    }
    return (
        <div className="flex items-center gap-3">
            <DiceFiveIcon weight="fill" className="shrink-0 text-muted-foreground" />
            <span className={label}>Chance</span>
            <Slider
                value={[percent]}
                min={0}
                max={100}
                step={5}
                onValueChange={([value]) => set(value)}
                aria-label="Chance"
                className="flex-1 [&_[data-slot=slider-range]]:bg-muted-foreground/60 [&_[data-slot=slider-thumb]]:border-muted-foreground/60 [&_[data-slot=slider-thumb]]:bg-background"
            />
            <div className="flex items-center gap-1">
                <Input
                    type="number"
                    min={0}
                    max={100}
                    aria-label="Chance percent"
                    className="h-8 w-14 text-center"
                    value={percent}
                    onChange={(e) => set(Number(e.target.value))}
                />
                <span className={label}>%</span>
            </div>
        </div>
    );
}

function durationRange(seconds: RandomCount | null | undefined): string {
    if (!seconds) return "?";
    if (seconds.choices?.length) return seconds.choices.map(formatDuration).join(" / ");
    if (seconds.min != null && seconds.max != null) {
        return seconds.min === seconds.max ? formatDuration(seconds.min) : `${formatDuration(seconds.min)}–${formatDuration(seconds.max)}`;
    }
    return "?";
}

function getHint<K extends TemplateCustomizationId>(id: K, option: OptionOf<K>): string {
    const chance = `${Math.round(option.chance * 100)}%`;
    switch (id) {
        case "timer": {
            const timer = option as OptionOf<"timer">;
            return `${chance} · within ${durationRange(timer.seconds)}${timer.fail ? " · fails quest" : ""}`;
        }
        case "maximum_deaths": {
            const deaths = option as OptionOf<"maximum_deaths">;
            return `${chance} · max. ${formatRandomCount(deaths.deaths)} deaths${deaths.fail ? " · fails quest" : ""}`;
        }
        case "mainhand": {
            const items = (option as OptionOf<"mainhand">).items;
            return `${chance} · ${items.length === 1 ? `using ${formatNamespacedId(items[0])}` : `1 of ${items.length} items`}`;
        }
        case "location": {
            const location = option as OptionOf<"location">;
            const count = location.locations.length;
            return `${chance} · ${count === 1 ? "1 location" : `1 of ${count} locations`}${location.show_waypoint ? " · waypoint" : ""}`;
        }
        default:
            return `${chance} · all blocks naturally generated`;
    }
}

function TimerEditor({ value, onChange }: { value: OptionOf<"timer">; onChange: (value: OptionOf<"timer">) => void }) {
    const lowest = lowestRandomCount(value.seconds);
    return (
        <>
            <div className="flex flex-col gap-2">
                <span className={label}>Complete within (seconds)</span>
                <div className="flex items-center gap-2">
                    <RandomCountInput
                        value={value.seconds}
                        onChange={(seconds) => onChange({ ...value, seconds: seconds as RandomCount })}
                        placeholder="600-900"
                        aria-label="Timer seconds"
                        className="w-32"
                    />
                    <span className={label}>{lowest != null ? `= ${durationRange(value.seconds)}` : ""}</span>
                </div>
            </div>
            <ConsequenceToggle value={value.fail} onChange={(fail) => onChange({ ...value, fail })} label="On timeout..." />
        </>
    );
}

function DeathsEditor({ value, onChange }: { value: OptionOf<"maximum_deaths">; onChange: (value: OptionOf<"maximum_deaths">) => void }) {
    return (
        <>
            <div className="flex items-center gap-2">
                <span className={label}>At most</span>
                <RandomCountInput
                    value={value.deaths}
                    onChange={(deaths) => onChange({ ...value, deaths: deaths as RandomCount })}
                    placeholder="1, 2, 3"
                    aria-label="Maximum deaths"
                />
                <span className={label}>deaths</span>
            </div>
            <ConsequenceToggle value={value.fail} onChange={(fail) => onChange({ ...value, fail })} label="When exceeded..." />
        </>
    );
}

function MainhandEditor({ value, onChange }: { value: OptionOf<"mainhand">; onChange: (value: OptionOf<"mainhand">) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <span className={label}>Complete using one of...</span>
            <div className="flex flex-wrap gap-1">
                {value.items.map((item) => (
                    <span key={item} className="inline-flex h-6 items-center gap-1 rounded-md bg-secondary pl-2 pr-1 text-xs">
                        {formatNamespacedId(item)}
                        <button
                            type="button"
                            className="rounded text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${item}`}
                            onClick={() => onChange({ ...value, items: value.items.filter((i) => i !== item) })}
                        >
                            <XIcon size={12} />
                        </button>
                    </span>
                ))}
            </div>
            <VirtualizedCombobox
                value=""
                onValueChange={(item) => item && !value.items.includes(item) && onChange({ ...value, items: [...value.items, item] })}
                options={MINECRAFT_ITEM_OPTIONS}
                placeholder="Add an item..."
                searchPlaceholder="Search items..."
                allowCustom={false}
                className="w-full"
            />
        </div>
    );
}

function LocationEditor({ value, onChange }: { value: OptionOf<"location">; onChange: (value: OptionOf<"location">) => void }) {
    type Location = OptionOf<"location">["locations"][number];

    function update(index: number, patch: Partial<Location>) {
        onChange({ ...value, locations: value.locations.map((location, i) => (i === index ? { ...location, ...patch } : location)) });
    }
    function num(raw: string): number {
        return raw === "" ? (undefined as unknown as number) : parseFloat(raw);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <MapPinAreaIcon weight="fill" className="text-muted-foreground" />
                <span className={label}>Complete around one of...</span>
            </div>
            {value.locations.map((location, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-lg border p-2">
                    <div className="flex items-center flex-wrap gap-2">
                        {(["X", "Y", "Z"] as const).map((axis, i) => (
                            <span key={axis} className="flex items-center gap-1.5">
                                <span className={label}>{axis}:</span>
                                <Input
                                    type="number"
                                    step="any"
                                    className="w-20"
                                    value={location.coordinates[i] ?? ""}
                                    onChange={(e) => {
                                        const coordinates = [...location.coordinates] as Location["coordinates"];
                                        coordinates[i] = num(e.target.value);
                                        update(index, { coordinates });
                                    }}
                                />
                            </span>
                        ))}
                        {value.locations.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                type="button"
                                className="ml-auto text-muted-foreground/60 hover:text-destructive"
                                aria-label="Remove location"
                                onClick={() => onChange({ ...value, locations: value.locations.filter((_, i) => i !== index) })}
                            >
                                <XIcon size={12} />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={label}>↔</span>
                        <Input type="number" className="w-16" value={location.horizontal_radius ?? ""} onChange={(e) => update(index, { horizontal_radius: num(e.target.value) })} />
                        <ArrowsDownUpIcon size={14} className="text-muted-foreground" />
                        <Input type="number" className="w-16" value={location.vertical_radius ?? ""} onChange={(e) => update(index, { vertical_radius: num(e.target.value) })} />
                        <span className={label}>blocks</span>
                    </div>
                </div>
            ))}
            <Button
                variant="ghost"
                size="sm"
                type="button"
                className="w-fit text-muted-foreground"
                onClick={() =>
                    onChange({ ...value, locations: [...value.locations, { coordinates: [0, 64, 0], horizontal_radius: 32, vertical_radius: 16 }] })
                }
            >
                <PlusIcon />
                Add location
            </Button>
            <div className="flex items-center gap-2">
                <Switch id="template-show-waypoint" checked={value.show_waypoint} onCheckedChange={(show_waypoint) => onChange({ ...value, show_waypoint })} />
                <Label htmlFor="template-show-waypoint" className="font-normal">Show a waypoint at the chosen location</Label>
            </div>
        </div>
    );
}

function OptionEditor<K extends TemplateCustomizationId>({
    id,
    value,
    onChange,
}: {
    id: K;
    value: OptionOf<K>;
    onChange: (value: OptionOf<K>) => void;
}): ReactNode {
    const set = onChange as (value: unknown) => void;
    switch (id) {
        case "timer":
            return <TimerEditor value={value as OptionOf<"timer">} onChange={set} />;
        case "maximum_deaths":
            return <DeathsEditor value={value as OptionOf<"maximum_deaths">} onChange={set} />;
        case "mainhand":
            return <MainhandEditor value={value as OptionOf<"mainhand">} onChange={set} />;
        case "location":
            return <LocationEditor value={value as OptionOf<"location">} onChange={set} />;
        default:
            return null;
    }
}

/** The "Add" picker, like the quest editor's CustomizationSelect, filtered by objective type. */
function AddCustomizationDialog({
    objectiveType,
    existing,
    onAdd,
}: {
    objectiveType: DailyTemplateFormValues["objective_type"];
    existing: Set<string>;
    onAdd: (id: TemplateCustomizationId) => void;
}) {
    const available = TEMPLATE_CUSTOMIZATION_IDS.filter((id) => !existing.has(id));
    const canAdd = available.some((id) => isTemplateCustomizationAllowed(id, objectiveType));

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" type="button" className="w-fit text-muted-foreground" disabled={!canAdd}>
                    <PlusIcon />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="gap-3 p-2.5">
                <DialogTitle>Add Customization</DialogTitle>
                <DialogDescription className="sr-only">Customizations are added to rolled quests by chance.</DialogDescription>
                <div className="flex flex-wrap gap-1.5">
                    {available.map((id) => {
                        const config = CUSTOMIZATIONS[id]!; // every template customization exists in the quest config
                        const Icon = config.icon;
                        const allowed = isTemplateCustomizationAllowed(id, objectiveType);
                        return (
                            <DialogClose asChild key={id}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                    disabled={!allowed}
                                    title={allowed ? undefined : `${describeAllowedTypes(id)}`}
                                    onClick={() => onAdd(id)}
                                >
                                    <Icon size={14} />
                                    {config.display}
                                    {!allowed && <span className="text-xs text-muted-foreground">· {describeAllowedTypes(id)}</span>}
                                </Button>
                            </DialogClose>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Customization options for a template: the quest editor's customization
 * cards and dialogs, each with a chance of being added to the rolled quest.
 */
export const TemplateCustomizations = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: {},
    render: function Render({ form }) {
        return (
            <form.Subscribe
                selector={(state) => ({ customizations: state.values.customizations, objectiveType: state.values.objective_type })}
                children={({ customizations, objectiveType }) => {
                    const active = TEMPLATE_CUSTOMIZATION_IDS.filter((id) => customizations?.[id] != null);
                    return (
                        <>
                            <div className="text-section-label flex gap-1.5 items-center">
                                Customization
                                <FieldInfoTooltip>
                                    Extra rules like time limits or locations. Each is added to the rolled quest with its
                                    own chance.
                                </FieldInfoTooltip>
                                <AddCustomizationDialog
                                    objectiveType={objectiveType}
                                    existing={new Set(active)}
                                    onAdd={(id) => form.setFieldValue(`customizations.${id}`, getTemplateCustomizationDefault(id) as never)}
                                />
                                <Separator className="flex-1" />
                            </div>

                            {active.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {active.map((id) => (
                                        <form.AppField
                                            key={id}
                                            name={`customizations.${id}` as "customizations.timer"}
                                            children={(field) => {
                                                const option = field.state.value as OptionOf<typeof id> | null | undefined;
                                                if (!option) return null;
                                                const config = CUSTOMIZATIONS[id]!; // every template customization exists in the quest config
                                                const set = (next: unknown) => field.handleChange(next as never);
                                                return (
                                                    <CustomizationCard
                                                        title={config.display}
                                                        icon={config.icon}
                                                        hint={getHint(id, option)}
                                                        onRemove={() => form.setFieldValue("customizations", { ...form.getFieldValue("customizations"), [id]: null })}
                                                        warning={"fail" in option ? Boolean(option.fail) : false}
                                                        hasErrors={!field.state.meta.isValid}
                                                    >
                                                        <div className="flex flex-col gap-3">
                                                            <ChanceControl chance={option.chance} onChange={(chance) => set({ ...option, chance })} />
                                                            {id !== "natural_block" && <Separator />}
                                                            <OptionEditor id={id} value={option} onChange={set} />
                                                        </div>
                                                    </CustomizationCard>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground/50 italic">
                                    No customizations
                                </p>
                            )}
                        </>
                    );
                }}
            />
        );
    },
});
