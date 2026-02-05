// components/ui/virtualized-combobox.tsx
import * as React from "react"
import { CaretUpDownIcon, CheckIcon, XIcon, PlusIcon } from "@phosphor-icons/react"
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
    /** Allow creating custom options. Default: false */
    allowCustom?: boolean
    /** Default namespaces to suggest when creating custom options. Default: ["minecraft", "amethyst"] */
    customNamespaces?: string[]
}

/**
 * Checks if a string contains a namespace (has a colon)
 */
function hasNamespace(value: string): boolean {
    return value.includes(":")
}

/**
 * Normalizes search input to valid ID format (lowercase, underscores)
 */
function normalizeToId(input: string): string {
    return input.toLowerCase().trim().replace(/\s+/g, "_")
}

/**
 * Formats a value for display (removes namespace if present)
 */
function formatDisplayLabel(value: string, formatLabel?: (value: string) => string): string {
    if (formatLabel) return formatLabel(value)
    return value.replace(/^[^:]+:/, "").replaceAll("_", " ")
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
                                        allowCustom = false,
                                        customNamespaces = ["minecraft", "amethyst"],
                                    }: VirtualizedComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    // Normalize options to consistent format
    const normalizedOptions = React.useMemo((): VirtualizedComboboxOption[] => {
        return options.map((option) => {
            if (typeof option === "string") {
                const defaultLabel = formatDisplayLabel(option, formatLabel)
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

    // Generate custom option suggestions (only when no results)
    const customOptions = React.useMemo(() => {
        if (!allowCustom || !searchValue.trim() || filteredOptions.length > 0) return []

        const trimmedSearch = searchValue.trim()

        // If search already has a namespace, only show that exact custom option
        if (hasNamespace(trimmedSearch)) {
            const [namespace, path] = trimmedSearch.split(":")
            const normalizedPath = normalizeToId(path)
            const normalizedValue = `${namespace.toLowerCase()}:${normalizedPath}`

            // Don't suggest if it already exists
            const exists = normalizedOptions.some(opt => opt.value === normalizedValue)
            if (exists) return []

            return [{
                value: normalizedValue,
                label: formatDisplayLabel(normalizedValue, formatLabel),
                fullId: normalizedValue,
                isCustom: true,
            }]
        }

        // No namespace - suggest namespace variants
        const normalizedSearch = normalizeToId(trimmedSearch)
        const suggestions = customNamespaces.map(namespace => {
            const fullId = `${namespace}:${normalizedSearch}`
            return {
                value: fullId,
                label: formatDisplayLabel(fullId, formatLabel),
                fullId,
                namespace,
                isCustom: true,
            }
        })

        return suggestions
    }, [allowCustom, searchValue, filteredOptions.length, normalizedOptions, customNamespaces, formatLabel])

    // Find selected option - check both normalized options and custom values
    const selectedOption = React.useMemo(() => {
        if (!value) return null

        // First check normalized options
        const normalizedOption = normalizedOptions.find((opt) => opt.value === value)
        if (normalizedOption) return normalizedOption

        // If not found and value exists, it's a custom value
        if (value) {
            return {
                value,
                label: formatDisplayLabel(value, formatLabel),
                disabled: false,
            }
        }

        return null
    }, [value, normalizedOptions, formatLabel])

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
    const showCustomOptions = allowCustom && customOptions.length > 0

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
                    <span className="truncate min-w-0 flex-1 text-left capitalize">
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
                align="center"
                sideOffset={4}
            >
                <Command shouldFilter={false} loop>
                    <CommandInput
                        value={searchValue}
                        onValueChange={setSearchValue}
                        placeholder={searchPlaceholder}
                    />
                    {!hasResults && !showCustomOptions ? (
                        <div className="py-8 text-center text-sm">
                            <p className="text-muted-foreground mb-2">{emptyMessage}</p>
                            {allowCustom && (
                                <p className="text-xs text-muted-foreground/70">
                                    {hasNamespace(searchValue)
                                        ? "Click below to create this custom tag"
                                        : "Add a namespace to create custom tags (e.g., \"custom:tag\")"
                                    }
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            {hasResults && (
                                shouldVirtualize ? (
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
                                )
                            )}
                            {showCustomOptions && (
                                <CustomOptions
                                    options={customOptions}
                                    onSelect={handleSelect}
                                    searchHasNamespace={hasNamespace(searchValue)}
                                />
                            )}
                        </>
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
                <span className="truncate flex-1 min-w-0 capitalize">{option.label}</span>
            </div>
        )
    }
)
ItemContent.displayName = "ItemContent"

// Custom options section
interface CustomOptionsProps {
    options: Array<{
        value: string
        label: string
        fullId: string
        namespace?: string
        isCustom: boolean
    }>
    onSelect: (value: string) => void
    searchHasNamespace: boolean
}

function CustomOptions({ options, onSelect, searchHasNamespace }: CustomOptionsProps) {
    if (options.length === 0) return null

    return (
        <div className="p-1">
            {/* Warning header */}
            <div className="px-2 py-3 mb-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                    No items found
                </p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    The ID may not be loaded yet.
                    Create a custom one if you're certain it exists, but beware, invalid IDs can break quests.
                </p>
            </div>

            {/* Custom options */}
            <div className={'grid gap-1'}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        role="option"
                        onClick={() => onSelect(option.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                onSelect(option.value)
                            }
                        }}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-2 text-xs cursor-pointer",
                            "transition-colors duration-150 outline-none",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:bg-accent focus-visible:text-accent-foreground",
                            "border border-primary/30 bg-primary/5 font-mono"
                        )}
                        tabIndex={0}
                    >
                        <PlusIcon
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        <span className="flex-1 min-w-0 text-primary">
                        {option.fullId}
                    </span>
                    </div>
                ))}
            </div>

            {/* Helper text */}
            {!searchHasNamespace && (
                <div className="px-2 py-2 mt-1 text-xs text-muted-foreground/70">
                    Tip: Type a custom namespace (e.g., "mymod:item")
                </div>
            )}
        </div>
    )
}

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
