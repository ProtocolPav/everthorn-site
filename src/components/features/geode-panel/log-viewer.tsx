import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommandBar } from "@/components/features/geode-panel/command-bar";
import { useLogStream } from "@/hooks/use-log-stream";
import { ArrowDownIcon, TrashIcon } from "@phosphor-icons/react";
import Convert from "ansi-to-html";

const GEODE_URL = import.meta.env.VITE_GEODE_URL;
const converter = new Convert({ escapeXML: true, newline: true });

async function sendCommand(cmd: string) {
    await fetch(`${GEODE_URL}/controls/command`, {
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

    return (
        <Card className="m-0 p-0 gap-0 lg:w-5/7 h-2/6 lg:h-2/3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/40 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Server Log
                    </span>
                    <Badge variant="secondary" className="text-xs tabular-nums px-1.5 py-0">
                        {lines.length}
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={clear}
                    title="Clear log"
                >
                    <TrashIcon size={14} />
                </Button>
            </div>

            <div className="relative flex-1 min-h-0">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-auto overflow-x-auto bg-[#0d0d0d] font-mono text-xs leading-5 px-3 py-2"
                >
                    {lines.length === 0 ? (
                        <span className="text-muted-foreground italic">Waiting for output…</span>
                    ) : (
                        lines.map((line, i) => (
                            <div
                                key={i}
                                className="whitespace-pre select-text"
                                dangerouslySetInnerHTML={{ __html: converter.toHtml(line) }}
                            />
                        ))
                    )}
                </div>

                {!following && (
                    <button
                        onClick={jumpToBottom}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg hover:bg-primary/90 transition"
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