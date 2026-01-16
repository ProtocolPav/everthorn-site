// app/routes/admin/projects.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
    WarningCircleIcon,
    SquaresFourIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockCounterClockwiseIcon, CheckCircleIcon, HandWavingIcon, SealQuestionIcon, FunnelSimpleIcon
} from '@phosphor-icons/react'
import { useProjects } from '@/hooks/use-project'
import { ProjectCard } from '@/components/features/projects/project-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {ProjectsFilter} from "@/components/features/projects/projects-filter.tsx";
import { z } from "zod"
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {ProjectEditForm} from "@/components/features/projects/project-edit-form.tsx";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {cn} from "@/lib/utils.ts";
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";

const projectsSearchSchema = z.object({
    query: z.string().optional(),
    status: z.array(z.enum(["pending", "ongoing", "abandoned", "completed"])).optional(),
    sort: z.enum(['newest', 'oldest', 'name']).catch('newest'),
})

const statusConfig = {
    ongoing: {
        label: "In Progress",
        icon: ClockCounterClockwiseIcon,
        // Pink Variant Styles
        activeClass: "bg-pink-500 text-white border-pink-600 hover:bg-pink-600 dark:bg-pink-600 dark:text-white",
        dotClass: "bg-white"
    },
    completed: {
        label: "Completed",
        icon: CheckCircleIcon,
        // Amber Variant Styles
        activeClass: "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 dark:bg-amber-600 dark:text-white",
        dotClass: "bg-white"
    },
    abandoned: {
        label: "Available",
        icon: HandWavingIcon,
        // Cyan Variant Styles
        activeClass: "bg-cyan-500 text-white border-cyan-600 hover:bg-cyan-600 dark:bg-cyan-600 dark:text-white",
        dotClass: "bg-white"
    },
    pending: {
        label: "Pending Approval",
        icon: SealQuestionIcon,
        activeClass: "bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600 dark:bg-indigo-600 dark:text-white",
        dotClass: "bg-white"
    }
}

export const Route = createFileRoute('/admin/projects')({
    validateSearch: (search) => projectsSearchSchema.parse(search),
    staticData: {
        pageTitle: "Projects",
        headerActions: <ProjectsFilter />,
    },
    component: AdminProjectsPage,
})

function AdminProjectsPage() {
    const { data: projects, isLoading, isError, error } = useProjects()
    const search = Route.useSearch()

    // Client-side filtering
    const filteredProjects = projects?.filter(project => {
        if (search.query) {
            const q = search.query.toLowerCase()
            if (!project.name.toLowerCase().includes(q)) return false
        }

        if (search.status && search.status.length > 0) {
            if (!search.status.includes(project.status as any)) return false
        }

        return true
    }).sort((a, b) => {
        if (search.sort === 'name') return a.name.localeCompare(b.name)

        const dateA = new Date(a.started_on).getTime()
        const dateB = new Date(b.started_on).getTime()

        if (search.sort === 'oldest') return dateA - dateB
        return dateB - dateA
    })

    return (
        <div className="p-6">
            <div className={cn("mb-6 w-1/2 mx-auto", search.query ? "sticky top-6 z-10" : '')}>
                <Card className={'bg-background p-0'}>
                    <CardContent className={'flex gap-1.5 p-1.5'}>
                        <InputGroup>
                            <InputGroupInput placeholder="Search..." />
                            <InputGroupAddon>
                                <MagnifyingGlassIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        {search.query && (
                            <>
                                <ButtonGroup>
                                    <Button variant="outline" className={'text-xs p-2.5'}>
                                        {filteredProjects?.length} Projects
                                    </Button>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size={'icon'}>
                                                <FunnelIcon className="h-3.5 w-3.5" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-[280px] p-0 shadow-lg" align="end" sideOffset={4}>
                                            <div className="flex flex-col">
                                                {/* Status Chips */}
                                                <div className="p-3">
                                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                                                        Status
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {Object.entries(statusConfig).map(([status, config]) => {
                                                            const isSelected = !!search.status?.includes(status as any)
                                                            const Icon = config.icon

                                                            return (
                                                                <Badge
                                                                    key={status}
                                                                    variant="outline"
                                                                    onClick={() => {}}
                                                                    className={cn(
                                                                        "cursor-pointer px-2.5 py-1 text-[11px] font-medium transition-all duration-200 select-none gap-1.5 border",
                                                                        isSelected
                                                                            ? config.activeClass
                                                                            : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                                    )}
                                                                >
                                                                    <Icon weight={isSelected ? "fill" : "regular"} className="h-3.5 w-3.5" />
                                                                    {config.label}
                                                                </Badge>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    <Button variant="outline" size={'icon'}>
                                        <FunnelSimpleIcon className="h-3.5 w-3.5" />
                                    </Button>
                                </ButtonGroup>
                            </>
                        )}
                    </CardContent>
                </Card>
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
                        <AlertTitle>Unable to Load Projects</AlertTitle>
                        <AlertDescription>
                            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* 3. Empty State (Global) */}
            {!isLoading && !isError && projects?.length === 0 && (
                <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center animate-in fade-in-50 zoom-in-95">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <SquaresFourIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight">No projects found</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Your database currently has no projects listed.
                    </p>
                </div>
            )}

            {/* 4. Success State (Filtered) */}
            {!isLoading && !isError && filteredProjects && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 justify-items-center lg:justify-items-start">
                    {filteredProjects.map((project) => (
                        <Dialog key={project.project_id}>
                            <DialogTrigger asChild>
                                <ProjectCard
                                    className="w-full max-w-sm lg:max-w-none"
                                    project={project}
                                    onClick={() => {}}
                                />
                            </DialogTrigger>
                            <DialogContent className="p-0 min-w-[70vw] h-[85vh] flex flex-col overflow-hidden gap-0 sm:max-w-[70vw]">
                                <DialogTitle hidden={true}>Edit Project</DialogTitle>
                                <DialogDescription hidden={true}>Edit your Project</DialogDescription>

                                <ProjectEditForm
                                    project={project}
                                    onSuccess={() => {}}
                                />
                            </DialogContent>
                        </Dialog>
                    ))}

                    {/* Empty Filter Result State */}
                    {filteredProjects.length === 0 && projects?.length! > 0 && (
                        <div className="col-span-full flex h-[40vh] w-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                            <SquaresFourIcon className="h-8 w-8 opacity-20" />
                            <p>No projects match your current filters.</p>
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
