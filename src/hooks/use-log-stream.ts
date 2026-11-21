import { useEffect, useRef, useState } from "react";

const MAX_LINES = 2000;

export function useLogStream() {
    const [lines, setLines] = useState<string[]>([]);
    const [connected, setConnected] = useState(false);
    const bufferRef = useRef("");

    useEffect(() => {
        const es = new EventSource(`/api/geode/controls/logs`);

        es.onopen = () => setConnected(true);
        es.onerror = () => setConnected(false);

        es.onmessage = (event) => {
            // Append incoming data to buffer, split on newlines
            bufferRef.current += event.data + "\n";
            const newLines = bufferRef.current.split("\n");
            // Keep last incomplete chunk in buffer
            bufferRef.current = newLines.pop() ?? "";

            setLines((prev) => {
                const next = [...prev, ...newLines.filter(Boolean)];
                // Trim to MAX_LINES from the tail
                return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
            });
        };

        return () => {
            es.close();
            setConnected(false);
        };
    }, []);

    const clear = () => setLines([]);

    return { lines, connected, clear };
}