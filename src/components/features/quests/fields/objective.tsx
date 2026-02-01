import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";

export const QuestObjectiveCard = withQuestForm({
    props: {
        index: 0,
        onRemove: () => {}
    },

    render: function Render({form, index, onRemove}) {
        return (
            <Card className="p-0">
                <CardHeader className="p-2 pb-0 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <Button variant="invisible" size="icon-sm"/>

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
})
