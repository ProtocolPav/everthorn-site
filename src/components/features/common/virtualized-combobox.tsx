// components/ui/virtualized-combobox.tsx
import * as React from "react"
import { CaretUpDownIcon, CheckIcon, XIcon } from "@phosphor-icons/react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandInput,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface VirtualizedComboboxOption {
    value: string
    label: string
    /** Optional metadata for filtering/searching */
    searchTerms?: string[]
    /** Optional flag to disable specific options */
    disabled?: boolean
}

interface VirtualizedComboboxProps {
    /** Current selected value. Use empty string for no selection */
    value?: string
    /** Callback when value changes. Empty string means cleared */
    onValueChange: (value: string) => void
    /** Array of string values or option objects */
    options: string[] | VirtualizedComboboxOption[]
    /** Placeholder text when no value selected */
    placeholder?: string
    /** Search input placeholder */
    searchPlaceholder?: string
    /** Disable the entire combobox */
    disabled?: boolean
    /** Additional className for the trigger button */
    className?: string
    /** Custom formatter for string options. Defaults to removing "minecraft:" and replacing underscores */
    formatLabel?: (value: string) => string
    /** Show chevron icon on trigger. Default: true */
    showChevron?: boolean
    /** Show clear button when value is selected. Default: false */
    showClearButton?: boolean
    /** Virtualization threshold - only virtualize if options exceed this. Default: 100 */
    virtualizeThreshold?: number
    /** Empty state message. Default: "No results found." */
    emptyMessage?: string
    /** Height of the options list. Default: "280px" */
    listHeight?: string
}

export function VirtualizedCombobox({
                                        value = "",
                                        onValueChange,
                                        options,
                                        placeholder = "Select...",
                                        searchPlaceholder = "Search...",
                                        disabled = false,
                                        className,
                                        formatLabel,
                                        showChevron = true,
                                        showClearButton = false,
                                        virtualizeThreshold = 100,
                                        emptyMessage = "No results found.",
                                        listHeight = "280px",
                                    }: VirtualizedComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    // Normalize options to consistent format
    const normalizedOptions = React.useMemo((): VirtualizedComboboxOption[] => {
        return options.map((option) => {
            if (typeof option === "string") {
                const defaultLabel = formatLabel
                    ? formatLabel(option)
                    : option.replace(/^minecraft:/, "").replaceAll("_", " ")
                return {
                    value: option,
                    label: defaultLabel,
                    disabled: false,
                }
            }
            return {
                ...option,
                disabled: option.disabled ?? false,
            }
        })
    }, [options, formatLabel])

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
        if (!searchValue.trim()) return normalizedOptions

        const searchWords = searchValue.trim().toLowerCase().split(/\s+/)
        return normalizedOptions.filter((option) => {
            const searchableText = [
                option.value,
                option.label,
                ...(option.searchTerms || []),
            ]
                .join(" ")
                .toLowerCase()

            return searchWords.every((word) => searchableText.includes(word))
        })
    }, [normalizedOptions, searchValue])

    const selectedOption = normalizedOptions.find((opt) => opt.value === value)

    const handleSelect = React.useCallback(
        (selectedValue: string) => {
            const option = normalizedOptions.find((opt) => opt.value === selectedValue)
            if (option?.disabled) return

            // Toggle selection: if already selected, clear it
            const newValue = selectedValue === value ? "" : selectedValue
            onValueChange(newValue)
            setOpen(false)
        },
        [value, onValueChange, normalizedOptions]
    )

    const handleClear = React.useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            onValueChange("")
        },
        [onValueChange]
    )

    // Reset search when popover opens/closes
    React.useEffect(() => {
        if (!open) {
            setSearchValue("")
        }
    }, [open])

    const shouldVirtualize = filteredOptions.length > virtualizeThreshold
    const hasValue = Boolean(value)
    const hasResults = filteredOptions.length > 0

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-label={selectedOption?.label || placeholder}
                    className={cn(
                        "w-full justify-between font-normal",
                        !hasValue && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate capitalize">
                        {selectedOption?.label || placeholder}
                    </span>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                        {showClearButton && hasValue && !disabled && (
                            <div
                                role="button"
                                aria-label="Clear selection"
                                onClick={handleClear}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        handleClear(e as any)
                                    }
                                }}
                                className="rounded-sm opacity-70 hover:opacity-100 hover:bg-accent p-0.5 transition-opacity"
                            >
                                <XIcon className="h-3 w-3" />
                            </div>
                        )}
                        {showChevron && (
                            <CaretUpDownIcon className="h-4 w-4 opacity-50" />
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] min-w-[200px] max-w-[400px] p-0"
                align="start"
                sideOffset={4}
            >
                <Command shouldFilter={false} loop>
                    <CommandInput
                        value={searchValue}
                        onValueChange={setSearchValue}
                        placeholder={searchPlaceholder}
                    />
                    {!hasResults ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {emptyMessage}
                        </div>
                    ) : shouldVirtualize ? (
                        <VirtualizedItems
                            options={filteredOptions}
                            selectedValue={value}
                            onSelect={handleSelect}
                            listHeight={listHeight}
                        />
                    ) : (
                        <RegularItems
                            options={filteredOptions}
                            selectedValue={value}
                            onSelect={handleSelect}
                            listHeight={listHeight}
                        />
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}

// Shared item rendering logic
interface ItemContentProps {
    option: VirtualizedComboboxOption
    isSelected: boolean
    onSelect: (value: string) => void
}

const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
    ({ option, isSelected, onSelect }, ref) => {
        return (
            <div
                ref={ref}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                data-value={option.value}
                data-disabled={option.disabled}
                onClick={() => !option.disabled && onSelect(option.value)}
                onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !option.disabled) {
                        e.preventDefault()
                        onSelect(option.value)
                    }
                }}
                className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer",
                    "transition-colors duration-150 outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:bg-accent focus-visible:text-accent-foreground",
                    "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                    isSelected && "font-medium",
                    option.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
                tabIndex={option.disabled ? -1 : 0}
            >
                <CheckIcon
                    weight={isSelected ? "bold" : "regular"}
                    className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-150",
                        isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )}
                    aria-hidden="true"
                />
                <span className="truncate capitalize flex-1">{option.label}</span>
            </div>
        )
    }
)
ItemContent.displayName = "ItemContent"

