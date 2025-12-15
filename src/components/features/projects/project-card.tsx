// @/components/features/projects/project-card.tsx
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject, type Project } from '@/hooks/use-project'
import { MapPinIcon, UserIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { ProjectStatusBadge } from './project-status-badge'

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
            <Card className={cn("overflow-hidden p-0", className)}>
                <Skeleton className="aspect-video w-full" />
            </Card>
        )
    }

    if (error || !projectData) {
        return (
            <Card className={cn("border-destructive overflow-hidden p-0", className)}>
                <div className="p-4 aspect-video">
                    <p className="text-destructive text-xs">Failed to load project</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className={cn("group overflow-hidden transition-colors hover:border-secondary-foreground/25 cursor-pointer p-0", className)}>
            <div className="relative aspect-video overflow-hidden bg-black">
                {/* Image */}
                <img
                    src="/landing/spawn.png"
                    alt={projectData.name}
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-170 ease-out"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Status badge - top right */}
                <div className="absolute top-2.5 right-2.5">
                    <ProjectStatusBadge status={projectData.status} />
                </div>

                {/* Content overlay - bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 space-y-1.5">
                    {/* Title */}
                    <h3 className="text-base md:text-lg font-semibold leading-tight text-white line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {projectData.name}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] md:text-xs text-white/85 line-clamp-2 leading-relaxed">
                        {projectData.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 pt-0.5 text-[10px] md:text-xs text-white/75">
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="size-3 md:size-3.5" weight="fill" />
                            <span className="truncate font-medium">{projectData.owner.gamertag}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <MapPinIcon className="size-3 md:size-3.5" weight="fill" />
                            <span className="font-mono tabular-nums">
                                {projectData.coordinates[0]}, {projectData.coordinates[2]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
