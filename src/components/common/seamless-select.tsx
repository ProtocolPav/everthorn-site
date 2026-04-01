// components/ui/seamless-select.tsx
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx"
import { cn } from "@/lib/utils.ts"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export interface SeamlessSelectOption {
    value: string
    label: string
    icon?: React.ElementType
    disabled?: boolean
    info?: string
    /** Tailwind classes to style the trigger like a badge (bg, text, border) */
    triggerClassName?: string
    iconClassName?: string
}

interface SeamlessSelectProps {
    value?: string | null
    onValueChange: (value: string) => void
    options: SeamlessSelectOption[]
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function SeamlessSelect({
                                   value,
                                   onValueChange,
                                   options,
                                   placeholder = "Select...",
                                   disabled,
                                   className
                               }: SeamlessSelectProps) {
    const selectedOption = options.find(opt => opt.value === value)

    return (
        <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    "w-auto h-7 px-2.5 py-0.5", // Reset layout, hide default icon
                    "rounded-md border text-xs font-medium shadow-none", // Badge base styles
                    "focus:ring-0 focus:ring-offset-0 transition-colors", // Reset focus ring to be subtle if needed

                    // Custom styling from config
                    selectedOption?.triggerClassName,
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent position={'item-aligned'} align="start" className="min-w-[140px]">
                {options.map((option) => {
                    const OptionIcon = option.icon
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                    className="text-xs cursor-pointer"
                                >
                                    <div className="flex w-full items-center justify-between gap-2">
                                        {OptionIcon && (
                                            <OptionIcon
                                                weight={option.value === value ? "fill" : "regular"}
                                                className={cn("w-3.5 h-3.5 opacity-70", option.iconClassName)}
                                            />
                                        )}
                                        {option.label}
                                    </div>
                                </SelectItem>
                            </TooltipTrigger>

                            {option.info && (
                                <TooltipContent side="right">
                                    {option.info}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
