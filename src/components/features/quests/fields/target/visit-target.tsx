import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowsDownUpIcon, MapPinAreaIcon, XIcon} from "@phosphor-icons/react";
import {Input} from "@/components/ui/input.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {useState} from "react";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {useFieldValidity} from "@/hooks/use-field-validity.ts";

const label = "text-sm text-muted-foreground";

export function VerticalConstraint() {
    const field = useFieldContext<string>()
    const { isInvalid } = useFieldValidity()

    const [verticalOpen, setVerticalOpen] = useState(
        !!field.state.value
    );

    function handleVerticalToggle(open: boolean) {
        setVerticalOpen(open);
        if (!open) {
            field.handleChange(undefined as any);
        }
    }

    return (
        <Collapsible open={verticalOpen} onOpenChange={handleVerticalToggle}>
            <CollapsibleTrigger asChild>
                {!verticalOpen && (
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="gap-2 text-muted-foreground justify-start"
                    >
                        <ArrowsDownUpIcon size={14} />
                        Add vertical constraint
                    </Button>
                )}
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="flex items-center flex-wrap gap-2">
                    <span className={label}>↕ within</span>
                    <Input
                        type="number" step="any"
                        className="w-16"
                        data-invalid={isInvalid} aria-invalid={isInvalid}
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(e.target.value === '' ? (undefined as any) : parseFloat(e.target.value))}
                    />
                    <span className={label}>blocks vertically</span>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            type="button"
                            className="text-muted-foreground/40 hover:text-destructive"
                        >
                            <XIcon size={12} />
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}

export const VisitTarget = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
    },

    render: function Render({form, objectiveIndex, targetIndex}) {
        return (
            <div className="flex gap-2 items-start">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={'outline'} className={'w-full'}>
                            Click to edit
                        </Button>
                    </DialogTrigger>

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
                                    const isInvalid = !field.state.meta.isValid

                                    const text = field.state.value;

                                    return (
                                        <div className="flex items-center gap-2">
                                            <span className={label}>Locate</span>
                                            <Input
                                                type="text"
                                                data-invalid={isInvalid} aria-invalid={isInvalid}
                                                placeholder={"the Super Secret button"}
                                                value={text ?? ''}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        </div>
                                    )
                                }}
                            />

                            {/* Coordinates */}
                            <form.AppField
                                name={`objectives[${objectiveIndex}].targets[${targetIndex}].coordinates`}
                                children={(field) => {
                                    const isInvalid = !field.state.meta.isValid

                                    const coords = field.state.value;

                                    function handleCoordChange(coordIndex: 0 | 1 | 2, rawValue: string) {
                                        const newCoords = [...(field.state.value || [0, 0, 0])];
                                        newCoords[coordIndex] = rawValue === '' ? (undefined as any) : parseFloat(rawValue);
                                        field.handleChange(newCoords as [number, number, number]);
                                    }

                                    return (
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className={label}>X:</span>
                                            <Input
                                                type="number" step="any"
                                                className="w-16"
                                                data-invalid={isInvalid} aria-invalid={isInvalid}
                                                value={coords?.[0] ?? ''}
                                                onChange={(e) => handleCoordChange(0, e.target.value)}
                                            />
                                            <span className={label}>Y:</span>
                                            <Input
                                                type="number" step="any"
                                                className="w-16"
                                                data-invalid={isInvalid} aria-invalid={isInvalid}
                                                value={coords?.[1] ?? ''}
                                                onChange={(e) => handleCoordChange(1, e.target.value)}
                                            />
                                            <span className={label}>Z:</span>
                                            <Input
                                                type="number" step="any"
                                                className="w-16"
                                                data-invalid={isInvalid} aria-invalid={isInvalid}
                                                value={coords?.[2] ?? ''}
                                                onChange={(e) => handleCoordChange(2, e.target.value)}
                                            />
                                        </div>
                                    )
                                }}
                            />

                            {/* Horizontal radius */}
                            <form.AppField
                                name={`objectives[${objectiveIndex}].targets[${targetIndex}].horizontal_radius`}
                                children={(field) => {
                                    const isInvalid = !field.state.meta.isValid

                                    return (
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className={label}>↔ within</span>
                                            <Input
                                                type="number" step="any"
                                                className="w-16"
                                                data-invalid={isInvalid} aria-invalid={isInvalid}
                                                value={field.state.value ?? ''}
                                                onChange={(e) => field.handleChange(e.target.value === '' ? (undefined as any) : parseFloat(e.target.value))}
                                            />
                                            <span className={label}>blocks horizontally</span>
                                        </div>
                                    )
                                }}
                            />

                            {/* Vertical Radius */}
                            <form.AppField
                                name={`objectives[${objectiveIndex}].targets[${targetIndex}].vertical_radius`}
                                children={() => <VerticalConstraint/>}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    },
});
