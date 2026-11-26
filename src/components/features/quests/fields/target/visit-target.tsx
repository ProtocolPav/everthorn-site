import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    ArrowsDownUpIcon,
    ArrowsHorizontalIcon,
    MapPinAreaIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input.tsx";
import { LocationAreaInput } from "@/components/features/quests/fields/location-area-input.tsx";

const label = "text-sm text-muted-foreground";

export const VisitTarget = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
    },

    render: function Render({ form, objectiveIndex, targetIndex }) {
        return (
            <div className="flex gap-2 items-start w-full">
                <Dialog>
                    <form.Subscribe
                        selector={(state) => {
                            const obj = state.values.objectives?.[objectiveIndex];
                            return obj?.targets?.[targetIndex];
                        }}
                    >
                        {(target) => {
                            if (target.target_type !== "visit") return

                            const hasCoords = target?.coordinates && target.coordinates.some((c: number | undefined) => c !== undefined && !isNaN(c));
                            const hasLabel = Boolean(target?.helper_text?.trim());
                            const hasHorizontal = target?.horizontal_radius !== undefined && target.horizontal_radius !== null;
                            const hasVertical = target?.vertical_radius !== undefined && target.vertical_radius !== null;
                            const isConfigured = hasCoords || hasLabel || hasHorizontal;

                            return (
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full justify-start gap-2 overflow-hidden px-3 font-normal"
                                    >
                                        {isConfigured ? (
                                            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-xs">
                                                <span className="truncate font-medium text-foreground">
                                                    {hasLabel ? target.helper_text : '[NO HELPER TEXT]'}
                                                </span>

                                                {hasCoords && (
                                                    <span className="shrink-0 font-mono text-muted-foreground">
                                                        [{target.coordinates?.[0] ?? '~'}, {target.coordinates?.[1] ?? '~'}, {target.coordinates?.[2] ?? '~'}]
                                                    </span>
                                                )}

                                                {hasHorizontal && (
                                                    <span className="inline-flex shrink-0 items-center gap-0.5 text-muted-foreground">
                                                        <ArrowsHorizontalIcon className="size-3" />
                                                        {target.horizontal_radius}
                                                    </span>
                                                )}

                                                {hasVertical && (
                                                    <span className="inline-flex shrink-0 items-center gap-0.5 text-muted-foreground">
                                                        <ArrowsDownUpIcon className="size-3" />
                                                        {target.vertical_radius}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Click to edit</span>
                                        )}
                                    </Button>
                                </DialogTrigger>
                            );
                        }}
                    </form.Subscribe>

                    <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                        <DialogTitle className="sr-only">Edit Locate Objective</DialogTitle>
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center gap-2">
                                <MapPinAreaIcon className="text-muted-foreground" />
                                <span className={label}>Locate...</span>
                            </div>

                            {/* Helper */}
                            <form.AppField
                                name={`objectives[${objectiveIndex}].targets[${targetIndex}].helper_text`}
                                children={(field) => {
                                    const isInvalid = !field.state.meta.isValid;
                                    const text = field.state.value;

                                    return (
                                        <div className="flex items-center gap-2">
                                            <span className={label}>Locate</span>
                                            <Input
                                                type="text"
                                                data-invalid={isInvalid}
                                                aria-invalid={isInvalid}
                                                placeholder="the Super Secret button"
                                                value={text ?? ''}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        </div>
                                    );
                                }}
                            />

                            {/* Coordinates + radius */}
                            <form.Subscribe
                                selector={(state) => {
                                    const prefix = `objectives[${objectiveIndex}].targets[${targetIndex}]`;
                                    const keys = ["coordinates", "horizontal_radius", "vertical_radius"] as const;
                                    return {
                                        target: state.values.objectives?.[objectiveIndex]?.targets?.[targetIndex],
                                        isInvalid: keys.some((key) => {
                                            const meta = state.fieldMeta[`${prefix}.${key}` as keyof typeof state.fieldMeta];
                                            return (meta?.errors?.length ?? 0) > 0;
                                        }),
                                    };
                                }}
                            >
                                {({ target, isInvalid }) => {
                                    if (target?.target_type !== "visit") return null;
                                    const prefix = `objectives[${objectiveIndex}].targets[${targetIndex}]` as const;

                                    return (
                                        <LocationAreaInput
                                            isInvalid={isInvalid}
                                            value={target}
                                            onChange={(area) => {
                                                form.setFieldValue(`${prefix}.coordinates`, area.coordinates);
                                                form.setFieldValue(`${prefix}.horizontal_radius`, area.horizontal_radius);
                                                form.setFieldValue(`${prefix}.vertical_radius`, area.vertical_radius ?? undefined);
                                            }}
                                        />
                                    );
                                }}
                            </form.Subscribe>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    },
});