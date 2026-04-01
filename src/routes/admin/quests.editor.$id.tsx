import { createFileRoute } from '@tanstack/react-router'
import {useCreateQuest, useQuest} from "@/hooks/use-quests.ts";
import {QuestEditForm} from "@/components/features/quests/quest-edit-form.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {convertZodToApi} from "@/lib/quest-schema-conversion.ts";

export const Route = createFileRoute('/admin/quests/editor/$id')({
    component: RouteComponent,
    staticData: {
        pageTitle: "Quest Editor",
    },
})

function RouteComponent() {
    const { id } = Route.useParams()
    const isNewQuest = !id || id === 'new'

    if (isNewQuest) {
        return <CreateQuestForm />
    }

    return <EditQuestWrapper id={id} />
}

function CreateQuestForm() {
    const createQuest = useCreateQuest()

    const handleSubmit = async (value: QuestFormValues) => {
        const apiData = convertZodToApi(value)
        await createQuest.mutateAsync(apiData)
    }

    return (
        <div className={'p-4 sm:p-6 w-full'}>
            <QuestEditForm onSubmit={handleSubmit} quest={undefined} />
        </div>
    )
}

function EditQuestWrapper({ id }: { id: string }) {
    const { data: quest, isLoading } = useQuest(id)

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className={'p-4 sm:p-6 w-full'}>
            <QuestEditForm onSubmit={async () => {}} quest={quest} />
        </div>
    )
}

