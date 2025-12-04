import { createFileRoute } from '@tanstack/react-router'
import {PageHeader} from "@/components/features/page-header.tsx";
import { CalendarIcon } from "@phosphor-icons/react";

export const Route = createFileRoute('/_main/events')({
  component: Events,
})

function Events() {
    return (
        <section className="mx-5 grid items-center gap-6 pt-6 md:mx-10 xl:mx-20">
            <PageHeader
                icon={CalendarIcon}
                title="Events"
                description="Discover what's happening on Everthorn!"
                gradient={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Events' }
                ]}
            />
        </section>
    )
}
