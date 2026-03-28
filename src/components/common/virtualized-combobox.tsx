import * as React from "react"
import { CheckIcon, PlusIcon, WarningIcon } from "@phosphor-icons/react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { cn } from "@/lib/utils.ts"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { Separator } from "@/components/ui/separator.tsx"

const textures = await import(`minecraft-textures/dist/textures/json/1.21.11.id.json`);

export interface VirtualizedComboboxOption {
    value: string
    label: string
    searchTerms?: string[]
    disabled?: boolean
}

interface VirtualizedComboboxProps
    extends Omit<React.ComponentProps<typeof ComboboxInput>, "value"> {
    value?: string
    onValueChange: (value: string) => void
    options: string[] | VirtualizedComboboxOption[]
    placeholder?: string
    searchPlaceholder?: string
    allowCustom?: boolean
}

function hasNamespace(value: string): boolean {
    return value.includes(":")
}

function normalizeToId(input: string): string {
    return input.toLowerCase().trim().replace(/\s+/g, "_")
}

function formatLabel(value: string): string {
    return value.replace(/^[^:]+:/, "").replaceAll("_", " ")
}

function normalizeOptions(options: string[] | VirtualizedComboboxOption[]): VirtualizedComboboxOption[] {
    return options.map((option) =>
        typeof option === "string"
            ? { value: option, label: formatLabel(option) }
            : option
    )
}

export function VirtualizedCombobox({
    value = "",
    onValueChange,
    options,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    allowCustom = false,
    disabled = false,
    className,
    ...rest
}: VirtualizedComboboxProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchVersion, setSearchVersion] = React.useState(0)
    const searchRef = React.useRef("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const normalizedOptions = React.useMemo(() => normalizeOptions(options), [options])

    const filteredOptions = React.useMemo(() => {
        // searchVersion ensures recalculation on each keystroke
        void searchVersion
        const search = searchRef.current
        if (!search.trim()) return normalizedOptions
        const words = search.trim().toLowerCase().split(/\s+/)
        return normalizedOptions.filter((option) => {
            const text = [option.value, option.label, ...(option.searchTerms || [])]
                .join(" ")
                .toLowerCase()
            return words.every((word) => text.includes(word))
        })
    }, [normalizedOptions, searchVersion])

    const customOptions = React.useMemo(() => {
        void searchVersion
        const search = searchRef.current
        if (!allowCustom || !search.trim() || filteredOptions.length > 0) return []

        const trimmed = search.trim()
        if (hasNamespace(trimmed)) {
            const [ns, path] = trimmed.split(":")
            const normalized = `${ns.toLowerCase()}:${normalizeToId(path)}`
            if (normalizedOptions.some((opt) => opt.value === normalized)) return []
            return [{ value: normalized, label: formatLabel(normalized) }]
        }

        return ["minecraft", "amethyst"].map((ns) => ({
            value: `${ns}:${normalizeToId(trimmed)}`,
            label: formatLabel(`${ns}:${normalizeToId(trimmed)}`),
        }))
    }, [allowCustom, filteredOptions.length, normalizedOptions, searchVersion])

    const selectedOption = React.useMemo(
        () => (value ? normalizedOptions.find((opt) => opt.value === value) : null),
        [value, normalizedOptions]
    )

    const handleSelect = React.useCallback(
        (itemValue: string | null) => {
            if (!itemValue) return
            const option = normalizedOptions.find((opt) => opt.value === itemValue)
            if (option?.disabled) return
            onValueChange(itemValue === value ? "" : itemValue)
            setIsOpen(false)
        },
        [value, onValueChange, normalizedOptions]
    )

    const handleOpenChange = React.useCallback((open: boolean) => {
        setIsOpen(open)
        if (open) {
            searchRef.current = ""
            setSearchVersion((v) => v + 1)
            requestAnimationFrame(() => {
                if (inputRef.current) inputRef.current.value = ""
            })
        }
    }, [])

    const handleInputValueChange = React.useCallback((inputValue: string) => {
        searchRef.current = inputValue
        setSearchVersion((v) => v + 1)
    }, [])

    const textureUrl = value
        ? (textures as any).items?.[value]?.texture ?? null
        : null

    return (
        <Combobox
            open={isOpen}
            onOpenChange={handleOpenChange}
            onInputValueChange={handleInputValueChange}
            value={value || null}
            onValueChange={handleSelect}
            items={normalizedOptions.map((opt) => opt.value)}
            itemToStringLabel={(val) =>
                normalizedOptions.find((opt) => opt.value === val)?.label ?? formatLabel(val)
            }
            filter={null}
            disabled={disabled}
        >
            <ComboboxInput
                ref={inputRef}
                placeholder={selectedOption?.label || placeholder}
                showClear
                showTrigger
                className={cn(
                    "w-full",
                    textureUrl && "pl-6",
                    className
                )}
                {...rest}
            >
                {textureUrl && (
                    <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                        <img
                            src={textureUrl}
                            alt=""
                            className="size-5 pixelated"
                        />
                    </div>
                )}
            </ComboboxInput>
            <ComboboxContent>
                {filteredOptions.length === 0 && customOptions.length === 0 ? (
                    <ComboboxEmpty>
                        {allowCustom
                            ? "No results found."
                            : "This item doesn't exist."
                        }
                    </ComboboxEmpty>
                ) : (
                    <ComboboxList className="overflow-visible max-h-none p-0">
                        {filteredOptions.length > 0 && (
                            <ComboboxGroup className="p-0">
                                <VirtualizedItems
                                    options={filteredOptions}
                                    selectedValue={value}
                                />
                            </ComboboxGroup>
                        )}
                        {allowCustom && customOptions.length > 0 && (
                            <>
                                <Separator className="my-1" />
                                <ComboboxGroup>
                                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                                        <WarningIcon className="size-3.5 text-muted-foreground" weight="fill" />
                                        <p className="text-xs text-muted-foreground">
                                            Not in the list — invalid IDs can break quests
                                        </p>
                                    </div>
                                    {customOptions.map((option) => (
                                        <ComboboxItem key={option.value} value={option.value}>
                                            <PlusIcon className="size-4 text-primary" />
                                            <span className="font-mono text-xs">{option.value}</span>
                                        </ComboboxItem>
                                    ))}
                                </ComboboxGroup>
                            </>
                        )}
                    </ComboboxList>
                )}
            </ComboboxContent>
        </Combobox>
    )
}

