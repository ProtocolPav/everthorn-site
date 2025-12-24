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


export function ObjectiveReference({ form, index, objective, disable }: ObjectiveProps) {
    function getInputBox(field: any) {
        if (objective.objective_type !== 'scriptevent') {
            return (
                <VirtualizedCombobox
                    disabled={disable}
                    className={'w-full'}
                    options={
                        form.getValues(`objectives.${index}.objective_type`) === "mine"
                            ? blocks
                            : entities
                    }
                    searchPlaceholder={'Select Objective'}
                    onOptionSelect={(value: string) => {
                        form.setValue(`objectives.${index}.objective`, value)
                    }}
                    preselect={objective.objective}
                />
            )
        }

        else {
            return ( <Input disabled={disable} type={'text'} placeholder={'quest:your_event...'} {...field}/> )
        }

    }

    return (
        <FormField
            control={form.control}
            name={`objectives.${index}.objective`}
            render={({field}) => (
                <FormItem className={'w-full'}>
                    {getInputBox(field)}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}