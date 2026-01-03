// app/routes/admin/projects.tsx
import { createFileRoute } from '@tanstack/react-router'
import { WarningCircleIcon, FadersIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { useProjects } from '@/hooks/use-project'
import { ProjectCard } from '@/components/features/projects/project-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// 1. Define the Action Component separately
function ProjectsHeaderActions() {
    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 border-dashed text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled
        >
            <FadersIcon className="h-3.5 w-3.5" />
            <span>Filter view</span>
        </Button>
    )
}

// 2. Configure Route with Static Data
export const Route = createFileRoute('/admin/projects')({
    staticData: {
        pageTitle: "Projects & Pins",
        headerActions: <ProjectsHeaderActions />,
    },
    component: AdminProjectsPage,
})

function AdminProjectsPage() {
    const { data: projects, isLoading, isError, error } = useProjects()

    return (
        <div className="p-6">
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

            {/* 3. Empty State */}
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

            {/* 4. Success State */}
            {!isLoading && !isError && projects && projects.length > 0 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 justify-items-center lg:justify-items-start">
                    {projects.map((project) => (
                        <ProjectCard
                            // Using w-full ensures it fits the grid cell perfectly on all screens
                            // max-w-sm keeps it from getting too wide on tablet/desktop before the grid breaks
                            className="w-full max-w-sm lg:max-w-none"
                            key={project.project_id}
                            project={project}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
