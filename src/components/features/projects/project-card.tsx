// @/components/features/projects/project-card.tsx
import { Card, CardContent } from '@/components/ui/card'
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
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-3 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
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

    const statusColors = {
        ongoing: 'default',
        completed: 'secondary',
        abandoned: 'destructive',
    } as const

    return (
        <Card className={cn("group overflow-hidden transition-colors hover:bg-accent/50 hover:border-accent-foreground/20 cursor-pointer p-0", className)}>
            {/* Project image */}
            <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                    src="/landing/spawn.png"
                    alt={projectData.name}
                    className="object-cover w-full h-full group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant={statusColors[projectData.status]} className="text-xs shadow-lg">
                        {projectData.status}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-3 space-y-2">
                {/* Title */}
                <h3 className="font-minecraft-seven text-base leading-tight line-clamp-1">
                    {projectData.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {projectData.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <UserIcon className="size-3.5" weight="duotone" />
                        <span className="truncate">{projectData.owner.gamertag}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <MapPinIcon className="size-3.5" weight="duotone" />
                        <span className="font-mono">{projectData.coordinates[0]}, {projectData.coordinates[2]}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
