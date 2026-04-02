import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SortAscendingIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { WIKI_SORT_OPTIONS } from "@/config/wiki-options";

interface WikiSortPopoverProps {
    activeSort: string;
    onSortChange: (sort: string) => void;
}

export function WikiSortPopover({ activeSort, onSortChange }: WikiSortPopoverProps) {
    const activeLabel = WIKI_SORT_OPTIONS.find((o) => o.value === activeSort)?.label;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <SortAscendingIcon className="size-3.5" />
                    {activeLabel}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-1" align="end" sideOffset={4}>
                {WIKI_SORT_OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        onClick={() => onSortChange(option.value)}
                        className={cn(
                            "flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                            activeSort === option.value
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
