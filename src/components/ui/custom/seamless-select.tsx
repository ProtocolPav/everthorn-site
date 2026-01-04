// components/ui/seamless-select.tsx
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CaretDownIcon } from "@phosphor-icons/react"

export interface SeamlessSelectOption {
    value: string
    label: string
    icon?: React.ElementType
    triggerClassName?: string
    iconClassName?: string
}

interface SeamlessSelectProps {
    value?: string | null
    onValueChange?: (value: string) => void
    options: SeamlessSelectOption[]
    placeholder?: string
    disabled?: boolean
    className?: string
    /** If true, shows a small chevron to hint it's a dropdown */
    showChevron?: boolean
}

export function SeamlessSelect({
                                   value,
                                   onValueChange,
                                   options,
                                   placeholder = "Select...",
                                   disabled,
                                   className,
                                   showChevron = false
                               }: SeamlessSelectProps) {
    const selectedOption = options.find(opt => opt.value === value)
    const Icon = selectedOption?.icon

    return (
        <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    // Base "Pill" Styles
                    "w-auto h-7 px-3 rounded-full shadow-sm transition-all duration-200",
                    "border-0 ring-1 ring-inset ring-border/50", // Subtle inner ring instead of heavy border
                    "bg-background hover:bg-accent/50 hover:ring-border", // Soft hover effect
                    "focus:ring-2 focus:ring-ring focus:ring-offset-0",

                    // Inject custom colors (background tints etc)
                    selectedOption?.triggerClassName,
                    className
                )}
            >
                <div className="flex items-center gap-2">
                    {/* Icon */}
                    {Icon && (
                        <Icon
                            weight="fill"
                            className={cn(
                                "w-3.5 h-3.5 shrink-0 opacity-90",
                                selectedOption?.iconClassName
                            )}
                        />
                    )}

                    {/* Label */}
                    <span className={cn(
                        "text-xs font-medium tracking-wide",
                        !selectedOption && "text-muted-foreground"
                    )}>
            {selectedOption?.label || placeholder}
          </span>

                    {/* Optional Micro-Chevron for UX hint */}
                    {showChevron && (
                        <CaretDownIcon className="w-3 h-3 text-muted-foreground/50 ml-1" />
                    )}
                </div>
            </SelectTrigger>

            <SelectContent
                align="start"
                className="min-w-[150px] p-1 shadow-xl border-border/60"
            >
                {options.map((option) => {
                    const OptionIcon = option.icon
                    return (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="rounded-md py-2 text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer my-0.5"
                        >
                            <div className="flex items-center gap-2.5">
                                {OptionIcon && (
                                    <OptionIcon
                                        weight={option.value === value ? "fill" : "regular"} // Fill icon if selected
                                        className={cn(
                                            "w-4 h-4",
                                            option.iconClassName
                                        )}
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
