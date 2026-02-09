import { Calendar } from "@/components/ui/calendar.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { CalendarIcon } from "@phosphor-icons/react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"

export interface DateTimeRange {
    start: string | undefined
    end: string | undefined
}

interface Time {
    hours: number
    min?: number
}

interface DateTimeRangePickerProps {
    value: DateTimeRange
    onChange: (value: DateTimeRange) => void
    placeholder?: string
    defaultTime?: Time
    disabled?: boolean
}

export function DateTimeRangePicker(
    {
        value,
        onChange,
        disabled,
        placeholder,
        defaultTime
    }: DateTimeRangePickerProps
) {
    const getDefaultTime = () => {
        const d = new Date()
        defaultTime && d.setUTCHours(defaultTime.hours, defaultTime.min)
        return format(d, "HH:mm")
    }

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (value.start && value.end) {
            return {
                from: new Date(value.start),
                to: new Date(value.end)
            }
        }
        return undefined
    })

    const [startTime, setStartTime] = useState(() =>
        value.start ? format(new Date(value.start), "HH:mm") : getDefaultTime()
    )
    const [endTime, setEndTime] = useState(() =>
        value.end ? format(new Date(value.end), "HH:mm") : getDefaultTime()
    )

    const triggerChange = (
        newDateRange: DateRange | undefined,
        newStartTime: string,
        newEndTime: string
    ) => {
        if (newDateRange?.from && newDateRange?.to) {
            const startDateTime = new Date(newDateRange.from)
            const [startHours, startMinutes] = newStartTime.split(":").map(Number)
            startDateTime.setHours(startHours, startMinutes, 0, 0)

            const endDateTime = new Date(newDateRange.to)
            const [endHours, endMinutes] = newEndTime.split(":").map(Number)
            endDateTime.setHours(endHours, endMinutes, 0, 0)

            onChange({
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString()
            })
        } else {
            onChange({ start: undefined, end: undefined })
        }
    }

    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range)
        triggerChange(range, startTime, endTime)
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setStartTime(newTime)
        triggerChange(dateRange, newTime, endTime)
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setEndTime(newTime)
        triggerChange(dateRange, startTime, newTime)
    }

    useEffect(() => {
        if (value.start && value.end) {
            setDateRange({
                from: new Date(value.start),
                to: new Date(value.end)
            })
            setStartTime(format(new Date(value.start), "HH:mm"))
            setEndTime(format(new Date(value.end), "HH:mm"))
        } else {
            setDateRange(undefined)
            setStartTime(getDefaultTime())
            setEndTime(getDefaultTime())
        }
    }, [value.start, value.end])

    const displayText = value.start && value.end
        ? `${format(new Date(value.start), "PP HH:mm")} - ${format(new Date(value.end), "PP HH:mm")}`
        : placeholder
            ? placeholder
            : "Pick date and time range"

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={'text-xs'}
                >
                    <CalendarIcon className="opacity-70" />
                    {displayText}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateSelect}
                        numberOfMonths={1}
                        className="p-0 pointer-events-auto"
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
