import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SortAscendingIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { WIKI_SORT_OPTIONS } from "@/config/wiki-options";
import type { WikiSearchState } from "@/hooks/use-wiki-search";
import { useState } from "react";

interface WikiSortPopoverProps {
    activeSortBy: WikiSearchState["sortBy"];
    activeSortOrder: WikiSearchState["sortOrder"];
    onSortChange: (sortBy: WikiSearchState["sortBy"], sortOrder: WikiSearchState["sortOrder"]) => void;
}

export function WikiSortPopover({ activeSortBy, activeSortOrder, onSortChange }: WikiSortPopoverProps) {
    const activeOption = WIKI_SORT_OPTIONS.find(
        (o) => o.sortBy === activeSortBy && o.sortOrder === activeSortOrder
    );

    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <SortAscendingIcon className="size-3.5" />
                    {activeOption?.label ?? "Sort"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-1" align="end" sideOffset={4}>
                {WIKI_SORT_OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        onClick={() => {
                            onSortChange(option.sortBy, option.sortOrder)
                            setOpen(false)
                        }}
                        className={cn(
                            "flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                            option.value === activeOption?.value
                                ? "bg-primary/5 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {option.label}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
}
