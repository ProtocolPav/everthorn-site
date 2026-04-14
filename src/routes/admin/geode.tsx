import { createFileRoute } from "@tanstack/react-router";
import { HardDrivesIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="grid gap-3 h-full">
            <Tabs defaultValue="main">
                <div className="flex justify-end items-center">
                    <TabsList>
                        <TabsTrigger value="main"><SquaresFourIcon /></TabsTrigger>
                        <TabsTrigger value="backups"><HardDrivesIcon /></TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="main" className="flex flex-col gap-2">
                    <ServerOverview />
                    <LogViewerCard />
                </TabsContent>

                <TabsContent value="backups" className="flex flex-col gap-2">
                    <BackupList serverRunning={status === "started"} />
                </TabsContent>
            </Tabs>
        </div>
    );
}