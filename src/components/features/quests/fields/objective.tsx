import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon, TargetIcon } from "@phosphor-icons/react";
import {useFormContext} from "@/hooks/use-form-context.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";

interface ObjectiveCardProps {
    index: number;
    onRemove: () => void;
}

export function QuestObjectiveCard({index, onRemove}: ObjectiveCardProps) {
    const form = useFormContext()

    return (
        <Card className="p-0">
            <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-muted rounded-md">
                        <TargetIcon className="size-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-sm font-medium">
                        Objective #{index + 1}
                    </CardTitle>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={onRemove}
                    type="button"
                >
                    <TrashIcon className="size-4" />
                </Button>
            </CardHeader>

            <CardContent className="p-3 grid gap-4">
                <form.AppField
                    name={`objectives[${index}].description`}
                    children={(field) => <field.ObjectiveDescriptionField/>}
                />
            </CardContent>
        </Card>
    )
}
