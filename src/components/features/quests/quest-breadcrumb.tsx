import { Link, useParams } from "@tanstack/react-router";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetQuestV1GuildsMeQuestsQuestIdGet } from "@/api/nexuscore/quests/quests.ts";

interface QuestBreadcrumbProps {
    /** Adds a trailing crumb after the quest title, e.g. "Edit". */
    suffix?: string;
}

/**
 * Admin header trail: Quests / <title> [/ suffix].
 * Reads the quest from the shared query cache, so it never costs an extra request.
 */
export function QuestBreadcrumb({ suffix }: QuestBreadcrumbProps) {
    const { id } = useParams({ strict: false }) as { id?: string };
    const isNew = !id || id === "new";
    const { data } = useGetQuestV1GuildsMeQuestsQuestIdGet(isNew ? 0 : Number(id), {
        query: { enabled: !isNew },
    });

    const title = isNew ? "New quest" : (data?.title ?? "…");
    const titleClass = "max-w-[32ch] truncate";

    return (
        <Breadcrumb>
            <BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-1.5">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/admin/quests" search={{}}>Quests</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {suffix && !isNew ? (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className={titleClass}>
                                <Link to="/admin/quests/$id" params={{ id: id! }}>{title}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-semibold">{suffix}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className={`${titleClass} font-semibold`}>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
