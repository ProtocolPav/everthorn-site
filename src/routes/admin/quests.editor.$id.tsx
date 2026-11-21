import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {QuestEditForm} from "@/components/features/quests/quest-edit-form.tsx";
import {QuestBreadcrumb} from "@/components/features/quests/quest-breadcrumb.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {convertApiToZod, convertZodToApi} from "@/lib/quest-schema-conversion.ts";
import {
    useCreateQuestV1GuildsMeQuestsPost,
    useGetQuestV1GuildsMeQuestsQuestIdGet, usePartialUpdateQuestV1GuildsMeQuestsQuestIdPut
} from "@/api/nexuscore/quests/quests.ts";
import {QuestIn, QuestUpdate} from "@/api/nexuscore/model";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

const editorSearchSchema = z.object({
    /** When creating, prefill the new quest from this quest's data (Duplicate). */
    from: z.coerce.number().optional(),
})

export const Route = createFileRoute('/admin/quests/editor/$id')({
    component: RouteComponent,
    validateSearch: (search) => editorSearchSchema.parse(search),
    staticData: {
        pageTitle: <QuestBreadcrumb suffix="Edit" />,
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
    const { from } = Route.useSearch()

    if (from) {
        return <DuplicateQuestForm sourceId={from} />
    }

    return <NewQuestForm />
}

function NewQuestForm() {
    const createQuest = useCreateQuestV1GuildsMeQuestsPost()

    const handleSubmit = async (value: QuestFormValues) => {
        const apiData = convertZodToApi(value)
        return await createQuest.mutateAsync({
            data: apiData as QuestIn
        })
    }

    return (
        <div className={'p-4 sm:p-6 w-full'}>
            <QuestEditForm onSubmit={handleSubmit} quest={undefined} />
        </div>
    )
}

function DuplicateQuestForm({ sourceId }: { sourceId: number }) {
    const createQuest = useCreateQuestV1GuildsMeQuestsPost()
    const everthornMember = useEverthornMember()
    const { data: source, isLoading, isError } = useGetQuestV1GuildsMeQuestsQuestIdGet(sourceId)

    const handleSubmit = async (value: QuestFormValues) => {
        const apiData = convertZodToApi(value)
        return await createQuest.mutateAsync({
            data: apiData as QuestIn
        })
    }

    if (isLoading) {
        return <Spinner />
    }

    if (isError || !source) {
        return (
            <div className={'p-4 sm:p-6 w-full text-sm text-muted-foreground'}>
                Couldn't load the quest to duplicate.
            </div>
        )
    }

    const base = convertApiToZod(source)
    const defaultValues: QuestFormValues = {
        ...base,
        title: `${base.title} (Copy)`,
        created_by: everthornMember.thornyUser?.thorny_id ?? base.created_by,
        objectives: base.objectives.map((objective, index) => ({
            ...objective,
            objective_id: index,
            order_index: index,
        })),
    }

    return (
        <div className={'p-4 sm:p-6 w-full'}>
            <QuestEditForm onSubmit={handleSubmit} defaultValues={defaultValues} />
        </div>
    )
}

function EditQuestWrapper({ id }: { id: string }) {
    const { data: quest, isLoading } = useGetQuestV1GuildsMeQuestsQuestIdGet(Number(id))
    const updateQuest = usePartialUpdateQuestV1GuildsMeQuestsQuestIdPut()

    const handleSubmit = async (value: QuestFormValues) => {
        const apiData = convertZodToApi(value)
        return await updateQuest.mutateAsync({
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