// Non-virtualized list for small option sets
interface ItemsProps {
    options: VirtualizedComboboxOption[]
    selectedValue: string
    onSelect: (value: string) => void
    listHeight: string
}

function RegularItems({ options, selectedValue, onSelect, listHeight }: ItemsProps) {
    const selectedRef = React.useRef<HTMLDivElement>(null)

    // Scroll to selected item when list opens
    React.useEffect(() => {
        if (selectedValue && selectedRef.current) {
            selectedRef.current.scrollIntoView({
                block: "nearest",
            })
        }
    }, [selectedValue])

    return (
        <ScrollArea style={{ height: listHeight }}>
            <div className="p-1" role="listbox">
                {options.map((option) => {
                    const isSelected = selectedValue === option.value
                    return (
                        <ItemContent
                            key={option.value}
                            ref={isSelected ? selectedRef : undefined}
                            option={option}
                            isSelected={isSelected}
                            onSelect={onSelect}
                        />
                    )
                })}
            </div>
        </ScrollArea>
    )
}

// Virtualized list for large option sets
function VirtualizedItems({ options, selectedValue, onSelect, listHeight }: ItemsProps) {
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)
    const [scrollElement, setScrollElement] = React.useState<HTMLElement | null>(null)

    // Get scroll viewport element
    React.useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            ) as HTMLElement
            setScrollElement(viewport)
        }
    }, [])

    const virtualizer = useVirtualizer({
        count: options.length,
        getScrollElement: () => scrollElement,
        estimateSize: () => 36,
        overscan: 5,
    })

    // Scroll to selected item when list opens
    React.useEffect(() => {
        if (selectedValue && scrollElement) {
            const selectedIndex = options.findIndex((opt) => opt.value === selectedValue)
            if (selectedIndex !== -1) {
                virtualizer.scrollToIndex(selectedIndex, {
                    align: "center",
                    behavior: "auto",
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedValue, scrollElement])

    const items = virtualizer.getVirtualItems()

    return (
        <ScrollArea ref={scrollAreaRef} style={{ height: listHeight }}>
            <div className="p-1" role="listbox">
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {items.map((virtualItem) => {
                        const option = options[virtualItem.index]
                        if (!option) return null

                        const isSelected = selectedValue === option.value

                        return (
                            <div
                                key={option.value}
                                data-index={virtualItem.index}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <ItemContent
                                    ref={virtualizer.measureElement}
                                    option={option}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </ScrollArea>
    )
}
