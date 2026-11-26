import { createFileRoute } from '@tanstack/react-router'
import { useGetQuestV1GuildsMeQuestsQuestIdGet } from '@/api/nexuscore/quests/quests'
import { QuestBreadcrumb } from '@/components/features/quests/quest-breadcrumb'
import { QuestSubpageHeader } from '@/components/features/quests/hub/quest-subpage-header'
import { QuestProgressEditor } from '@/components/features/quests/users/quest-progress-editor'
import { Skeleton } from '@/components/ui/skeleton'
import { getPreviewPlayer } from '@/lib/quest-progress-preview'

export const Route = createFileRoute('/admin/quests/$id/users/$thornyId')({
    staticData: {
        pageTitle: <QuestBreadcrumb suffix="Progress" />,
    },
    component: QuestUserPage,
})

function QuestUserPage() {
    const { id, thornyId } = Route.useParams()
    const questQuery = useGetQuestV1GuildsMeQuestsQuestIdGet(parseInt(id, 10))
    const quest = questQuery.data

    if (questQuery.isError) {
        return (
            <div className="p-6 text-sm font-light text-muted-foreground">
                Couldn't load this quest. Try refreshing the page.
            </div>
        )
    }

    if (!quest) {
        return (
            <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-40 w-full max-w-4xl" />
            </div>
        )
    }

    const player = getPreviewPlayer(quest, Number(thornyId))

    if (!player) {
        return (
            <div className="flex flex-col">
                <QuestSubpageHeader questId={id} eyebrow="Player progress" title="Unknown player" />
                <p className="p-6 text-sm font-light text-muted-foreground">
                    This player isn't in the preview data for this quest.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <QuestSubpageHeader
                questId={id}
                eyebrow="Player progress"
                title={player.username}
                description={player.gamertag ?? player.role}
            />
            <div className="px-6 py-6">
                <QuestProgressEditor quest={quest} player={player} />
            </div>
        </div>
    )
}
