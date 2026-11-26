import { DefaultReactSuggestionItem, SuggestionMenuProps } from "@blocknote/react";
import { useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function CustomSlashMenu(props: SuggestionMenuProps<DefaultReactSuggestionItem>) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLDivElement>(null);

    const grouped = useMemo(() => {
        const groups = new Map<string, DefaultReactSuggestionItem[]>();
        for (const item of props.items) {
            const groupName = item.group ?? "Other";
            if (!groups.has(groupName)) groups.set(groupName, []);
            groups.get(groupName)!.push(item);
        }
        return Array.from(groups.entries());
    }, [props.items]);

    // Scroll the selected item into view whenever the keyboard index changes
    useEffect(() => {
        if (selectedItemRef.current && scrollContainerRef.current) {
            selectedItemRef.current.scrollIntoView({
                block: "nearest", // Scrolls just enough to show the item
                behavior: "auto"  // Instant snap (feels better for keyboard nav than smooth)
            });
        }
    }, [props.selectedIndex]);

    return (
        <div className="w-72 rounded-xl border border-border/50 bg-popover shadow-2xl backdrop-blur-md overflow-hidden flex flex-col">
            <div
                ref={scrollContainerRef}
                className="max-h-80 overflow-y-auto p-1 scroll-py-1"
            >
                {props.items.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No matching blocks
                    </div>
                ) : (
                    grouped.map(([groupName, items]) => (
                        <div key={groupName} className="mb-2 last:mb-0">
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                {groupName}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {items.map((item) => {
                                    const globalIndex = props.items.indexOf(item);
                                    const isSelected = globalIndex === props.selectedIndex;

                                    return (
                                        <div
                                            key={item.title}
                                            // Attach the ref ONLY if this is the currently selected item
                                            ref={isSelected ? selectedItemRef : null}
                                            onClick={() => props.onItemClick?.(item)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer transition-colors",
                                                isSelected
                                                    ? "bg-accent text-accent-foreground"
                                                    : "hover:bg-accent/50 text-foreground"
                                            )}
                                        >
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-foreground shadow-sm">
                                                {item.icon}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium truncate">
                                                    {item.title}
                                                </span>
                                                {item.subtext && (
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {item.subtext}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
