import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { serverInfoQueryOptions, serverStatusQueryOptions } from "@/hooks/use-info";

type ServerAction = "start" | "stop" | "restart" | "kill";

const ACTION_ENDPOINTS: Record<ServerAction, string> = {
    start:   `/api/geode/controls/start`,
    stop:    `/api/geode/controls/stop`,
    restart: `/api/geode/controls/restart`,
    kill:    `/api/geode/controls/kill`,
};

const ACTION_EXPECTED_STATE: Record<ServerAction, string> = {
    start:   "started",
    stop:    "stopped",
    restart: "started",
    kill:    "stopped",
};

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS  = 120_000;

export function useServerControls() {
    const queryClient = useQueryClient();
    const [pendingAction, setPendingAction] = useState<ServerAction | null>(null);

    async function triggerAction(action: ServerAction) {
        setPendingAction(action);

        await fetch(ACTION_ENDPOINTS[action], { method: "POST" });

        const expectedState = ACTION_EXPECTED_STATE[action];
        let pollInterval: ReturnType<typeof setInterval> | null = null;

        const stop = () => {
            if (pollInterval) clearInterval(pollInterval);
            setPendingAction(null);
        };

        const poll = async () => {
            try {
                const res  = await fetch(`/api/geode/info/status`);
                const data = await res.json();
                if (data.status === expectedState) {
                    queryClient.invalidateQueries({ queryKey: serverInfoQueryOptions.queryKey });
                    queryClient.invalidateQueries({ queryKey: serverStatusQueryOptions.queryKey });
                    stop();
                }
            } catch {
                // keep polling — transient network error during restart is expected
            }
        };

        pollInterval = setInterval(poll, POLL_INTERVAL_MS);
        setTimeout(stop, POLL_TIMEOUT_MS);
    }

    return {
        triggerAction,
        pendingAction,
        isLoading: pendingAction !== null,
    };
}