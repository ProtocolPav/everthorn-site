import {createFileRoute} from '@tanstack/react-router'
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
    head: () => ({
        meta: [
            {
                property: 'og:title',
                content: `Everthorn Guidelines`,
            },
            {
                property: 'og:description',
                content: "Everything you need to know to get started on Everthorn!",
            },
            {
                property: 'og:image',
                content: `${import.meta.env.VITE_BASE_URL}/og/guidelines.png`,
            },
            {
                property: 'og:url',
                content: `${import.meta.env.VITE_BASE_URL}/guidelines`,
            },
            {
                name: 'twitter:title',
                content: `Everthorn Guidelines`
            },
            {
                name: 'twitter:description',
                content: "Everything you need to know to get started on Everthorn!"
            },
            {
                name: 'twitter:image',
                content: `${import.meta.env.VITE_BASE_URL}/og/guidelines.png`,
            },
            {
                name: 'twitter:url',
                content: `${import.meta.env.VITE_BASE_URL}/guidelines`,
            }
        ],
    }),
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
