import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {formSchema} from "../../../app/(admin)/admin/quests/editor/_types/schema";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import * as React from "react";
import {HandGrabbing, Check, ArrowUUpLeft} from "@phosphor-icons/react";
import {cn} from "@/lib/utils";
import {VirtualizedCombobox} from "@/components/ui/virtualized-combobox";
import {items} from "@/lib/minecraft-data";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

interface RequirementProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
    objective_index: number
    objective: any
    disable?: boolean
}

export function RequirementMainhand({form, objective_index, objective, disable}: RequirementProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={disable} className={cn(
                objective.mainhand ? 'border-blue-500/50' : '',
                "relative grid items-center gap-1 rounded-md border bg-secondary/40 p-2.5 text-sm shadow-sm",
                { hidden: objective.objective_type === "scriptevent" || objective.objective_type === '' },
            )}>
                <div className={'flex items-center gap-1'}>
                    <HandGrabbing size={20} weight={'fill'}/>
                    Require Mainhand
                </div>
                <div hidden={!objective.mainhand} className={'font-mono text-gray-500'}>
                    using {objective.mainhand}
                </div>
                <div className={cn(
                    {hidden: !objective.mainhand},
                    'absolute -right-1 -top-1 rounded-sm bg-blue-500 p-0.5'
                )}>
                    <Check size={12} weight={'bold'}/>
                </div>
            </PopoverTrigger>

            <PopoverContent className={'w-80 space-y-2 p-2'}>
                <FormField
                    control={form.control}
                    name={`objectives.${objective_index}.mainhand`}
                    render={({ field }) => (
                        <FormItem>
                            <div className={'flex items-center justify-between gap-1'}>
                                <h3 className={'text-lg'}>
                                    Complete using...
                                </h3>

                                <Button size={'sm'} type={'reset'} variant={'secondary'} className={'flex h-8 gap-1'} onClick={() => {
                                    form.setValue(`objectives.${objective_index}.mainhand`, '');
                                    setOpen(false);
                                }}>
                                    <ArrowUUpLeft size={15}/>
                                    Undo
                                </Button>
                            </div>
                            <FormControl>
                                <VirtualizedCombobox
                                    disabled={disable}
                                    options={items}
                                    searchPlaceholder="Item"
                                    className={'w-full'}
                                    onOptionSelect={(value: string) => {
                                        form.setValue(
                                            `objectives.${objective_index}.mainhand`,
                                            value
                                        )
                                        setOpen(false);
                                    }}
                                    preselect={form.getValues(`objectives.${objective_index}.mainhand`)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </PopoverContent>
        </Popover>
    )
}