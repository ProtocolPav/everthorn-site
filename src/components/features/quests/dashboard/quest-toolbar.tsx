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
] as const;

export const QUEST_SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name", label: "Name (A–Z)" },
    { value: "ending_soon", label: "Ending soonest" },
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
    const sort = state.sort ?? "newest";

    function toggleType(value: string, checked: boolean) {
        const next = checked ? [...types, value] : types.filter((t) => t !== value);
        onChange({ type: next.length ? next : undefined });
    }

    return (
        <div className="sticky top-0 z-10 -mx-6 border-b bg-background/80 px-6 py-2.5 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Tabs
                    value={state.lifecycle ?? "all"}
                    onValueChange={(v) => onChange({ lifecycle: v === "all" ? undefined : (v as QuestLifecycle) })}
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

                <div className="ml-auto flex w-full items-center gap-1.5 sm:w-auto">
                    <InputGroup className="sm:w-72">
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
                            <Button variant="outline" size="icon" className="relative shrink-0">
                                <FunnelSimpleIcon />
                                {types.length > 0 && (
                                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                        {types.length}
                                    </span>
                                )}
                                <span className="sr-only">Filter by quest type</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Quest type</DropdownMenuLabel>
                            {QUEST_TYPE_OPTIONS.map((opt) => (
                                <DropdownMenuCheckboxItem
                                    key={opt.value}
                                    checked={types.includes(opt.value)}
                                    onCheckedChange={(c) => toggleType(opt.value, c === true)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {opt.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <SortAscendingIcon />
                                <span className="sr-only">Sort quests</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onChange({ sort: v })}>
                                {QUEST_SORT_OPTIONS.map((opt) => (
                                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
