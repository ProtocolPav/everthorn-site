// components/ui/seamless-select.tsx
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SeamlessSelectOption {
    value: string
    label: string
    icon?: React.ElementType
    /** Tailwind classes for the trigger (bg/border/text) when this option is selected */
    triggerClassName?: string
    /** Tailwind classes for the icon when this option is selected */
    iconClassName?: string
}

interface SeamlessSelectProps {
    value?: string | null
    onValueChange?: (value: string) => void
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
    // Find currently selected option object to access its specific styles
    const selectedOption = options.find(opt => opt.value === value)
    const Icon = selectedOption?.icon

    return (
        <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    // Base "Seamless" Styles
                    "w-auto h-7 px-2.5 rounded-full border border-dashed shadow-none",
                    "focus:ring-0 focus:ring-offset-0 gap-2 transition-all duration-200",
                    "hover:bg-accent/50 data-[state=open]:bg-accent",

                    // Dynamic Styles based on selection
                    selectedOption?.triggerClassName || "border-border bg-background text-foreground",
                    className
                )}
            >
                {/* Custom rendering to allow precise icon/text control */}
                <div className="flex items-center gap-1.5 truncate">
                    {Icon && (
                        <Icon
                            weight="fill"
                            className={cn(
                                "w-3.5 h-3.5 shrink-0",
                                selectedOption?.iconClassName || "text-muted-foreground"
                            )}
                        />
                    )}
                    <span className={cn("text-xs font-medium", !selectedOption && "text-muted-foreground")}>
            {selectedOption?.label || placeholder}
          </span>
                </div>
            </SelectTrigger>

            <SelectContent align="start">
                {options.map((option) => {
                    const OptionIcon = option.icon
                    return (
                        <SelectItem key={option.value} value={option.value} className="cursor-pointer text-xs">
                            <div className="flex items-center gap-2">
                                {OptionIcon && (
                                    <OptionIcon
                                        className={cn(
                                            "w-3.5 h-3.5",
                                            option.iconClassName || "text-muted-foreground"
                                        )}
                                    />
                                )}
                                <span>{option.label}</span>
                            </div>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
