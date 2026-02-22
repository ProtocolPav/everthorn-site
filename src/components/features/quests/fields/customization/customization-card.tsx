import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {CustomizationTypes} from "@/types/quests";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {HourglassLowIcon, TrashIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";

export function CustomizationField() {
    const field = useFieldContext<CustomizationTypes>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Objective Customization</FieldLabel>
            <Card className={'group/customization transition-all p-0 rounded-lg text-sm border-yellow-800 hover:bg-background/40'}>
                <CardContent className={'p-2 gap-1'}>
                    <div className={'flex justify-between'}>
                        <div className="flex items-center gap-1">
                            <HourglassLowIcon size={18} weight={'fill'}/>
                            Timer
                        </div>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground opacity-0 group-hover/customization:opacity-100 hover:text-destructive"
                            onClick={() => {}}
                            type="button"
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                    <div className={'text-muted-foreground font-mono'}>
                        Complete within 5m40s
                    </div>
                </CardContent>
            </Card>

            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}