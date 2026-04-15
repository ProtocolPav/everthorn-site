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

    return (
        <div className="p-4 h-full">
            <div className="grid gap-3 h-full grid-cols-1 lg:grid-cols-3">
                <div className="col-span-full">
                    <ServerOverview />
                </div>
                <div className="lg:col-span-2">
                    <LogViewerCard />
                </div>
                <div className="lg:col-span-1">
                    <BackupList serverRunning={status === "started"} />
                </div>
            </div>
        </div>
    );
}