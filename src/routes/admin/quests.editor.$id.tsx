import { createFileRoute } from '@tanstack/react-router'
import {QuestEditForm} from "@/components/features/quests/quest-edit-form.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {convertZodToApi} from "@/lib/quest-schema-conversion.ts";
import {
    useCreateQuestV1GuildsMeQuestsPost,
    useGetQuestV1GuildsMeQuestsQuestIdGet, usePartialUpdateQuestV1GuildsMeQuestsQuestIdPut
} from "@/api/nexuscore/quests/quests.ts";
import {QuestIn, QuestUpdate} from "@/api/nexuscore/model";

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
    const createQuest = useCreateQuestV1GuildsMeQuestsPost()

    const handleSubmit = async (value: QuestFormValues) => {
        const apiData = convertZodToApi(value)
        await createQuest.mutateAsync({
            data: apiData as QuestIn
        })
    }

    return (
        <div className={'p-4 sm:p-6 w-full'}>
            <QuestEditForm onSubmit={handleSubmit} quest={undefined} />
        </div>
    )
}

function EditQuestWrapper({ id }: { id: string }) {
    const { data: quest, isLoading } = useGetQuestV1GuildsMeQuestsQuestIdGet(Number(id))
    const updateQuest = usePartialUpdateQuestV1GuildsMeQuestsQuestIdPut()

    const handleSubmit = async (value: QuestFormValues) => {
        const apiData = convertZodToApi(value)
        await updateQuest.mutateAsync({
            questId: Number(id),
            data: apiData as QuestUpdate,
        })
    }

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className={'p-4 sm:p-6 w-full'}>
            <QuestEditForm onSubmit={handleSubmit} quest={quest} />
        </div>
    )
}

