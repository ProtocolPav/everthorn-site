import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {formSchema} from "../../../app/(admin)/admin/quests/editor/_types/schema";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import * as React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon} from "lucide-react";

// Helper function to convert Date to ISO with timezone
function toISOWithTZ(date: Date): string {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60);
}

export function QuestDates({form, disable}: {form: UseFormReturn<z.infer<typeof formSchema>>, disable?: boolean}) {
    return (
        <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
                <FormItem className="my-4 md:w-1/2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    disabled={disable}
                                    className={cn(
                                        "w-full justify-between text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value?.from ? (
                                        field.value.to ? (
                                            <>
                                                {format(new Date(field.value.from), "LLL dd, y haaa")} - {' '}
                                                {format(new Date(field.value.to), "LLL dd, y haaa")}
                                            </>
                                        ) : (
                                            format(new Date(field.value.from), "LLL dd, y haaa")
                                        )
                                    ) : (
                                        <span>When does the quest start and end?</span>
                                    )}
                                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                weekStartsOn={1}
                                defaultMonth={field.value?.from ? new Date(field.value.from) : undefined}
                                selected={field.value ? {
                                    from: field.value.from ? new Date(field.value.from) : undefined,
                                    to: field.value.to ? new Date(field.value.to) : undefined
                                } : undefined}
                                onSelect={(range) => {
                                    if (range?.from) {
                                        // Set start date to 4 PM UTC (16:00 UTC)
                                        const fromDate = new Date(Date.UTC(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), 16, 0, 0));
                                        const fromISO = fromDate.toISOString();

                                        if (range.to) {
                                            // Set end date to 4 PM UTC (16:00 UTC)
                                            const toDate = new Date(Date.UTC(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), 16, 0, 0));
                                            const toISO = toDate.toISOString();
                                            field.onChange({ from: fromISO, to: toISO });
                                        } else {
                                            field.onChange({ from: fromISO, to: undefined });
                                        }
                                    } else {
                                        field.onChange(undefined);
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
