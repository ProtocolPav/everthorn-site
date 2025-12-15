// @/components/features/projects/project-card.tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject, type Project } from '@/hooks/use-project'
import { MapPinIcon, UserIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
    project?: Project
    projectId?: string
    className?: string
}

export function ProjectCard({ project, projectId, className }: ProjectCardProps) {
    const { data: fetchedProject, isLoading, error } = useProject(projectId)

    // Use provided project or fetched project
    const projectData = project || fetchedProject

    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden", className)}>
                <Skeleton className="aspect-video w-full" />
            </Card>
        )
    }

    if (error || !projectData) {
        return (
            <Card className={cn("border-destructive overflow-hidden", className)}>
                <div className="p-3">
                    <p className="text-destructive text-xs">Failed to load project</p>
                </div>
            </Card>
        )
    }

    const statusVariants = {
        ongoing: { variant: 'amber' as const, label: 'In Progress' },
        completed: { variant: 'emerald' as const, label: 'Completed' },
        abandoned: { variant: 'slate' as const, label: 'Abandoned' },
    }

    const status = statusVariants[projectData.status]

    return (
        <Card className={cn("group overflow-hidden hover:shadow-md cursor-pointer p-0", className)}>
            <div className="relative aspect-video overflow-hidden">
                {/* Image */}
                <img
                    src="/landing/spawn.png"
                    alt={projectData.name}
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-200"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Status badge - top right */}
                <div className="absolute top-3 right-3">
                    <Badge
                        variant={status.variant}
                        className="backdrop-blur-sm bg-background/90 border shadow-lg text-[10px] px-2 py-0.5"
                    >
                        {status.label}
                    </Badge>
                </div>

                {/* Content overlay - bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    {/* Title */}
                    <h3 className="text-lg leading-tight text-white drop-shadow-lg line-clamp-1">
                        {projectData.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/90 line-clamp-2 leading-relaxed drop-shadow-md">
                        {projectData.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 pt-1 text-xs text-white/80">
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="size-3.5" weight="fill" />
                            <span className="truncate drop-shadow-md">{projectData.owner.gamertag}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <MapPinIcon className="size-3.5" weight="fill" />
                            <span className="font-mono drop-shadow-md">
                                {projectData.coordinates[0]}, {projectData.coordinates[2]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
