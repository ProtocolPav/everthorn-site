import { createFileRoute } from "@tanstack/react-router";
import ServerOverview from "@/components/features/geode-panel/server-overview";
import LogViewerCard from "@/components/features/geode-panel/log-viewer";
import BackupList from "@/components/features/geode-panel/backups";
import { useServerStatus } from "@/hooks/use-info";

export const Route = createFileRoute("/admin/geode")({
    component: ControlPanelDashboard,
});

function ControlPanelDashboard() {
    const { status } = useServerStatus();
    const serverRunning = status === "started";

    return (
        <div className="grid grid-rows-[auto_1fr] gap-3 h-full p-4 overflow-hidden">
            <ServerOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
                <div className="lg:col-span-2 min-h-0">
                    <LogViewerCard />
                </div>
                <div className="min-h-0 h-110 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                    <BackupList serverRunning={serverRunning} />
                </div>
            </div>
        </div>
    );
}