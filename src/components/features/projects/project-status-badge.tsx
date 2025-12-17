// @/components/features/projects/project-status-badge.tsx
import { Badge } from '@/components/ui/badge'
import { CheckCircleIcon, ClockCounterClockwiseIcon, XCircleIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type ProjectStatus = 'ongoing' | 'completed' | 'abandoned'

interface ProjectStatusBadgeProps {
    status: ProjectStatus
    className?: string
}

const statusConfig = {
    ongoing: {
        variant: 'pink' as const,
        label: 'In Progress',
        icon: ClockCounterClockwiseIcon,
    },
    completed: {
        variant: 'amber' as const,
        label: 'Completed',
        icon: CheckCircleIcon,
    },
    abandoned: {
        variant: 'slate' as const,
        label: 'Abandoned',
        icon: XCircleIcon,
    },
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
        <Badge
            variant={config.variant}
            className={cn(
                "backdrop-blur-md bg-background/95 shadow-xl text-[10px] px-2.5 py-0.5 font-semibold tracking-wide gap-1",
                className
            )}
        >
            <Icon weight="fill" />
            {config.label}
        </Badge>
    )
}
