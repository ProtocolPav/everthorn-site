import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "@phosphor-icons/react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"

interface DateTimeRange {
    start: Date | undefined
    end: Date | undefined
}

interface DateTimeRangePickerProps {
    value: DateTimeRange
    onChange: (value: DateTimeRange) => void
    disabled?: boolean
}

export function DateTimeRangePicker({ value, onChange, disabled }: DateTimeRangePickerProps) {
    // Initialize state from props
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: value.start,
        to: value.end,
    })
    const [startTime, setStartTime] = useState(value.start ? format(value.start, "HH:mm") : "00:00")
    const [endTime, setEndTime] = useState(value.end ? format(value.end, "HH:mm") : "23:59")

    // Helper to combine date and time and notify parent
    // We pass the new values directly to avoid stale state issues
    const triggerChange = (
        newDateRange: DateRange | undefined,
        newStartTime: string,
        newEndTime: string
    ) => {
        if (newDateRange?.from && newDateRange?.to) {
            const startDateTime = new Date(newDateRange.from)
            const [startHours, startMinutes] = newStartTime.split(":").map(Number)
            startDateTime.setHours(startHours, startMinutes)

            const endDateTime = new Date(newDateRange.to)
            const [endHours, endMinutes] = newEndTime.split(":").map(Number)
            endDateTime.setHours(endHours, endMinutes)

            onChange({ start: startDateTime, end: endDateTime })
        } else {
            onChange({ start: undefined, end: undefined })
        }
    }

    // Handle Calendar selection
    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range)
        triggerChange(range, startTime, endTime)
    }

    // Handle Start Time change
    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setStartTime(newTime)
        triggerChange(dateRange, newTime, endTime)
    }

    // Handle End Time change
    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setEndTime(newTime)
        triggerChange(dateRange, startTime, newTime)
    }

    // Sync internal state if external value prop changes (e.g. reset form)
    // We skip triggering onChange here to avoid loops
    useEffect(() => {
        setDateRange({ from: value.start, to: value.end })
        if (value.start) setStartTime(format(value.start, "HH:mm"))
        if (value.end) setEndTime(format(value.end, "HH:mm"))
    }, [value.start, value.end])

    const displayText = value.start && value.end
        ? `${format(value.start, "PPP HH:mm")} - ${format(value.end, "PPP HH:mm")}`
        : "Pick date and time range"

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full h-8 px-2 text-left font-normal text-xs bg-background/50 border-border/50",
                        !value.start && !value.end && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-70" />
                    {displayText}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                        className="p-3 pointer-events-auto"
                    />
                    <div className="flex gap-4 mt-4">
                        <div className="flex-1">
                            <Label htmlFor="start-time" className="text-xs">Start Time</Label>
                            <Input
                                id="start-time"
                                type="time"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="end-time" className="text-xs">End Time</Label>
                            <Input
                                id="end-time"
                                type="time"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                className="mt-1"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
