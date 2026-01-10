// app/routes/admin/quests.tsx
import { createFileRoute } from '@tanstack/react-router'
import { WarningCircleIcon, SquaresFourIcon, ScrollIcon } from '@phosphor-icons/react'
import { useQuests } from '@/hooks/use-quests'
import { QuestCard } from '@/components/features/quests/quest-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { z } from "zod"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"

const questsSearchSchema = z.object({
    query: z.string().optional(),
    type: z.enum(['all', 'story', 'side', 'minor']).catch('all'),
    sort: z.enum(['newest', 'oldest', 'name']).catch('newest'),
})

export const Route = createFileRoute('/admin/quests')({
    validateSearch: (search) => questsSearchSchema.parse(search),
    staticData: {
        pageTitle: "Quests",
    },
    component: AdminQuestsPage,
})

function AdminQuestsPage() {
    const { data: quests, isLoading, isError, error } = useQuests()
    const search = Route.useSearch()

    // Client-side filtering
    const filteredQuests = quests?.filter(quest => {
        if (search.query) {
            const q = search.query.toLowerCase()
            if (!quest.title.toLowerCase().includes(q)) return false
        }

        if (search.type && search.type !== 'all') {
            if (quest.quest_type !== search.type) return false
        }

        return true
    }).sort((a, b) => {
        if (search.sort === 'name') return a.title.localeCompare(b.title)

        const dateA = new Date(a.start_time).getTime()
        const dateB = new Date(b.start_time).getTime()

        if (search.sort === 'oldest') return dateA - dateB
        return dateB - dateA
    })

    return (
        <div className="px-6">
            {/* Simple Filter Bar */}
            <div className="sticky top-0 z-1 py-4 bg-background flex flex-wrap gap-4 items-center">
                <Input
                    placeholder="Search quests..."
                    className="max-w-xs"
                    value={search.query || ''}
                    onChange={(e) => {
                        const searchParams = new URLSearchParams(window.location.search)
                        if (e.target.value) {
                            searchParams.set('query', e.target.value)
                        } else {
                            searchParams.delete('query')
                        }
                        window.history.pushState({}, '', `?${searchParams.toString()}`)
                        // Trigger a re-render by updating the URL
                        window.dispatchEvent(new PopStateEvent('popstate'))
                    }}
                />
                <Select
                    value={search.type}
                    onValueChange={(value) => {
                        const searchParams = new URLSearchParams(window.location.search)
                        searchParams.set('type', value)
                        window.history.pushState({}, '', `?${searchParams.toString()}`)
                        window.dispatchEvent(new PopStateEvent('popstate'))
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Quest Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="side">Side</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={search.sort}
                    onValueChange={(value) => {
                        const searchParams = new URLSearchParams(window.location.search)
                        searchParams.set('sort', value)
                        window.history.pushState({}, '', `?${searchParams.toString()}`)
                        window.dispatchEvent(new PopStateEvent('popstate'))
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        window.history.pushState({}, '', window.location.pathname)
                        window.dispatchEvent(new PopStateEvent('popstate'))
                    }}
                >
                    Clear Filters
                </Button>
            </div>

            {/* 1. Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex h-[180px] flex-col justify-between rounded-xl border bg-card p-4 shadow-sm">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. Error State */}
            {isError && (
                <div className="flex h-[50vh] flex-col items-center justify-center gap-4 animate-in fade-in">
                    <Alert variant="destructive" className="max-w-md bg-destructive/5">
                        <WarningCircleIcon className="h-4 w-4" />
                        <AlertTitle>Unable to Load Quests</AlertTitle>
                        <AlertDescription>
                            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* 3. Empty State (Global) */}
            {!isLoading && !isError && quests?.length === 0 && (
                <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center animate-in fade-in-50 zoom-in-95">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <ScrollIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight">No quests found</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Your database currently has no quests listed.
                    </p>
                </div>
            )}

            {/* 4. Success State (Filtered) */}
            {!isLoading && !isError && filteredQuests && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 justify-items-center lg:justify-items-start">
                    {filteredQuests.map((quest) => (
                        <QuestCard
                            key={quest.quest_id}
                            quest={quest}
                            className="w-full max-w-sm lg:max-w-none"
                        />
                    ))}

                    {/* Empty Filter Result State */}
                    {filteredQuests.length === 0 && quests?.length! > 0 && (
                        <div className="col-span-full flex h-[40vh] w-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                            <SquaresFourIcon className="h-8 w-8 opacity-20" />
                            <p>No quests match your current filters.</p>
                            <Button variant="link" size="sm" onClick={() => window.history.back()}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
