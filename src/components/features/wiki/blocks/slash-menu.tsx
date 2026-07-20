import {
    DefaultReactSuggestionItem,
    SuggestionMenuProps,
} from "@blocknote/react";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandEmpty,
} from "@/components/ui/command";
import { useMemo } from "react";

export function CustomSlashMenu(props: SuggestionMenuProps<DefaultReactSuggestionItem>) {
    const grouped = useMemo(() => {
        const groups = new Map<string, DefaultReactSuggestionItem[]>();
        for (const item of props.items) {
            const groupName = item.group ?? "Other";
            if (!groups.has(groupName)) groups.set(groupName, []);
            groups.get(groupName)!.push(item);
        }
        return Array.from(groups.entries());
    }, [props.items]);

    return (
        <Command
            className="w-72 rounded-xl border border-border/50 bg-popover shadow-2xl backdrop-blur-md"
            shouldFilter={false}
        >
            <CommandList className="max-h-80">
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    No matching blocks
                </CommandEmpty>

                {grouped.map(([groupName, items]) => (
                    <CommandGroup
                        key={groupName}
                        heading={groupName}
                        className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                    >
                        {items.map((item) => {
                            const globalIndex = props.items.indexOf(item);
                            return (
                                <CommandItem
                                    key={item.title}
                                    onSelect={() => props.onItemClick?.(item)}
                                    data-selected={globalIndex === props.selectedIndex}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2 aria-selected:bg-accent data-[selected=true]:bg-accent cursor-pointer"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted text-foreground">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-foreground truncate">
                                            {item.title}
                                        </span>
                                        {item.subtext && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                {item.subtext}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                ))}
            </CommandList>
        </Command>
    );
}