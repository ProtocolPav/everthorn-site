import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { DiceFiveIcon, MagnifyingGlassIcon, PencilSimpleIcon, PlusIcon, StackIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestCardSkeleton } from '@/components/features/quests/quest-card-skeleton'
import { QUEST_GRID } from '@/components/features/quests/dashboard/quest-section'
import { DailyBreadcrumb } from '@/components/features/quests/daily/daily-breadcrumb'
import { DailyToolbar } from '@/components/features/quests/daily/daily-toolbar'
import { DailySection } from '@/components/features/quests/daily/daily-section'
import { TemplateCard } from '@/components/features/quests/daily/template-card'
import { DeleteTemplateDialog } from '@/components/features/quests/daily/delete-template-dialog'
import { PreviewTemplateDialog } from '@/components/features/quests/daily/preview-template-dialog'
import {
    useListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet,
    useListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet,
} from '@/api/nexuscore/daily-quests/daily-quests.ts'
import { getTargetLabel, templateToInput } from '@/lib/daily-quests.ts'
import type { DailyTemplateOut } from '@/api/nexuscore/model'

export const Route = createFileRoute('/admin/quests/daily/templates/')({
    component: DailyTemplatesPage,
    staticData: {
        pageTitle: <DailyBreadcrumb current="Templates" />,
        headerActions: (
            <Button size="sm" asChild>
                <Link to="/admin/quests/daily/templates/$templateId" params={{ templateId: 'new' }}>
                    <PlusIcon />
                    New template
                </Link>
            </Button>
        ),
    },
})

function matchesTemplate(template: DailyTemplateOut, query: string): boolean {
    const needle = query.trim().toLowerCase()
    if (!needle) return true
    const haystack = [
        template.name,
        template.title,
        template.objective_type,
        ...template.targets.map((target) => getTargetLabel(target)),
    ]
    return haystack.some((value) => value.toLowerCase().includes(needle))
}

function DailyTemplatesPage() {
    const { data: templates, isLoading, isError, error, refetch } = useListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet()
    const { data: upcoming } = useListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet()
    const [query, setQuery] = useState('')

    const { enabled, disabled, totalWeight } = useMemo(() => {
        const list = (templates ?? []).filter((template) => matchesTemplate(template, query))
        const byName = (a: DailyTemplateOut, b: DailyTemplateOut) => a.name.localeCompare(b.name)
        return {
            enabled: list.filter((template) => template.enabled ?? true).sort(byName),
            disabled: list.filter((template) => !(template.enabled ?? true)).sort(byName),
            // Shares are over the whole enabled pool, not just the search results.
            totalWeight: (templates ?? [])
                .filter((template) => template.enabled ?? true)
                .reduce((sum, template) => sum + (template.weight ?? 1), 0),
        }
    }, [templates, query])

    function shareOf(template: DailyTemplateOut): number {
        if (!(template.enabled ?? true) || totalWeight === 0) return 0
        return (template.weight ?? 1) / totalWeight
    }

    function templateLink(template: DailyTemplateOut, name: string) {
        return (
            <Link
                to="/admin/quests/daily/templates/$templateId"
                params={{ templateId: `${template.template_id}` }}
                className="underline-offset-4 hover:underline"
            >
                {name}
            </Link>
        )
    }

    function templateActions(template: DailyTemplateOut) {
        return (
            <>
                <PreviewTemplateDialog
                    name={template.name}
                    getTemplate={() => templateToInput(template)}
                    trigger={
                        <Button variant="ghost" size="xs">
                            <DiceFiveIcon weight="bold" />
                            <span className="hidden @2xs:inline">Preview</span>
                        </Button>
                    }
                />
                <Button variant="ghost" size="xs" asChild>
                    <Link
                        to="/admin/quests/daily/templates/$templateId"
                        params={{ templateId: `${template.template_id}` }}
                        aria-label={`Edit ${template.name}`}
                    >
                        <PencilSimpleIcon weight="bold" />
                        <span className="hidden @2xs:inline">Edit</span>
                    </Link>
                </Button>
                <DeleteTemplateDialog template={template} />
            </>
        )
    }

    if (isError) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md bg-destructive/5">
                    <WarningCircleIcon />
                    <AlertTitle>Couldn't load templates</AlertTitle>
                    <AlertDescription>
                        <p>{error instanceof Error ? error.message : 'Something went wrong.'}</p>
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>
                            Try again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    const isSearching = query.trim().length > 0
    const noResults = isSearching && enabled.length + disabled.length === 0

    return (
        <div className="px-6 pb-8">
            <DailyToolbar active="templates" counts={{ upcoming: upcoming?.length, templates: templates?.length }}>
                <InputGroup className="min-w-0 flex-1 md:max-w-sm">
                    <InputGroupInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') setQuery('')
                        }}
                        placeholder="Search name, title or target"
                        aria-label="Search templates"
                    />
                    <InputGroupAddon>
                        <MagnifyingGlassIcon />
                    </InputGroupAddon>
                    {query && (
                        <InputGroupAddon align="inline-end">
                            <Button variant="ghost" size="icon-sm" className="size-6" onClick={() => setQuery('')}>
                                <XIcon />
                                <span className="sr-only">Clear search</span>
                            </Button>
                        </InputGroupAddon>
                    )}
                </InputGroup>
            </DailyToolbar>

            {isLoading ? (
                <div className="flex flex-col gap-2 pt-6">
                    <Skeleton className="h-4 w-24" />
                    <div className={QUEST_GRID}>
                        {Array.from({ length: 3 }).map((_, card) => (
                            <QuestCardSkeleton key={card} />
                        ))}
                    </div>
                </div>
            ) : (templates?.length ?? 0) === 0 ? (
                <Empty className="py-16">
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><StackIcon /></EmptyMedia>
                        <EmptyTitle>No templates yet</EmptyTitle>
                        <EmptyDescription>
                            Create one to start generating daily quests.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : noResults ? (
                <Empty className="py-16">
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><MagnifyingGlassIcon /></EmptyMedia>
                        <EmptyTitle>No templates match</EmptyTitle>
                        <EmptyDescription>Nothing found for “{query}”.</EmptyDescription>
                    </EmptyHeader>
                    <Button variant="outline" size="sm" onClick={() => setQuery('')}>
                        Clear search
                    </Button>
                </Empty>
            ) : (
                <div className="flex flex-col gap-8 pt-6">
                    <DailySection
                        title="Enabled"
                        count={enabled.length}
                        tone="bg-emerald-500"
                        empty={<p className="text-sm font-light text-muted-foreground">None enabled, so no new days will be generated.</p>}
                    >
                        {enabled.map((template) => (
                            <TemplateCard key={template.template_id} template={template} share={shareOf(template)} actions={templateActions(template)} renderName={(name) => templateLink(template, name)} />
                        ))}
                    </DailySection>

                    {disabled.length > 0 && (
                        <DailySection title="Disabled" count={disabled.length} tone="bg-muted-foreground/40">
                            {disabled.map((template) => (
                                <TemplateCard key={template.template_id} template={template} share={0} actions={templateActions(template)} renderName={(name) => templateLink(template, name)} />
                            ))}
                        </DailySection>
                    )}
                </div>
            )}
        </div>
    )
}
