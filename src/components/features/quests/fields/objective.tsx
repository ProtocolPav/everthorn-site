import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CaretDownIcon, TrashIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {TargetList} from "./objective/target-list";
import {OrTargetCountField} from "./objective/or-target-count";
import {ObjectiveTypeField} from "./objective/objective-type";

export const QuestObjectiveCard = withQuestForm({
    props: {
        index: 0,
        onRemove: () => {
        },
    },

    render: function Render({form, index, onRemove}) {
        const [open, setOpen] = useState(false);

        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <Card className="p-0 gap-0 transition-all overflow-hidden">
                    <CollapsibleTrigger asChild>
                        <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 group hover:bg-input/10">
                            <div className="flex items-center gap-2">
                                <Button variant="invisible" size="icon-sm"/>

                                <CardTitle className="font-medium flex gap-2 items-center">
                                    Objective #{index + 1}
                                    <CaretDownIcon
                                        className={cn(
                                            "transition-all duration-75 group-hover:font-bold",
                                            open ? "rotate-180" : ""
                                        )}
                                    />
                                </CardTitle>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
                                onClick={onRemove}
                                type="button"
                            >
                                <TrashIcon className="size-4"/>
                            </Button>
                        </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent asChild>
                        <CardContent className="p-2 grid gap-4">
                            <form.AppField
                                name={`objectives[${index}].description`}
                                children={(field) => <field.ObjectiveDescriptionField/>}
                            />

                            <div className="flex gap-2">
                                <ObjectiveTypeField form={form} index={index}/>

                                <form.AppField
                                    name={`objectives[${index}].logic`}
                                    children={(field) => <field.TargetLogicField/>}
                                />

                                <OrTargetCountField form={form} objectiveIndex={index}/>
                            </div>

                            <div className="border rounded-md p-2">
                                <TargetList form={form} objectiveIndex={index}/>
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        );
    },
});
