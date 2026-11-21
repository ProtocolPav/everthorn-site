import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";

export function CommandBar({
                               connected,
                               onSend,
                           }: {
    connected: boolean;
    onSend: (command: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const val = inputRef.current?.value?.trim();
        if (val) {
            onSend(val);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center border-t p-2 gap-2 bg-background/50 backdrop-blur-sm"
            autoComplete="off"
        >
            <Input
                ref={inputRef}
                placeholder={connected ? "Type a command..." : "Not connected..."}
                className="w-full rounded-lg bg-muted px-3 py-2 text-sm border-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={!connected}
                autoComplete="off"
            />
            <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={!connected}
            >
                <PaperPlaneTiltIcon weight="fill" size={18} />
            </Button>
            <div className="ml-auto flex items-center gap-1 select-none">
                <svg width="22" height="9" aria-hidden>
                    <rect x="2" y="2" width="3" height="5" rx="1.5" fill={connected ? "#4ade80" : "#e5e7eb"}>
                        <animate attributeName="height" values={connected ? "5;9;5" : "5;5;5"} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="y" values={connected ? "2;0;2" : "2;2;2"} dur="1.5s" repeatCount="indefinite" />
                    </rect>
                    <rect x="8" y="2" width="3" height="5" rx="1.5" fill={connected ? "#4ade80" : "#e5e7eb"}>
                        <animate attributeName="height" values={connected ? "5;2;5" : "5;5;5"} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="y" values={connected ? "2;6;2" : "2;2;2"} dur="1.5s" repeatCount="indefinite" />
                    </rect>
                    <rect x="14" y="2" width="3" height="5" rx="1.5" fill={connected ? "#4ade80" : "#e5e7eb"}>
                        <animate attributeName="height" values={connected ? "5;8;5" : "5;5;5"} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="y" values={connected ? "2;1;2" : "2;2;2"} dur="1.5s" repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>
        </form>
    );
}