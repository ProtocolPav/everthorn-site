import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import * as React from "react";
import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {formSchema} from "../../../app/(admin)/admin/quests/editor/_types/schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Sword, Shovel, BracketsCurly, LockKey} from "@phosphor-icons/react";

interface ObjectiveProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
    index: number
    disable?: boolean
}

export function ObjectiveType({ form, index, disable }: ObjectiveProps) {
    return (
        <FormField
            control={form.control}
            name={`objectives.${index}.objective_type`}
            render={({ field }) => (
                <FormItem className={'w-44'}>
                    <FormControl>
                        <Select disabled={disable} onValueChange={field.onChange} {...field}>
                            <SelectTrigger className={'w-full'}>
                                <SelectValue placeholder={'Kill...'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kill">
                                    <div className={'flex gap-1 align-baseline'}>
                                        <Sword weight={'fill'} size={18}/> Kill
                                    </div>
                                </SelectItem>
                                <SelectItem value="mine">
                                    <div className={'flex gap-1 align-baseline'}>
                                        <Shovel weight={'fill'} size={18}/> Mine
                                    </div>
                                </SelectItem>
                                <SelectItem value="scriptevent">
                                    <div className={'flex gap-1 align-baseline'}>
                                        <BracketsCurly weight={'fill'} size={18}/> Custom
                                    </div>
                                </SelectItem>
                                <SelectItem value="horde" disabled>
                                    <div className={'flex gap-1 align-baseline'}>
                                        <LockKey weight={'fill'} size={18}/> Horde Kill
                                    </div>
                                </SelectItem>
                                <SelectItem value="visit" disabled>
                                    <div className={'flex gap-1 align-baseline'}>
                                        <LockKey weight={'fill'} size={18}/> Visit
                                    </div>
                                </SelectItem>
                                <SelectItem value="place" disabled>
                                    <div className={'flex gap-1 align-baseline'}>
                                        <LockKey weight={'fill'} size={18}/> Place
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}