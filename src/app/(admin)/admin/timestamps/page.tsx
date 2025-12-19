"use client"

import {useEffect, useState} from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Copy, RotateCcw, Check } from "lucide-react"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"
import {usePageTitle} from "@/hooks/use-context";

const TIMESTAMP_FORMATS = [
    { value: "t", label: "Short Time", color: "blue" },
    { value: "T", label: "Long Time", color: "cyan" },
    { value: "d", label: "Short Date", color: "violet" },
    { value: "D", label: "Long Date", color: "purple" },
    { value: "f", label: "Long Date with Short Time", color: "pink" },
    { value: "F", label: "Long Date with Day of Week and Short Time", color: "rose" },
    { value: "R", label: "Relative", color: "amber" },
]

export default function DiscordTimestampGenerator() {
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<string>(
        new Date().toTimeString().slice(0, 5)
    )
    const [dateTimeOpen, setDateTimeOpen] = useState(false)
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

    const getTimestamp = () => {
        const [hours, minutes] = time.split(":").map(Number)
        const dateTime = new Date(date)
        dateTime.setHours(hours, minutes, 0, 0)
        return Math.floor(dateTime.getTime() / 1000)
    }

    const getSelectedDateTime = () => {
        const [hours, minutes] = time.split(":").map(Number)
        const dateTime = new Date(date)
        dateTime.setHours(hours, minutes, 0, 0)
        return dateTime
    }

    const getFormattedPreview = (formatValue: string) => {
        const dateTime = getSelectedDateTime()

        switch (formatValue) {
            case "t":
                return format(dateTime, "HH:mm")
            case "T":
                return format(dateTime, "HH:mm:ss")
            case "d":
                return format(dateTime, "dd/MM/yyyy")
            case "D":
                return format(dateTime, "d MMMM yyyy")
            case "f":
                return format(dateTime, "d MMMM yyyy HH:mm")
            case "F":
                return format(dateTime, "EEEE, d MMMM yyyy HH:mm")
            case "R":
                return formatDistanceToNow(dateTime, { addSuffix: true })
            default:
                return ""
        }
    }

    const getDiscordCode = (formatValue: string) => {
        return `<t:${getTimestamp()}:${formatValue}>`
    }

    const handleCopy = async (formatValue: string) => {
        try {
            await navigator.clipboard.writeText(getDiscordCode(formatValue))
            setCopiedFormat(formatValue)
            toast.success("Copied to clipboard!")
            setTimeout(() => setCopiedFormat(null), 2000)
        } catch (err) {
            toast.error("Failed to copy")
        }
    }

    const handleReset = () => {
        const now = new Date()
        setDate(now)
        setTime(now.toTimeString().slice(0, 5))
    }

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            blue: "border-l-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
            cyan: "border-l-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/20",
            violet: "border-l-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/20",
            purple: "border-l-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20",
            pink: "border-l-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20",
            rose: "border-l-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20",
            amber: "border-l-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20",
        }
        return colors[color] || ""
    }

    const { setTitle } = usePageTitle();
    useEffect(() => {
        setTitle("Discord Timestamp Converter");
    }, [setTitle]);

    return (
        <div className="flex">
            {/* Main Card */}
            <div className="md:w-1/2 border rounded-lg bg-card overflow-hidden shadow-sm">
                {/* Date & Time Selector */}
                <div className="p-4 border-b bg-muted/30 flex gap-2">
                    <Popover open={dateTimeOpen} onOpenChange={setDateTimeOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex-1 justify-start text-left font-normal h-9"
                            >
                                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                <span className="truncate text-sm">
                                    {format(getSelectedDateTime(), "PPP p")}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => {
                                    if (newDate) {
                                        setDate(newDate)
                                    }
                                }}
                                initialFocus
                            />
                            <div className="p-3 border-t">
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value)
                                    }}
                                    className="h-8"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Reset Button */}
                    <Button
                        onClick={handleReset}
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Format List */}
                <div className="divide-y">
                    {TIMESTAMP_FORMATS.map((fmt) => (
                        <button
                            key={fmt.value}
                            onClick={() => handleCopy(fmt.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-l-2 ${getColorClasses(fmt.color)}`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm">
                                    {getFormattedPreview(fmt.value)}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                        {fmt.label}
                                    </span>
                                    <span className="text-muted-foreground/50">•</span>
                                    <code className="text-xs font-mono text-muted-foreground/70">
                                        {getDiscordCode(fmt.value)}
                                    </code>
                                </div>
                            </div>
                            <div className="shrink-0 relative w-4 h-4 overflow-visible">
                                <div className={`absolute inset-0 transition-all duration-300 ${
                                    copiedFormat === fmt.value
                                        ? 'scale-0 opacity-0 rotate-180'
                                        : 'scale-100 opacity-100 rotate-0'
                                }`}>
                                    <Copy className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className={`absolute inset-0 transition-all duration-300 ${
                                    copiedFormat === fmt.value
                                        ? 'scale-100 opacity-100 rotate-0'
                                        : 'scale-0 opacity-0 -rotate-180'
                                }`}>
                                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                {copiedFormat === fmt.value && (
                                    <div className="absolute inset-0 -z-10 rounded-full bg-green-500/20 animate-ping" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
