// components/ui/seamless-select.tsx
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CaretDownIcon } from "@phosphor-icons/react"

export interface SeamlessSelectOption {
    value: string
    label: string
    icon?: React.ElementType
    disabled?: boolean
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
    /** Show a small arrow? Default: true */
    showChevron?: boolean
}

export function SeamlessSelect({
                                   value,
                                   onValueChange,
                                   options,
                                   placeholder = "Select...",
                                   disabled,
                                   className,
                                   showChevron = true
                               }: SeamlessSelectProps) {
    const selectedOption = options.find(opt => opt.value === value)
    const Icon = selectedOption?.icon

    return (
        <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                // 1. [&>svg]:hidden removes the default ShadCN chevron
                // 2. We apply badge styles (height, padding, border) directly here
                className={cn(
                    "w-auto h-7 px-2.5 py-0.5 [&>svg]:hidden", // Reset layout, hide default icon
                    "rounded-md border text-xs font-semibold shadow-none", // Badge base styles
                    "focus:ring-0 focus:ring-offset-0 transition-colors", // Reset focus ring to be subtle if needed
                    "hover:opacity-80", // Simple hover effect

                    // Default styling if no config provided (Grey badge)
                    !selectedOption?.triggerClassName && "bg-secondary text-secondary-foreground border-transparent",

                    // Custom styling from config
                    selectedOption?.triggerClassName,
                    className
                )}
            >
                {/* We explicitly control the content inside. SelectValue is hidden but kept for a11y */}
                <span className="hidden"><SelectValue /></span>

                <div className="flex items-center gap-1.5">
                    {/* Icon */}
                    {Icon && (
                        <Icon
                            weight="fill"
                            className={cn(
                                "w-3.5 h-3.5 shrink-0",
                                selectedOption?.iconClassName
                            )}
                        />
                    )}

                    {/* Label */}
                    <span>
                {selectedOption?.label || placeholder}
            </span>

                    {/* Custom Chevron */}
                    {showChevron && (
                        <CaretDownIcon className="w-3 h-3 opacity-50" />
                    )}
                </div>
            </SelectTrigger>

            <SelectContent align="start" className="min-w-[140px]">
                {options.map((option) => {
                    const OptionIcon = option.icon
                    return (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            className="text-xs cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                {OptionIcon && (
                                    <OptionIcon
                                        weight={option.value === value ? "fill" : "regular"}
                                        className={cn("w-3.5 h-3.5 opacity-70", option.iconClassName)}
                                    />
                                )}
                                <span className={option.value === value ? "font-semibold" : "font-medium"}>
                    {option.label}
                </span>
                            </div>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
