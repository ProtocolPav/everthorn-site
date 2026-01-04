import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "@phosphor-icons/react"
import { format } from "date-fns"
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils.ts";

interface DatePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    disabled?: boolean
}

export function DatePicker({ date, setDate, disabled }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full h-8 px-2 text-left font-normal text-xs bg-background/50 border-border/50",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-70" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                />
            </PopoverContent>
        </Popover>
    )
}
