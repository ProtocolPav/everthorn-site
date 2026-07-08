import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { CommandBar } from "@/components/features/geode-panel/command-bar";
import { useLogStream } from "@/hooks/use-log-stream";
import { ArrowDownIcon, TrashIcon } from "@phosphor-icons/react";
import Convert from "ansi-to-html";

const converter = new Convert({
    escapeXML: true,
    newline: true,
    colors: {
        0:  "#4b5263",  // black → visible dark gray
        1:  "#e06c75",  // red → soft rose
        2:  "#98c379",  // green → sage green
        3:  "#e5c07b",  // yellow → warm amber
        4:  "#61afef",  // blue → sky blue
        5:  "#c678dd",  // magenta → soft violet
        6:  "#56b6c2",  // cyan → muted teal
        7:  "#abb2bf",  // white → light gray
        8:  "#636d83",  // bright black → medium gray
        9:  "#ef6b74",  // bright red
        10: "#b5e890",  // bright green
        11: "#f0d08a",  // bright yellow
        12: "#7ec4f7",  // bright blue
        13: "#d896f0",  // bright magenta
        14: "#7ec8d3",  // bright cyan
        15: "#d7dae0",  // bright white
    },
});

async function sendCommand(cmd: string) {
    await fetch(`/api/geode/controls/command`, {
        method: "POST",
        body: JSON.stringify({ command: cmd.replace("/", "") }),
        headers: { "Content-Type": "application/json" },
    });
}

export default function LogViewerCard() {
    const { lines, connected, clear } = useLogStream();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [following, setFollowing] = useState(true);
    const followingRef = useRef(true);

    useEffect(() => {
        followingRef.current = following;
    }, [following]);

    useEffect(() => {
        if (following && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, following]);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 8;
        if (atBottom !== followingRef.current) {
            setFollowing(atBottom);
        }
    }, []);

    function jumpToBottom() {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        setFollowing(true);
    }

    function handleClear() {
        clear();
    }

    return (
        <Card className="m-0 p-0 gap-0 w-full h-110 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-1.5 border-b bg-background/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Server Console
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={handleClear}
                    title="Clear log"
                >
                    <TrashIcon size={14} />
                </Button>
            </div>

            <div className="relative flex-1 min-h-0 max-h-96">
                <ScrollAreaPrimitive.Root className="relative h-full">
                    <ScrollAreaPrimitive.Viewport
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="h-full bg-[#0d0d0d] font-mono text-xs leading-5 px-3 py-2 [&_b]:font-bold [&_i]:italic [&_u]:underline focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
                    >
                        {lines.length === 0 ? (
                            <span className="text-muted-foreground italic">Waiting for output…</span>
                        ) : (
                            lines.map((line, i) => (
                                <div
                                    key={i}
                                    className="whitespace-pre-wrap select-text hover:bg-muted/80"
                                    onClick={(e) => {
                                        const range = document.createRange();
                                        range.selectNodeContents(e.target as Node);
                                        const selection = window.getSelection()!;
                                        selection.removeAllRanges();
                                        selection.addRange(range);
                                    }}
                                    dangerouslySetInnerHTML={{ __html: converter.toHtml(line) }}
                                />
                            ))
                        )}
                    </ScrollAreaPrimitive.Viewport>
                    <ScrollAreaPrimitive.ScrollAreaScrollbar
                        orientation="vertical"
                        className="flex touch-none p-px transition-colors select-none h-full w-2.5 border-l border-l-transparent"
                    >
                        <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
                    </ScrollAreaPrimitive.ScrollAreaScrollbar>
                    <ScrollAreaPrimitive.Corner />
                </ScrollAreaPrimitive.Root>

                {!following && (
                    <button
                        onClick={jumpToBottom}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 backdrop-blur-xs text-muted-foreground text-xs font-medium hover:bg-muted transition"
                    >
                        <ArrowDownIcon size={12} weight="bold" />
                        Jump to bottom
                    </button>
                )}
            </div>

            <CommandBar connected={connected} onSend={sendCommand} />
        </Card>
    );
}