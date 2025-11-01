"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuestList } from "@/hooks/use-quest-list";
import { usePageTitle } from "@/hooks/use-context";
import {
    PlusIcon,
    XCircleIcon,
    ArchiveIcon,
    ClockCountdownIcon,
    CalendarDotsIcon,
} from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {QuestsSection} from "@/components/features/quest_dashboard/quest-section";

export default function QuestsPage() {
    const { setTitle } = usePageTitle();
    const {
        quests,
        isLoading,
        isError,
    } = useQuestList();

    const [questTab, setQuestTab] = useState<"current" | "scheduled" | "past">("current");

    useEffect(() => {
        setTitle("Quests Dashboard");
    }, [setTitle]);

    if (isError) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <XCircleIcon size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Error Loading Quests</h2>
                    <p className="text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-3 h-full">
            <Card className="p-3">
                <Tabs value={questTab} onValueChange={(tab) => setQuestTab(tab as "current" | "scheduled" | "past")}>
                    <CardHeader className="p-0">
                        <div className="w-full">
                            <CardTitle className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                                <TabsList className="w-full sm:w-auto">
                                    <TabsTrigger value="current" className="flex-1 sm:flex-none">
                                        <CalendarDotsIcon size={20} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Current</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="scheduled" className="flex-1 sm:flex-none">
                                        <ClockCountdownIcon size={20} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Scheduled</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="past" className="flex-1 sm:flex-none">
                                        <ArchiveIcon size={20} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Past</span>
                                    </TabsTrigger>
                                </TabsList>

                                <Button size="sm" asChild className="w-full sm:w-auto">
                                    <Link href="/admin/quests/editor/new">
                                        <PlusIcon size={16} className="mr-2" />
                                        Create
                                    </Link>
                                </Button>
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <TabsContent value="current">
                        <QuestsSection
                            quests={quests}
                            isLoading={isLoading}
                            filterType="current"
                        />
                    </TabsContent>

                    <TabsContent value="scheduled">
                        <QuestsSection
                            quests={quests}
                            isLoading={isLoading}
                            filterType="scheduled"
                        />
                    </TabsContent>

                    <TabsContent value="past">
                        <QuestsSection
                            quests={quests}
                            isLoading={isLoading}
                            filterType="past"
                        />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
