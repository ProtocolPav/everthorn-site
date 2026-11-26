import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { WarningCircleIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { DailyBreadcrumb } from '@/components/features/quests/daily/daily-breadcrumb'
import { TemplateEditForm } from '@/components/features/quests/daily/template-form/template-edit-form'
import {
    invalidateGetDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdGet,
    invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet,
    useCreateDailyTemplateV1GuildsMeQuestsDailyTemplatesPost,
    useGetDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdGet,
    useListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet,
    useUpdateDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdPatch,
} from '@/api/nexuscore/daily-quests/daily-quests.ts'
import { useEverthornMember } from '@/hooks/use-everthorn-member.ts'
import {
    formValuesToTemplate,
    newTemplateFormValues,
    templateToFormValues,
} from '@/lib/daily-template-conversion.ts'
import type { DailyTemplateFormValues } from '@/lib/schemas/daily-template-form.tsx'

export const Route = createFileRoute('/admin/quests/daily/templates/$templateId')({
    component: TemplateEditorPage,
    staticData: {
        pageTitle: <TemplateBreadcrumb />,
    },
})

/** Quests / Daily / Templates / <name> — reads the template from the shared query cache. */
function TemplateBreadcrumb() {
    const { templateId } = useParams({ strict: false }) as { templateId?: string }
    const isNew = !templateId || templateId === 'new'
    const { data } = useGetDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdGet(isNew ? 0 : Number(templateId), {
        query: { enabled: !isNew },
    })
    return <DailyBreadcrumb viaTemplates current={isNew ? 'New template' : (data?.name ?? '…')} />
}

/** Total weight of the other enabled templates, for the weight badge's share of days. */
function useOtherEnabledWeight(templateId: number | null): number {
    const { data: templates } = useListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet()
    return (templates ?? [])
        .filter((template) => (template.enabled ?? true) && template.template_id !== templateId)
        .reduce((sum, template) => sum + (template.weight ?? 1), 0)
}

function TemplateEditorPage() {
    const { templateId } = Route.useParams()
    return templateId === 'new' ? <NewTemplate /> : <EditTemplate templateId={Number(templateId)} />
}

function NewTemplate() {
    const queryClient = useQueryClient()
    const { thornyUser } = useEverthornMember()
    const create = useCreateDailyTemplateV1GuildsMeQuestsDailyTemplatesPost()
    const otherEnabledWeight = useOtherEnabledWeight(null)

    async function handleSubmit(values: DailyTemplateFormValues) {
        const saved = await create.mutateAsync({ data: formValuesToTemplate(values) })
        await invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet(queryClient)
        return saved
    }

    return (
        <div className="p-4 sm:p-6 w-full">
            <TemplateEditForm
                defaultValues={newTemplateFormValues(thornyUser?.thorny_id)}
                onSubmit={handleSubmit}
                otherEnabledWeight={otherEnabledWeight}
            />
        </div>
    )
}

function EditTemplate({ templateId }: { templateId: number }) {
    const queryClient = useQueryClient()
    const { data: template, isLoading, isError, error } = useGetDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdGet(templateId)
    const update = useUpdateDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdPatch()
    const otherEnabledWeight = useOtherEnabledWeight(templateId)

    async function handleSubmit(values: DailyTemplateFormValues) {
        // The whole template is sent; Nexuscore re-validates the merged result.
        const saved = await update.mutateAsync({ templateId, data: formValuesToTemplate(values) })
        await Promise.all([
            invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet(queryClient),
            invalidateGetDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdGet(queryClient, templateId),
        ])
        return saved
    }

    if (isLoading) return <Spinner />

    if (isError || !template) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md bg-destructive/5">
                    <WarningCircleIcon />
                    <AlertTitle>Couldn't load this template</AlertTitle>
                    <AlertDescription>{error instanceof Error ? error.message : 'It may have been deleted.'}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 w-full">
            <TemplateEditForm
                key={template.template_id}
                template={template}
                defaultValues={templateToFormValues(template)}
                onSubmit={handleSubmit}
                otherEnabledWeight={otherEnabledWeight}
            />
        </div>
    )
}
