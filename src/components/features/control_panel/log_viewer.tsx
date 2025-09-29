import { useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { LazyLog } from "@melloware/react-logviewer";
import { FunnelIcon, ArrowArcLeftIcon, ArrowArcRightIcon } from "@phosphor-icons/react";
import {CommandBar} from "@/components/features/control_panel/command_bar";

export default function LogViewerCard({ connected, onSend }: { connected: boolean; onSend: (cmd: string) => void }) {
    const [follow, setFollow] = useState(true);

    function handleScroll({ scrollTop, scrollHeight, clientHeight }:
                          { scrollTop: number; scrollHeight: number , clientHeight: number }) {
        const isAtBottom = scrollHeight - scrollTop - clientHeight <= 2;
        setFollow(isAtBottom);
    }

    return (
        <Card className="m-0 p-0 gap-0 lg:w-5/7 h-2/6 lg:h-2/3 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
                <LazyLog
                    lineClassName="whitespace-pre"
                    iconFilterLines={<FunnelIcon weight={"fill"} size={20} />}
                    iconFindNext={<ArrowArcRightIcon weight={"fill"} size={20} />}
                    iconFindPrevious={<ArrowArcLeftIcon weight={"fill"} size={20} />}
                    enableLinks={true}
                    enableSearch={false}
                    enableSearchNavigation={true}
                    selectableLines={true}
                    enableLineNumbers={false}
                    enableGutters={true}
                    eventsource={true}
                    eventsourceOptions={{ reconnect: true }}
                    url="/amethyst/controls/logs"
                    follow={follow}
                    wrapLines={true}
                    overscanRowCount={200}
                    onScroll={handleScroll}
                />
            </div>
            <CommandBar connected={connected} onSend={onSend} />
        </Card>
    );
}
