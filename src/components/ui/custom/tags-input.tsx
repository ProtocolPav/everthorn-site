import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag, useTags } from "@/hooks/use-tags";
import {Button} from "@/components/ui/button.tsx";

interface TagsInputProps {
    maxTags: number;
    onChange: (tags: Tag[]) => void;
    className?: string;
    suggestions?: string[];
    defaultTags?: string[]
}

export function TagsInput({maxTags, onChange, className, defaultTags = [], suggestions = []}: TagsInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { tags, addTag, removeTag, removeLastTag, hasReachedMax } = useTags({
        maxTags: maxTags,
        onChange: (tags) => onChange(tags),
        defaultTags: defaultTags.map(
            (t) => ({id: t.toLowerCase(), label: t})
        )
    });

    const suggestions_map = suggestions.map(
        (s) => ({id: s.toLowerCase(), label: s})
    );

    const availableSuggestions = suggestions_map.filter(
        (suggestion) => !tags.find(t => t.id === suggestion.id)
    );

    const showSuggestionsDropdown = showSuggestions && availableSuggestions.length > 0 && !hasReachedMax;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !inputValue) {
            e.preventDefault();
            removeLastTag();
        }
        if (e.key === "Enter" && inputValue) {
            e.preventDefault();
            addTag({ id: inputValue.toLowerCase(), label: inputValue });
            setInputValue("");
        }
        if (e.key === "Escape") {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    const handleSuggestionClick = (suggestion: {id: string; label: string}) => {
        addTag(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full relative rounded-lg border border-input bg-background p-1.5 transition-all",
                showSuggestionsDropdown && "rounded-b-none",
                className
            )}
        >
            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                    <span
                        key={tag.id}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                            tag.color || "bg-primary/10 text-primary hover:bg-primary/15"
                        )}
                    >
                        {tag.label}
                        <button
                            onClick={() => removeTag(tag.id)}
                            className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                            aria-label={`Remove ${tag.label}`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={hasReachedMax ? "Max tags reached" : "Add tag..."}
                    disabled={hasReachedMax}
                    className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed min-w-[120px]"
                />
            </div>

            {showSuggestionsDropdown && (
                <div className="absolute -left-px -right-px top-full z-50 border border-input border-t-transparent bg-muted p-1.5 rounded-b-lg shadow-lg animate-in slide-in-from-top-1 duration-200">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                        Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availableSuggestions.map((suggestion) => (
                            <Button
                                variant={'outline'}
                                size={'sm'}
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
