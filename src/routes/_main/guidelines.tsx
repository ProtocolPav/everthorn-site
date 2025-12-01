import { createFileRoute } from '@tanstack/react-router'
import {PageHeader} from "@/components/features/page-header.tsx";
import {BookIcon, WarningIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";
import {Accordion} from "@/components/ui/accordion.tsx";

export const Route = createFileRoute('/_main/guidelines')({
  component: Guidelines,
})

export default function Guidelines() {
    return (
        <section className="mx-5 grid items-center gap-6 pt-6 md:mx-10 md:pb-10 xl:mx-20">
            <PageHeader
                icon={BookIcon}
                title="Guidelines"
                description="Community rules and standards for a thriving server"
                gradient={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Guidelines' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Share
                        </Button>
                        <Button size="sm">
                            Edit
                        </Button>
                    </div>
                }
            />

            <Accordion defaultValue={'getting-started'} type="single" collapsible className="w-full space-y-2">
                {/*<ConnectionRules/>*/}
                {/*<ServerRules/>*/}
                {/*<ProjectRules/>*/}
                {/*<DiscordRules/>*/}
                {/*<EventsRules/>*/}
                {/*<ServerAddons/>*/}
            </Accordion>

            <div className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/20 px-2 mb-2 py-1.5 sm:px-3 sm:py-2 rounded-sm border">
                <WarningIcon weight={'duotone'} className="size-3 sm:size-4 text-amber-500 mt-0.5 flex-shrink-0"/>
                <span className="leading-tight">
                <strong className="text-foreground">Note:</strong> These rules are strictly enforced.
                Violations may result in removal from the community.
              </span>
            </div>
        </section>
    )
}
