import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {formSchema} from "../../../app/(admin)/admin/quests/editor/_types/schema";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import * as React from "react";
import {
    Timer,
    MapPinSimpleArea,
    HandGrabbing,
    Cube, Check, XCircle, ArrowUUpLeft
} from "@phosphor-icons/react";
import {cn} from "@/lib/utils";
import {Switch} from "@/components/ui/switch";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface RequirementProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
    objective_index: number
    objective: any
    disable?: boolean;
}

const inputProps = {
    type: "number",
    className: 'h-fit w-14 p-1 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
}

export function RequirementLocation({form, objective_index, objective, disable}: RequirementProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={disable} className={cn(
                objective.location[0] && objective.location[1] ? 'border-blue-500/50' : '',
                "relative grid items-center gap-1 rounded-md border bg-secondary/40 p-2.5 text-sm shadow-sm",
                {hidden: objective.objective_type === "encounter" || objective.objective_type === ''},
            )}>
                <div className={'flex items-center gap-1'}>
                    <MapPinSimpleArea size={20} weight={'fill'}/>
                    Require Location
                </div>
                <div hidden={objective.location[0] == null || objective.location[1] == null} className={'font-mono text-gray-500'}>
                    {objective.location_radius} blocks around [{objective.location[0]}, {objective.location[1]}]
                </div>
                <div className={cn(
                    {hidden: objective.location[0] == null || objective.location[1] == null},
                    'absolute -right-1 -top-1 rounded-sm bg-blue-500 p-0.5'
                )}>
                    <Check size={12} weight={'bold'}/>
                </div>
            </PopoverTrigger>

            <PopoverContent className={'w-fit space-y-2 p-2'}>
                <div className={'flex items-center justify-between gap-1'}>
                    <h3 className={'text-lg'}>
                        Complete around...
                    </h3>

                    <Button size={'sm'} type={'reset'} variant={'secondary'} className={'flex h-8 gap-1'} onClick={() => {
                        form.setValue(`objectives.${objective_index}.location`, [null, null]);
                        setOpen(false);
                    }}>
                        <ArrowUUpLeft size={15}/>
                        Undo
                    </Button>
                </div>

                <div className={'flex gap-2'}>
                    <FormField
                        control={form.control}
                        name={`objectives.${objective_index}.location_radius`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className={'flex items-center gap-1'}>
                                        <Input disabled={disable} placeholder={'0'} {...inputProps} {...field} /> blocks around
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`objectives.${objective_index}.location.0`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className={'flex items-center gap-1'}>
                                        <Input disabled={disable} placeholder={'x'} {...inputProps} {...field} value={field.value ?? ''} />,
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`objectives.${objective_index}.location.1`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className={'flex items-center'}>
                                        <Input disabled={disable} placeholder={'y'} {...inputProps} {...field} value={field.value ?? ''} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}