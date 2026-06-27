import { createFileRoute } from '@tanstack/react-router'
import {PageHeader} from "@/components/features/page-header.tsx";
import {BookIcon} from "@phosphor-icons/react";
import {Accordion} from "@/components/ui/accordion.tsx";
import ConnectionRules from "@/components/features/guidelines/connection.tsx";
import ServerRules from "@/components/features/guidelines/server.tsx";
import ProjectRules from "@/components/features/guidelines/projects.tsx";
import DiscordRules from "@/components/features/guidelines/discord.tsx";
import EventsRules from "@/components/features/guidelines/events.tsx";
import ServerAddons from "@/components/features/guidelines/addons.tsx";
import StrikesRules from "@/components/features/guidelines/strikes.tsx";

export const Route = createFileRoute('/_main/guidelines')({
  component: Guidelines,
})

function Guidelines() {
    return (
        <section className="mx-5 grid items-center gap-6 pt-6 md:mx-10 xl:mx-20">
            <PageHeader
                icon={BookIcon}
                title="Guidelines"
                description="Everything you need to know to get started on Everthorn!"
            />

            <Accordion defaultValue={'getting-started'} type="single" collapsible className="w-full space-y-2">
                <ConnectionRules/>
                <ServerRules/>
                <ProjectRules/>
                <DiscordRules/>
                <StrikesRules/>
                <EventsRules/>
                <ServerAddons/>
            </Accordion>
        </section>
    )
}
