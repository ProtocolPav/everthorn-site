import { createFileRoute } from '@tanstack/react-router'
import {useQuest} from "@/hooks/use-quests.ts";
import {QuestEditForm} from "@/components/features/quests/quest-edit-form.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";

export const Route = createFileRoute('/admin/quests/editor/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const isNewQuest = !id || id === 'new'

    if (isNewQuest) {
        return (
            <div className={'flex p-6 w-2/3'}>
                <QuestEditForm onSubmit={() => {}} quest={null} />
            </div>
        )
    }

    return <EditQuestWrapper id={id} />
}

function EditQuestWrapper({ id }: { id: string }) {
    const { data: quest, isLoading } = useQuest(id)

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className={'flex p-6 w-2/3'}>
            <QuestEditForm onSubmit={() => {}} quest={quest} />
        </div>
    )
}

