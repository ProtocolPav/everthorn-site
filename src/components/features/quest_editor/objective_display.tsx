import {FormControl, FormField, FormItem, FormMessage, FormDescription} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import * as React from "react";
import {ControllerRenderProps, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {formSchema} from "../../../app/(admin)/admin/quests/editor/_types/schema";
import {VirtualizedCombobox} from "@/components/ui/virtualized-combobox";
import {blocks, entities} from "@/lib/minecraft-data";
import {Input} from "@/components/ui/input";

interface ObjectiveProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
    index: number
    objective: any
    disable?: boolean
}


export function ObjectiveDisplay({ form, index, objective, disable }: ObjectiveProps) {
    if (objective.objective_type === 'scriptevent') {
        return (
            <FormField
                control={form.control}
                name={`objectives.${index}.display`}
                render={({field}) => (
                    <FormItem className={'my-2'}>
                        <Input disabled={disable} type={'text'} placeholder={'Your Custom Objective Task Display'} {...field}/>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        )
    }
    else {return (<></>)}
}