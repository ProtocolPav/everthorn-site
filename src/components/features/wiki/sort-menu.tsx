import { SeamlessSelect } from "@/components/common/seamless-select";
import { WIKI_SORT_OPTIONS } from "@/config/wiki-options";
import type { WikiSearchState } from "@/hooks/use-wiki-search";

interface WikiSortMenuProps {
    activeSortBy: WikiSearchState["sortBy"];
    activeSortOrder: WikiSearchState["sortOrder"];
    onSortChange: (sortBy: WikiSearchState["sortBy"], sortOrder: WikiSearchState["sortOrder"]) => void;
}

export function WikiSortMenu({ activeSortBy, activeSortOrder, onSortChange }: WikiSortMenuProps) {
    // Find the currently active value to pass to the controlled input
    const activeOption = WIKI_SORT_OPTIONS.find(
        (o) => o.sortBy === activeSortBy && o.sortOrder === activeSortOrder
    );

    return (
        <SeamlessSelect
            value={activeOption?.value}
            options={WIKI_SORT_OPTIONS}
            placeholder="Sort by"
            className="w-[140px] border-input/50 bg-background/50 hover:bg-muted/50 shadow-sm"
            onValueChange={(val) => {
                const option = WIKI_SORT_OPTIONS.find((o) => o.value === val);
                if (option) {
                    onSortChange(option.sortBy, option.sortOrder);
                }
            }}
        />
    );
}