function VirtualizedItems({
    options,
    selectedValue,
}: {
    options: VirtualizedComboboxOption[]
    selectedValue: string
}) {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const [scrollElement, setScrollElement] = React.useState<HTMLElement | null>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            setScrollElement(
                scrollRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
                    ?? scrollRef.current
            )
        }
    }, [])

    const virtualizer = useVirtualizer({
        count: options.length,
        getScrollElement: () => scrollElement,
        estimateSize: () => 36,
        overscan: 5,
    })

    React.useEffect(() => {
        if (selectedValue && scrollElement) {
            const index = options.findIndex((opt) => opt.value === selectedValue)
            if (index !== -1) virtualizer.scrollToIndex(index, { align: "center" })
        }
    }, [selectedValue, scrollElement])

    const textureItems = (textures as any).items ?? {}

    return (
        <ScrollArea ref={scrollRef} className="h-[300px] p-1">
            <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const option = options[virtualRow.index]
                    if (!option) return null
                    const texture = textureItems[option.value]?.texture as string | undefined
                    return (
                        <div
                            key={option.value}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <ComboboxItem value={option.value} disabled={option.disabled}>
                                {texture ? (
                                    <img
                                        src={texture}
                                        alt=""
                                        className="size-5 pixelated shrink-0"
                                    />
                                ) : (
                                    <CheckIcon className="size-4 opacity-0 [[data-selected]>&]:opacity-100" />
                                )}
                                <span className="truncate capitalize">{option.label}</span>
                            </ComboboxItem>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
