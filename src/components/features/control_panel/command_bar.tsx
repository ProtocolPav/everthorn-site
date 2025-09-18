import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideSendHorizonal } from "lucide-react";

export function CommandBar({ connected, onSend }: { connected: boolean; onSend: (command: string) => void }) {
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
            className="flex items-center border-t px-3 py-2 gap-2 bg-background"
            autoComplete="off"
        >
            <Input
                ref={inputRef}
                placeholder="Type a command…"
                className="w-full rounded-lg bg-muted px-3 py-2 text-sm border-none focus:ring-2 focus:ring-blue-500 transition"
                autoComplete="off"
            />
            <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition focus:ring-2 focus:ring-blue-400"
            >
                <LucideSendHorizonal className="w-5 h-5" />
            </Button>
            {/* Minimal live stream waveform */}
            <div className="ml-auto flex items-center gap-2 select-none">
                {connected ? (
                    <span className="flex items-center gap-1">
            <svg width="22" height="9" className="mr-1" aria-hidden>
              <rect x="2" y="2" width="3" height="5" rx="1.5" fill="#4ade80">
                <animate attributeName="height" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="2;0;2" dur="1.5s" repeatCount="indefinite" />
              </rect>
              <rect x="8" y="2" width="3" height="5" rx="1.5" fill="#4ade80">
                <animate attributeName="height" values="5;2;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="2;6;2" dur="1.5s" repeatCount="indefinite" />
              </rect>
              <rect x="14" y="2" width="3" height="5" rx="1.5" fill="#4ade80">
                <animate attributeName="height" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="2;1;2" dur="1.5s" repeatCount="indefinite" />
              </rect>
            </svg>
            <span className="uppercase text-xs font-medium text-green-500 tracking-widest">LIVE</span>
          </span>
                ) : (
                    <span className="uppercase text-xs font-medium text-muted-foreground opacity-60 tracking-widest">OFFLINE</span>
                )}
            </div>
        </form>
    );
}
