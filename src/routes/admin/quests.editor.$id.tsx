import { createFileRoute } from '@tanstack/react-router'
import {useQuest} from "@/hooks/use-quests.ts";
import {QuestEditForm} from "@/components/features/quests/quest-edit-form.tsx";

export const Route = createFileRoute('/admin/quests/editor/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { data: quest } = useQuest(id)

    return (
        <div className={'flex p-6 w-2/3'}>
            <QuestEditForm onSubmit={() => {}} quest={quest} />
        </div>
    )
}
