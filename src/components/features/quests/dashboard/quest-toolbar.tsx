import { useEffect, useRef, useState } from "react";
import {
    FunnelSimpleIcon,
    MagnifyingGlassIcon,
    SortAscendingIcon,
    XIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { QuestLifecycle } from "@/lib/quest-lifecycle.ts";

export const QUEST_TYPE_OPTIONS = [
    { value: "story", label: "Story" },
    { value: "side", label: "Side" },
    { value: "minor", label: "Minor" },
    { value: "weekly", label: "Weekly" },
] as const;

export const QUEST_SORT_OPTIONS = [
    { value: "recommended", label: "Recommended" },
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "ending_soon", label: "Ending soonest" },
    { value: "name", label: "Name (A–Z)" },
] as const;

export interface QuestToolbarState {
    query?: string;
    lifecycle?: QuestLifecycle;
    type?: string[];
    sort?: string;
}

interface QuestToolbarProps {
    state: QuestToolbarState;
    counts: Record<QuestLifecycle | "all", number>;
    onChange: (updates: Partial<QuestToolbarState>) => void;
}

const TAB_LABELS: { value: QuestLifecycle | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "scheduled", label: "Scheduled" },
    { value: "expired", label: "Expired" },
];

function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function typeLabel(types: string[]) {
    if (types.length === 0) return "Type";
    if (types.length === 1) return QUEST_TYPE_OPTIONS.find((option) => option.value === types[0])?.label ?? "Type";
    return `${types.length} types`;
}

/**
 * Sticky browse bar. Search + type + sort on the first row (labels collapse to
 * icons on mobile), lifecycle tabs on the second. Filter state lives in the URL.
 */
export function QuestToolbar({ state, counts, onChange }: QuestToolbarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [localQuery, setLocalQuery] = useState(state.query ?? "");

    // Debounce typing into the URL.
    useEffect(() => {
        if (localQuery === (state.query ?? "")) return;
        const id = setTimeout(() => onChange({ query: localQuery || undefined }), 250);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localQuery]);

    // Follow external changes (clear filters, back button).
    useEffect(() => {
        setLocalQuery(state.query ?? "");
    }, [state.query]);

    // "/" jumps to search from anywhere on the page.
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
            e.preventDefault();
            inputRef.current?.focus();
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const types = state.type ?? [];
    const sort = state.sort ?? "recommended";
    const sortLabel = QUEST_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "Recommended";
    const hasFilters = !!state.query || !!state.lifecycle || types.length > 0 || sort !== "recommended";

    function toggleType(value: string, checked: boolean) {
        const next = checked ? [...types, value] : types.filter((type) => type !== value);
        onChange({ type: next.length ? next : undefined });
    }

    function clearAll() {
        setLocalQuery("");
        onChange({ query: undefined, lifecycle: undefined, type: undefined, sort: undefined });
    }

    return (
        <div className="sticky top-0 z-10 -mx-6 border-b bg-background/80 px-6 py-2 backdrop-blur-sm">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                    <InputGroup className="min-w-0 flex-1 md:max-w-sm">
                        <InputGroupInput
                            ref={inputRef}
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setLocalQuery("");
                                    onChange({ query: undefined });
                                    e.currentTarget.blur();
                                }
                            }}
                            placeholder="Search title, tag, description or ID"
                            aria-label="Search quests"
                        />
                        <InputGroupAddon>
                            <MagnifyingGlassIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {localQuery ? (
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="size-6"
                                    onClick={() => {
                                        setLocalQuery("");
                                        onChange({ query: undefined });
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <XIcon />
                                    <span className="sr-only">Clear search</span>
                                </Button>
                            ) : (
                                <Kbd className="hidden sm:inline-flex">/</Kbd>
                            )}
                        </InputGroupAddon>
                    </InputGroup>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 shrink-0 gap-1.5"
                                aria-label={
                                    types.length > 0 ? `Filter by type (${types.length} selected)` : "Filter by quest type"
                                }
                            >
                                <FunnelSimpleIcon />
                                <span className="hidden md:inline">{typeLabel(types)}</span>
                                {types.length > 0 && (
                                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground md:hidden">
                                        {types.length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Quest type</DropdownMenuLabel>
                            {QUEST_TYPE_OPTIONS.map((option) => (
                                <DropdownMenuCheckboxItem
                                    key={option.value}
                                    checked={types.includes(option.value)}
                                    onCheckedChange={(checked) => toggleType(option.value, checked === true)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {option.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 shrink-0 gap-1.5"
                                aria-label={`Sort quests (currently ${sortLabel})`}
                            >
                                <SortAscendingIcon />
                                <span className="hidden md:inline">{sortLabel}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sort} onValueChange={(value) => onChange({ sort: value })}>
                                {QUEST_SORT_OPTIONS.map((option) => (
                                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                                        {option.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    <Tabs
                        value={state.lifecycle ?? "all"}
                        onValueChange={(value) =>
                            onChange({ lifecycle: value === "all" ? undefined : (value as QuestLifecycle) })
                        }
                        className="min-w-0"
                    >
                        <TabsList className="max-w-full overflow-x-auto scrollbar-hide">
                            {TAB_LABELS.map(({ value, label }) => (
                                <TabsTrigger key={value} value={value} className="gap-1.5 px-2.5">
                                    {label}
                                    <span className="text-xs font-normal tabular-nums text-muted-foreground">
                                        {counts[value]}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="ml-auto shrink-0 text-muted-foreground"
                            onClick={clearAll}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
